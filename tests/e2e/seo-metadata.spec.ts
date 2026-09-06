import { expect, test } from "@playwright/test";

test("robots.txt returns valid crawling directives", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);

  const text = await response.text();
  expect(text).toContain("User-Agent: *");
  expect(text).toContain("Allow: /");
  expect(text).toContain("Disallow: /dev/");
  expect(text).toContain("sitemap.xml");
});

test("manifest.webmanifest returns valid PWA manifest", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.status()).toBe(200);

  const json = await response.json();
  expect(json.name).toContain("Bayu Praditya");
  expect(json.theme_color).toBe("#000000");
  expect(json.icons.length).toBeGreaterThan(0);
});

test("og-image.png and og-image.jpg are accessible and valid image formats", async ({ request }) => {
  const resPng = await request.get("/og-image.png");
  expect(resPng.status()).toBe(200);
  expect(resPng.headers()["content-type"]).toContain("image/png");

  const resJpg = await request.get("/og-image.jpg");
  expect(resJpg.status()).toBe(200);
  expect(resJpg.headers()["content-type"]).toContain("image/jpeg");
});

test("homepage head contains canonical openGraph and twitter metadata", async ({ page }) => {
  await page.goto("/");

  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
  expect(ogTitle).toBeTruthy();

  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImage).toContain("og-image.png");

  const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
  expect(twitterCard).toBe("summary_large_image");
});
