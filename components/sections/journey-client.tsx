"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { ScrollFloat } from "@/components/motion/scroll-float";
import { cn } from "@/lib/utils";
import type { Experience } from "@/lib/types/database";

// Idempotent — SmoothScroll registers this globally; re-registering keeps the
// component self-contained and hooks into the shared Lenis ↔ ScrollTrigger tick.
gsap.registerPlugin(ScrollTrigger);

const EASE = "power3.out";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/**
 * Cinematic, scroll-driven "The path so far" timeline.
 *
 * All motion is transform/opacity/filter only (90+ Lighthouse safe) and routed
 * through the app's global Lenis ↔ ScrollTrigger tick, so every scrub inherits
 * the same smoothing as the rest of the page.
 *
 * - A center accent rail draws itself (scaleY 0→1) scrubbed to scroll.
 * - Each node lights up while its entry owns the viewport.
 * - Content cards slide in from the rail with a blur-in on first reveal.
 * - Period labels get a whisper of opposing parallax for depth.
 *
 * Reduced-motion collapses everything to its final, fully readable state.
 */
export function JourneyClient({ timeline }: { timeline: Experience[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const periodRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail || timeline.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Reduced motion: paint final state, nothing scrubbed ────────────────
      mm.add(REDUCED_QUERY, () => {
        if (progressRef.current) gsap.set(progressRef.current, { scaleY: 1 });
        gsap.set(contentRefs.current, { opacity: 1, x: 0, filter: "blur(0px)" });
        gsap.set(periodRefs.current, { y: 0 });
        nodeRefs.current.forEach((n) => n?.classList.add("is-active"));
      });

      // Shared bits that don't depend on layout: rail draw, node lighting,
      // period parallax. Registered once for any motion-allowed viewport.
      const addSharedMotion = () => {
        // Accent rail draws itself as you scroll the list.
        if (progressRef.current) {
          gsap.fromTo(
            progressRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: rail,
                start: "top center",
                end: "bottom center",
                scrub: true,
              },
            },
          );
        }

        // Nodes light up while their entry owns the viewport.
        nodeRefs.current.forEach((node, i) => {
          if (!node) return;
          ScrollTrigger.create({
            trigger: itemRefs.current[i] ?? node,
            start: "top 62%",
            end: "bottom 45%",
            onToggle: (self) => node.classList.toggle("is-active", self.isActive),
          });
        });

        // Whisper of opposing parallax on the period label — depth, not noise.
        periodRefs.current.forEach((el) => {
          if (!el) return;
          gsap.fromTo(
            el,
            { y: 14 },
            {
              y: -14,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      };

      /** Content reveal — `dir` sets slide-in origin (+1 right, -1 left). */
      const revealCards = (dir: (i: number) => number) => {
        contentRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.fromTo(
            el,
            { opacity: 0, x: 40 * dir(i), filter: "blur(8px)" },
            {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              duration: 0.7,
              ease: EASE,
              scrollTrigger: {
                trigger: itemRefs.current[i] ?? el,
                start: "top 82%",
                once: true,
              },
            },
          );
        });
      };

      // ── Mobile / tablet: left rail, everything slides in from the left ─────
      mm.add(`(max-width: 1023px) and ${MOTION_QUERY}`, () => {
        addSharedMotion();
        revealCards(() => -1);
      });

      // ── Desktop: center rail, entries alternate — even → left, odd → right ─
      mm.add(`(min-width: 1024px) and ${MOTION_QUERY}`, () => {
        addSharedMotion();
        revealCards((i) => (i % 2 === 0 ? -1 : 1));
      });
    }, section);

    return () => ctx.revert();
  }, [timeline.length]);

  return (
    <Section id="journey">
      <div ref={sectionRef as React.RefObject<HTMLDivElement>}>
        {/* Heading — split-char scroll-float, sized to match other section titles */}
        <ScrollFloat
          containerClassName="max-w-3xl text-left text-3xl font-semibold tracking-tight md:text-5xl"
          scrollStart="center bottom+=40%"
          scrollEnd="center center"
        >
          The path so far
        </ScrollFloat>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-secondary md:text-lg">
          How I got from first lines of code to building products end to end.
          Most recent first.
        </p>

        {/* Timeline */}
        <div ref={railRef} className="relative mt-16">
          {/* Faint static rail — left on mobile, centered on desktop */}
          <span
            className="journey-rail pointer-events-none absolute top-1 bottom-1 left-0 w-px bg-border lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
          />
          {/* Accent progress rail — scaleY scrubbed to scroll */}
          <span
            ref={progressRef}
            className="journey-progress pointer-events-none absolute top-1 bottom-1 left-0 w-px origin-top bg-gradient-to-b from-accent via-accent to-transparent lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
          />

          <ol className="space-y-0">
            {timeline.map((entry, i) => {
              const isRight = i % 2 !== 0; // desktop side; ignored on mobile
              return (
                <li
                  key={entry.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={cn(
                    "relative pb-14 pl-10 last:pb-0 lg:pl-0",
                    // Desktop: each entry occupies one half, offset from center.
                    "lg:grid lg:grid-cols-2 lg:gap-x-16",
                  )}
                >
                  {/* Node — on the rail (left on mobile, centered on desktop) */}
                  <span
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    className="journey-node absolute top-1.5 -left-[7px] lg:left-1/2 lg:-translate-x-1/2"
                    aria-hidden="true"
                  />

                  {/* Opposite-side Period label on desktop for visual symmetry */}
                  <div
                    className={cn(
                      "hidden lg:block pt-1 font-mono text-xs font-medium text-muted",
                      isRight
                        ? "lg:col-start-1 lg:pr-16 lg:text-right"
                        : "lg:col-start-2 lg:pl-16 lg:text-left",
                    )}
                  >
                    <p
                      ref={(el) => {
                        periodRefs.current[i] = el;
                      }}
                      style={{ willChange: "transform" }}
                    >
                      {entry.period}
                    </p>
                  </div>

                  {/* Content — alternates columns on desktop, text hugs the rail */}
                  <div
                    ref={(el) => {
                      contentRefs.current[i] = el;
                    }}
                    className={cn(
                      isRight
                        ? "lg:col-start-2 lg:pl-16 lg:text-left"
                        : "lg:col-start-1 lg:pr-16 lg:text-right",
                    )}
                    style={{ willChange: "transform, opacity, filter" }}
                  >
                    {/* Period label on mobile layout */}
                    <p className="font-mono text-xs text-muted lg:hidden">
                      {entry.period}
                    </p>

                    <h3 className="mt-1 text-xl font-semibold tracking-tight lg:mt-0">
                      {entry.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-accent">{entry.org}</p>
                    <p
                      className={cn(
                        "mt-3 max-w-[58ch] leading-relaxed text-secondary",
                        isRight ? "" : "lg:ml-auto",
                      )}
                    >
                      {entry.description}
                    </p>
                    {entry.tags.length > 0 && (
                      <div
                        className={cn(
                          "mt-4 flex flex-wrap gap-2",
                          isRight ? "" : "lg:justify-end",
                        )}
                      >
                        {entry.tags.map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
