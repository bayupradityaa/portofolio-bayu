import { expect, test } from "@playwright/test";
import { skipPreloader } from "./helpers";

test.beforeEach(async ({ page }) => {
  await skipPreloader(page);
});

test("project detail page loads 200 for valid slug and renders case study content", async ({ page }) => {
  // CLT.Store is one of the verified published projects in the database
  const response = await page.goto("/projects/clt-store");
  expect(response?.status()).toBe(200);

  // Check heading and case study content
  const title = page.locator("h1");
  await expect(title).toBeVisible();
  await expect(title).toContainText("CLT.Store");

  // Check back link to all projects
  const backLink = page.locator('a:has-text("Back to All Projects")');
  await expect(backLink).toBeVisible();

  // Ensure all images declare sizes
  const imagesWithoutSizes = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("main img"));
    return imgs.filter((img) => !img.hasAttribute("sizes")).length;
  });
  expect(imagesWithoutSizes, "All project detail images should have sizes attribute").toBe(0);
});

test("random slug triggers branded 404 page", async ({ page }) => {
  const response = await page.goto("/projects/random-slug-does-not-exist-999");
  expect(response?.status()).toBe(404);

  // Branded 404 content
  await expect(page.locator("h1")).toContainText("Page Not Found");
  await expect(page.locator('a:has-text("Return Home")')).toBeVisible();
  await expect(page.locator('a:has-text("All Projects")')).toBeVisible();
});

test("no 404 requests to non-existent /works/*.svg on homepage", async ({ page }) => {
  const brokenRequests: string[] = [];

  page.on("requestfailed", (request) => {
    if (request.url().includes("/works/")) {
      brokenRequests.push(request.url());
    }
  });

  page.on("response", (response) => {
    if (response.url().includes("/works/") && response.status() === 404) {
      brokenRequests.push(response.url());
    }
  });

  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  expect(brokenRequests, "No requests to fake /works/ SVGs should occur").toEqual([]);
});
