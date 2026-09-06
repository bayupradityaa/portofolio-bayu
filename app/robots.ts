import type { MetadataRoute } from "next";
import { getProfileSettings } from "@/lib/actions/settings";

const DEFAULT_BASE_URL = "https://bayupraditya.dev";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getProfileSettings();
  const baseUrl = settings?.site_url || DEFAULT_BASE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/projects", "/projects/*"],
        disallow: ["/dev/", "/dev/*", "/api/", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
