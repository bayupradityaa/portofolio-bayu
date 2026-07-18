"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * First-paint logo reveal. Reason for motion: it covers font/asset settle and
 * hands off to the page once ready. Kept short; skipped entirely if the visitor
 * has already seen it this session or prefers reduced motion.
 */
export function LoadingScreen() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("intro-seen");
    // Skip the intro entirely if already seen or reduced-motion. Dismiss on the
    // next frame (not synchronously) to avoid a cascading render in the effect.
    const skip = Boolean(seen) || reduce;
    if (skip) {
      const raf = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(raf);
    }

    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("intro-seen", "1");
      document.body.style.overflow = "";
    }, 1500);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="flex items-baseline text-4xl font-semibold tracking-tight md:text-5xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>bayu</span>
            <motion.span
              className="text-accent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.2, 1] }}
              transition={{ duration: 1.2, times: [0, 0.2, 0.6, 0.8, 1] }}
            >
              .
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
