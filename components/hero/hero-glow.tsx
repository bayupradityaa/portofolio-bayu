"use client";

import { forwardRef } from "react";

/** Radial green glow behind portrait. GSAP targets this directly. */
export const HeroGlow = forwardRef<HTMLDivElement>(function HeroGlow(_, ref) {
  return <div ref={ref} className="hero-glow" aria-hidden />;
});
