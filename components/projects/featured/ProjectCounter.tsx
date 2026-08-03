"use client";

import { cn } from "@/lib/utils";
import type { FeaturedProject } from "./types";

/**
 * The stack of giant project numbers in the pinned sidebar.
 * All numbers render absolutely stacked; the GSAP hook crossfades between
 * them by index, so only the active one is visible at a time.
 *
 * `numberRefs` is populated by the parent so the animation hook can address
 * each element directly without re-querying the DOM.
 */
export function ProjectCounter({
  projects,
  numberRefs,
}: {
  projects: FeaturedProject[];
  numberRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
}) {
  // Zero-padded, so "01" and "12" occupy the same box — no reflow on swap.
  const label = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <div className="relative select-none" aria-hidden="true">
      {/* Reserve the box the widest number occupies so nothing shifts. */}
      <span className="invisible block font-display text-[clamp(5rem,9vw,9rem)] font-bold leading-none tracking-tighter">
        {label(projects.length - 1)}
      </span>

      {projects.map((project, i) => (
        <span
          key={project.slug}
          ref={(el) => {
            numberRefs.current[i] = el;
          }}
          className={cn(
            "absolute inset-0 block font-display text-[clamp(5rem,9vw,9rem)]",
            "font-bold leading-none tracking-tighter text-accent",
          )}
          style={{ willChange: "transform, opacity" }}
        >
          {label(i)}
        </span>
      ))}
    </div>
  );
}
