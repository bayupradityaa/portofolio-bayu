"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ProjectPreviewPlaceholder } from "@/components/ui/project-preview-placeholder";
import { motion } from "motion/react";
import { TextAnimate } from "@/registry/magicui/text-animate";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface WorkItem {
  index?: string;
  title: string;
  category?: string;
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

  const isValidSrc = Boolean(src && src !== "/works/pulse-studio.svg" && !hasError);

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
      src={src!}
      alt={title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 35vw"
      priority={priority}
      loading={priority ? "eager" : undefined}
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

function ProjectDividerDesktop({
  label,
  index,
}: {
  label?: string;
  index?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="h-[430px] lg:h-[470px] w-12 md:w-16 lg:w-20 shrink-0 flex flex-col items-center justify-between py-2 select-none pointer-events-none relative z-10"
    >
      {/* Top Crosshair */}
      <span className="font-mono text-sm font-bold text-black/70 leading-none">
        +
      </span>

      {/* Vertical Hairline with Architectural Accents */}
      <div className="relative w-px flex-1 bg-black/35 my-3 flex flex-col items-center justify-center">
        {/* Upper Ruler Tick */}
        <div className="absolute top-[22%] w-3.5 h-px bg-black/50 -left-[6.5px]" />

        {/* Mid-Upper Mini Dot */}
        <div className="absolute top-[38%] w-1.5 h-1.5 rounded-full bg-black/40 -left-[2.5px]" />

        {/* Center Tag Pill */}
        <div className="bg-[#FFD177] py-2 px-1 flex flex-col items-center gap-1.5 my-auto z-10 border border-black/30 rounded-xs shadow-xs">
          <span className="font-mono text-[9px] font-extrabold uppercase tracking-[0.25em] text-black/85 [writing-mode:vertical-lr] rotate-180">
            {label || (index ? `Project / ${index}` : "DIV // 00")}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-black/85" />
        </div>

        {/* Mid-Lower Mini Dot */}
        <div className="absolute bottom-[38%] w-1.5 h-1.5 rounded-full bg-black/40 -left-[2.5px]" />

        {/* Lower Ruler Tick */}
        <div className="absolute bottom-[22%] w-3.5 h-px bg-black/50 -left-[6.5px]" />
      </div>

      {/* Bottom Crosshair */}
      <span className="font-mono text-sm font-bold text-black/70 leading-none">
        +
      </span>
    </div>
  );
}

function ProjectDividerMobile({
  index,
  label,
}: {
  index?: string;
  label?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="w-full flex items-center gap-3 py-5 select-none relative z-10"
    >
      <span className="font-mono text-xs font-bold text-black/60 leading-none">
        +
      </span>
      <div className="relative flex-1 h-px bg-black/30 flex items-center justify-center">
        <div className="absolute -top-[3px] left-1/4 w-px h-[7px] bg-black/45" />
      </div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-black/25 font-mono text-[10px] font-extrabold uppercase tracking-widest text-black/85 shrink-0">
        <span>{label || `Project / ${index}`}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-black/85" />
      </div>
      <div className="relative flex-1 h-px bg-black/30 flex items-center justify-center">
        <div className="absolute -top-[3px] right-1/4 w-px h-[7px] bg-black/45" />
      </div>
      <span className="font-mono text-xs font-bold text-black/60 leading-none">
        +
      </span>
    </div>
  );
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
      className={cn("relative w-full bg-[#000000] text-white", className)}
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
          </header>
        </div>

        {/* ── GOLD STAGE CONTAINER (Z-20 ON TOP OF LAYER 2) ── */}
        <div
          ref={trackContainerRef}
          className="relative z-20 w-full h-full overflow-hidden flex items-center pt-24 pb-12 bg-[#FFD177] text-black"
        >
          {/* ── ARCHITECTURAL GRID & TEXTURE (PREVENTS BACKGROUND EMPTINESS) ── */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none z-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.14) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.14) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none z-0 opacity-15"
            style={{
              backgroundImage: "radial-gradient(rgba(0,0,0,0.25) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Top Architectural Guide Rail */}
          <div
            aria-hidden="true"
            className="absolute top-7 left-0 right-0 z-10 pl-8 lg:pl-16 pr-32 lg:pr-44 flex items-center justify-between border-b border-black/20 pb-2 pointer-events-none select-none"
          >
            <div className="flex items-center gap-3 font-mono text-[10px] font-bold tracking-[0.25em] text-black/70 uppercase">
              <span className="text-black font-black">+</span>
              <span>SELECTED WORKS</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] font-bold tracking-[0.25em] text-black/70 uppercase">
              <span>HORIZONTAL SCROLL GALLERY →</span>
              <span className="text-black font-black">+</span>
            </div>
          </div>

          {/* Bottom Architectural Guide Rail */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-0 right-0 z-10 px-8 lg:px-16 flex items-center justify-between border-t border-black/20 pt-2 pointer-events-none select-none"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.2em] text-black/60 uppercase">
              <span>LAT. 6.2088° S / LONG. 106.8456° E</span>
              <span className="text-black/30">•</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] font-bold tracking-[0.2em] text-black/60 uppercase">
              <span>EXPLORATION STAGE</span>
              <span className="text-black font-black">+</span>
            </div>
          </div>

          <div
            ref={trackRef}
            className="relative z-10 flex items-center gap-8 lg:gap-12 w-max pr-16 lg:pr-32 pl-0"
          >
            {/* ── SLIDE 0: CENTERED TITLE & INTRO CTA (#FFD177 STAGE) ── */}
            <article
              data-intro-card
              className="w-screen h-screen shrink-0 flex flex-col items-center justify-center text-center px-6 md:px-12 bg-[#FFD177] text-black relative z-10"
            >
              <div className="max-w-4xl space-y-8 flex flex-col items-center justify-center pt-12">
                {/* Giant Awwwards Headline with Outline Text & Cinematic Masked Line Reveal */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.18,
                        delayChildren: 0.15,
                      },
                    },
                  }}
                  className="flex flex-col items-center justify-center text-center font-sans font-extrabold tracking-tight leading-[1.05] select-text"
                >
                  {/* Line 1: Selected + Outline "work" */}
                  <div className="overflow-hidden py-1.5 -my-1.5">
                    <motion.h2
                      variants={{
                        hidden: { y: "120%", rotate: 3.5, filter: "blur(8px)", opacity: 0 },
                        visible: {
                          y: "0%",
                          rotate: 0,
                          filter: "blur(0px)",
                          opacity: 1,
                          transition: {
                            duration: 1.25,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-black transform-gpu origin-center will-change-transform"
                    >
                      <span>Selected </span>
                      <span className="[text-stroke:2.5px_#000000] [-webkit-text-stroke:2.5px_#000000] text-transparent font-extrabold">
                        work
                      </span>
                    </motion.h2>
                  </div>

                  {/* Line 2: & + Outline "explorations" */}
                  <div className="overflow-hidden py-1.5 -my-1.5">
                    <motion.h2
                      variants={{
                        hidden: { y: "120%", rotate: 3.5, filter: "blur(8px)", opacity: 0 },
                        visible: {
                          y: "0%",
                          rotate: 0,
                          filter: "blur(0px)",
                          opacity: 1,
                          transition: {
                            duration: 1.25,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-black transform-gpu origin-center will-change-transform"
                    >
                      <span>&amp; </span>
                      <span className="[text-stroke:2.5px_#000000] [-webkit-text-stroke:2.5px_#000000] text-transparent font-extrabold">
                        explorations
                      </span>
                    </motion.h2>
                  </div>
                </motion.div>

                <div>
                  <Link
                    href={viewAllHref}
                    className="group inline-flex items-center gap-3 font-mono text-xs md:text-sm font-semibold uppercase tracking-widest text-black/80 hover:text-black transition-all duration-300 border-b border-black/30 hover:border-black pb-1"
                  >
                    <TextAnimate>{viewAllLabel}</TextAnimate>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>

            {/* ── PROJECT SLIDES WITH BLACK ARCHITECTURAL DIVIDERS ── */}
            {items.length === 0 ? (
              <article
                data-project-card
                className="w-[82vw] sm:w-[480px] md:w-[540px] shrink-0 flex flex-col justify-center gap-4 p-8 rounded-[20px] md:rounded-[24px] border border-black/20 bg-black/5"
              >
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                  // Status Kurasi
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
                  Studi Kasus Sedang Dipersiapkan
                </h3>
                <p className="text-sm md:text-base text-black/75 leading-relaxed">
                  Proyek terbaru sedang dalam tahap dokumentasi dan kurasi untuk publikasi. Silakan kunjungi kembali segera.
                </p>
                <div className="pt-2">
                  <Link
                    href={viewAllHref}
                    className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1"
                  >
                    <span>{viewAllLabel} →</span>
                  </Link>
                </div>
              </article>
            ) : (
              items.map((item, idx) => {
                const formattedIdx = getFormattedIndex(item, idx);
                const category = getItemCategory(item);

                return (
                  <React.Fragment key={item.link + idx}>
                    {/* Vertical Black Divider Line between projects */}
                    <ProjectDividerDesktop
                      label={idx === 0 ? "ENTRY // 01" : undefined}
                      index={formattedIdx}
                    />

                    <article
                      data-project-card
                      className="w-[82vw] sm:w-[480px] md:w-[540px] lg:w-[590px] shrink-0 flex flex-col gap-4 group relative"
                    >
                      {/* Subtle Giant Architectural Watermark Index */}
                      <span
                        aria-hidden="true"
                        className="absolute -top-10 right-4 font-mono font-black text-7xl md:text-8xl text-black/[0.08] select-none pointer-events-none tracking-tighter leading-none z-0"
                      >
                        {formattedIdx}
                      </span>

                      {/* Desktop Image Frame with Max Height Constraint */}
                      <div className="relative z-10 aspect-[16/10] max-h-[350px] lg:max-h-[380px] w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-black/10 border border-black/20 shadow-xl group transition-all duration-500 group-hover:border-black/40">
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
                          {formattedIdx}{" // "}{category}
                        </div>

                        {/* Coming Soon Status Badge */}
                        {item.status && item.status.toLowerCase().includes("coming") && (
                          <div className="absolute top-3.5 right-3.5 z-20 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/85 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span>COMING SOON</span>
                          </div>
                        )}
                      </div>

                      {/* Content Area Below Image */}
                      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-3 pt-0.5">
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
                            <TextAnimate>EXPLORE PROJECT</TextAnimate>
                            <span className="transition-transform duration-300 group-hover/link:translate-x-1.5">
                              →
                            </span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  </React.Fragment>
                );
              })
            )}

            {/* Closing Divider before Final Summary CTA */}
            {items.length > 0 && (
              <ProjectDividerDesktop
                label="ARCHIVE / END"
                index="99"
              />
            )}

            {/* Final Summary CTA Slide */}
            <article
              data-project-card
              className="w-[78vw] sm:w-[380px] md:w-[420px] shrink-0 flex flex-col justify-center gap-6 p-7 lg:p-10 rounded-2xl md:rounded-3xl bg-black text-white border border-black/20 shadow-2xl relative z-10"
            >
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
                Discover our complete collection of digital experiences, brands, and platforms.
              </h3>

              <div>
                <Link
                  href={viewAllHref}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#FFD177] text-black font-mono text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
                >
                  <TextAnimate>{viewAllLabel}</TextAnimate>
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
      <div className="block md:hidden relative px-6 pt-8 pb-16 space-y-10 bg-[#FFD177] text-black overflow-hidden">
        {/* Mobile Architectural Grid Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none z-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.14) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.14) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Mobile Header */}
        <header className="relative z-10 text-center space-y-6 pb-6 border-b border-black/20">
          {/* Mobile Giant Awwwards Headline with Outline Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.18,
                  delayChildren: 0.12,
                },
              },
            }}
            className="flex flex-col items-center justify-center text-center font-sans font-extrabold tracking-tight leading-[1.08] select-text"
          >
            {/* Line 1: Selected + Outline "work" */}
            <div className="overflow-hidden py-1 -my-1">
              <motion.h2
                variants={{
                  hidden: { y: "120%", rotate: 3, filter: "blur(6px)", opacity: 0 },
                  visible: {
                    y: "0%",
                    rotate: 0,
                    filter: "blur(0px)",
                    opacity: 1,
                    transition: {
                      duration: 1.1,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black transform-gpu origin-center"
              >
                <span>Selected </span>
                <span className="[text-stroke:2px_#000000] [-webkit-text-stroke:2px_#000000] text-transparent font-extrabold">
                  work
                </span>
              </motion.h2>
            </div>

            {/* Line 2: & + Outline "explorations" */}
            <div className="overflow-hidden py-1 -my-1">
              <motion.h2
                variants={{
                  hidden: { y: "120%", rotate: 3, filter: "blur(6px)", opacity: 0 },
                  visible: {
                    y: "0%",
                    rotate: 0,
                    filter: "blur(0px)",
                    opacity: 1,
                    transition: {
                      duration: 1.1,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black transform-gpu origin-center"
              >
                <span>&amp; </span>
                <span className="[text-stroke:2px_#000000] [-webkit-text-stroke:2px_#000000] text-transparent font-extrabold">
                  explorations
                </span>
              </motion.h2>
            </div>
          </motion.div>
          <div>
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-widest text-black/80 hover:text-black transition-all border-b border-black/30 pb-1"
            >
              <TextAnimate>{viewAllLabel}</TextAnimate>
              <span>→</span>
            </Link>
          </div>
        </header>

        {/* Mobile Subheader Indicator */}
        <div
          aria-hidden="true"
          className="w-full flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-black/60 pt-1 pb-2 border-b border-black/20 relative z-10"
        >
          <span>// CURATED WORKS</span>
          <span>TOTAL [{String(items.length).padStart(2, "0")}]</span>
        </div>

        {/* Mobile Project Cards List */}
        <div className="space-y-10 relative z-10">
          {items.length === 0 ? (
            <div className="p-6 rounded-2xl border border-black/20 bg-black/5 space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                // Status Kurasi
              </span>
              <h3 className="text-xl font-bold tracking-tight text-black">
                Studi Kasus Sedang Dipersiapkan
              </h3>
              <p className="text-sm text-black/75 leading-relaxed">
                Proyek terbaru sedang dalam tahap dokumentasi dan kurasi untuk publikasi.
              </p>
              <div className="pt-1">
                <Link
                  href={viewAllHref}
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1"
                >
                  <span>{viewAllLabel} →</span>
                </Link>
              </div>
            </div>
          ) : (
            items.map((item, idx) => {
              const formattedIdx = getFormattedIndex(item, idx);
              const category = getItemCategory(item);

              return (
                <React.Fragment key={"mobile-" + item.link + idx}>
                  {idx > 0 && (
                    <ProjectDividerMobile
                      index={formattedIdx}
                    />
                  )}
                  <article
                    data-mobile-card
                    className="space-y-4 flex flex-col relative"
                  >
                    {/* Watermark Index */}
                    <span
                      aria-hidden="true"
                      className="absolute -top-7 right-2 font-mono font-black text-6xl text-black/[0.08] select-none pointer-events-none tracking-tighter leading-none z-0"
                    >
                      {formattedIdx}
                    </span>

                    {/* Image Container */}
                    <div className="relative z-10 w-full aspect-[16/10] rounded-xl overflow-hidden border border-black/20 bg-black/10 shadow-lg">
                      <WorkCardImage
                        src={item.image}
                        title={item.title}
                        category={category}
                        status={item.status}
                        priority={idx === 0}
                      />
                      <div className="absolute top-3 left-3 font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-black text-[#FFD177]">
                        {formattedIdx}{" // "}{category}
                      </div>

                      {/* Coming Soon Status Badge */}
                      {item.status && item.status.toLowerCase().includes("coming") && (
                        <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/85 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-md">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span>COMING SOON</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="relative z-10 space-y-2 pt-1">
                      <h3 className="text-2xl font-bold tracking-tight text-black">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm md:text-base text-black/80 font-normal leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="relative z-10">
                      <Link
                        href={item.link}
                        className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-black/80 hover:text-black border-b border-black/30 pb-0.5"
                      >
                        <TextAnimate>EXPLORE PROJECT</TextAnimate>
                        <span>→</span>
                      </Link>
                    </div>
                  </article>
                </React.Fragment>
              );
            })
          )}

          {/* Closing Mobile Divider */}
          {items.length > 0 && (
            <ProjectDividerMobile
              label="END // ARCHIVE"
            />
          )}
        </div>
      </div>
    </section>
  );
}