"use client";

import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "./work-section";

/**
 * ProjectCard — single project entry in the pinned `WorkSection` list.
 *
 * Anatomy
 * ───────
 *  • Image with `rounded-lg overflow-hidden` clips the hover scale so the
 *    photo never escapes the card frame.
 *  • Below the image: title → short description → "EXPLORE PROJECT →"
 *    link. Same mono-uppercase voice as the section header.
 *
 * Animation hooks
 * ───────────────
 *  • Carries `data-work-card` so the parent `WorkSection` can target it
 *    with GSAP for the entrance reveal (opacity 0 → 1, y: 60 → 0).
 *  • Carries `data-active` so the same parent can flag the card currently
 *    crossing the viewport centre (see WorkSection for the trigger setup).
 *    A non-active card is dimmed via `filter: brightness(...)` on this
 *    element — `filter` is independent of the reveal's inline `opacity`,
 *    so the two effects never fight for the same property.
 *
 * Hover
 * ─────
 *  • Image scales to 1.05 over 700ms with the project's ease. Pure CSS
 *    so it stays buttery and doesn't depend on JS.
 *
 * Accessibility
 * ─────────────
 *  • `next/image` handles alt + lazy loading.
 *  • `prefers-reduced-motion` is honoured automatically by the global
 *    rule in `globals.css` (transitions collapse to 0.001ms). The image
 *    scale therefore won't animate for users who request reduced motion.
 */
export function ProjectCard({ item }: { item: WorkItem }) {
  return (
    <article
      data-work-card
      className="group flex min-h-[70vh] flex-col justify-center"
    >
      <Link
        href={item.link}
        aria-label={`Explore project: ${item.title}`}
        className="block"
      >
        {/* Image — overflow-hidden clips the 1.05 hover scale. */}
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-surface">
          <Image
            src={item.image || "/works/pulse-studio.jpg"}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Text block — title, description, explore link. */}
        <div className="mt-6">
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
            {item.title}
          </h3>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-secondary md:text-base">
            {item.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors group-hover:text-accent">
            Explore Project
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default ProjectCard;