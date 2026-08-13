import type { MetadataRoute } from "next";
import { getPublicProjects } from "@/lib/actions/projects";

const BASE_URL = "https://bayupraditya.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublicProjects();

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projectUrls,
  ];
}
