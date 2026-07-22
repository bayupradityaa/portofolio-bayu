"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SectionOverlapProps {
  className?: string;
}

/**
 * Visual section overlap connector positioned at the top of the content container.
 * Features an ambient top-border glow beam and dynamic halo that seamlessly
 * handsoff from the Hero scene to the main content sheet.
 */
export const SectionOverlap = forwardRef<HTMLDivElement, SectionOverlapProps>(
  function SectionOverlap({ className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-col items-center justify-start overflow-hidden",
          className
        )}
      >
        {/* Ambient top light beam highlight */}
        <div
          id="overlap-glow-beam"
          className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-80 shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-opacity duration-300"
        />

        {/* Soft background ambient halo glow behind edge */}
        <div className="absolute top-0 h-16 w-3/4 max-w-4xl bg-accent/10 blur-2xl rounded-full" />
      </div>
    );
  }
);
