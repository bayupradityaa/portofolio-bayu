"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 *  SCRAMBLE TEXT
 *  Hover-triggered glyph scramble. On pointer enter, characters rotate
 *  through a glyph bank before settling into the final word — the same
 *  trick several Awwwards winners use to imply the page is "thinking".
 *  Collapses to a static swap under reduced-motion.
 * ──────────────────────────────────────────────────────────────────────── */

const SCRAMBLE_GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

export function ScrambleText({
  text,
  className,
  duration = 700,
  cycles = 4,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  /** Total duration of the scramble in ms. */
  duration?: number;
  /** How many glyph rotations each character goes through. */
  cycles?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const [displayed, setDisplayed] = useState(text);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const animate = () => {
    if (reduceRef.current) {
      setDisplayed(text);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // For each character, compute how many scramble iterations it has done.
      const out = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          // Per-character phase: each starts a little later so the scramble
          // reads as a wave, not all-at-once.
          const charStart = (i / text.length) * 0.4;
          const local = Math.max(0, (t - charStart) / (1 - charStart));
          const iterations = Math.floor(local * cycles);
          if (local >= 1) return char;
          if (iterations % 2 === 0 && Math.random() < 0.5) return char;
          return SCRAMBLE_GLYPHS[
            Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)
          ];
        })
        .join("");
      setDisplayed(out);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  };

  return (
    <Tag
      className={cn("inline-block", className)}
      onMouseEnter={animate}
      // Re-trigger every hover so the reveal stays alive across visits.
      onFocus={animate}
    >
      {displayed}
    </Tag>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 *  MAGNETIC WRAPPER
 *  Sub-translate toward the pointer within a `radius` window. Applied as a
 *  wrapper around any interactive element — `data-magnetic` opt-in means
 *  text links, headings, and CTAs can opt-in without polluting every
 *  Link/button in the codebase.
 * ──────────────────────────────────────────────────────────────────────── */

export function Magnetic({
  children,
  className,
  strength = 0.35,
  radius = 90,
}: {
  children: React.ReactNode;
  className?: string;
  /** How much of the pointer offset to apply. 0–1. */
  strength?: number;
  /** Distance (px) at which the magnet starts pulling. */
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceRef.current) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        targetX = 0;
        targetY = 0;
      } else {
        const falloff = 1 - dist / radius;
        targetX = dx * strength * falloff;
        targetY = dy * strength * falloff;
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    const loop = () => {
      raf = 0;
      // Spring damping — eases toward target rather than snapping.
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      if (
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05
      ) {
        raf = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [radius, strength]);

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 *  CUSTOM CURSOR
 *  A pair of concentric circles that lag the pointer. The outer ring
 *  lerps slowly for the editorial "weight", the inner dot snaps 1:1.
 *  Auto-hides when the pointer leaves the viewport or on touch.
 * ──────────────────────────────────────────────────────────────────────── */

export function EditorialCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    setEnabled(true);
    document.body.classList.add("custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let ringX = mx;
    let ringY = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      if (!raf) raf = requestAnimationFrame(loop);
      const t = e.target as HTMLElement | null;
      const interactive = t?.closest(
        "a, button, [role='button'], input, textarea, [data-magnetic]",
      );
      setHovering(Boolean(interactive));
    };
    const loop = () => {
      raf = 0;
      ringX += (mx - ringX) * 0.15;
      ringY += (my - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      if (Math.hypot(mx - ringX, my - ringY) > 0.5) {
        raf = requestAnimationFrame(loop);
      }
    };
    const onLeave = () => setHovering(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.body.classList.remove("custom-cursor");
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-120 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border md:block",
          "transition-[width,height,border-color,opacity] duration-200 ease-out",
          hovering
            ? "h-10 w-10 border-accent opacity-100"
            : "h-6 w-6 border-foreground/40 opacity-60",
        )}
        style={{ willChange: "transform" }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-120 hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
