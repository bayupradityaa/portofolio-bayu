"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const variants: Variants = {
  // Uncover from below — the site's signature reveal. clip-path is
  // GPU-composited and lands in one frame, so we don't pay the opacity
  // "blink" tax that a generic fade carries.
  hidden: { opacity: 0, clipPath: "inset(100% 0% 0% 0%)", y: 24 },
  show: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 },
};

/**
 * Enter-on-scroll wrapper.
 *
 * Uses the editorial wipe (clip-path) instead of a generic fade so reveals
 * read as "designed", not "framework". Collapses to final state instantly
 * under reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
