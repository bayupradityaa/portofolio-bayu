import { gsap } from "gsap";
import { sequenceConfig } from "@/lib/sequence-config";

/* ── Refs bag ───────────────────────────────────────────────────── */

/**
 * Every DOM element the timeline needs to animate.
 * Populated by the hook from component refs before calling createHeroTimeline.
 */
export interface HeroRefs {
  section: HTMLElement;
  parallaxCanvas: HTMLDivElement;
  parallaxText: HTMLDivElement;
  glow: HTMLDivElement;
  titleHello: HTMLElement;
  titleBayu: HTMLElement;
  titlePraditya: HTMLElement;
  subtitle: HTMLElement;
  descriptionContainer: HTMLElement;
  descriptionWords: Element[];
  buttonWraps: Element[];
  scrollIndicator: HTMLDivElement;
  scrollIndicatorFill: HTMLDivElement;
  stageNumber: HTMLElement;
  renderFrame: (index: number) => void;
}

/* ── Initial / final states ─────────────────────────────────────── */

/**
 * Set initial DOM states before the timeline scrub begins.
 * Called synchronously in the effect, before ScrollTrigger is created.
 */
export function setHeroInitialStates(refs: HeroRefs): void {
  // Title words — hidden below their mask containers, set opacity 1
  gsap.set([refs.titleHello, refs.titleBayu, refs.titlePraditya], {
    yPercent: 110,
    opacity: 1,
  });
  // Subtitle — blurred and offset
  gsap.set(refs.subtitle, { opacity: 0, y: 20, filter: "blur(20px)" });
  // Description — container visible, individual words hidden
  gsap.set(refs.descriptionContainer, { opacity: 1 });
  if (refs.descriptionWords.length > 0) {
    gsap.set(refs.descriptionWords, { opacity: 0, y: 15 });
  }
  // Buttons — hidden, offset, slightly scaled
  gsap.set(refs.buttonWraps, { opacity: 0, y: 30, scale: 0.95 });
  // Glow — invisible and small
  gsap.set(refs.glow, { opacity: 0, scale: 0.6 });
  // Scroll indicator — hidden
  gsap.set(refs.scrollIndicator, { opacity: 0 });
  gsap.set(refs.scrollIndicatorFill, { scaleY: 0, transformOrigin: "top" });
}

/**
 * Show all hero elements immediately — used for prefers-reduced-motion.
 */
export function setHeroFinalStates(refs: HeroRefs): void {
  gsap.set([refs.titleHello, refs.titleBayu, refs.titlePraditya], {
    yPercent: 0,
    opacity: 1,
  });
  gsap.set(refs.subtitle, { opacity: 1, y: 0, filter: "blur(0px)" });
  gsap.set(refs.descriptionContainer, { opacity: 1 });
  if (refs.descriptionWords.length > 0) {
    gsap.set(refs.descriptionWords, { opacity: 1, y: 0 });
  }
  gsap.set(refs.buttonWraps, { opacity: 1, y: 0, scale: 1 });
  gsap.set(refs.glow, { opacity: 0.4, scale: 1 });
  // Render the final frame (portrait facing camera)
  refs.renderFrame(sequenceConfig.frameCount - 1);
}

/* ── Master timeline ────────────────────────────────────────────── */

/**
 * Build the ONE master timeline.
 *
 * Pure function — no side effects beyond constructing the timeline.
 * All positions are fractions of 1.0 = 100% scroll progress.
 *
 * Timeline map:
 *   0%–100%   Frame scrub (continuous)
 *   10%–25%   Glow fade + scale
 *   20%–25%   "Hello, I'm" mask
 *   26%–31%   "Bayu" mask
 *   32%–37%   "Praditya" mask
 *   37%–44%   Subtitle blur→clear + y
 *   44%–58%   Description word stagger
 *   58%–68%   Buttons opacity+y+scale
 *   72%–80%   Scroll indicator fade in
 *   92%–100%  Content + canvas fade out
 */
export function createHeroTimeline(refs: HeroRefs): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });
  const frameCount = sequenceConfig.frameCount;

  // ── Frame scrub: 0%–100% (continuous across entire scroll) ────
  const frameProxy = { value: 0 };
  tl.to(
    frameProxy,
    {
      value: frameCount - 1,
      duration: 1,
      ease: "none",
      onUpdate() {
        refs.renderFrame(Math.round(frameProxy.value));
      },
    },
    0,
  );

  // ── Glow: 10%–25% ────────────────────────────────────────────
  tl.to(
    refs.glow,
    { opacity: 0.4, scale: 1, duration: 0.15, ease: "power1.inOut" },
    0.1,
  );

  // ── Title word masks: sequential reveal ───────────────────────
  tl.to(
    refs.titleHello,
    { yPercent: 0, duration: 0.05, ease: "power3.out" },
    0.2,
  );
  tl.to(
    refs.titleBayu,
    { yPercent: 0, duration: 0.05, ease: "power3.out" },
    0.26,
  );
  tl.to(
    refs.titlePraditya,
    { yPercent: 0, duration: 0.05, ease: "power3.out" },
    0.32,
  );

  // ── Subtitle: blur(20px→0) + y(20→0) at 37%–44% ─────────────
  tl.to(
    refs.subtitle,
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.07,
      ease: "power2.out",
    },
    0.37,
  );

  // ── Description: word stagger at 44%–58% ──────────────────────
  if (refs.descriptionWords.length > 0) {
    tl.to(
      refs.descriptionWords,
      {
        opacity: 1,
        y: 0,
        duration: 0.02,
        stagger: 0.004,
        ease: "power2.out",
      },
      0.44,
    );
  }

  // ── Buttons: opacity + y + scale at 58%–68% ──────────────────
  tl.to(
    refs.buttonWraps,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.06,
      stagger: 0.025,
      ease: "power2.out",
    },
    0.58,
  );

  // ── Scroll indicator: fade in at 72%–80% ──────────────────────
  tl.to(
    refs.scrollIndicator,
    { opacity: 1, duration: 0.08, ease: "power1.out" },
    0.72,
  );

  // ── Fade out: 92%–100% ────────────────────────────────────────
  tl.to(
    refs.parallaxText,
    { opacity: 0, y: -40, duration: 0.06, ease: "power2.in" },
    0.92,
  );
  tl.to(
    refs.parallaxCanvas,
    { opacity: 0, duration: 0.08, ease: "power1.in" },
    0.92,
  );
  tl.to(
    refs.scrollIndicator,
    { opacity: 0, duration: 0.05, ease: "power1.in" },
    0.93,
  );

  return tl;
}

/* ── Breathing timeline ─────────────────────────────────────────── */

/**
 * Idle breathing — separate from the scrubbed timeline because it's
 * time-based (yoyo, repeat). Plays/pauses based on hero stage.
 */
export function createBreathingTimeline(
  target: HTMLElement,
): gsap.core.Timeline {
  return gsap
    .timeline({ paused: true, repeat: -1, yoyo: true })
    .to(target, { scale: 1.01, duration: 3, ease: "sine.inOut" });
}
