"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ProjectPreviewPlaceholder } from "@/components/ui/project-preview-placeholder";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface WorkItem {
  index?: string;
  title: string;
  category?: string;
  year?: string;
  description?: string;
  image?: string;
  status?: string;
  link: string;
}

function WorkCardImage({
  src,
  title,
  category,
  status,
  priority,
}: {
  src?: string;
  title: string;
  category?: string;
  status?: string;
  priority?: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  const isComingSoon = status?.toLowerCase().includes("coming") || status?.toLowerCase().includes("dev");
  const isValidSrc = src && src !== "/works/pulse-studio.svg" && !hasError && !isComingSoon;

  if (!isValidSrc) {
    return (
      <ProjectPreviewPlaceholder
        title={title}
        category={category}
        status={status || "Coming Soon"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 35vw"
      priority={priority}
      onError={() => setHasError(true)}
      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
    />
  );
}

export type WorkSectionProps = {
  items: WorkItem[];
  className?: string;
  heading?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
};

function getFormattedIndex(item: WorkItem, idx: number): string {
  if (item.index) return item.index;
  const num = idx + 1;
  return num < 10 ? `0${num}` : `${num}`;
}

function getItemCategory(item: WorkItem): string {
  return item.category || "Selected Work";
}

export function WorkSection({
  items,
  className,
  heading = "Selected work & explorations",
  viewAllHref = "/projects",
  viewAllLabel = "VIEW ALL PROJECTS",
}: WorkSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinTargetRef = useRef<HTMLDivElement | null>(null);
  const trackContainerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    if (!items || items.length === 0) return;

    const section = sectionRef.current;
    const pinTarget = pinTargetRef.current;
    const trackContainer = trackContainerRef.current;
    const track = trackRef.current;
    if (!section || !pinTarget || !trackContainer || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = track.querySelectorAll<HTMLElement>("[data-project-card]");
        const journeySection = typeof document !== "undefined" ? document.getElementById("journey-section") : null;

        const getScrollAmount = () => {
          const totalWidth = track.scrollWidth;
          const containerWidth = trackContainer.clientWidth;
          return Math.max(totalWidth - containerWidth, 0);
        };

        const scrollAmount = getScrollAmount();
        const closingDistance = Math.min(window.innerHeight, 900);
        const totalScrollDistance = scrollAmount + closingDistance;

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: pinTarget,
            start: "top top",
            end: () => `+=${totalScrollDistance}`,
            scrub: 1,
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

        // 1. Horizontal Track Translation
        masterTl.to(
          track,
          {
            x: () => -getScrollAmount(),
            ease: "none",
            duration: scrollAmount,
          },
          0
        );

        // 2. Per-Card Bottom-Right Entrance Animation
        const step = scrollAmount / Math.max(cards.length, 1);
        cards.forEach((card, idx) => {
          const startTime = Math.max(idx * step - 50, 0);
          const animDuration = Math.max(step * 0.9, 350);

          masterTl.fromTo(
            card,
            {
              y: 340,
              x: 220,
              opacity: 0,
              scale: 0.78,
              rotate: 4,
              transformOrigin: "bottom right",
            },
            {
              y: 0,
              x: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
              ease: "power3.out",
              duration: animDuration,
            },
            startTime
          );

          const img = card.querySelector<HTMLElement>("[data-card-image]");
          if (img) {
            masterTl.fromTo(
              img,
              { scale: 1.08 },
              {
                scale: 1,
                ease: "none",
                duration: scrollAmount,
              },
              0
            );
          }
        });

        // 3. Phase 2: Right-to-Left Closing Clip-Path Wipe of Gold Stage (trackContainer)
        masterTl.fromTo(
          trackContainer,
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

        // Inertia track push off-stage
        masterTl.to(
          track,
          {
            x: () => -getScrollAmount() - 220,
            ease: "power1.in",
            duration: closingDistance,
          },
          scrollAmount
        );

        // Layer 2 Intro Header animation as gold stage wipes open
        const revealHeader = pinTarget.querySelector<HTMLElement>("[data-reveal-header]");
        if (revealHeader) {
          masterTl.fromTo(
            revealHeader,
            {
              scale: 0.92,
              opacity: 0.3,
              y: 30,
            },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              ease: "power2.out",
              duration: closingDistance,
            },
            scrollAmount
          );
        }
      });

      // MOBILE: Stacked Vertical Reveal (< 768px)
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
      className={cn("relative w-full bg-[#000000] text-white select-none", className)}
      aria-label="Selected Work Portfolio Showcase"
    >
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* DESKTOP PINNED HORIZONTAL STAGE (>= 768px)                             */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div
        ref={pinTargetRef}
        className="hidden md:block relative w-full h-screen overflow-hidden bg-[#000000] text-white z-20 shadow-2xl"
      >
        {/* ── LAYER 2: REVEAL INTRO HEADER (PINNED AT Z-10 BEHIND GOLD STAGE) ── */}
        <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center px-8 lg:px-16 pointer-events-none">
          <header data-reveal-header className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD177]/10 border border-[#FFD177]/30 text-[#FFD177] font-mono text-xs font-bold uppercase tracking-[0.2em]">
              <span>MY JOURNEY</span>
            </div>

            {/* Main Title */}
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              The <span className="text-[#FFD177]">Path</span> That Shaped Me
            </h2>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-white/70 leading-relaxed font-normal max-w-2xl pt-1">
              A timeline of my education, career milestones, and technical experiences that built who I am today.
            </p>

            {/* Scroll Down Hint Indicator */}
            <div className="pt-6 flex flex-col items-center gap-2.5">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-[#FFD177]/30 text-[#FFD177] font-mono text-xs font-semibold uppercase tracking-[0.22em] shadow-md backdrop-blur-sm">
                <span>SCROLL TO EXPLORE</span>
                <span className="inline-block animate-bounce font-bold text-sm">↓</span>
              </div>
            </div>
          </header>
        </div>

        {/* ── GOLD STAGE CONTAINER (Z-20 ON TOP OF LAYER 2) ── */}
        <div
          ref={trackContainerRef}
          className="relative z-20 w-full h-full overflow-hidden flex items-center pt-24 pb-12 bg-[#FFD177] text-black"
        >
          {/* SECTION 03 PROJECT BOUNDARY RULE */}
          <div className="absolute top-8 left-0 right-0 z-30 w-full flex items-center gap-6 px-8 lg:px-16 max-w-[1700px] mx-auto pointer-events-none">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-black">
              03
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-black/80">
              PROJECT
            </span>
            <span className="h-px flex-1 bg-black/30" />
          </div>
          <div
            ref={trackRef}
            className="flex items-center gap-10 lg:gap-16 w-max pr-16 lg:pr-32 pl-0"
          >
            {/* ── SLIDE 0: CENTERED TITLE & INTRO CTA (#FFD177 STAGE) ── */}
            <article
              data-intro-card
              className="w-screen h-screen shrink-0 flex flex-col items-center justify-center text-center px-6 md:px-12 bg-[#FFD177] text-black relative z-10"
            >
              <div className="max-w-3xl space-y-8 flex flex-col items-center justify-center pt-12">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-black leading-[1.08] select-text">
                  {heading.includes(" & ") ? (
                    <>
                      <span className="block">{heading.split(" & ")[0]}</span>
                      <span className="block text-black/90">&amp; {heading.split(" & ")[1]}</span>
                    </>
                  ) : (
                    heading
                  )}
                </h2>

                <div>
                  <Link
                    href={viewAllHref}
                    className="group inline-flex items-center gap-3 font-mono text-xs md:text-sm font-semibold uppercase tracking-widest text-black/80 hover:text-black transition-all duration-300 border-b border-black/30 hover:border-black pb-1"
                  >
                    <span>{viewAllLabel}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>

            {/* ── PROJECT SLIDES (PROPORTIONAL REFINED SIZING) ── */}
            {items.map((item, idx) => {
              const formattedIdx = getFormattedIndex(item, idx);
              const category = getItemCategory(item);

              return (
                <article
                  key={item.link + idx}
                  data-project-card
                  className="w-[82vw] sm:w-[480px] md:w-[540px] lg:w-[590px] shrink-0 flex flex-col gap-4 group"
                >
                  {/* Desktop Image Frame with Max Height Constraint */}
                  <div className="relative aspect-[16/10] max-h-[350px] lg:max-h-[380px] w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-black/10 border border-black/20 shadow-xl group transition-all duration-500 group-hover:border-black/40">
                    <div
                      data-card-image
                      className="relative w-full h-full overflow-hidden"
                    >
                      <WorkCardImage
                        src={item.image}
                        title={item.title}
                        category={category}
                        status={item.status}
                        priority={idx === 0}
                      />
                    </div>

                    {/* High Contrast Black Category Badge */}
                    <div className="absolute top-3.5 left-3.5 font-mono text-[11px] font-bold px-3 py-1 rounded-full bg-black text-[#FFD177] shadow-md border border-black/30">
                      {formattedIdx} // {category}
                    </div>
                  </div>

                  {/* Content Area Below Image */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-0.5">
                    <div className="space-y-1.5 max-w-md">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-black font-sans group-hover:text-black/70 transition-colors duration-300">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-xs md:text-sm text-black/80 font-normal leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 pt-1 md:pt-0">
                      <Link
                        href={item.link}
                        className="group/link inline-flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-black/80 hover:text-black transition-all duration-300 border-b border-black/30 hover:border-black pb-0.5 whitespace-nowrap"
                      >
                        <span>EXPLORE PROJECT</span>
                        <span className="transition-transform duration-300 group-hover/link:translate-x-1.5">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Final Summary CTA Slide */}
            <article
              data-project-card
              className="w-[78vw] sm:w-[380px] md:w-[420px] shrink-0 flex flex-col justify-center gap-6 p-7 lg:p-10 rounded-2xl md:rounded-3xl bg-black text-white border border-black/20 shadow-2xl"
            >
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
                Discover our complete collection of digital experiences, brands, and platforms.
              </h3>

              <div>
                <Link
                  href={viewAllHref}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#FFD177] text-black font-mono text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
                >
                  <span>{viewAllLabel}</span>
                  <span>↗</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* MOBILE STACKED VIEW (< 768px)                                         */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="block md:hidden px-6 py-16 space-y-12 bg-[#FFD177] text-black">
        {/* Mobile Section Boundary Rule */}
        <div className="flex items-center gap-6 pb-2">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-black">
            03
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-black/80">
            PROJECT
          </span>
          <span className="h-px flex-1 bg-black/30" />
        </div>

        {/* Mobile Header */}
        <header className="text-center space-y-6 pb-8 border-b border-black/20">
          <h2 className="text-4xl font-extrabold tracking-tight text-black leading-[1.1]">
            {heading.includes(" & ") ? (
              <>
                <span className="block">{heading.split(" & ")[0]}</span>
                <span className="block text-black/90">&amp; {heading.split(" & ")[1]}</span>
              </>
            ) : (
              heading
            )}
          </h2>
          <div>
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-widest text-black/80 hover:text-black transition-all border-b border-black/30 pb-1"
            >
              <span>{viewAllLabel}</span>
              <span>→</span>
            </Link>
          </div>
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
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-black/20 bg-black/10 shadow-lg">
                  <WorkCardImage
                    src={item.image}
                    title={item.title}
                    category={category}
                    status={item.status}
                  />
                  <div className="absolute top-3 left-3 font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-black text-[#FFD177]">
                    {formattedIdx} // {category}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 pt-1">
                  <h3 className="text-2xl font-bold tracking-tight text-black">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm md:text-base text-black/80 font-normal leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>

                <div>
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-black/80 hover:text-black border-b border-black/30 pb-0.5"
                  >
                    <span>EXPLORE PROJECT</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}