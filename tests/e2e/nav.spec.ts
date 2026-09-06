import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { skipPreloader } from "./helpers";

const repoRoot = join(__dirname, "..", "..");
const source = (relative: string) => readFileSync(join(repoRoot, relative), "utf8");

const TRIGGER = "button.nav-close-btn";
const DRAWER = "nav.menu-content";

test.beforeEach(async ({ page }) => {
  await skipPreloader(page);
  await page.goto("/");
  await expect(page.locator(TRIGGER).first()).toBeVisible();
});

/**
 * C-FIX-9, proof — the effect's cleanup is `return () => ctx.revert();`.
 * `ctx.revert()` runs on every dependency change AND on unmount, and it kills
 * the close timeline whose `onComplete` (nav.tsx:156-162) is the only code that
 * resets `body.style.overflow`. `Nav` is mounted per page, not in the root
 * layout, so the drawer's "GET IN TOUCH" link genuinely unmounts it roughly
 * 0ms after `closeMenu()` starts a ~500ms timeline.
 *
 * This is asserted against source deliberately. Measured on this tree, from
 * both `/` and `/projects`, the inline lock was already cleared 150ms after the
 * drawer CTA changed route: whether the timeline outruns the navigation is a
 * race that Chromium wins locally and a real phone need not. The behavioural
 * net below stays green either way, so it cannot serve as proof — see
 * DEVICE-CHECKLIST.md step 5 for the physical-device check.
 *
 * PRE-FIX EXPECTATION: fails — the cleanup only calls `ctx.revert()`.
 */
test("nav cleanup releases the scroll lock unconditionally", () => {
  const file = source("components/shell/nav.tsx");
  const revertAt = file.indexOf("ctx.revert()");
  expect(revertAt, "nav.tsx no longer calls ctx.revert() — reread the file").toBeGreaterThan(0);
  // Window back from ctx.revert() so this works whether the cleanup is a single
  // expression (pre-fix) or a block (post-fix).
  const cleanup = file.slice(Math.max(0, revertAt - 300), revertAt + 20);
  expect(
    cleanup,
    "nav.tsx cleanup must reset body.style.overflow before ctx.revert() kills the close timeline",
  ).toMatch(/document\.body\.style\.overflow\s*=\s*""/);
});

/**
 * C-FIX-9, regression net — `toggleMenu` (nav.tsx:197) has no animation guard,
 * so clicking again mid-close flips `isMenuOpen` and re-runs the effect,
 * reverting the context while the close timeline is still in flight. The clicks
 * below are deliberately not serialised on `data-nav`, because that attribute is
 * written inside the very `onComplete` the bug destroys — waiting for it would
 * mean the test can only ever observe timelines that already finished.
 *
 * This passes on the pre-fix tree in Chromium and is kept as a net, not proof.
 */
test("page still scrolls after rapid menu toggling", async ({ page }) => {
  const trigger = page.locator(TRIGGER).first();

  for (let i = 0; i < 8; i += 1) {
    await trigger.click();
    await page.waitForTimeout(120); // mid-open
    await trigger.click();
    await page.waitForTimeout(120); // mid-close: this is where revert() bites
  }

  await expect(page.locator("[data-nav]")).toHaveAttribute("data-nav", "closed");

  await expect
    .poll(async () => page.evaluate(() => document.body.style.overflow), {
      timeout: 10_000,
      message: "body.style.overflow was left locked after closing the menu",
    })
    .not.toBe("hidden");

  const scrolled = await page.evaluate(async () => {
    window.scrollTo(0, 0);
    window.scrollBy(0, 400);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    return window.scrollY;
  });
  expect(scrolled, "page must still scroll after the menu closes").toBeGreaterThan(0);
});

/**
 * C-FIX-5, proof — `.menu-content` (globals.css:670-680) sets `top:0; bottom:0`
 * and then `height: 100vh` on top of them. On iOS `100vh` is the LARGE viewport,
 * so the drawer becomes taller than the visible area while `overflow: hidden`
 * clips the bottom, and `justify-content: space-between` puts the social row and
 * the "GET IN TOUCH" CTA exactly where the clipping happens.
 *
 * Asserted against the shipped stylesheet, not against geometry: Chromium has no
 * dynamic toolbar, so `100vh === innerHeight` and the box measures correct here
 * no matter what. The visual symptom is DEVICE-CHECKLIST.md step 5b.
 *
 * PRE-FIX EXPECTATION: fails — the rule declares `height: 100vh`.
 */
test("drawer height is not pinned to the large viewport", async ({ page }) => {
  const declarations = await page.evaluate(() => {
    const found: string[] = [];
    const walk = (rules: CSSRuleList) => {
      for (const rule of Array.from(rules)) {
        const nested = (rule as CSSGroupingRule).cssRules;
        if (nested) walk(nested);
        const style = (rule as CSSStyleRule).selectorText;
        if (!style || !style.includes(".menu-content")) continue;
        const height = (rule as CSSStyleRule).style.getPropertyValue("height").trim();
        if (height) found.push(`${style} { height: ${height} }`);
      }
    };
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        walk(sheet.cssRules);
      } catch {
        continue; // cross-origin sheet: not ours
      }
    }
    return found;
  });

  expect(
    declarations.join(" | "),
    "a .menu-content height in vh clips the drawer on iOS; top:0 + bottom:0 already size it",
  ).not.toMatch(/height:\s*\d+vh/);
});

/**
 * C-FIX-5, regression net — geometry check that holds in Chromium. It cannot
 * fail pre-fix (100vh === innerHeight without a dynamic toolbar), but it does
 * catch a worse regression: a drawer sized past the layout viewport, or a CTA
 * pushed out of it.
 */
test("drawer CTA stays inside the layout viewport", async ({ page }) => {
  await page.locator(TRIGGER).first().click();
  const drawer = page.locator(DRAWER);
  await expect(drawer).toBeVisible();

  const cta = drawer.getByRole("link", { name: /get in touch/i });
  await expect(cta).toBeVisible();
  await expect(cta).toBeInViewport();

  const clipped = await drawer.evaluate((el) => el.scrollHeight - el.clientHeight);
  expect(clipped, "drawer content is clipped by overflow:hidden").toBeLessThanOrEqual(1);

  const box = await drawer.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(Math.round(box?.height ?? 0)).toBeLessThanOrEqual((viewport?.height ?? 0) + 1);
});
