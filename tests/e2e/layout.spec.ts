import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { horizontalOffenders, skipPreloader } from "./helpers";

const repoRoot = join(__dirname, "..", "..");
const source = (relative: string) => readFileSync(join(repoRoot, relative), "utf8");

test.beforeEach(async ({ page }) => {
  await skipPreloader(page);
});

/**
 * C-10 — `lenis/dist/lenis.css` was never imported, so `lenis.stop()` never got
 * `overflow: clip` and the six `data-lenis-prevent` scrollers never got
 * `overscroll-behavior: contain`. The CSS ships in the package already; the only
 * question is whether the bundle actually contains its rules.
 *
 * PRE-FIX EXPECTATION: fails — no `.lenis-stopped` rule in any stylesheet.
 */
test("lenis stylesheet is part of the bundle", async ({ page }) => {
  await page.goto("/");

  const hasRule = await page.evaluate(() => {
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // cross-origin sheet: not ours, cannot contain lenis rules
      }
      for (const rule of Array.from(rules)) {
        if (rule.cssText.includes("lenis-stopped")) return true;
      }
    }
    return false;
  });

  expect(hasRule, "lenis.css is missing: lenis.stop() cannot lock native scroll").toBe(true);
});

/**
 * C-19 — the modal thumbnails are 80x56 CSS px but `<Image fill>` without
 * `sizes` makes Next default to `sizes="100vw"`, so every thumbnail downloads a
 * viewport-wide image. Asserted against source because the thumbnail strip only
 * renders for projects that actually have several images, which would make a
 * runtime assertion depend on database contents.
 *
 * PRE-FIX EXPECTATION: fails — no `sizes` on the thumbnail Image.
 */
test("modal thumbnails declare their real rendered size", () => {
  const file = source("components/projects/project-detail-modal.tsx");
  const thumbnail = file.slice(file.indexOf('"relative h-14 w-20 shrink-0'));
  expect(thumbnail.length).toBeGreaterThan(0);
  const firstImage = thumbnail.slice(thumbnail.indexOf("<Image"), thumbnail.indexOf("/>"));
  expect(firstImage).toContain('sizes="80px"');
});

/**
 * §H step 1 — `body { overflow-x: hidden }` hides horizontal overflow instead of
 * preventing it, so the honest measurement lifts the clip first.
 */
for (const path of ["/", "/projects"]) {
  test(`no horizontal overflow on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("domcontentloaded");

    const { limit, docScrollWidth, offenders } = await horizontalOffenders(page, true);
    expect(
      offenders,
      `elements escaping ${limit}px: ${JSON.stringify(offenders, null, 2)}`,
    ).toEqual([]);
    expect(
      docScrollWidth,
      `document scrolls horizontally once body{overflow-x:hidden} is lifted: ${docScrollWidth}px > ${limit}px`,
    ).toBeLessThanOrEqual(limit + 1);
  });
}
