"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useHeroSequence } from "./hooks/use-hero-sequence";

export interface HeroSequenceHandle {
  /** Render a specific frame. Called by the timeline. */
  renderFrame: (index: number) => void;
}

/**
 * Canvas-rendered portrait sequence optimized for 90+ Lighthouse performance scores.
 * Renders an instant-paint HTML picture element on mount to ensure sub-second LCP.
 */
export const HeroSequence = forwardRef<HeroSequenceHandle>(
  function HeroSequence(_, ref) {
    const { canvasRef, wrapRef, renderFrame, status } = useHeroSequence();

    useImperativeHandle(ref, () => ({ renderFrame }));

    return (
      <div ref={wrapRef} className="absolute inset-0 overflow-hidden" style={{ background: "var(--background)" }}>
        <canvas
          ref={canvasRef}
          className="h-full w-full relative z-10"
          role="img"
          aria-label="Bayu Praditya, cinematic portrait sequence"
        />

        {/* High-priority LCP static poster for instant sub-second paint */}
        {status !== "ready" && (
          <picture className="absolute inset-0 z-0">
            <source media="(max-width: 1023px)" srcSet="/sequence-mobile/ezgif-frame-001.webp" />
            <source media="(min-width: 1024px)" srcSet="/sequence-desktop/ezgif-frame-001.webp" />
            <img
              src="/sequence-mobile/ezgif-frame-001.webp"
              alt="Bayu Praditya"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </picture>
        )}
      </div>
    );
  },
);
