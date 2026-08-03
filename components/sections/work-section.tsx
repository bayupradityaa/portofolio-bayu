"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Idempotent plugin registration safely gated for SSR
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Shape of a single project card rendered by {@link WorkSection}.
 */
export interface WorkItem {
  index?: string;
  title: string;
  category?: string;
  year?: string;
  description?: string;
  image?: string;
  link: string;
}

export type WorkSectionProps = {
  items: WorkItem[];
  className?: string;
  /** Main section heading text. */
  heading?: string;
  /** Link target for the "view all" CTA. */
  viewAllHref?: string;
  /** Label for the "view all" CTA. */
  viewAllLabel?: string;
};

// ── Helper Utilities ─────────────────────────────────────────────────────────

/** Safely formats zero-padded double-digit index strings ("01", "02", etc.) */
function getFormattedIndex(item: WorkItem, idx: number): string {
  if (item.index) return item.index;
  const num = idx + 1;
  return num < 10 ? `0${num}` : `${num}`;
}

/** Fallback resolver for category text */
function getItemCategory(item: WorkItem): string {
  return item.category || "Selected Work";
}

/** Fallback resolver for publication year */
function getItemYear(item: WorkItem): string {
  return item.year || "2025";
}

/**
 * `WorkSection` — Exact TRIONN-Style Pinned Horizontal Scroll Section.
 *
 * ─── Layout & Motion Specifications (Matching Reference Video) ─────────────────────
 *  1. Layout: Large featured image frame with rounded corners (`rounded-3xl`), title +
 *     description on bottom-left, and "EXPLORE PROJECT →" link on bottom-right.
 *  2. Bottom-Right Smooth Entrance: Each project card enters smoothly from the bottom-right
 *     (`y: 60, x: 40, opacity: 0.3, scale: 0.95` -> `y: 0, x: 0, opacity: 1, scale: 1`).
 *  3. Right-to-Left Clip-Path Wipe Over Journey Stage: Layer 1 (behind) renders the Section 04
 *     Journey stage header. Layer 2 (top) wipes closed from right to left (`clipPath: inset(0% 0% 0% 0%)` ->
 *     `inset(0% 100% 0% 0%)`), directly revealing Section 04 Journey right behind the wipe edge.
 */
export function WorkSection({
  items,
  className,
  heading = "Selected work & explorations",
  viewAllHref = "/projects",
  viewAllLabel = "VIEW ALL PROJECTS",
}: WorkSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinTargetRef = useRef<HTMLDivElement | null>(null);
  const workStageRef = useRef<HTMLDivElement | null>(null);
  const nextSectionLayerRef = useRef<HTMLDivElement | null>(null);
  const trackContainerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── GSAP ScrollTrigger Master Timeline Setup ─────────────────────────────
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    if (!items || items.length === 0) return;

    const section = sectionRef.current;
    const pinTarget = pinTargetRef.current;
    const workStage = workStageRef.current;
    const nextSectionLayer = nextSectionLayerRef.current;
    const trackContainer = trackContainerRef.current;
    const track = trackRef.current;
    if (!section || !pinTarget || !workStage || !trackContainer || !track) return;

    // Scoped GSAP context for safe selector isolation and React unmount teardown
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ───────────────────────────────────────────────────────────────────────
      // DESKTOP & TABLET: Pinned Horizontal Scrub + Right-to-Left Closing Wipe Over Journey (>= 768px)
      // ───────────────────────────────────────────────────────────────────────
      mm.add("(min-width: 768px)", () => {
        const cards = track.querySelectorAll<HTMLElement>("[data-project-card]");
        
        const getScrollAmount = () => {
          const totalWidth = track.scrollWidth;
          const containerWidth = trackContainer.clientWidth;
          return Math.max(totalWidth - containerWidth, 0);
        };

        const scrollAmount = getScrollAmount();
        const closingDistance = 900;
        const totalScrollDistance = scrollAmount + closingDistance;

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: pinTarget,
            start: "top top",
            end: () => `+=${totalScrollDistance}`,
            scrub: 1, // Smooth catch-up momentum scrub
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            refreshPriority: 1,
            markers: false,
            onToggle: (self) => {
              if (self.isActive && typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("section-active", { detail: { id: "work" } })
                );
              }
            },
          },
        });

        // 1. Horizontal Track Translation (from 0 to scrollAmount)
        masterTl.to(
          track,
          {
            x: () => -getScrollAmount(),
            ease: "none",
            duration: scrollAmount,
          },
          0
        );

        // 2. Per-Card Bottom-Right Entrance Animation & Parallax
        cards.forEach((card, idx) => {
          if (idx > 0) {
            const cardOffset = (idx / (cards.length - 1)) * scrollAmount;
            const startTime = Math.max(cardOffset - 250, 0);

            masterTl.fromTo(
              card,
              {
                y: 60,
                x: 40,
                opacity: 0.3,
                scale: 0.95,
              },
              {
                y: 0,
                x: 0,
                opacity: 1,
                scale: 1,
                ease: "power2.out",
                duration: 300,
              },
              startTime
            );
          }

          // Subtle horizontal parallax offset for inner image
          const img = card.querySelector<HTMLElement>("[data-card-image]");
          if (img) {
            masterTl.fromTo(
              img,
              { xPercent: 8 },
              {
                xPercent: -8,
                ease: "none",
                duration: scrollAmount,
              },
              0
            );
          }
        });

        // 3. Right-to-Left Closing Clip-Path Wipe of Work Stage (workStageRef)
        // Sweeps workStage away from right to left (`clipPath: inset(0% 0% 0% 0%)` -> `inset(0% 100% 0% 0%)`),
        // directly revealing Section 04 Journey stage underneath right behind the wipe edge!
        masterTl.fromTo(
          workStage,
          {
            clipPath: "inset(0% 0% 0% 0%)",
          },
          {
            clipPath: "inset(0% 100% 0% 0%)",
            ease: "power2.inOut",
            duration: closingDistance,
          },
          scrollAmount
        );

        // 4. Subtle entrance scale-up for Section 04 Journey preview layer as it is revealed
        if (nextSectionLayer) {
          masterTl.fromTo(
            nextSectionLayer,
            {
              scale: 0.96,
              opacity: 0.8,
            },
            {
              scale: 1,
              opacity: 1,
              ease: "power2.out",
              duration: closingDistance,
            },
            scrollAmount
          );
        }
      });

      // ───────────────────────────────────────────────────────────────────────
      // MOBILE: Stacked Vertical Reveal (< 768px)
      // ───────────────────────────────────────────────────────────────────────
      mm.add("(max-width: 767px)", () => {
        const mobileCards = section.querySelectorAll<HTMLElement>("[data-mobile-card]");
        mobileCards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [mounted, items]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className={cn("relative w-full bg-background text-foreground select-none", className)}
      aria-label="Selected Work Portfolio Showcase"
    >
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* DESKTOP PINNED HORIZONTAL STAGE (>= 768px)                             */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div
        ref={pinTargetRef}
        className="hidden md:block relative w-full h-screen overflow-hidden"
      >
        {/* ── LAYER 1 (BEHIND): SECTION 04 JOURNEY REVEAL STAGE ── */}
        <div
          ref={nextSectionLayerRef}
          className="absolute inset-0 w-full h-full bg-background z-0 flex flex-col justify-center px-8 lg:px-16 max-w-[1700px] mx-auto pointer-events-none"
        >
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                04 // JOURNEY
              </span>
              <span className="h-px w-12 bg-accent/30" />
            </div>

            <h2 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
              The path so far.
            </h2>

            <p className="text-base lg:text-lg text-muted font-normal leading-relaxed max-w-xl">
              How I got from first lines of code to building products end to end. Most recent experience &amp; milestones.
            </p>

            <div className="pt-4">
              <div className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-accent/40 bg-accent/10 text-accent font-mono text-xs font-semibold uppercase tracking-widest">
                <span>SCROLL TO EXPLORE JOURNEY</span>
                <span>↓</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── LAYER 2 (TOP): SECTION 03 WORK STAGE (WIPES RIGHT-TO-LEFT) ── */}
        <div
          ref={workStageRef}
          className="absolute inset-0 w-full h-full bg-background z-10 flex items-center justify-between px-8 lg:px-16 max-w-[1700px] mx-auto overflow-hidden"
        >
          {/* Left Column: Fixed Pinned Section Header & View All CTA */}
          <header className="w-full md:w-[35%] lg:w-[30%] flex flex-col justify-between h-full py-10 lg:py-14 pr-8 lg:pr-12 z-20 shrink-0 border-r border-border/30 bg-background">
            <div className="space-y-6 pt-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                {heading}
              </h2>
            </div>

            {/* Bottom Left CTA */}
            <div className="pt-8">
              <Link
                href={viewAllHref}
                className="group inline-flex items-center gap-3 text-xs md:text-sm font-mono font-semibold uppercase tracking-widest text-muted hover:text-foreground transition-colors"
              >
                <span>{viewAllLabel}</span>
                <span className="w-9 h-9 rounded-full border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent group-hover:bg-accent/10 transition-all duration-300">
                  ↗
                </span>
              </Link>
            </div>
          </header>

          {/* Right Column: Horizontal Scroll Track Container */}
          <div
            ref={trackContainerRef}
            className="w-full md:w-[65%] lg:w-[70%] overflow-hidden flex items-center h-full pl-8 lg:pl-12 shrink-0 bg-background"
          >
            <div
              ref={trackRef}
              className="flex items-center gap-8 lg:gap-14 w-max pr-16 lg:pr-32"
            >
              {items.map((item, idx) => {
                const formattedIdx = getFormattedIndex(item, idx);
                const category = getItemCategory(item);

                return (
                  <article
                    key={item.link + idx}
                    data-project-card
                    className="w-[82vw] sm:w-[480px] md:w-[540px] lg:w-[600px] shrink-0 flex flex-col gap-4 group"
                  >
                    {/* Image Frame: Constrained height (h-[48vh] max-h-[440px]) */}
                    <div className="relative h-[48vh] max-h-[440px] aspect-[16/10] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-card border border-border/50 shadow-xl group">
                      <div
                        data-card-image
                        className="relative w-[116%] h-full -left-[8%]"
                      >
                        <Image
                          src={item.image || "/works/pulse-studio.svg"}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                          priority={idx === 0}
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>

                      {/* Category & Index Tag */}
                      <div className="absolute top-4 left-4 font-mono text-xs font-bold px-3.5 py-1.5 rounded-full bg-background/90 text-accent backdrop-blur-md border border-accent/20">
                        {formattedIdx} // {category}
                      </div>
                    </div>

                    {/* Content Area Below Image: Completely visible typography, zero cutoffs */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
                      <div className="space-y-1 max-w-md">
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans group-hover:text-accent transition-colors">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="text-sm md:text-base text-muted font-normal leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 pt-1 md:pt-0">
                        <Link
                          href={item.link}
                          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.18em] text-foreground hover:text-accent transition-colors group/link whitespace-nowrap"
                        >
                          <span>EXPLORE PROJECT</span>
                          <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Final Summary CTA Slide at the end of track */}
              <article
                data-project-card
                className="w-[82vw] sm:w-[420px] md:w-[460px] shrink-0 flex flex-col justify-center gap-8 p-8 lg:p-12 rounded-2xl md:rounded-3xl bg-surface/90 border border-border/60 shadow-2xl backdrop-blur-md"
              >
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-snug">
                  Discover our complete collection of digital experiences, brands, and platforms.
                </h3>

                <div>
                  <Link
                    href={viewAllHref}
                    className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-foreground text-background font-mono text-xs font-semibold uppercase tracking-widest hover:bg-accent hover:text-accent-contrast transition-all duration-300 shadow-lg"
                  >
                    <span>{viewAllLabel}</span>
                    <span>↗</span>
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* MOBILE STACKED VIEW (< 768px)                                         */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="block md:hidden px-6 py-16 space-y-16">
        {/* Mobile Header */}
        <header className="space-y-3 pb-6 border-b border-border/40">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {heading}
          </h2>
        </header>

        {/* Mobile Project Cards List */}
        <div className="space-y-14">
          {items.map((item, idx) => {
            const formattedIdx = getFormattedIndex(item, idx);
            const category = getItemCategory(item);

            return (
              <article
                key={"mobile-" + item.link + idx}
                data-mobile-card
                className="space-y-4 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-border/50 bg-card shadow-lg">
                  <Image
                    src={item.image || "/works/pulse-studio.svg"}
                    alt={item.title}
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute top-3 left-3 font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-background/80 text-accent backdrop-blur-md border border-accent/20">
                    {formattedIdx} // {category}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 pt-1">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-muted leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="pt-2">
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-accent hover:underline"
                    >
                      <span>EXPLORE PROJECT</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile View All Footer */}
        <div className="pt-8 text-center border-t border-border/30">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-foreground/20 text-xs font-mono font-semibold uppercase tracking-widest text-foreground hover:bg-accent hover:text-accent-contrast transition-colors"
          >
            <span>{viewAllLabel}</span>
            <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WorkSection;