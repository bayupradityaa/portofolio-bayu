"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SLIDE_MOTION,
  COUNTER_MOTION,
  IMAGE_PARALLAX,
  EASE,
  SCRUB,
  DESKTOP_QUERY,
  REDUCED_QUERY,
} from "./config";

// ScrollTrigger is already registered globally in SmoothScroll, but registering
// again is idempotent and keeps this hook self-contained if reused elsewhere.
gsap.registerPlugin(ScrollTrigger);

interface UseFeaturedProjectsArgs {
  count: number;
}

interface UseFeaturedProjectsReturn {
  /** Attach to the outer <section> — the pin/scrub trigger. */
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Attach to the pinned left column wrapper. */
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  /** Attach to the scrolling right column wrapper. */
  trackRef: React.RefObject<HTMLDivElement | null>;
  /** Attach to the sidebar metadata block (title/category) for crossfades. */
  metaRef: React.RefObject<HTMLDivElement | null>;
  /** Per-slide root elements. */
  slideRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** Per-slide image parallax layers. */
  imageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** Per-slide giant counter digits in the sidebar. */
  numberRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  /** Currently focused project — drives sidebar text swap. */
  activeIndex: number;
}

/**
 * Drives the cinematic Featured Projects showcase.
 *
 * Desktop: the whole section pins for `count` viewport-heights. A single
 * scrubbed timeline fades/blurs each slide in and out, crossfades the giant
 * counter digits, and parallaxes each cover. `activeIndex` is lifted to React
 * state (updated only on change) so the pinned sidebar text can swap.
 *
 * Mobile: no pinning — slides reveal individually on enter, counter shown
 * inline in each slide. Reduced-motion: everything painted in its final state.
 */
export function useFeaturedProjects({ count }: UseFeaturedProjectsArgs): UseFeaturedProjectsReturn {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  // Mirror in a ref so the scrub callback can compare without re-subscribing.
  const activeIndexRef = useRef(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || count === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Reduced motion: paint final states, no scrub, fully readable ──────
      mm.add(REDUCED_QUERY, () => {
        gsap.set(slideRefs.current, SLIDE_MOTION.visible);
        gsap.set(imageRefs.current, { y: 0, scale: 1 });
        gsap.set(numberRefs.current, COUNTER_MOTION.visible);
        // Only the first number should remain visible; stack the rest hidden.
        numberRefs.current.forEach((el, i) => {
          if (el) gsap.set(el, i === 0 ? COUNTER_MOTION.visible : { opacity: 0 });
        });
      });

      // ── Desktop: pinned, scrub-driven cinematic sequence ──────────────────
      mm.add(DESKTOP_QUERY, () => {
        const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
        const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
        const numbers = numberRefs.current.filter(Boolean) as HTMLSpanElement[];

        // Initial states — first slide/number visible, the rest hidden below.
        slides.forEach((el, i) => gsap.set(el, i === 0 ? SLIDE_MOTION.visible : SLIDE_MOTION.hidden));
        numbers.forEach((el, i) =>
          gsap.set(el, i === 0 ? COUNTER_MOTION.visible : COUNTER_MOTION.hidden),
        );
        gsap.set(images, { y: -IMAGE_PARALLAX / 2 });

        // One master timeline, progress mapped 1:1 to scroll via scrub.
        const tl = gsap.timeline({
          defaults: { ease: EASE },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            // One extra viewport of scroll per transition after the first slide.
            end: () => `+=${window.innerHeight * count}`,
            // No GSAP pin: the sidebar is held by CSS `position: sticky`, which
            // is bulletproof against the grid-cell stretch that made the number
            // drift. This trigger now only scrubs the crossfade timeline.
            scrub: SCRUB,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Map overall progress → nearest slide index for the React swap.
              const idx = Math.min(count - 1, Math.round(self.progress * (count - 1)));
              if (idx !== activeIndexRef.current) {
                activeIndexRef.current = idx;
                setActiveIndex(idx);
              }
            },
          },
        });

        // Each transition occupies one equal segment of the timeline.
        for (let i = 1; i < count; i++) {
          const segment = i; // label position, 1 unit per transition
          // Outgoing slide: settle back, scale down, blur.
          tl.to(slides[i - 1], { ...SLIDE_MOTION.past, duration: 1 }, segment);
          // Incoming slide: rise, sharpen, scale to 1.
          tl.fromTo(
            slides[i],
            SLIDE_MOTION.hidden,
            { ...SLIDE_MOTION.visible, duration: 1 },
            segment,
          );
          // Counter crossfade — no hard switch.
          tl.to(numbers[i - 1], { ...COUNTER_MOTION.hidden, duration: 1 }, segment);
          tl.fromTo(
            numbers[i],
            COUNTER_MOTION.hidden,
            { ...COUNTER_MOTION.visible, duration: 1 },
            segment,
          );
        }

        // Continuous, gentle image parallax across the whole scroll.
        images.forEach((img) => {
          gsap.to(img, {
            y: IMAGE_PARALLAX / 2,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${window.innerHeight * count}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      // ── Mobile / tablet: no pin, per-slide reveal on enter ────────────────
      mm.add(`(max-width: 1023px) and (not ${REDUCED_QUERY})`, () => {
        const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
        slides.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 48, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.8,
              ease: EASE,
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            },
          );
        });
        // Counter digits are shown inline per-slide on mobile; keep sidebar stack hidden.
        gsap.set(numberRefs.current, { opacity: 0 });
      });
    }, section);

    return () => ctx.revert(); // kills every trigger + tween created above
  }, [count]);

  return {
    sectionRef,
    sidebarRef,
    trackRef,
    metaRef,
    slideRefs,
    imageRefs,
    numberRefs,
    activeIndex,
  };
}
