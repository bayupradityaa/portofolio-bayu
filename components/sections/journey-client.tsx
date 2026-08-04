"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Compass, ArrowDown, MapPin } from "lucide-react";
import type { Experience } from "@/lib/types/database";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Extracts a short 2-digit year display string (e.g., "'23", "'22", "'21", "'19")
 * from period strings like "2023 — Present" or "Sep 2021 — Oct 2021".
 */
function getShortYear(period: string, fallbackIdx: number): string {
  const match = period.match(/\b(20\d{2}|19\d{2})\b/);
  if (match && match[1]) {
    return `'${match[1].slice(-2)}`;
  }
  const years = ["'25", "'23", "'22", "'21", "'19"];
  return years[fallbackIdx % years.length] ?? "'25";
}

/**
 * `JourneyClient` — Thicker Lines, Larger Airplane, Ultra-Smooth Organic Curves.
 *
 * ─── Specifications & Enhancements ─────────────────────────────────────────────
 *  1. Thicker Progress Line (`strokeWidth="6"`): Bold, prominent green accent line.
 *  2. High-Visibility Dashed Guideline (`stroke="rgba(255,255,255,0.25)" strokeWidth="3.5"`):
 *     Crisp, clear dashed path visible across dark mode background.
 *  3. Larger Airplane Icon (`scale(1.3)`): Proportional to the thicker progress line.
 *  4. Silky Organic Bezier Trajectory: Symmetric C2 continuous curves for ultra-smooth turns.
 */
export function JourneyClient({ timeline }: { timeline: Experience[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const planeGroupRef = useRef<SVGGElement | null>(null);
  const planePopupGroupRef = useRef<SVGGElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [mounted, setMounted] = useState(false);
  const [activeNodes, setActiveNodes] = useState<Record<number, boolean>>({});
  const [isLanded, setIsLanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    if (!timeline || timeline.length === 0) return;

    const section = sectionRef.current;
    const path = pathRef.current;
    const planeGroup = planeGroupRef.current;
    const planePopupGroup = planePopupGroupRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        if (path && planeGroup) {
          const pathLength = path.getTotalLength();

          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });

          // Airplane starts at Card 1 right edge
          const startPt = path.getPointAtLength(0);
          const startPtNext = path.getPointAtLength(Math.min(6, pathLength));
          const startAngle = Math.atan2(startPtNext.y - startPt.y, startPtNext.x - startPt.x) * (180 / Math.PI);

          gsap.set(planeGroup, {
            x: startPt.x,
            y: startPt.y,
            rotation: startAngle + 90,
            transformOrigin: "center center",
          });

          if (planePopupGroup) {
            gsap.set(planePopupGroup, {
              x: startPt.x,
              y: startPt.y,
            });
          }

          // Scrub starts as soon as Card 1 is visible — near-instant, silky smooth tracking
          ScrollTrigger.create({
            trigger: cardsRef.current[0] ?? section,
            start: "top 78%",
            endTrigger: section,
            end: "bottom 85%",
            scrub: 0.3,
            onUpdate: (self) => {
              const currentLength = pathLength * self.progress;
              gsap.set(path, { strokeDashoffset: pathLength - currentLength });

              const pt = path.getPointAtLength(currentLength);
              const ptNext = path.getPointAtLength(Math.min(currentLength + 5, pathLength));
              const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) * (180 / Math.PI);

              gsap.set(planeGroup, {
                x: pt.x,
                y: pt.y,
                rotation: angle + 90,
                transformOrigin: "center center",
              });

              if (planePopupGroup) {
                gsap.set(planePopupGroup, {
                  x: pt.x,
                  y: pt.y,
                });
              }

              // Touchdown / Landed state detection when plane reaches the end of the line
              if (self.progress >= 0.92) {
                setIsLanded(true);
              } else {
                setIsLanded(false);
              }

              // Active card state
              timeline.forEach((_, idx) => {
                const nodeThreshold = idx / Math.max(1, timeline.length - 1);
                if (self.progress >= nodeThreshold * 0.75) {
                  setActiveNodes((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
                } else {
                  setActiveNodes((prev) => (!prev[idx] ? prev : { ...prev, [idx]: false }));
                }
              });
            },
          });
        }

        // Staggered Entrance Animations for Cards (Synchronized smoothly as plane approaches)
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const isRight = i % 2 !== 0;

          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 40,
              x: isRight ? 40 : -40,
              scale: 0.96,
              filter: "blur(4px)",
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });

      // Mobile vertical reveal
      mm.add("(max-width: 767px)", () => {
        cardsRef.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });
    }, section);

    return () => ctx.revert();
  }, [mounted, timeline]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative w-full bg-background text-foreground pt-4 pb-20 md:pt-8 md:pb-28 overflow-hidden select-none"
      aria-label="About Me and My Journey Timeline"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Timeline Container */}
        <div className="relative w-full">
          {/* SVG Bezier Curve with Thicker Line & High Visibility (Desktop) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 1400"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* High-visibility Dashed Background Guideline Path */}
              <path
                d="M 460 120 C 620 140, 740 240, 740 360 C 740 520, 260 560, 260 720 C 260 880, 740 920, 740 1080 C 740 1220, 460 1320, 260 1340"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="3.5"
                strokeDasharray="10 10"
              />

              {/* Thicker Accent Green Animated Progress Path */}
              <path
                ref={pathRef}
                d="M 460 120 C 620 140, 740 240, 740 360 C 740 520, 260 560, 260 720 C 260 880, 740 920, 740 1080 C 740 1220, 460 1320, 260 1340"
                stroke="var(--color-accent, #10b981)"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Larger Airplane SVG Icon Group Mounted DIRECTLY at tip of Progress Path */}
              <g
                ref={planeGroupRef}
                className="text-accent drop-shadow-[0_0_24px_rgba(16,185,129,1)]"
              >
                <g transform="translate(-25, -25) scale(1.85)">
                  <path
                    d="m 14.83626,1023.9633 c -1.27638,-0.022 -2.23322,1.3945 -1.93048,2.5893 -0.0106,2.3825 0.0254,4.5399 -0.0211,6.9222 -0.86563,0.724 -1.95196,1.1101 -2.84804,1.7935 -2.6499502,1.6543 -5.3834402,3.1905 -7.9741805,4.9298 -0.52658,1.0194 -0.12448,2.19 -0.25868,3.2744 0.11289,0.5899 0.9093903,0.7624 1.3520503,0.4239 3.29418,-1.0185 6.53329,-2.2113 9.8415802,-3.184 -0.0136,1.2588 0.0536,2.5172 0.0159,3.7764 -0.0278,0.3845 0.0353,0.8094 -0.0793,1.1678 -0.73435,0.8237 -1.95869,1.1927 -2.42191,2.2475 -0.15271,0.6859 -0.0237,1.3982 -0.0669,2.0926 0.0545,0.4878 0.57437,0.9328 1.06023,0.7042 0.96241,-0.3065 1.93965,-0.5659 2.88352,-0.9103 0.49901,-0.1817 1.0366,-0.1155 1.51212,0.093 1.06199,0.324 2.1249,0.8298 3.24892,0.8142 0.5432,-0.2545 0.45447,-0.9487 0.40024,-1.437 0.0965,-0.7182 0.11746,-1.6418 -0.57108,-2.084 -0.65138,-0.5245 -1.36097,-0.9863 -1.96573,-1.5694 -0.0402,-1.6279 -0.0903,-3.3324 0.0123,-4.9143 1.26835,0.4358 2.56344,0.7925 3.82879,1.2414 2.24148,0.7382 4.46719,1.5504 6.75364,2.1317 0.57349,-0.097 0.70865,-0.8342 0.54603,-1.3122 -0.02,-0.838 0.23484,-1.7759 -0.23779,-2.5329 -1.9355,-1.3961 -4.08122,-2.4651 -6.08613,-3.7567 -1.61971,-0.9718 -3.23783,-1.9463 -4.85386,-2.9243 -0.1822,-1.0478 0.0511,-2.1208 -0.0622,-3.1775 -0.008,-1.8175 0.13456,-3.4277 -0.16148,-5.2296 -0.32567,-0.7305 -1.12107,-1.2029 -1.91639,-1.1695 z"
                    fill="currentColor"
                    transform="translate(0,-1022.3622)"
                  />
                </g>
              </g>

              {/* Upright Floating Speech-Bubble Pop-Up directly attached to Airplane position */}
              <g ref={planePopupGroupRef}>
                <foreignObject
                  x="-115"
                  y="-72"
                  width="230"
                  height="60"
                  className="overflow-visible pointer-events-none"
                >
                  <div
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-black shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition-all duration-500 transform origin-bottom font-sans",
                      isLanded
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-75 translate-y-3 pointer-events-none"
                    )}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black text-[#FFD177] shadow-sm">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-bold text-black tracking-tight leading-snug">
                        See You in the Next Journey!
                      </span>
                      <span className="text-[9.5px] text-black/70 font-normal leading-tight mt-0.5 whitespace-nowrap">
                        Ready to build the next milestone together.
                      </span>
                    </div>
                    {/* Speech bubble pointer arrow pointing straight down to airplane icon */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
                  </div>
                </foreignObject>
              </g>
            </svg>
          </div>

          {/* Staggered Experience Cards List */}
          <div className="relative z-10 space-y-12 md:space-y-20">
            {timeline.map((entry, idx) => {
              const shortYear = getShortYear(entry.period, idx);
              const isRight = idx % 2 !== 0;
              const isActive = activeNodes[idx];

              return (
                <div
                  key={entry.id}
                  className={cn(
                    "flex flex-col md:grid md:grid-cols-12 items-center gap-8",
                    isRight ? "md:flex-row-reverse" : ""
                  )}
                >
                  {/* Card Container */}
                  <div
                    ref={(el) => {
                      cardsRef.current[idx] = el;
                    }}
                    className={cn(
                      "w-full md:col-span-6 max-w-[440px] relative p-5 lg:p-6 rounded-2xl md:rounded-3xl bg-card/85 backdrop-blur-xl border transition-all duration-500 shadow-xl group",
                      isActive
                        ? "border-accent/60 shadow-[0_0_30px_rgba(255,209,119,0.15)]"
                        : "border-border/60 hover:border-accent/40",
                      isRight ? "md:col-start-7 md:ml-auto" : "md:col-start-1"
                    )}
                  >
                    {/* Period Badge on Card Header */}
                    <div
                      className={cn(
                        "absolute -top-3.5 left-6 lg:left-8 px-3.5 py-1 rounded-full font-mono text-xs font-bold border transition-all duration-500 flex items-center gap-2 uppercase tracking-wider",
                        isActive
                          ? "bg-accent text-accent-contrast border-accent shadow-[0_0_15px_rgba(255,209,119,0.5)]"
                          : "bg-background text-muted border-border"
                      )}
                    >
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors shrink-0",
                          isActive ? "bg-accent-contrast animate-ping" : "bg-muted"
                        )}
                      />
                      <span>{entry.period}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground mb-1 mt-1 group-hover:text-accent transition-colors">
                      {entry.title}
                    </h3>

                    {/* Organization / Company */}
                    <div className="flex items-center gap-2 text-accent font-medium text-xs lg:text-sm mb-3">
                      <span>{entry.org}</span>
                      {entry.employment_type && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono">
                          {entry.employment_type}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-muted text-xs lg:text-sm leading-relaxed mb-5 font-normal">
                      {entry.description}
                    </p>

                    {/* Footer Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/30">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} className="text-[11px] px-2.5 py-0.5 font-mono">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneyClient;
