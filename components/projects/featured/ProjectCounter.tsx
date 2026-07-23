"use client";

import { cn } from "@/lib/utils";
import type { FeaturedProject } from "./types";

/**
 * The stack of giant project numbers living inside the pinned sidebar.
 * All numbers are rendered and absolutely stacked; the GSAP hook crossfades
 * between them by index. Only the active one is visible at a time.
 *
 * `refs` is populated by the parent so the animation hook can address each
 * number element directly without re-querying the DOM.
 */
export function ProjectCounter({
  projects,
  numberRefs,
}: {
  projects: FeaturedProject[];
  numberRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
}) {
  return (
    <div className="relative select-none" aria-hidden="true">
      {/* Reserve the box the largest number occupies so nothing shifts. */}
      <span className="invisible block font-jakarta font-thin leading-none tracking-tighter text-[clamp(7rem,11vw,11rem)]">
        {projects.length}
      </span>

      {projects.map((project, i) => (
        <span
          key={project.slug}
          ref={(el) => {
            numberRefs.current[i] = el;
          }}
          className={cn(
            "absolute inset-0 block font-jakarta font-thin leading-none tracking-tighter",
            "text-[clamp(7rem,11vw,11rem)]",
            // Ghosted outline number — premium, restrained. Accent bleeds in via the hook.
            "bg-gradient-to-b from-foreground to-secondary/40 bg-clip-text text-transparent",
          )}
          style={{ willChange: "transform, opacity, filter" }}
        >
          {i + 1}
        </span>
      ))}
    </div>
  );
}
