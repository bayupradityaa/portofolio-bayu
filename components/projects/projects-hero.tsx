"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";

interface ProjectsHeroProps {
  totalCount: number;
}

export function ProjectsHero({ totalCount }: ProjectsHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headlineLine1Ref = useRef<HTMLHeadingElement | null>(null);
  const headlineLine2Ref = useRef<HTMLHeadingElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const metaRailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
      )
        .fromTo(
          [headlineLine1Ref.current, headlineLine2Ref.current],
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "expo.out",
          },
          "-=0.2"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          metaRailRef.current ? metaRailRef.current.children : [],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={containerRef}
      className="relative w-full pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-white/10"
      aria-label="Archive Introduction"
    >
      {/* Delicate Architectural Background Grid (Subtle Texture) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] select-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* Top Utility Strip */}
        <div className="mb-10 md:mb-14 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70 transition-colors duration-300 hover:text-accent"
          >
            <ArrowLeft
              size={13}
              className="transition-transform duration-300 group-hover:-translate-x-1 text-accent"
            />
            <span>BACK TO HOME</span>
          </Link>

          <div className="inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-widest text-foreground/60">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span>
              ARCHIVE // {String(totalCount).padStart(2, "0")} SHIPPED WORKS
            </span>
          </div>
        </div>

        {/* Eyebrow */}
        <div ref={eyebrowRef} className="mb-4 flex items-center gap-2.5">
          <div className="h-px w-6 bg-accent" />
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-accent">
            SELECTED WORKS ARCHIVE
          </span>
        </div>

        {/* Editorial Headline with Clean Masked Reveal */}
        <div className="mb-6 space-y-1 overflow-hidden select-text">
          <div className="overflow-hidden py-1">
            <h1
              ref={headlineLine1Ref}
              className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground leading-[0.96]"
            >
              Things I&apos;ve built
            </h1>
          </div>
          <div className="overflow-hidden py-1">
            <h1
              ref={headlineLine2Ref}
              className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground leading-[0.96] flex items-center gap-3 sm:gap-5 flex-wrap"
            >
              <span className="text-accent">&amp;</span>
              <span>shipped.</span>
            </h1>
          </div>
        </div>

        {/* Concise Description */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <p
            ref={descRef}
            className="text-base sm:text-lg text-secondary font-normal leading-relaxed"
          >
            Software, AI experiments, and digital platforms built with thoughtful engineering and tangible utility.
          </p>
        </div>

        {/* Clean Metadata Rail (Restrained & Open — 3 Columns) */}
        <div
          ref={metaRailRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 font-sans"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              // VOLUME
            </span>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {String(totalCount).padStart(2, "0")} <span className="text-[11px] font-semibold text-accent uppercase">PROJECTS</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              // TIMELINE
            </span>
            <p className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              2023 — 2026
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              // FOCUS
            </span>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-foreground/90 uppercase">
              AI · REAL-TIME · PLATFORMS
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
