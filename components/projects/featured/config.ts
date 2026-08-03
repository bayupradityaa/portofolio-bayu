/**
 * Motion + layout constants for the Featured Projects showcase.
 * Single source of truth so the GSAP hook, CSS, and components never drift.
 * Values mirror the brief and the existing hero animation language
 * (expo/power easings, blur-in reveals, restrained distances).
 */

/**
 * Pinned counter crossfade states.
 * No blur: editorial motion is crisp — position and opacity only.
 */
export const COUNTER_MOTION = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1 },
} as const;

/** Subtle vertical parallax travel (px) applied to each project image. */
export const IMAGE_PARALLAX = 56;

/** Easing shared across scrubbed tweens — matches the hero's power3.out feel. */
export const EASE = "power3.out";

/** ScrollTrigger scrub smoothing (seconds) — soft, no lag. */
export const SCRUB = 0.6;

/** Desktop breakpoint mirrors Tailwind `lg` and the hero hook. */
export const DESKTOP_QUERY = "(min-width: 1024px)";
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
