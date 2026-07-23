import { getPublishedProjects } from "@/lib/actions/projects";
import type { ProjectWithRelations } from "@/lib/types/database";
import { FeaturedProjectsClient } from "./FeaturedProjectsClient";
import type { FeaturedProject } from "./types";

/** Max panels the pinned experience stays comfortable with. */
const MAX_FEATURED = 5;

/** Derive an uppercase category label, falling back to the role. */
function categoryLabel(project: ProjectWithRelations): string {
  return (project.category || project.role || "Project").toUpperCase();
}

/** Map the DB relation shape to the flat, serializable client shape. */
function toFeatured(project: ProjectWithRelations, i: number): FeaturedProject {
  const stats: FeaturedProject["stats"] = [];
  if (project.year) stats.push({ label: "Year", value: String(project.year) });
  if (project.role) stats.push({ label: "Role", value: project.role });

  return {
    slug: project.slug,
    index: String(i + 1).padStart(2, "0"),
    name: project.name,
    tagline: project.tagline,
    category: categoryLabel(project),
    summary: project.summary,
    status: project.status,
    coverImage: project.cover_image || project.images[0]?.image_url || null,
    coverAlt: project.cover_alt || `${project.name} — ${project.tagline}`,
    liveUrl: project.live_url,
    liveUrlLabel: project.live_url_label,
    repoUrl: project.repo_url,
    technologies: project.technologies.map((t) => t.name),
    highlights: project.highlights.map((h) => h.text),
    stats,
  };
}

/**
 * Server entry for the Featured Projects showcase. Fetches published projects,
 * keeps only those flagged `featured`, caps the count, and hands a flat,
 * client-safe array to the cinematic client component.
 */
export async function FeaturedProjects() {
  const all = await getPublishedProjects();
  const featured = all.filter((p) => p.featured).slice(0, MAX_FEATURED);

  if (featured.length === 0) return null;

  const projects = featured.map(toFeatured);

  return <FeaturedProjectsClient projects={projects} />;
}
