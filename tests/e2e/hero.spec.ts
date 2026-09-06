import { expect, test } from "@playwright/test";
import { sampleHeroCanvas, skipPreloader, waitForSequenceReady } from "./helpers";

test.beforeEach(async ({ page }) => {
  await skipPreloader(page);
});

/**
 * C-FIX-2 — `onResize` calls `sizeCanvas()`, which assigns `canvas.width` and
 * therefore CLEARS the bitmap. With `{alpha:false}` a cleared bitmap is opaque
 * black, and nothing repaints it. iOS Safari fires `resize` on every URL-bar
 * collapse, so the hero goes fully black during ordinary use.
 *
 * The test dispatches a bare `resize` event as well as changing the viewport,
 * because those two are not equivalent here. A real dimension change makes
 * ScrollTrigger refresh and rewrite the pin spacer's inline styles, which trips
 * the MutationObserver at use-hero-sequence.ts:258-266 and repaints the canvas
 * as a side effect — masking the bug. A bare `resize` reaches the app's own
 * listener with nothing else moving, which is what a URL-bar collapse looks
 * like once GSAP has decided the layout did not change.
 *
 * Measured on this tree before the fix: baseline 9/9 non-black, then 0/9 after a
 * bare resize and still 0/9 a second later.
 *
 * PRE-FIX EXPECTATION: this fails (all nine samples black after a bare resize).
 */
test("hero canvas still has pixels after repeated viewport resizes", async ({ page }, testInfo) => {
  const { width, height } = testInfo.project.use.viewport ?? { width: 390, height: 844 };

  await page.goto("/");
  await waitForSequenceReady(page);
  await page.mouse.wheel(0, 120);
  await expect
    .poll(async () => (await sampleHeroCanvas(page)).nonBlack, { timeout: 30_000 })
    .toBeGreaterThan(0);

  // Height-only changes mimic a URL bar collapsing and expanding; the last step
  // changes both axes, which is a resize that genuinely must re-render.
  const steps = [
    { width, height: height - 90 },
    { width, height },
    { width: width - 40, height: height - 60 },
  ];

  // A legitimate implementation may repaint on the next rAF, so poll rather than
  // sample once — but 8s of black is a black hero, not a slow frame.
  const expectPainted = (label: string) =>
    expect
      .poll(async () => (await sampleHeroCanvas(page)).nonBlack, {
        timeout: 8_000,
        intervals: [200, 400, 800],
        message: `hero canvas is fully black after ${label}`,
      })
      .toBeGreaterThan(0);

  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await expectPainted("a bare resize event");

  for (const step of steps) {
    await page.setViewportSize(step);
    await expectPainted(`a resize to ${step.width}x${step.height}`);

    await page.evaluate(() => window.dispatchEvent(new Event("resize")));
    await expectPainted(`a bare resize event at ${step.width}x${step.height}`);
  }
});

/**
 * C-FIX-3 — the canvas sits at `z-10` with an opaque-black default bitmap over
 * the `z-0` LCP poster, so first paint is a black box and the `fetchPriority`
 * preload in app/layout.tsx buys nothing visible.
 *
 * Requests for sequence frames are aborted so `status` can never reach "ready";
 * that pins the component in the exact state the user sees on first paint,
 * instead of racing a localhost load that finishes in milliseconds.
 *
 * PRE-FIX EXPECTATION: fails on canvas opacity (it is 1, hiding the poster).
 */
test("LCP poster is not covered by the canvas before the first frame paints", async ({ page }) => {
  await page.route("**/sequence-*/**", (route) => route.abort());
  await page.goto("/");

  const poster = page.locator("#hero picture img");
  await expect(poster).toHaveCount(1);
  await expect(poster).toHaveAttribute("fetchpriority", "high");

  const canvasOpacity = await page
    .locator('#hero canvas[role="img"]')
    .evaluate((el) => getComputedStyle(el).opacity);
  expect(canvasOpacity, "canvas must not paint opaque black over the poster").toBe("0");
});

/** The poster must be in the server HTML, or the preload cannot help the LCP. */
test("poster is server-rendered, not client-only", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain("/sequence-mobile/ezgif-frame-001.webp");
});
