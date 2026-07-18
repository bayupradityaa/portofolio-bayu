"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useReducedMotion,
  animate,
} from "motion/react";

/**
 * Count-up number that runs once when scrolled into view. Reason for motion:
 * feedback — the number "earns" its value as you arrive. Under reduced-motion
 * it renders the final value immediately.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.4,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Reduced-motion shows the final value via render, no animation needed.
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  const shown = reduce ? value : display;

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
