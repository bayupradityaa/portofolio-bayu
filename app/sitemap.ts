import type { MetadataRoute } from "next";
import { getPublicProjects } from "@/lib/actions/projects";
import { getProfileSettings } from "@/lib/actions/settings";

const DEFAULT_BASE_URL = "https://bayupraditya.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, settings] = await Promise.all([
    getPublicProjects(),
    getProfileSettings(),
  ]);

  const baseUrl = settings?.site_url || DEFAULT_BASE_URL;

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projectUrls,
  ];
}
