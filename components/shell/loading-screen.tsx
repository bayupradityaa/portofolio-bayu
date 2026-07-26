"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * List of critical homepage assets to prefetch & warm in browser cache
 * during the preloader phase so the site opens smoothly without layout shifts.
 */
const CRITICAL_ASSETS = ["/og-image.png", "/favicon.ico"];

/**
 * First-paint logo reveal screen with Asset Prefetching.
 * Displays 'BayuPraditya.' initially with a thin outline,
 * sweeping left-to-right with solid colors as resources load.
 */
export function LoadingScreen() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("intro-seen");
    const skip = Boolean(seen) || reduce;
    if (skip) {
      const raf = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(raf);
    }

    document.body.style.overflow = "hidden";

    // Track active preloading progress
    let loadedCount = 0;
    const totalAssets = CRITICAL_ASSETS.length + 1; // +1 for DOM ready state

    // Preload critical images in parallel
    CRITICAL_ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
      };
    });

    const startTime = performance.now();
    const duration = 1400; // 1.4s smooth sweep

    let animFrame: number;
    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const timePct = Math.min(100, Math.floor((elapsed / duration) * 100));
      const assetPct = Math.floor((loadedCount / totalAssets) * 100);
      const combined = Math.min(100, Math.max(timePct, assetPct));

      setProgress(combined);

      if (elapsed < duration || combined < 100) {
        animFrame = requestAnimationFrame(updateProgress);
      }
    };
    animFrame = requestAnimationFrame(updateProgress);

    const t = window.setTimeout(() => {
      setProgress(100);
      window.setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("intro-seen", "1");
        document.body.style.overflow = "";
      }, 150);
    }, 1700);

    return () => {
      cancelAnimationFrame(animFrame);
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Text Container with Thinner 1px Stroke & Left-to-Right Fill Overlay */}
          <motion.div
            className="relative flex items-baseline text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl select-none"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Outline Layer (Garis Tepi 1px Tipis & Halus) */}
            <div
              aria-hidden="true"
              className="flex items-baseline text-transparent opacity-40 dark:opacity-50"
              style={{
                WebkitTextStroke: "1px var(--foreground, #ffffff)",
              }}
            >
              <span>Bayu</span>
              <span>Praditya</span>
              <span>.</span>
            </div>

            {/* Solid Fill Layer (Animasi Warna KIRI ke KANAN) */}
            <motion.div
              className="absolute inset-0 flex items-baseline"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
            >
              <span className="text-foreground">Bayu</span>
              <span className="text-accent">Praditya</span>
              <span className="text-accent">.</span>
            </motion.div>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mt-6 flex flex-col items-center gap-2"
          >
            <div className="h-[2px] w-36 md:w-48 overflow-hidden rounded-full bg-border/40">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
              />
            </div>
            <span className="font-mono text-xs font-medium tracking-widest text-muted">
              {progress}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
