"use client";

import { forwardRef } from "react";
import { MorphingText } from "./hero-morphing-text";

/** Role text. GSAP animates blur(20px→0) + y(20→0) + opacity. */
export const HeroSubtitle = forwardRef<HTMLDivElement>(
  function HeroSubtitle(_, ref) {
    return (
      <div
        ref={ref}
        className="mt-5"
        style={{ opacity: 0 }}
      >
        <MorphingText />
      </div>
    );
  },
);
