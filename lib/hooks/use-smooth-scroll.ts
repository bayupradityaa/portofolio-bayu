"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type SmoothScrollOptions = {
  /** Duration of the smooth scroll animation. Higher = slower/heavier feel. */
  duration?: number;
  /** Custom easing function. Default is exponential easing for the "Awwwards" heavy feel. */
  easing?: (t: number) => number;
  /** Pass true to skip Lenis entirely (e.g. when prefers-reduced-motion is on). */
  disabled?: boolean;
  /** Wheel sensitivity multiplier. */
  wheelMultiplier?: number;
  /** Touch sensitivity multiplier. */
  touchMultiplier?: number;
};

/**
 * Default easing — the canonical "expoOut" used on every Awwwards-style site.
 * Starts fast, then lingers. That lingering is what gives headings and
 * cards their characteristic "heavy" feel during scroll.
 */
export function expoOut(t: number): number {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
}

/**
 * `useSmoothScroll` — installs Lenis for buttery inertia scrolling and wires
 * it to GSAP's `ScrollTrigger` so every scroll-driven animation stays in
 * perfect sync.
 *
 * The hook returns a ref containing the active Lenis instance so consumers
 * can call `lenis.scrollTo(...)` etc. without re-rendering on every frame.
 *
 * Use once at the root layout level (typically inside a `<SmoothScroll>`
 * provider). Re-running the hook (e.g. due to a route change) will tear
 * down the previous Lenis instance and create a fresh one.
 *
 * @example
 * ```tsx
 * const lenisRef = useSmoothScroll({ disabled: reduce });
 *
 * useEffect(() => {
 *   const lenis = lenisRef.current;
 *   if (!lenis) return;
 *   const onClick = (e: MouseEvent) => {
 *     const a = (e.target as HTMLElement).closest("a");
 *     if (a?.hash) lenis.scrollTo(a.hash);
 *   };
 *   document.addEventListener("click", onClick);
 *   return () => document.removeEventListener("click", onClick);
 * }, [lenisRef]);
 * ```
 */
export function useSmoothScroll(options: SmoothScrollOptions = {}) {
  const {
    duration = 1.2,
    easing = expoOut,
    disabled = false,
    wheelMultiplier = 1.0,
    touchMultiplier = 1.5,
  } = options;

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (disabled || typeof window === "undefined") return;

    const lenis = new Lenis({
      duration,
      easing,
      smoothWheel: true,
      wheelMultiplier,
      touchMultiplier,
    });

    lenisRef.current = lenis;

    // Lenis → ScrollTrigger: every scroll event from Lenis refreshes ST.
    // Without this, GSAP's scroll-driven animations would lag behind the
    // smooth-scrolled viewport.
    lenis.on("scroll", ScrollTrigger.update);

    // gsap.ticker → Lenis: drive Lenis from GSAP's animation frame so it
    // shares the same exact timing as every other GSAP animation.
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    // Lag smoothing: keep tweens from skipping frames on slow tabs.
    gsap.ticker.lagSmoothing(500, 33);

    // Let content mount before re-measuring trigger positions.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      window.clearTimeout(id);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [duration, easing, disabled, wheelMultiplier, touchMultiplier]);

  return lenisRef;
}
