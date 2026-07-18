"use client";

import { forwardRef } from "react";

/** Role text. GSAP animates blur(20px→0) + y(20→0) + opacity. */
export const HeroSubtitle = forwardRef<HTMLParagraphElement>(
  function HeroSubtitle(_, ref) {
    return (
      <p
        ref={ref}
        className="mt-5 font-mono text-sm text-accent md:text-base"
        style={{ opacity: 0 }}
      >
        Software Engineer
      </p>
    );
  },
);
