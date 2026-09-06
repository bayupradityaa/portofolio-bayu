import { expect, test } from "@playwright/test";
import { skipPreloader } from "./helpers";

/**
 * The contact form only mounts after the ConversationBubble CTA is pressed, and
 * that CTA starts at `pointer-events: none` behind a ~4.5s GSAP chain gated by a
 * ScrollTrigger at `top 80%`. Scroll first, then let Playwright's auto-wait
 * absorb the chain instead of guessing a timeout.
 */
async function openContactForm(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /let's talk/i }).click({ timeout: 60_000 });
  await expect(page.locator("#name")).toBeVisible({ timeout: 30_000 });
}

test.beforeEach(async ({ page }) => {
  await skipPreloader(page);
});

/**
 * C-FIX-6 — iOS Safari zooms in irreversibly when a focused control renders
 * below 16px, and `controlBase` in components/ui/field.tsx is `text-sm` (14px).
 *
 * PRE-FIX EXPECTATION: fails on mobile projects with 14px.
 */
test("form controls are at least 16px on phones", async ({ page }, testInfo) => {
  const width = testInfo.project.use.viewport?.width ?? 390;
  test.skip(width >= 640, "16px rule only applies below the sm breakpoint");

  await openContactForm(page);

  const sizes = await page.locator("#contact input, #contact textarea").evaluateAll((els) =>
    els.map((el) => ({
      id: el.id,
      fontSize: parseFloat(getComputedStyle(el).fontSize),
    })),
  );

  expect(sizes.length).toBeGreaterThan(0);
  for (const field of sizes) {
    expect(field.fontSize, `#${field.id} is ${field.fontSize}px — iOS will auto-zoom`).toBeGreaterThanOrEqual(16);
  }
});

/**
 * The other half of `text-base sm:text-sm`: the 14px desktop rendering must
 * survive, or the fix has restyled desktop instead of fixing mobile.
 */
test("form controls stay 14px from the sm breakpoint up", async ({ page }, testInfo) => {
  const width = testInfo.project.use.viewport?.width ?? 390;
  test.skip(width < 640, "desktop-neutrality check only");

  await openContactForm(page);

  const sizes = await page.locator("#contact input, #contact textarea").evaluateAll((els) =>
    els.map((el) => parseFloat(getComputedStyle(el).fontSize)),
  );

  expect(sizes.length).toBeGreaterThan(0);
  for (const size of sizes) {
    expect(size).toBeLessThan(16);
  }
});
