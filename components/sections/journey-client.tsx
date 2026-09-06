"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Navigation, Sparkles, CheckCircle2 } from "lucide-react";
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
  return years[fallbackIdx % years.length] ?? `'${25 - fallbackIdx * 2}`;
}

export function JourneyClient({ timeline }: { timeline: Experience[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Desktop refs
  const desktopPathRef = useRef<SVGPathElement | null>(null);
  const desktopPlaneGroupRef = useRef<SVGGElement | null>(null);
  const desktopPopupGroupRef = useRef<SVGGElement | null>(null);

  // Mobile refs
  const mobilePathRef = useRef<SVGPathElement | null>(null);
  const mobilePlaneGroupRef = useRef<SVGGElement | null>(null);

  // Card element refs
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
    if (!section) return;

    const mm = gsap.matchMedia();

    // ── DESKTOP ANIMATION (>= 768px) ─────────────────────────────────────────
    mm.add("(min-width: 768px)", () => {
      const path = desktopPathRef.current;
      const planeGroup = desktopPlaneGroupRef.current;
      const popup = desktopPopupGroupRef.current;
      if (!path || !planeGroup) return;

      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      const startPt = path.getPointAtLength(0);
      const startPtNext = path.getPointAtLength(Math.min(8, pathLength));
      const startAngle = Math.atan2(startPtNext.y - startPt.y, startPtNext.x - startPt.x) * (180 / Math.PI);

      gsap.set(planeGroup, {
        x: startPt.x,
        y: startPt.y,
        rotation: startAngle + 90,
        transformOrigin: "center center",
      });

      if (popup) {
        gsap.set(popup, { x: startPt.x, y: startPt.y });
      }

      ScrollTrigger.create({
        trigger: cardsRef.current[0] ?? section,
        start: "top 78%",
        endTrigger: section,
        end: "bottom 85%",
        scrub: 0.6,
        onUpdate: (self) => {
          const currentLength = pathLength * self.progress;
          gsap.set(path, { strokeDashoffset: pathLength - currentLength });

          const pt = path.getPointAtLength(currentLength);
          const ptNext = path.getPointAtLength(Math.min(currentLength + 6, pathLength));
          const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) * (180 / Math.PI);

          gsap.set(planeGroup, {
            x: pt.x,
            y: pt.y,
            rotation: angle + 90,
            transformOrigin: "center center",
          });

          if (popup) {
            gsap.set(popup, { x: pt.x, y: pt.y });
          }

          setIsLanded(self.progress >= 0.92);

          timeline.forEach((_, idx) => {
            const nodeThreshold = (idx + 0.15) / Math.max(1, timeline.length);
            if (self.progress >= nodeThreshold * 0.85) {
              setActiveNodes((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
            } else {
              setActiveNodes((prev) => (!prev[idx] ? prev : { ...prev, [idx]: false }));
            }
          });
        },
      });
    });

    // ── MOBILE ANIMATION (< 768px) ───────────────────────────────────────────
    mm.add("(max-width: 767px)", () => {
      const path = mobilePathRef.current;
      const planeGroup = mobilePlaneGroupRef.current;
      if (!path || !planeGroup) return;

      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      const startPt = path.getPointAtLength(0);
      const startPtNext = path.getPointAtLength(Math.min(6, pathLength));
      const startAngle = Math.atan2(startPtNext.y - startPt.y, startPtNext.x - startPt.x) * (180 / Math.PI);

      gsap.set(planeGroup, {
        x: startPt.x,
        y: startPt.y,
        rotation: startAngle + 90,
        transformOrigin: "center center",
      });

      ScrollTrigger.create({
        trigger: cardsRef.current[0] ?? section,
        start: "top 82%",
        endTrigger: section,
        end: "bottom 88%",
        scrub: 0.5,
        onUpdate: (self) => {
          const currentLength = pathLength * self.progress;
          gsap.set(path, { strokeDashoffset: pathLength - currentLength });

          const pt = path.getPointAtLength(currentLength);
          const ptNext = path.getPointAtLength(Math.min(currentLength + 6, pathLength));
          const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) * (180 / Math.PI);

          gsap.set(planeGroup, {
            x: pt.x,
            y: pt.y,
            rotation: angle + 90,
            transformOrigin: "center center",
          });

          setIsLanded(self.progress >= 0.90);

          timeline.forEach((_, idx) => {
            const nodeThreshold = (idx + 0.1) / Math.max(1, timeline.length);
            if (self.progress >= nodeThreshold * 0.85) {
              setActiveNodes((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
            } else {
              setActiveNodes((prev) => (!prev[idx] ? prev : { ...prev, [idx]: false }));
            }
          });
        },
      });
    });

    // Card entrance animations for all viewports
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const isRight = i % 2 !== 0;

      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 35,
          x: isRight ? 15 : -15,
          scale: 0.97,
          filter: "blur(3px)",
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => mm.revert();
  }, [mounted, timeline]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative w-full bg-background text-foreground pt-4 pb-20 md:pt-8 md:pb-28 overflow-hidden"
      aria-label="About Me and My Journey Timeline"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Timeline Container */}
        <div ref={containerRef} className="relative w-full">
          {/* ── DESKTOP FLIGHT PATH SVG (>= md) ─────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 1400"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Background Guideline Path */}
              <path
                d="M 460 120 C 620 140, 740 240, 740 360 C 740 520, 260 560, 260 720 C 260 880, 740 920, 740 1080 C 740 1220, 460 1320, 260 1340"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="3"
                strokeDasharray="8 8"
              />

              {/* Glowing Accent Animated Progress Flight Path */}
              <path
                ref={desktopPathRef}
                d="M 460 120 C 620 140, 740 240, 740 360 C 740 520, 260 560, 260 720 C 260 880, 740 920, 740 1080 C 740 1220, 460 1320, 260 1340"
                stroke="var(--color-accent, #FFD177)"
                strokeWidth="5"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_12px_rgba(255,209,119,0.7)]"
              />

              {/* Desktop Airplane Icon Group */}
              <g
                ref={desktopPlaneGroupRef}
                className="text-accent drop-shadow-[0_0_24px_rgba(255,209,119,0.95)]"
              >
                <g transform="translate(-25, -25) scale(1.85)">
                  <path
                    d="m 14.83626,1023.9633 c -1.27638,-0.022 -2.23322,1.3945 -1.93048,2.5893 -0.0106,2.3825 0.0254,4.5399 -0.0211,6.9222 -0.86563,0.724 -1.95196,1.1101 -2.84804,1.7935 -2.6499502,1.6543 -5.3834402,3.1905 -7.9741805,4.9298 -0.52658,1.0194 -0.12448,2.19 -0.25868,3.2744 0.11289,0.5899 0.9093903,0.7624 1.3520503,0.4239 3.29418,-1.0185 6.53329,-2.2113 9.8415802,-3.184 -0.0136,1.2588 0.0536,2.5172 0.0159,3.7764 -0.0278,0.3845 0.0353,0.8094 -0.0793,1.1678 -0.73435,0.8237 -1.95869,1.1927 -2.42191,2.2475 -0.15271,0.6859 -0.0237,1.3982 -0.0669,2.0926 0.0545,0.4878 0.57437,0.9328 1.06023,0.7042 0.96241,-0.3065 1.93965,-0.5659 2.88352,-0.9103 0.49901,-0.1817 1.0366,-0.1155 1.51212,0.093 1.06199,0.324 2.1249,0.8298 3.24892,0.8142 0.5432,-0.2545 0.45447,-0.9487 0.40024,-1.437 0.0965,-0.7182 0.11746,-1.6418 -0.57108,-2.084 -0.65138,-0.5245 -1.36097,-0.9863 -1.96573,-1.5694 -0.0402,-1.6279 -0.0903,-3.3324 0.0123,-4.9143 1.26835,0.4358 2.56344,0.7925 3.82879,1.2414 2.24148,0.7382 4.46719,1.5504 6.75364,2.1317 0.57349,-0.097 0.70865,-0.8342 0.54603,-1.3122 -0.02,-0.838 0.23484,-1.7759 -0.23779,-2.5329 -1.9355,-1.3961 -4.08122,-2.4651 -6.08613,-3.7567 -1.61971,-0.9718 -3.23783,-1.9463 -4.85386,-2.9243 -0.1822,-1.0478 0.0511,-2.1208 -0.0622,-3.1775 -0.008,-1.8175 0.13456,-3.4277 -0.16148,-5.2296 -0.32567,-0.7305 -1.12107,-1.2029 -1.91639,-1.1695 z"
                    fill="currentColor"
                    transform="translate(0,-1022.3622)"
                  />
                </g>
              </g>

              {/* Desktop Touchdown Landing Pop-Up */}
              <g ref={desktopPopupGroupRef}>
                <foreignObject
                  x="-125"
                  y="-85"
                  width="250"
                  height="75"
                  className="overflow-visible pointer-events-none"
                >
                  <div
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-xl border border-accent/30 bg-card/95 backdrop-blur-xl px-3.5 py-2.5 text-foreground shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-500 transform origin-bottom font-sans",
                      isLanded
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-75 translate-y-3 pointer-events-none"
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-contrast shadow-md">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-foreground tracking-tight leading-snug">
                        Touchdown: Ready to Build!
                      </span>
                      <span className="text-[11px] text-foreground/70 font-normal leading-tight mt-0.5">
                        Let's start the next milestone together.
                      </span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-card" />
                  </div>
                </foreignObject>
              </g>
            </svg>
          </div>

          {/* ── MOBILE FLIGHT TRACK SVG (< md) ──────────────────────────── */}
          <div className="absolute left-2.5 sm:left-4 top-0 bottom-0 w-10 pointer-events-none z-0 md:hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 40 1400"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Mobile Dashed Guideline Path */}
              <path
                d="M 20 50 C 30 150, 10 250, 20 370 C 30 490, 10 590, 20 710 C 30 830, 10 930, 20 1050 C 30 1170, 10 1260, 20 1360"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />

              {/* Mobile Glowing Progress Path */}
              <path
                ref={mobilePathRef}
                d="M 20 50 C 30 150, 10 250, 20 370 C 30 490, 10 590, 20 710 C 30 830, 10 930, 20 1050 C 30 1170, 10 1260, 20 1360"
                stroke="var(--color-accent, #FFD177)"
                strokeWidth="4"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_8px_rgba(255,209,119,0.8)]"
              />

              {/* Mobile Airplane Icon Group */}
              <g
                ref={mobilePlaneGroupRef}
                className="text-accent drop-shadow-[0_0_18px_rgba(255,209,119,0.95)]"
              >
                <g transform="translate(-18, -18) scale(1.35)">
                  <path
                    d="m 14.83626,1023.9633 c -1.27638,-0.022 -2.23322,1.3945 -1.93048,2.5893 -0.0106,2.3825 0.0254,4.5399 -0.0211,6.9222 -0.86563,0.724 -1.95196,1.1101 -2.84804,1.7935 -2.6499502,1.6543 -5.3834402,3.1905 -7.9741805,4.9298 -0.52658,1.0194 -0.12448,2.19 -0.25868,3.2744 0.11289,0.5899 0.9093903,0.7624 1.3520503,0.4239 3.29418,-1.0185 6.53329,-2.2113 9.8415802,-3.184 -0.0136,1.2588 0.0536,2.5172 0.0159,3.7764 -0.0278,0.3845 0.0353,0.8094 -0.0793,1.1678 -0.73435,0.8237 -1.95869,1.1927 -2.42191,2.2475 -0.15271,0.6859 -0.0237,1.3982 -0.0669,2.0926 0.0545,0.4878 0.57437,0.9328 1.06023,0.7042 0.96241,-0.3065 1.93965,-0.5659 2.88352,-0.9103 0.49901,-0.1817 1.0366,-0.1155 1.51212,0.093 1.06199,0.324 2.1249,0.8298 3.24892,0.8142 0.5432,-0.2545 0.45447,-0.9487 0.40024,-1.437 0.0965,-0.7182 0.11746,-1.6418 -0.57108,-2.084 -0.65138,-0.5245 -1.36097,-0.9863 -1.96573,-1.5694 -0.0402,-1.6279 -0.0903,-3.3324 0.0123,-4.9143 1.26835,0.4358 2.56344,0.7925 3.82879,1.2414 2.24148,0.7382 4.46719,1.5504 6.75364,2.1317 0.57349,-0.097 0.70865,-0.8342 0.54603,-1.3122 -0.02,-0.838 0.23484,-1.7759 -0.23779,-2.5329 -1.9355,-1.3961 -4.08122,-2.4651 -6.08613,-3.7567 -1.61971,-0.9718 -3.23783,-1.9463 -4.85386,-2.9243 -0.1822,-1.0478 0.0511,-2.1208 -0.0622,-3.1775 -0.008,-1.8175 0.13456,-3.4277 -0.16148,-5.2296 -0.32567,-0.7305 -1.12107,-1.2029 -1.91639,-1.1695 z"
                    fill="currentColor"
                    transform="translate(0,-1022.3622)"
                  />
                </g>
              </g>
            </svg>
          </div>

          {/* ── EXPERIENCE CARDS WITH MILESTONE WAYPOINTS ───────────────── */}
          <div className="relative z-10 space-y-12 md:space-y-24 pl-10 sm:pl-14 md:pl-0">
            {timeline.map((entry, idx) => {
              const shortYear = getShortYear(entry.period, idx);
              const isRight = idx % 2 !== 0;
              const isActive = activeNodes[idx];
              const waypointNumber = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={entry.id}
                  className={cn(
                    "relative flex flex-col md:grid md:grid-cols-12 items-center gap-6 md:gap-8",
                    isRight ? "md:flex-row-reverse" : ""
                  )}
                >
                  {/* ── MOBILE WAYPOINT NODE (< md) ────────────────────── */}
                  <div className="absolute -left-10 sm:-left-14 top-4 flex md:hidden items-center">
                    <div
                      className={cn(
                        "relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all duration-500 font-mono text-xs font-bold",
                        isActive
                          ? "border-accent bg-accent text-accent-contrast shadow-[0_0_18px_rgba(255,209,119,0.65)] scale-110"
                          : "border-border/70 bg-card text-muted-foreground/70 scale-95"
                      )}
                    >
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping opacity-75" />
                      )}
                      <span>{waypointNumber}</span>
                    </div>
                  </div>

                  {/* ── DESKTOP WAYPOINT NODE & CONNECTOR (>= md) ───────── */}
                  <div
                    className={cn(
                      "hidden md:flex absolute top-1/2 -translate-y-1/2 items-center z-20 pointer-events-none transition-all duration-500",
                      isRight
                        ? "right-1/2 mr-[-24px] flex-row-reverse"
                        : "left-1/2 ml-[-24px] flex-row"
                    )}
                  >
                    {/* Anchor Line */}
                    <div
                      className={cn(
                        "h-[2px] transition-all duration-500",
                        isRight ? "w-12 lg:w-16" : "w-12 lg:w-16",
                        isActive
                          ? "bg-accent shadow-[0_0_8px_rgba(255,209,119,0.8)]"
                          : "bg-border/60"
                      )}
                    />

                    {/* Central Radar Waypoint Node */}
                    <div
                      className={cn(
                        "relative flex h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full border-2 transition-all duration-500 font-mono shadow-xl backdrop-blur-md",
                        isActive
                          ? "border-accent bg-card text-accent shadow-[0_0_24px_rgba(255,209,119,0.65)] scale-110"
                          : "border-border/80 bg-card/90 text-muted-foreground scale-95"
                      )}
                    >
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping opacity-75" />
                      )}
                      <div className="flex flex-col items-center justify-center leading-none">
                        <span className="text-[11px] font-extrabold">{waypointNumber}</span>
                        <span className="text-[9px] font-medium text-accent/90 mt-0.5">{shortYear}</span>
                      </div>
                    </div>
                  </div>

                  {/* ── CARD BODY CONTAINER ─────────────────────────────── */}
                  <div
                    ref={(el) => {
                      cardsRef.current[idx] = el;
                    }}
                    className={cn(
                      "w-full md:col-span-6 max-w-[480px] relative p-5 sm:p-6 lg:p-7 rounded-2xl md:rounded-3xl bg-card/90 backdrop-blur-xl border transition-all duration-500 shadow-xl group",
                      isActive
                        ? "border-accent/75 shadow-[0_0_35px_rgba(255,209,119,0.18)]"
                        : "border-border/60 hover:border-accent/40",
                      isRight ? "md:col-start-7 md:ml-auto" : "md:col-start-1"
                    )}
                  >
                    {/* Period Badge on Card Header */}
                    <div
                      className={cn(
                        "absolute -top-3.5 left-5 sm:left-6 lg:left-8 px-3.5 py-1 rounded-full font-mono text-xs font-bold border transition-all duration-500 flex items-center gap-2 uppercase tracking-wider",
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

                    {/* Checkpoint Header Info */}
                    <div className="flex items-center justify-between text-xs font-mono text-accent/80 uppercase tracking-widest pt-1 mb-2">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Navigation className="w-3 h-3 text-accent rotate-45" />
                        Waypoint {waypointNumber}
                      </span>
                      <span className="text-muted-foreground/70 font-semibold">{shortYear}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-foreground mb-1 group-hover:text-accent transition-colors font-sans">
                      {entry.title}
                    </h3>

                    {/* Organization / Company */}
                    <div className="flex flex-wrap items-center gap-2 text-accent font-medium text-xs sm:text-sm mb-3">
                      <span>{entry.org}</span>
                      {entry.employment_type && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 border border-accent/25 text-accent font-mono">
                          {entry.employment_type}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-muted text-sm sm:text-base leading-relaxed mb-5 font-normal">
                      {entry.description}
                    </p>

                    {/* Footer Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/30">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} className="text-xs px-2.5 py-0.5 font-mono">
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

          {/* ── MOBILE TOUCHDOWN MESSAGE (appears when landed) ──────────── */}
          <div
            className={cn(
              "md:hidden mt-8 ml-2 flex items-center gap-3 p-3.5 rounded-2xl border border-accent/30 bg-card/95 backdrop-blur-xl shadow-xl transition-all duration-500",
              isLanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-contrast shadow-md">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-foreground">Touchdown: Destination Reached!</span>
              <span className="text-[11px] text-foreground/70">Ready to build the next milestone together.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneyClient;
