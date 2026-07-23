/**
 * Motion + layout constants for the Featured Projects showcase.
 * Single source of truth so the GSAP hook, CSS, and components never drift.
 * Values mirror the brief and the existing hero animation language
 * (expo/power easings, blur-in reveals, restrained distances).
 */

/** Enter/exit transform + filter states for a project slide. */
export const SLIDE_MOTION = {
  hidden: { opacity: 0, y: 80, scale: 0.96, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  /** Outgoing slide settles slightly back rather than fully out. */
  past: { opacity: 0, y: -40, scale: 0.98, filter: "blur(8px)" },
} as const;

/** Pinned counter crossfade states. */
export const COUNTER_MOTION = {
  hidden: { opacity: 0, y: 36, scale: 0.9, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
} as const;

/** Subtle vertical parallax travel (px) applied to each project image. */
export const IMAGE_PARALLAX = 56;

/** Easing shared across scrubbed tweens — matches the hero's power3.out feel. */
export const EASE = "power3.out";

/** Per-slide scroll length as a multiple of viewport height (desktop pin). */
export const SLIDE_VH = 1;

/** ScrollTrigger scrub smoothing (seconds) — soft, no lag. */
export const SCRUB = 0.6;

/** Desktop breakpoint mirrors Tailwind `lg` and the hero hook. */
export const DESKTOP_QUERY = "(min-width: 1024px)";
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
