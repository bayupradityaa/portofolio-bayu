import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { settleScroll, skipPreloader, waitForSequenceReady } from "./helpers";

/**
 * Invariant proof for the whole audit: mobile fixes must not change desktop.
 *
 * Two kinds of evidence, on purpose:
 *  - compared viewport snapshots, with the hero canvas masked, so a layout
 *    regression fails the run instead of being argued about;
 *  - unmasked labelled captures under __baseline__/manual/, because a GSAP +
 *    canvas hero never repaints byte-identically and four commits (C-FIX-3,
 *    C-FIX-4, C-12, C-34) deliberately change how it looks over time. Those
 *    need eyes, not a threshold.
 *
 * Viewport shots rather than element shots: #hero is 180vh and #work contains a
 * pinned h-screen stage, so element screenshots would be multi-viewport tall and
 * scroll-position dependent — the opposite of a stable baseline.
 */

const LABEL = process.env.SHOT_LABEL ?? "current";
const manualDir = join(__dirname, "__baseline__", "manual");

function saveManual(name: string, projectName: string, buffer: Buffer) {
  mkdirSync(manualDir, { recursive: true });
  writeFileSync(join(manualDir, `${name}-${LABEL}-${projectName}.png`), buffer);
}

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "desktop-visual is the invariant proof specifically for desktop @1440×900");
  await skipPreloader(page);
  await page.goto("/");
  await waitForSequenceReady(page);
});

test("hero", async ({ page }, testInfo) => {
  await page.evaluate(() => window.scrollTo(0, 0));
  await settleScroll(page);

  saveManual("hero", testInfo.project.name, await page.screenshot());
  await expect(page).toHaveScreenshot("hero.png", {
    mask: [page.locator('#hero canvas[role="img"]')],
  });
});

test("work", async ({ page }, testInfo) => {
  await page.locator("#work").scrollIntoViewIfNeeded();
  await settleScroll(page);

  saveManual("work", testInfo.project.name, await page.screenshot());
  await expect(page).toHaveScreenshot("work.png");
});

test("nav", async ({ page }, testInfo) => {
  // Header closed first: this is the box C-12 (.nav-close-btn min 44px) touches.
  const header = page.locator(".site-header-wrapper");
  saveManual("nav-header", testInfo.project.name, await header.screenshot());
  await expect(header).toHaveScreenshot("nav-header.png");

  await page.locator("button.nav-close-btn").first().click();
  await expect(page.locator("[data-nav]")).toHaveAttribute("data-nav", "open");
  await page.waitForTimeout(1200); // let the open timeline finish

  saveManual("nav-open", testInfo.project.name, await page.screenshot());
  await expect(page).toHaveScreenshot("nav-open.png");
});
