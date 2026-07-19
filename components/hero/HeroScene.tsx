"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { HeroProvider } from "./hero-context";
import { HeroGrid } from "./hero-grid";
import { HeroOverlay } from "./hero-overlay";
import { HeroSequence, type HeroSequenceHandle } from "./hero-sequence";
import { HeroGlow } from "./hero-glow";
import { HeroTitle } from "./hero-title";
import { HeroSubtitle } from "./hero-subtitle";
import { HeroDescription } from "./hero-description";
import { HeroButtons } from "./hero-buttons";
import { useHeroTimeline } from "./hooks/use-hero-timeline";

import type { ProfileSettings } from "@/lib/types/database";

gsap.registerPlugin(ScrollTrigger);

export function HeroScene({ settings }: { settings: ProfileSettings | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasLayerRef = useRef<HTMLDivElement>(null);
  const parallaxLayerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HeroSequenceHandle>(null);

  // Directly declare refs for elements in children
  const titleHelloRef = useRef<HTMLSpanElement>(null);
  const titleBayuRef = useRef<HTMLSpanElement>(null);
  const titlePradityaRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const button1Ref = useRef<HTMLDivElement>(null);

  const reduce = useReducedMotion();

  // Parallax input handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (reduce) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = ((e.clientX - cx) / cx) * 5; // Max ±5px
      const dy = ((e.clientY - cy) / cy) * 5;

      if (canvasLayerRef.current) {
        gsap.to(canvasLayerRef.current, {
          x: dx * 0.6,
          y: dy * 0.6,
          duration: 0.8,
          ease: "power2.out",
        });
      }
      if (parallaxLayerRef.current) {
        gsap.to(parallaxLayerRef.current, {
          x: -dx * 0.4,
          y: -dy * 0.3,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    },
    [reduce]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Awwwards-level section handoff: as the content panel rises to cover the hero,
  // the hero recedes into depth (scale down + fade + subtle blur) while the panel's
  // corners flatten and its lift shadow deepens. The layer that leaves moves back in
  // z-space instead of sitting still — that parallax is what reads as "premium".
  useEffect(() => {
    if (reduce) return;

    const content = document.getElementById("content-container");
    const sticky = stickyRef.current;
    if (!content || !sticky) return;

    const ctx = gsap.context(() => {
      // Panel handoff — corners flatten + shadow deepens as it climbs over the hero.
      gsap.fromTo(
        content,
        {
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          boxShadow: "0 -10px 30px rgba(0,0,0,0.25)",
        },
        {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: "0 -40px 80px rgba(0,0,0,0.65)",
          ease: "none",
          scrollTrigger: {
            trigger: content,
            start: "top bottom", // begins as the panel's top slides up from the viewport bottom
            end: "top top",      // resolves once the panel fully covers the screen
            scrub: 0.6,          // slight smoothing lag reads as weight, not a rigid 1:1 bind
          },
        },
      );

      // Hero recede — the outgoing layer drifts back into depth as it's covered.
      gsap.fromTo(
        sticky,
        { scale: 1, filter: "blur(0px)", opacity: 1 },
        {
          scale: 0.94,
          filter: "blur(4px)",
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: content,
            start: "top bottom",
            end: "top top",
            scrub: 0.6,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [reduce]);

  const renderFrame = useCallback((index: number) => {
    if (sequenceRef.current) {
      sequenceRef.current.renderFrame(index);
    }
  }, []);

  // Pass these individual refs into the hooks
  const { stage } = useHeroTimeline({
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
  });

  return (
    <HeroProvider value={{ stage }}>
      <section ref={sectionRef} id="hero" className="relative h-[500vh]">
        <div
          ref={stickyRef}
          className="sticky top-0 h-[100dvh] overflow-hidden z-10 will-change-transform"
          style={{ background: "var(--background)", transformOrigin: "50% 40%" }}
        >
          {/* Faint static grid overlay */}
          <HeroGrid />

          {/* Canvas sequence layer */}
          <div ref={canvasLayerRef} className="absolute inset-0">
            <HeroSequence ref={sequenceRef} />
            <HeroGlow ref={glowRef} />
          </div>

          {/* Legibility scrim gradient overlay */}
          <HeroOverlay />

          {/* UI Text layer with interactive parallax */}
          <div
            ref={parallaxLayerRef}
            className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 pt-24"
          >
            <HeroTitle
              helloRef={titleHelloRef}
              bayuRef={titleBayuRef}
              pradityaRef={titlePradityaRef}
              name={settings?.name || "Bayu Praditya"}
            />
            <HeroSubtitle ref={subtitleRef} />
            <HeroDescription
              ref={descriptionRef}
              description={settings?.subtitle || "Building thoughtful digital experiences through modern web engineering, backend systems, and artificial intelligence."}
            />
            <HeroButtons button1Ref={button1Ref} />
          </div>
        </div>
      </section>
    </HeroProvider>
  );
}
