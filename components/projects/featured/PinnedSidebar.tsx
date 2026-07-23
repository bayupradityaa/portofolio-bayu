"use client";

import type { FeaturedProject } from "./types";
import { ProjectCounter } from "./ProjectCounter";

/**
 * The left 28% pinned column. Contains the giant counter and the metadata
 * labels that change as projects scroll into view. The metadata elements are
 * swapped by the parent hook via data attributes and CSS transitions, while
 * the counter digits are GSAP-crossfaded individually.
 */
export function PinnedSidebar({
  projects,
  activeIndex,
  numberRefs,
  metaRef,
}: {
  projects: FeaturedProject[];
  activeIndex: number;
  numberRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  metaRef: React.RefObject<HTMLDivElement | null>;
}) {
  const active = projects[activeIndex] ?? projects[0];

  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-10 px-6 lg:px-10">
      {/* Counter + title sit on one row: the giant number holds its position
          while the title/category swap beside it as projects scroll by. */}
      <div className="flex w-full items-center gap-6">
        {/* Counter */}
        <ProjectCounter projects={projects} numberRefs={numberRefs} />

        {/* Metadata labels — crossfade via CSS transition when activeIndex changes */}
        <div
          key={active.slug}
          ref={metaRef}
          className="fp-meta flex min-w-0 flex-col gap-3"
          style={{ willChange: "opacity, transform" }}
        >
          {/* Title */}
          <h3 className="max-w-[16ch] text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
            {active.name}
          </h3>
        </div>
      </div>
    </div>
  );
}
