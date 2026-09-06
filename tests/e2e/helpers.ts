import { expect, type Page } from "@playwright/test";

export const MOBILE_PROJECTS = ["mobile-320", "mobile-375", "mobile-390", "mobile-414"];

/**
 * The preloader skips itself when `intro-seen` is already in sessionStorage
 * (components/shell/loading-screen.tsx:27). Setting it up front removes ~1.4s
 * of non-deterministic wordmark wipe — and, more importantly, removes the
 * loader's own `body.style.overflow = "hidden"` from scroll-lock assertions.
 */
export async function skipPreloader(page: Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      /* storage blocked — the loader just runs, tests still pass */
    }
  });
}

/**
 * hero-sequence.tsx renders the LCP poster only while `status !== "ready"`, so
 * the poster leaving the DOM *is* the readiness signal. True both before and
 * after C-FIX-3, which is what makes it usable as a baseline anchor.
 */
export async function waitForSequenceReady(page: Page) {
  await expect(page.locator("#hero picture")).toHaveCount(0, { timeout: 60_000 });
}

export interface CanvasSample {
  found: boolean;
  nonBlack: number;
  total: number;
  width: number;
  height: number;
}

/**
 * Samples the hero canvas on a 3x3 grid. The sequence frames are same-origin
 * (`/sequence-mobile/`, `/sequence-desktop/`), so the canvas is never tainted
 * and getImageData is legal.
 *
 * `alpha: false` means an unpainted or just-resized bitmap reads as pure black —
 * that is exactly the blocker C-FIX-2 and C-FIX-3 are about.
 */
export async function sampleHeroCanvas(page: Page): Promise<CanvasSample> {
  return page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('#hero canvas[role="img"]');
    if (!canvas) return { found: false, nonBlack: 0, total: 0, width: 0, height: 0 };
    const ctx = canvas.getContext("2d");
    if (!ctx) return { found: false, nonBlack: 0, total: 0, width: 0, height: 0 };

    const fractions = [0.2, 0.5, 0.8];
    let nonBlack = 0;
    let total = 0;
    for (const fy of fractions) {
      for (const fx of fractions) {
        const x = Math.min(canvas.width - 1, Math.max(0, Math.floor(canvas.width * fx)));
        const y = Math.min(canvas.height - 1, Math.max(0, Math.floor(canvas.height * fy)));
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
        total += 1;
        if (r + g + b > 24) nonBlack += 1;
      }
    }
    return { found: true, nonBlack, total, width: canvas.width, height: canvas.height };
  });
}

export interface OverflowReport {
  limit: number;
  docScrollWidth: number;
  offenders: { tag: string; cls: string; right: number }[];
}

/**
 * Real horizontal overflow, measured two ways.
 *
 * A naive `el.scrollWidth > clientWidth` sweep is misleading here: the blur
 * blobs (about.tsx:29) and the marquee tracks (marquee.tsx:26) are deliberately
 * wider than the viewport and sit inside an ancestor that clips the x axis, so
 * they cost nothing. What matters is geometry that actually escapes: an element
 * whose right edge is past the viewport with no clipping ancestor, and the
 * document's own scrollWidth once body{overflow-x:hidden} is lifted.
 */
export async function horizontalOffenders(page: Page, unclip: boolean): Promise<OverflowReport> {
  return page.evaluate((shouldUnclip: boolean) => {
    const root = document.documentElement;
    const previousBody = document.body.style.overflowX;
    const previousRoot = root.style.overflowX;
    // body{overflow-x:hidden} hides the culprit rather than fixing it, so the
    // honest measurement has to lift the clip first.
    if (shouldUnclip) {
      document.body.style.overflowX = "visible";
      root.style.overflowX = "visible";
    }

    const limit = root.clientWidth;
    const clipped = (el: HTMLElement) => {
      for (let node = el.parentElement; node; node = node.parentElement) {
        if (node === document.body || node === root) continue;
        if (getComputedStyle(node).overflowX !== "visible") return true;
      }
      return false;
    };

    const offenders = [...root.querySelectorAll<HTMLElement>("body *")]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        return rect.right > limit + 1 && !clipped(el);
      })
      .slice(0, 12)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 90),
        right: Math.round(el.getBoundingClientRect().right),
      }));

    const docScrollWidth = root.scrollWidth;
    if (shouldUnclip) {
      document.body.style.overflowX = previousBody;
      root.style.overflowX = previousRoot;
    }
    return { limit, docScrollWidth, offenders };
  }, unclip);
}

/**
 * Lenis animates programmatic scrolls, so a screenshot taken right after
 * scrollIntoView lands mid-glide. Wait until scrollY stops moving instead of
 * guessing a timeout.
 */
export async function settleScroll(page: Page, samples = 4) {
  let stable = 0;
  let previous = -1;
  for (let i = 0; i < 60 && stable < samples; i += 1) {
    const y = await page.evaluate(() => Math.round(window.scrollY));
    stable = y === previous ? stable + 1 : 0;
    previous = y;
    await page.waitForTimeout(100);
  }
}
