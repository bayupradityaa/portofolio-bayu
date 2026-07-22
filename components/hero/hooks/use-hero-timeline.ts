"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import SplitType from "split-type";
import { HeroStage } from "../hero-context";
import {
  createHeroTimeline,
  createBreathingTimeline,
  setHeroInitialStates,
  setHeroFinalStates,
  type HeroRefs,
} from "../hero-timeline";

gsap.registerPlugin(ScrollTrigger);

interface UseHeroTimelineProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  canvasLayerRef: React.RefObject<HTMLDivElement | null>;
  parallaxLayerRef: React.RefObject<HTMLDivElement | null>;
  glowRef: React.RefObject<HTMLDivElement | null>;
  titleHelloRef: React.RefObject<HTMLSpanElement | null>;
  titleBayuRef: React.RefObject<HTMLSpanElement | null>;
  titlePradityaRef: React.RefObject<HTMLSpanElement | null>;
  subtitleRef: React.RefObject<HTMLDivElement | null>;
  descriptionRef: React.RefObject<HTMLParagraphElement | null>;
  button1Ref: React.RefObject<HTMLDivElement | null>;
  renderFrame: (index: number) => void;
}

export function useHeroTimeline({
  sectionRef,
  canvasLayerRef,
  parallaxLayerRef,
  glowRef,
  titleHelloRef,
  titleBayuRef,
  titlePradityaRef,
  subtitleRef,
  descriptionRef,
  button1Ref,
  renderFrame,
}: UseHeroTimelineProps) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<HeroStage>(reduce ? HeroStage.IDLE : HeroStage.INTRO);
  const [progress, setProgress] = useState(0);

  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const breathingTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const currentStageRef = useRef<HeroStage>(reduce ? HeroStage.IDLE : HeroStage.INTRO);

  useEffect(() => {
    const section = sectionRef.current;
    const canvasLayer = canvasLayerRef.current;
    const parallaxLayer = parallaxLayerRef.current;
    const glow = glowRef.current;
    const titleHello = titleHelloRef.current;
    const titleBayu = titleBayuRef.current;
    const titlePraditya = titlePradityaRef.current;
    const subtitle = subtitleRef.current;
    const description = descriptionRef.current;
    const button1 = button1Ref.current;

    // Strict guard checking that all DOM references are fully attached
    if (
      !section ||
      !canvasLayer ||
      !parallaxLayer ||
      !glow ||
      !titleHello ||
      !titleBayu ||
      !titlePraditya ||
      !subtitle ||
      !description ||
      !button1
    ) {
      return;
    }

    // Split description into words using SplitType
    const descSplit = new SplitType(description, {
      types: "words",
      wordClass: "word inline-block opacity-0 translate-y-[15px]",
    });

    const descriptionWords = descSplit.words || [];

    // Assemble the refs bag
    const refs: HeroRefs = {
      section,
      parallaxCanvas: canvasLayer,
      parallaxText: parallaxLayer,
      glow,
      titleHello,
      titleBayu,
      titlePraditya,
      subtitle,
      descriptionContainer: description,
      descriptionWords,
      buttonWraps: [button1],
      renderFrame,
    };

    if (reduce) {
      setHeroFinalStates(refs);
      return;
    }

    // Initialize CSS states
    setHeroInitialStates(refs);

    // Create the breathing timeline on the canvas layer wrapper
    const breatheTl = createBreathingTimeline(canvasLayer);
    breathingTimelineRef.current = breatheTl;

    // Create the master timeline
    const masterTl = createHeroTimeline(refs);
    masterTimelineRef.current = masterTl;

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

    // Connect to ScrollTrigger with optimized scrub for mobile
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: isDesktop ? 0.5 : 0.2, // Smoother & faster scrub response on mobile
      onUpdate: (self) => {
        const p = self.progress;

        // Determine current stage
        let currentStage = HeroStage.INTRO;
        if (p < 0.1) {
          currentStage = HeroStage.INTRO;
        } else if (p < 0.2) {
          currentStage = HeroStage.REVEAL;
        } else if (p < 0.35) {
          currentStage = HeroStage.TITLE;
        } else if (p < 0.6) {
          currentStage = HeroStage.CONTENT;
        } else if (p < 0.8) {
          currentStage = HeroStage.READY;
        } else {
          currentStage = HeroStage.IDLE;
        }

        // Only trigger React state updates when the stage ACTUALLY changes
        if (currentStage !== currentStageRef.current) {
          currentStageRef.current = currentStage;
          setStage(currentStage);
          setProgress(p);
        }

        // Control idle breathing timeline without spawning redundant scroll tweens
        if (currentStage === HeroStage.READY || currentStage === HeroStage.IDLE) {
          if (!breatheTl.isActive()) {
            breatheTl.play();
          }
        } else {
          if (breatheTl.isActive()) {
            breatheTl.pause();
            gsap.set(canvasLayer, { scale: 1 });
          }
        }

        // Dispatch scroll event for Nav
        window.dispatchEvent(
          new CustomEvent("hero-scroll", {
            detail: { progress: p },
          })
        );

        // Drive the timeline progress directly in GSAP without re-rendering React
        masterTl.progress(p);
      },
    });

    return () => {
      st.kill();
      masterTl.kill();
      breatheTl.kill();
      descSplit.revert();
    };
  }, [
    reduce,
    sectionRef,
    canvasLayerRef,
    parallaxLayerRef,
    glowRef,
    titleHelloRef,
    titleBayuRef,
    titlePradityaRef,
    subtitleRef,
    descriptionRef,
    button1Ref,
    renderFrame,
  ]);

  return { stage, progress };
}
