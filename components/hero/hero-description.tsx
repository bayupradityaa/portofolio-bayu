"use client";

import { forwardRef } from "react";

/**
 * Description text. SplitType splits this into words inside the
 * useHeroTimeline hook. GSAP staggers individual words.
 * Dumb component — zero animation logic.
 */
export const HeroDescription = forwardRef<HTMLParagraphElement>(
  function HeroDescription(_, ref) {
    return (
      <p
        ref={ref}
        className="mt-6 max-w-[52ch] text-lg leading-relaxed text-secondary"
        style={{ opacity: 0 }}
      >
        Building thoughtful digital experiences through modern web engineering,
        backend systems, and artificial intelligence.
      </p>
    );
  },
);
