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

  // Parallax input handler (desktop only)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (reduce || window.innerWidth < 1024) return;
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

  // Opsi 3: Pure Natural Flow — Hero scrubs smoothly and flows directly into About
  useEffect(() => {
    if (reduce) return;

    const sticky = stickyRef.current;
    if (!sticky) return;

    const ctx = gsap.context(() => {
      gsap.set(sticky, { force3D: true });

      // Subtle parallax fade-out as hero completes its scroll
      gsap.to(sticky, {
        opacity: 0.2,
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "70% top",
          end: "bottom top",
          scrub: true,
        },
      });
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
      <section ref={sectionRef} id="hero" className="relative h-[160vh] md:h-[200vh]">
        <div
          ref={stickyRef}
          className="sticky top-0 h-[100dvh] overflow-hidden z-10 will-change-transform"
          style={{ background: "var(--background)" }}
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
