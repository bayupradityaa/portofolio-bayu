/**
 * Motion tokens — the JS mirror of the custom properties in globals.css.
 *
 * Anything animated by GSAP or Motion pulls its easing/duration from here so
 * the whole site shares one motion signature. If a value changes, it changes
 * in both places: update the CSS custom property AND the constant below.
 *
 * Rule of thumb: three easings, four durations, one stagger. If a component
 * needs something outside this set, the design is probably drifting.
 */

/* ── Easings ─────────────────────────────────────────────────────── */

/** Entrances. Fast out of the gate, long settle. The house easing. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Symmetrical — for reveals that travel both ways (wipes, overlays). */
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

/** Shorter settle than expo. Use for small, frequent moves. */
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

/** GSAP string equivalents — GSAP prefers named eases for its own tweens. */
export const GSAP_EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  /** Matches EASE_OUT_EXPO closely enough for scrubbed tweens. */
  expo: "expo.out",
} as const;

/* ── Durations (seconds) ─────────────────────────────────────────── */

export const DUR = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  slower: 1.2,
} as const;

/* ── Stagger ─────────────────────────────────────────────────────── */

export const STAGGER = 0.06;

/** Tighter stagger for character/word-level splits, where 0.06 is far too slow. */
export const STAGGER_TIGHT = 0.02;

/* ── ScrollTrigger defaults ──────────────────────────────────────── */

/** Scrub smoothing (seconds). Soft follow without feeling laggy. */
export const SCRUB = 0.6;

/** Standard enter point for one-shot reveals. */
export const START_REVEAL = "top 85%";

/* ── Media queries ──────────────────────────────────────────────── */

export const DESKTOP_QUERY = "(min-width: 1024px)";
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
export const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/* ── Signature reveal states ─────────────────────────────────────── */

/**
 * The site's one reveal idea: a directional wipe via clip-path.
 * Used instead of the generic opacity+translateY so reveals read as
 * editorial rather than "web app". clip-path is GPU-composited, so this
 * is no more expensive than a transform.
 */
export const WIPE = {
  /** Hidden — clipped away from the right edge. */
  fromRight: { clipPath: "inset(0 100% 0 0)" },
  /** Hidden — clipped away from below. */
  fromBottom: { clipPath: "inset(100% 0 0 0)" },
  /** Revealed. */
  visible: { clipPath: "inset(0 0% 0 0)" },
} as const;
