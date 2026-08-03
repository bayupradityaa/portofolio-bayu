"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
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
 * Drives the Featured Projects showcase.
 *
 * Desktop: the sidebar holds position via CSS `sticky` while each slide is
 * scrubbed through three phases as it crosses the viewport —
 *
 *   enter   the cover wipes open and the slide settles into place
 *   hold    the cover drifts against the scroll (parallax)
 *   exit    the slide recedes slightly as the next one takes over
 *
 * The giant counter digit crossfades to match, and `activeIndex` is lifted to
 * React state (only on change) so the sidebar title can swap.
 *
 * Mobile: no parallax or scrub — each slide gets a single wipe reveal on enter
 * and the counter is rendered inline. Reduced motion: final state, painted.
 *
 * Every tween is transform / opacity / clip-path only, so nothing here touches
 * layout or triggers a repaint on the main thread.
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

      /**
       * Tracks which slide owns the viewport and crossfades the giant digit.
       * Shared by every breakpoint — the counter only renders on desktop but
       * the state drives the sidebar title, which matters everywhere.
       */
      const wireActiveTracking = (slides: HTMLDivElement[], numbers: HTMLSpanElement[]) => {
        slides.forEach((el, idx) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 45%",
            onToggle: (self) => {
              if (!self.isActive || activeIndexRef.current === idx) return;
              activeIndexRef.current = idx;
              setActiveIndex(idx);

              numbers.forEach((num, nIdx) => {
                const state = nIdx === idx ? COUNTER_MOTION.visible : COUNTER_MOTION.hidden;
                gsap.to(num, { ...state, duration: 0.45, ease: EASE, overwrite: "auto" });
              });
            },
          });
        });
      };

      // ── Reduced motion: paint the final state, scrub nothing ───────────
      mm.add(REDUCED_QUERY, () => {
        const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
        const numbers = numberRefs.current.filter(Boolean) as HTMLSpanElement[];

        gsap.set(slides, { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" });
        gsap.set(imageRefs.current.filter(Boolean), { y: 0, scale: 1 });
        numbers.forEach((el, i) => {
          gsap.set(el, i === 0 ? COUNTER_MOTION.visible : COUNTER_MOTION.hidden);
        });
      });

      // ── Desktop: full three-phase scrub + parallax ─────────────────────
      mm.add(`${DESKTOP_QUERY} and (not ${REDUCED_QUERY})`, () => {
        const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
        const numbers = numberRefs.current.filter(Boolean) as HTMLSpanElement[];
        const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];

        numbers.forEach((el, i) => {
          gsap.set(el, i === 0 ? COUNTER_MOTION.visible : COUNTER_MOTION.hidden);
        });

        slides.forEach((el, idx) => {
          // Phase 1 — enter. The slide is uncovered by a bottom-up wipe, the
          // site's signature reveal. One-shot: once seen it stays put, so
          // scrolling back up never re-hides content.
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0 0 0)", y: 48 },
            {
              clipPath: "inset(0% 0 0 0)",
              y: 0,
              duration: 0.9,
              ease: EASE,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            },
          );

          // Phase 2 — hold. The cover drifts upward against the scroll for
          // the whole time the slide is in view. This is the depth cue the
          // section was missing entirely.
          const image = images[idx];
          if (image) {
            gsap.fromTo(
              image,
              { y: IMAGE_PARALLAX * -0.5 },
              {
                y: IMAGE_PARALLAX * 0.5,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: SCRUB,
                },
              },
            );
          }

          // Phase 3 — exit. The outgoing slide recedes rather than vanishing,
          // so attention transfers to the incoming one. Skipped on the last
          // slide, which should stay fully present as the section ends.
          if (idx < slides.length - 1) {
            gsap.to(el, {
              opacity: 0.25,
              y: -32,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "bottom 55%",
                end: "bottom 15%",
                scrub: SCRUB,
              },
            });
          }
        });

        wireActiveTracking(slides, numbers);
      });

      // ── Mobile / tablet: wipe reveal only, no parallax or fade-out ─────
      mm.add(`(max-width: 1023px) and (not ${REDUCED_QUERY})`, () => {
        const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
        const numbers = numberRefs.current.filter(Boolean) as HTMLSpanElement[];

        slides.forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0 0 0)", y: 32 },
            {
              clipPath: "inset(0% 0 0 0)",
              y: 0,
              duration: 0.8,
              ease: EASE,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            },
          );
        });

        wireActiveTracking(slides, numbers);
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
