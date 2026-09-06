"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ProjectPreviewPlaceholder } from "@/components/ui/project-preview-placeholder";
import { ProjectSummaryView } from "@/components/projects/project-summary-view";
import type { ProjectWithRelations } from "@/lib/types/database";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface EditorialProjectArchiveProps {
  projects: ProjectWithRelations[];
}

export function EditorialProjectArchive({ projects }: EditorialProjectArchiveProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Build dynamic scenes from database projects
  const scenes = projects.map((p, idx) => {
    const number = String(idx + 1).padStart(2, "0");
    const category = p.category || "Selected Work";
    const categoryLabel = `${number} / ${category.toUpperCase()}`;
    const stack = p.technologies && p.technologies.length > 0
      ? p.technologies.map((t) => t.name)
      : ["Full Stack", "TypeScript", "Next.js"];

    const isFlagship = Boolean(idx === 0 || p.featured || p.slug === "jkt48-sentiment-tracker");

    return {
      index: idx,
      id: `scene-${number}`,
      number,
      categoryLabel,
      displayName: p.name.toUpperCase(),
      tagline: p.tagline || p.summary || "A thoughtful digital experience and software engineering case study.",
      role: p.role || "Full Stack Engineer",
      type: category.toUpperCase(),
      stack,
      ctaLabel: "VIEW CASE STUDY",
      ctaType: "case-study",
      isFlagship,
      data: p,
    };
  });

  // 3. GSAP ScrollTrigger setup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      scenes.forEach((scene, idx) => {
        const sceneEl = document.getElementById(scene.id);
        if (!sceneEl) return;

        // Active index tracker for the left 30% sticky rail
        ScrollTrigger.create({
          trigger: sceneEl,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setActiveIndex(idx),
          onEnterBack: () => setActiveIndex(idx),
        });

        if (prefersReducedMotion) return;

        const imageFrame = sceneEl.querySelector(".scene-image-frame");
        const imageEl = sceneEl.querySelector(".scene-image-inner");
        const contentEl = sceneEl.querySelector(".scene-content");

        // Subtle editorial reveal transition on entrance
        if (contentEl) {
          gsap.fromTo(
            contentEl,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sceneEl,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Image clip reveal + subtle parallax
        if (imageFrame) {
          gsap.fromTo(
            imageFrame,
            { clipPath: "inset(6% 6% 6% 6%)", opacity: 0.3 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sceneEl,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (imageEl) {
          gsap.fromTo(
            imageEl,
            { scale: 1.04, yPercent: -4 },
            {
              scale: 1,
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: sceneEl,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [scenes]);

  const scrollToScene = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="project-archive"
      className="relative w-full border-b border-white/10"
      aria-label="Project Archive"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* ── 30% / 70% EDITORIAL ARCHIVE CONTAINER ── */}
        <div className="relative flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
          {/* ──────────────────────────────────────────────────────────── */}
          {/* LEFT 30%: STICKY PROJECT INDEX (DESKTOP / TABLET ONLY)      */}
          {/* ──────────────────────────────────────────────────────────── */}
          <aside
            className="hidden md:flex md:w-[28%] lg:w-[28%] sticky top-36 self-start flex-col justify-between h-[calc(100vh-11rem)] max-h-[580px] py-4 select-none"
            aria-label="Project Archive Navigation"
          >
            <div className="space-y-8">
              {/* Header Label */}
              <div className="space-y-1 pb-3 border-b border-white/10">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-accent block">
                  SELECTED WORKS
                </span>
              </div>

              {/* Minimalist Editorial Number Index */}
              <nav className="flex flex-col gap-5">
                {scenes.map((scene, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => scrollToScene(scene.id)}
                      className="group flex items-center gap-4 text-left transition-all duration-300 cursor-pointer"
                      aria-current={isActive ? "true" : "false"}
                    >
                      {/* Number with warm accent highlight */}
                      <span
                        className={cn(
                          "font-sans text-sm lg:text-base font-bold transition-all duration-300",
                          isActive
                            ? "text-accent scale-110 translate-x-1"
                            : "text-muted/60 group-hover:text-foreground"
                        )}
                      >
                        {scene.number}
                      </span>

                      {/* Name & Category indicator */}
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-sans text-xs lg:text-sm uppercase tracking-wider font-semibold transition-colors duration-300 truncate",
                            isActive
                              ? "text-foreground font-bold"
                              : "text-muted/70 group-hover:text-foreground"
                          )}
                        >
                          {scene.displayName}
                        </span>
                        <span className="font-sans text-[10px] uppercase tracking-widest text-muted/50 truncate">
                          {scene.type}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quiet Bottom Telemetry */}
            <div className="pt-4 border-t border-white/10 font-sans text-[11px] text-muted uppercase tracking-widest flex items-center justify-between">
              <span>SCROLL TO EXPLORE</span>
              <span className="text-accent animate-bounce">↓</span>
            </div>
          </aside>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* RIGHT 70%: SCROLL-DRIVEN PROJECT SCENES                     */}
          {/* ──────────────────────────────────────────────────────────── */}
          <main className="w-full md:w-[72%] lg:w-[72%] border-l-0 md:border-l md:border-white/10 md:pl-10 lg:pl-16">
            {scenes.length === 0 ? (
              <div className="py-28 text-center space-y-4">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-accent block">
                  // ARCHIVE STATUS
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  No Published Projects Yet
                </h2>
                <p className="text-secondary text-sm max-w-md mx-auto">
                  Projects published in the admin panel will automatically appear in this archive.
                </p>
              </div>
            ) : (
              scenes.map((scene) => {
                const project = scene.data!;
                const coverUrl = project.cover_image || project.images[0]?.image_url || "";
                const isComingSoon = project.status === "Coming Soon";
                const showPlaceholder = !coverUrl || imageErrors[project.id];

              return (
                <article
                  key={scene.id}
                  id={scene.id}
                  className="min-h-[85vh] lg:min-h-[100vh] flex flex-col justify-center py-20 md:py-28 border-b border-white/10 last:border-b-0"
                >
                  <div className="scene-content space-y-6">
                    {/* Editorial Number & Category Label */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-sans text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-accent block">
                        {scene.categoryLabel}
                      </span>
                      {isComingSoon && (
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
                          Coming Soon
                        </span>
                      )}
                    </div>

                    {/* Project Title (Live Sentiment largest, others proportionally scaled) */}
                    <h2
                      className={cn(
                        "font-sans font-black tracking-tight text-foreground leading-[0.96]",
                        scene.isFlagship
                          ? "text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
                          : "text-3xl sm:text-5xl md:text-6xl"
                      )}
                    >
                      {scene.displayName}
                    </h2>

                    {/* Short Description */}
                    <p className="font-sans text-base sm:text-lg text-secondary font-normal max-w-2xl leading-relaxed">
                      {scene.tagline}
                    </p>

                    {/* Large Project Image Container with Clip Reveal & Parallax */}
                    <div className="scene-image-frame relative w-full aspect-[16/10] max-h-[560px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-card/30 shadow-2xl my-8">
                      {!showPlaceholder ? (
                        <div className="relative w-full h-[115%] -top-[7.5%]">
                          <Image
                            src={coverUrl}
                            alt={project.cover_alt || `${project.name} preview`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1440px) 70vw, 1000px"
                            onError={() =>
                              setImageErrors((prev) => ({ ...prev, [project.id]: true }))
                            }
                            className="scene-image-inner object-cover object-top"
                          />
                        </div>
                      ) : (
                        <ProjectPreviewPlaceholder
                          title={project.name}
                          category={scene.type}
                          status={project.status}
                        />
                      )}

                      {/* Floating Coming Soon Status Badge */}
                      {isComingSoon && (
                        <div className="absolute top-4 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-black/80 px-3.5 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md shadow-xl font-mono">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                          </span>
                          <span>COMING SOON</span>
                        </div>
                      )}
                    </div>

                    {/* Overview & Architecture Section */}
                    {project.summary && (
                      <div className="space-y-3 pt-2 pb-2 font-sans max-w-3xl">
                        <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-accent block">
                          // OVERVIEW & ARCHITECTURE
                        </span>
                        <ProjectSummaryView summary={project.summary} textSize="base" />
                      </div>
                    )}

                    {/* ROLE · TYPE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 font-sans">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted block">
                          ROLE
                        </span>
                        <p className="text-foreground font-semibold text-sm sm:text-base">
                          {scene.role}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted block">
                          TYPE
                        </span>
                        <p className="text-accent font-semibold text-sm sm:text-base uppercase">
                          {scene.type}
                        </p>
                      </div>
                    </div>

                    {/* STACK */}
                    <div className="font-sans text-xs sm:text-sm text-muted flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                      <span className="text-foreground/80 font-bold uppercase mr-1">STACK:</span>
                      <span>{scene.stack.join(" · ")}</span>
                    </div>

                    {/* Hierarchical Action Links */}
                    <div className="pt-4 flex flex-wrap items-center gap-6 font-sans text-xs sm:text-sm border-t border-white/10">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background font-bold uppercase tracking-widest transition-all duration-300 hover:bg-accent hover:text-black shadow-lg"
                      >
                        <span>{scene.ctaLabel}</span>
                        <ArrowUpRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-accent hover:underline font-semibold uppercase tracking-wider"
                        >
                          <span>LIVE SITE</span>
                          <ExternalLink size={12} />
                        </a>
                      )}

                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground font-semibold uppercase tracking-wider"
                        >
                          <GithubIcon size={13} />
                          <span>SOURCE</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            }))}
          </main>
        </div>
      </div>
    </section>
  );
}
