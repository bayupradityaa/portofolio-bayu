"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

export interface MagicTextProps {
  paragraphs: string[];
  className?: string;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: number[];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  // Animates the overlay opacity from 0 to 1 based on scroll progress range
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative inline-block select-none">
      {/* Background low-contrast layer */}
      <span className="absolute opacity-15 text-foreground">{children}</span>
      {/* Active fading layer */}
      <motion.span style={{ opacity }} className="text-foreground">
        {children}
      </motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({ paragraphs, className }) => {
  const container = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Tracks scroll progress across the entire multi-paragraph container
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.85", "end 0.45"],
  });

  const paragraphsWords = paragraphs.map((p) => p.split(" "));
  const totalWords = paragraphsWords.reduce((sum, words) => sum + words.length, 0);

  // Pre-calculate the starting global index for each paragraph to maintain pure renders
  const startIndices: number[] = [];
  let accum = 0;
  paragraphsWords.forEach((words) => {
    startIndices.push(accum);
    accum += words.length;
  });

  // Fallback to standard text if user prefers reduced motion
  if (reduce) {
    return (
      <div className={cn("space-y-6", className)}>
        {paragraphs.map((para, i) => (
          <p key={i} className="text-justify text-lg leading-relaxed text-secondary">
            {para}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div ref={container} className={cn("space-y-6", className)}>
      {paragraphsWords.map((words, paraIdx) => (
        <p
          key={paraIdx}
          className="leading-relaxed text-justify text-lg text-secondary"
        >
          {words.map((word, wordIdx) => {
            const globalIdx = startIndices[paraIdx] + wordIdx;
            const start = globalIdx / totalWords;
            const end = (globalIdx + 1) / totalWords;

            return (
              <React.Fragment key={wordIdx}>
                <Word progress={scrollYProgress} range={[start, end]}>
                  {word}
                </Word>
                {" "}
              </React.Fragment>
            );
          })}
        </p>
      ))}
    </div>
  );
};
