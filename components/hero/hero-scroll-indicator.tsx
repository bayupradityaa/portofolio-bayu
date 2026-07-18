"use client";

interface HeroScrollIndicatorProps {
  indicatorRootRef: React.RefObject<HTMLDivElement | null>;
  indicatorFillRef: React.RefObject<HTMLDivElement | null>;
  stageNumberRef: React.RefObject<HTMLSpanElement | null>;
}

/**
 * Minimal vertical progress indicator.
 * Driven entirely by refs passed as props.
 */
export function HeroScrollIndicator({
  indicatorRootRef,
  indicatorFillRef,
  stageNumberRef,
}: HeroScrollIndicatorProps) {
  return (
    <div
      ref={indicatorRootRef}
      className="scroll-indicator"
      style={{ opacity: 0 }}
      aria-hidden
    >
      <span ref={stageNumberRef} className="scroll-indicator__number">
        01
      </span>
      <div className="scroll-indicator__track">
        <div
          ref={indicatorFillRef}
          className="scroll-indicator__fill"
          style={{ transformOrigin: "top", transform: "scaleY(0)" }}
        />
      </div>
      <span className="scroll-indicator__number" style={{ opacity: 0.4 }}>
        06
      </span>
    </div>
  );
}
