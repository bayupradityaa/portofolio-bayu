import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * @playwright/test 1.63 wants Chromium build 1243, whose download fails from
 * this machine (CDN timeouts, retried three times). Build 1234 from the earlier
 * install is present and complete, so point at it instead of adding anything to
 * the dependency tree. Where the matching browser does exist, this resolves to
 * undefined and Playwright's own lookup wins.
 */
const browsersPath =
  process.env.PLAYWRIGHT_BROWSERS_PATH ?? join(process.env.LOCALAPPDATA ?? "", "ms-playwright");
const pinnedChromium = join(browsersPath, "chromium-1234", "chrome-win64", "chrome.exe");
const executablePath = existsSync(pinnedChromium) ? pinnedChromium : undefined;

/**
 * Mobile audit viewports. 320–639px is the range the audit found most broken,
 * so four of the six projects sit inside it.
 */
const mobile = (width: number, height: number) => ({
  ...devices["Desktop Chrome"],
  viewport: { width, height },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});

export default defineConfig({
  testDir: "./tests/e2e",
  // One flat baseline folder so before/after is easy to eyeball by hand.
  snapshotPathTemplate: "{testDir}/__baseline__/{arg}{-projectName}{ext}",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  reporter: [["list"]],
  expect: {
    timeout: 15_000,
    // A GSAP + canvas hero never repaints byte-identically. 1.5% absorbs frame
    // drift without hiding a real layout shift.
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.015,
      animations: "disabled",
      caret: "hide",
    },
  },
  use: { baseURL: BASE_URL, trace: "retain-on-failure", launchOptions: { executablePath } },
  projects: [
    { name: "mobile-320", use: mobile(320, 568) },
    { name: "mobile-375", use: mobile(375, 667) },
    { name: "mobile-390", use: mobile(390, 844) },
    { name: "mobile-414", use: mobile(414, 896) },
    { name: "tablet-768", use: mobile(768, 1024) },
    {
      name: "desktop-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    // Production build only — next dev's TBT and hydration are not
    // representative of what a phone actually receives.
    command: `npm run build && npx next start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 600_000,
  },
});
