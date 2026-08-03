"use client";

import type { FeaturedProject } from "./types";
import { ProjectCounter } from "./ProjectCounter";

/**
 * The sticky left column (desktop only).
 *
 * Holds the giant counter and the metadata that swaps as projects scroll past.
 * The counter digits are GSAP-crossfaded individually; the text block is
 * remounted via React `key` so the `.fp-meta` CSS animation re-fires on each
 * change. Progress is shown as "03 / 07" rather than a bar — it reads as an
 * index in a printed contents list.
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
  const total = String(projects.length).padStart(2, "0");

  return (
    <div className="flex h-full w-full flex-col justify-center gap-8">
      <ProjectCounter projects={projects} numberRefs={numberRefs} />

      <div className="h-px w-full bg-border" />

      <div
        key={active.slug}
        ref={metaRef}
        className="fp-meta flex min-w-0 flex-col gap-3"
        style={{ willChange: "opacity, transform" }}
      >
        <span className="eyebrow">{active.category}</span>
        <h3 className="max-w-[18ch] font-display text-3xl font-bold leading-[0.95] tracking-tight text-foreground">
          {active.name}
        </h3>
      </div>

      <p className="font-mono text-xs text-muted">
        {String(activeIndex + 1).padStart(2, "0")}
        <span className="mx-1.5 text-border">/</span>
        {total}
      </p>
    </div>
  );
}
