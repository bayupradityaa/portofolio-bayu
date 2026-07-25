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

      // ── Smooth scroll reveal — slides reveal on scroll enter and STAY visible ──────
      mm.add(`(not ${REDUCED_QUERY})`, () => {
        const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
        const numbers = numberRefs.current.filter(Boolean) as HTMLSpanElement[];

        // Initial state for sidebar counter digits
        numbers.forEach((el, i) => {
          if (el) gsap.set(el, i === 0 ? COUNTER_MOTION.visible : COUNTER_MOTION.hidden);
        });

        slides.forEach((el, idx) => {
          // 1. Reveal slide smoothly on scroll enter — STAYS fully visible
          gsap.fromTo(
            el,
            { opacity: 0, y: 36, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.7,
              ease: EASE,
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true, // Only animates once, never fades out on scroll
              },
            },
          );

          // 2. Update pinned sidebar counter digit as each project enters viewport
          ScrollTrigger.create({
            trigger: el,
            start: "top 50%",
            end: "bottom 50%",
            onToggle: (self) => {
              if (self.isActive && activeIndexRef.current !== idx) {
                activeIndexRef.current = idx;
                setActiveIndex(idx);

                numbers.forEach((num, nIdx) => {
                  if (num) {
                    gsap.to(num, {
                      opacity: nIdx === idx ? 1 : 0,
                      scale: nIdx === idx ? 1 : 0.9,
                      filter: nIdx === idx ? "blur(0px)" : "blur(6px)",
                      duration: 0.4,
                      ease: EASE,
                    });
                  }
                });
              }
            },
          });
        });
      });
    }, section);

    return () => ctx.revert();
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
