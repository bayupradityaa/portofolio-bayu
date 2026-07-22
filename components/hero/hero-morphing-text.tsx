"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Code2, Boxes, Palette, BrainCircuit, Store } from "lucide-react";

// 2 seconds readable time, 1 second morph animation time
const morphTime = 1.0;
const cooldownTime = 2.0;

interface MorphItem {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

const morphItems: MorphItem[] = [
  { icon: Code2, text: "Software Engineer" },
  { icon: Boxes, text: "Web Developer" },
  { icon: Palette, text: "Graphic Designer" },
  { icon: BrainCircuit, text: "AI Enthusiast" },
  { icon: Store, text: "Founder @CLT.STORE" },
];

export const MorphingText: React.FC<{ className?: string }> = ({ className }) => {
  const [index, setIndex] = useState(0);
  const [isMorphing, setIsMorphing] = useState(false);
  const morphRef = useRef(0);
  // Start with cooldownTime so the first item stays visible on mount
  const cooldownRef = useRef(cooldownTime);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);

  const setStyles = useCallback((fraction: number) => {
    const current1 = text1Ref.current;
    const current2 = text2Ref.current;
    if (!current1 || !current2) return;

    current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    current2.style.opacity = `${Math.pow(fraction, 0.4)}`;

    const invertedFraction = 1 - fraction;
    current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
    current1.style.opacity = `${Math.pow(invertedFraction, 0.4)}`;
  }, []);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const current1 = text1Ref.current;
    const current2 = text2Ref.current;
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "0";
      current1.style.filter = "none";
      current1.style.opacity = "1";
    }
    // Disable SVG threshold filter during cooldown to allow clean browser subpixel anti-aliasing
    setIsMorphing((prev) => (prev ? false : prev));
  }, []);

  const doMorph = useCallback(() => {
    // Enable SVG threshold filter during morph transition to create fluid metaballs liquid effect
    setIsMorphing((prev) => (!prev ? true : prev));
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      setIndex((prev) => prev + 1);
    }
  }, [setStyles]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) {
        morphRef.current += dt;
        doMorph();
      } else {
        doCooldown();
      }
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown]);

  const item1 = morphItems[index % morphItems.length];
  const item2 = morphItems[(index + 1) % morphItems.length];

  const Icon1 = item1.icon;
  const Icon2 = item2.icon;

  return (
    <div
      className={cn(
        "relative h-8 w-full text-base md:text-lg text-accent select-none",
        isMorphing ? "[filter:url(#threshold)_blur(0.3px)]" : "",
        className
      )}
      style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
    >
      {/* Text 1 */}
      <div
        ref={text1Ref}
        className="absolute inset-y-0 left-0 flex items-center justify-start gap-2.5 w-full text-accent font-bold"
        style={{ opacity: 1 }}
      >
        <Icon1 className="h-[18px] w-[18px] md:h-[22px] md:w-[22px] shrink-0" />
        <span>{item1.text}</span>
      </div>

      {/* Text 2 */}
      <div
        ref={text2Ref}
        className="absolute inset-y-0 left-0 flex items-center justify-start gap-2.5 w-full text-accent font-bold"
        style={{ opacity: 0 }}
      >
        <Icon2 className="h-[18px] w-[18px] md:h-[22px] md:w-[22px] shrink-0" />
        <span>{item2.text}</span>
      </div>

      {/* SVG filter: must not use display:none (hidden) otherwise the filter becomes inactive */}
      <svg id="filters" style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none", opacity: 0 }} aria-hidden="true">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
