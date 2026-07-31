"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface OrganicTransitionProps {
  /** 
   * Solid fill color that EXACTLY matches the incoming next section background.
   * Examples: "fill-[#141418]", "fill-surface", "fill-background"
   */
  fillColor: string;
  /** Curve direction variant for architectural rhythm */
  variant?: "slope-right" | "slope-left";
  /** Optional subtle micro-floating animation */
  animate?: boolean;
  /** Additional container classes */
  className?: string;
}

/**
 * Redesigned Organic Section Transition
 * 
 * - Belongs strictly inside the previous section.
 * - Reduced height (~100-125px max) for an elegant, non-intrusive boundary.
 * - Gentle, low-amplitude architectural Bezier curve.
 * - Seamlessly merges section backgrounds without overlaying content.
 */
export function OrganicTransition({
  fillColor,
  variant = "slope-right",
  animate = true,
  className,
}: OrganicTransitionProps) {
  const pathRef = useRef<SVGPathElement | null>(null);

  // GSAP Ultra-slow micro-floating animation (imperceptible 0.8px float over 35s)
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!animate || !path) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(path, {
          y: 0.8,
          duration: 35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    });

    return () => ctx.revert();
  }, [animate]);

  // Gentle, low-amplitude cubic Bezier curves (height 120px)
  const pathRight = "M 0,15 C 380,15 520,70 840,82 C 1140,94 1320,105 1440,110 L 1440,120 L 0,120 Z";
  const pathLeft = "M 0,110 C 120,105 300,94 600,82 C 920,70 1060,15 1440,15 L 1440,120 L 0,120 Z";

  const dPath = variant === "slope-right" ? pathRight : pathLeft;

  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={cn(
        "pointer-events-none absolute inset-x-0 -bottom-[1px] z-10 w-full overflow-hidden leading-none select-none",
        className
      )}
    >
      <svg
        className="relative block w-full h-[50px] sm:h-[80px] md:h-[110px] lg:h-[125px] transform-gpu"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
      >
        <path
          ref={pathRef}
          d={dPath}
          className={cn("transition-colors duration-300 transform-gpu will-change-transform", fillColor)}
        />
      </svg>
    </div>
  );
}
