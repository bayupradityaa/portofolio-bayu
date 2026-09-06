import type { MetadataRoute } from "next";

const BASE_URL = "https://bayupraditya.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/projects", "/projects/*"],
        disallow: ["/dev/", "/dev/*", "/api/", "/api/*"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
