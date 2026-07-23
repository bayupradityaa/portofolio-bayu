"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PinnedSidebar } from "./PinnedSidebar";
import { ProjectSlide } from "./ProjectSlide";
import { useFeaturedProjects } from "./useFeaturedProjects";
import type { FeaturedProject } from "./types";

/**
 * Cinematic, scroll-driven Featured Projects showcase.
 *
 * Layout: a two-column grid inside a pinned section. The left 28% column is
 * pinned by GSAP and holds a giant crossfading counter + metadata; the right
 * 72% column scrolls its project panels underneath. All motion lives in
 * `useFeaturedProjects`; this component is layout + ref wiring only.
 *
 * Owns the `#work` anchor (replaces the previous grid section).
 */
export function FeaturedProjectsClient({ projects }: { projects: FeaturedProject[] }) {
  const {
    sectionRef,
    sidebarRef,
    trackRef,
    metaRef,
    slideRefs,
    imageRefs,
    numberRefs,
    activeIndex,
  } = useFeaturedProjects({ count: projects.length });

  return (
    <section id="work" ref={sectionRef} className="featured-shell relative hairline-t">
      {/* Premium background depth — radial glow + soft grid + noise (CSS) */}
      <div className="featured-bg" aria-hidden="true" />
      <div className="grid-faint pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Header — kept minimal; carries the "View All" CTA the old section had */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pt-24 md:flex-row md:items-end md:justify-between md:pt-32">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Featured Work</h2>
          <p className="mt-5 text-base leading-relaxed text-secondary md:text-lg">
            A close look at selected projects—each one a deliberate exercise in
            performance, craft, and meaningful user experience.
          </p>
        </div>

        <Link
          href="/projects"
          className="group inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-accent/30 bg-accent/10 px-5 py-3 font-sans text-xs font-semibold text-accent transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-contrast hover:shadow-[0_0_20px_rgba(34,197,94,0.25)] md:self-auto"
        >
          <span>View All Projects</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Two-column stage */}
      <div className="relative z-10 mx-auto mt-16 grid w-full max-w-7xl grid-cols-1 px-6 md:mt-24 lg:grid-cols-[34%_1fr] lg:gap-10">
        {/* Left — sticky sidebar (desktop). `sticky top-0` keeps the number +
            title truly fixed to the viewport while the track scrolls under it;
            `self-start` stops the grid from stretching the cell so sticky can
            travel the full column. On mobile it collapses out of flow. */}
        <div
          ref={sidebarRef}
          className="hidden self-start lg:sticky lg:top-0 lg:block lg:h-screen"
        >
          <PinnedSidebar
            projects={projects}
            activeIndex={activeIndex}
            numberRefs={numberRefs}
            metaRef={metaRef}
          />
        </div>

        {/* Right — scrolling project track */}
        <div ref={trackRef} className="flex flex-col">
          {projects.map((project, i) => (
            <ProjectSlide
              key={project.slug}
              project={project}
              priority={i === 0}
              slideRef={(el) => {
                slideRefs.current[i] = el;
              }}
              imageRef={(el) => {
                imageRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
