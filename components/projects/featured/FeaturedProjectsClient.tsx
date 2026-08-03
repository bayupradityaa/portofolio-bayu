"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PinnedSidebar } from "./PinnedSidebar";
import { ProjectSlide } from "./ProjectSlide";
import { useFeaturedProjects } from "./useFeaturedProjects";
import { Magnetic } from "@/components/motion/editorial-interactions";
import type { FeaturedProject } from "./types";

/**
 * Scroll-driven Featured Projects showcase.
 *
 * Layout: an asymmetric two-column grid. The left 30% is sticky and holds the
 * giant counter + metadata; the right column scrolls its project panels past
 * it. All motion lives in `useFeaturedProjects` — this component is layout and
 * ref wiring only.
 *
 * Owns the `#work` anchor.
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
    <section id="work" ref={sectionRef} className="relative bg-ch-work pb-24 md:pb-32">
      {/* Section masthead — mono label on a full-bleed rule, then the title. */}
      <div className="mx-auto w-full max-w-7xl px-6 pt-24 md:pt-32">
        <div className="flex items-center gap-6 border-t border-border pt-5">
          <span className="eyebrow">02 — Selected Work</span>
          <span className="h-px flex-1 bg-border" />
          <Magnetic strength={0.25} radius={110}>
            <Link
              href="/projects"
              className="group inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-widest text-secondary transition-colors hover:text-accent"
            >
              <span className="link-underline">All projects</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Magnetic>
        </div>

        <h2 className="text-display mt-10 max-w-[14ch]">
          Work that had to
          <span className="text-accent"> hold up</span>.
        </h2>
      </div>

      {/* Asymmetric stage — sticky index left, scrolling specimens right */}
      <div className="mx-auto mt-16 grid w-full max-w-7xl grid-cols-1 px-6 md:mt-24 lg:grid-cols-[30%_1fr] lg:gap-16">
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
