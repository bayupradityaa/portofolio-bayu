"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useHeroSequence } from "./hooks/use-hero-sequence";

export interface HeroSequenceHandle {
  /** Render a specific frame. Called by the timeline. */
  renderFrame: (index: number) => void;
}

/**
 * Canvas-rendered portrait sequence. Dumb component — the parent timeline
 * calls renderFrame(index) to advance frames. Zero animation logic.
 */
export const HeroSequence = forwardRef<HeroSequenceHandle>(
  function HeroSequence(_, ref) {
    const { canvasRef, wrapRef, renderFrame, status } = useHeroSequence();

    useImperativeHandle(ref, () => ({ renderFrame }));

    return (
      <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-surface">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          role="img"
          aria-label="Bayu Praditya, cinematic portrait sequence"
        />

        {/* Placeholder while frames load or if absent */}
        {status !== "ready" && (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 70% 10%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 55%), var(--surface)",
            }}
          />
        )}
      </div>
    );
  },
);
