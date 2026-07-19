"use client";

import { forwardRef } from "react";

interface HeroDescriptionProps {
  description: string;
}

/**
 * Description text. SplitType splits this into words inside the
 * useHeroTimeline hook. GSAP staggers individual words.
 * Dumb component — zero animation logic.
 */
export const HeroDescription = forwardRef<HTMLParagraphElement, HeroDescriptionProps>(
  function HeroDescription({ description }, ref) {
    return (
      <p
        ref={ref}
        className="mt-6 max-w-[52ch] text-lg leading-relaxed text-secondary"
        style={{ opacity: 0 }}
      >
        {description}
      </p>
    );
  },
);
