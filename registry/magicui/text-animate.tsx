"use client";

import React, { useState, useCallback } from "react";
import { motion, Variants } from "motion/react";
import { cn } from "@/lib/utils";

export interface TextAnimateProps {
  children: string;
  className?: string;
  segmentClassName?: string;
  variants?: Variants;
  by?: "character" | "word";
  triggerOnHover?: boolean;
  triggerOnClick?: boolean;
  startOnView?: boolean;
  delayStep?: number;
  as?: React.ElementType;
}

export const wavyVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    rotate: 45,
    scale: 0.5,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.4,
      y: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        mass: 0.8,
      },
      rotate: {
        type: "spring",
        damping: 8,
        stiffness: 150,
      },
      scale: {
        type: "spring",
        damping: 10,
        stiffness: 300,
      },
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: 24,
    rotate: 45,
    scale: 0.5,
    transition: {
      delay: i * 0.04,
      duration: 0.4,
    },
  }),
};

export function TextAnimate({
  children,
  className,
  segmentClassName,
  variants = wavyVariants,
  by = "character",
  triggerOnHover = true,
  triggerOnClick = true,
  as: Component = "span",
}: TextAnimateProps) {
  const [animKey, setAnimKey] = useState(0);

  const handleTrigger = useCallback(() => {
    setAnimKey((prev) => prev + 1);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (triggerOnHover) {
      handleTrigger();
    }
  }, [triggerOnHover, handleTrigger]);

  const handleClick = useCallback(() => {
    if (triggerOnClick) {
      handleTrigger();
    }
  }, [triggerOnClick, handleTrigger]);

  if (typeof children !== "string") {
    return <Component className={className}>{children}</Component>;
  }

  const words = children.split(" ");
  let charGlobalIndex = 0;

  return (
    <Component
      className={cn("inline-flex flex-wrap items-center cursor-pointer select-none", className)}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap">
          {by === "word" ? (
            <motion.span
              key={`${animKey}-word-${wordIndex}`}
              custom={wordIndex}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={variants}
              className={cn("inline-block", segmentClassName)}
            >
              {word}
            </motion.span>
          ) : (
            word.split("").map((char) => {
              const currentIndex = charGlobalIndex++;
              return (
                <motion.span
                  key={`${animKey}-char-${currentIndex}`}
                  custom={currentIndex}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={variants}
                  className={cn("inline-block transform-gpu", segmentClassName)}
                >
                  {char}
                </motion.span>
              );
            })
          )}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </Component>
  );
}
