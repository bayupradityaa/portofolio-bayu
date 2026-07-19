"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidateProjects } from "@/lib/cache";
import { convertToWebp, ACCEPTED_IMAGE_TYPES } from "@/lib/image";
import { projectSchema } from "@/lib/schemas/project";
import type {
  Project,
  ProjectWithRelations,
  ProjectHighlight,
  ProjectImage,
  Technology,
} from "@/lib/types/database";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function loadProjectRelations(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  projectIds: string[],
) {
  if (!supabase || projectIds.length === 0) return { techMap: {}, highlightMap: {}, imageMap: {} };

  // Technologies via junction
  const { data: junctions } = await supabase
    .from("project_technologies")
    .select("project_id, technology_id, sort_order, technologies(*)")
    .in("project_id", projectIds)
    .order("sort_order", { ascending: true });

  const techMap: Record<string, Technology[]> = {};
  for (const j of junctions ?? []) {
    const pid = j.project_id as string;
    if (!techMap[pid]) techMap[pid] = [];
    if (j.technologies) techMap[pid].push(j.technologies as unknown as Technology);
  }

  // Highlights
  const { data: highlights } = await supabase
    .from("project_highlights")
    .select("*")
    .in("project_id", projectIds)
    .order("sort_order", { ascending: true });

  const highlightMap: Record<string, ProjectHighlight[]> = {};
  for (const h of highlights ?? []) {
    const pid = h.project_id as string;
    if (!highlightMap[pid]) highlightMap[pid] = [];
    highlightMap[pid].push(h as ProjectHighlight);
  }

  // Images
  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .in("project_id", projectIds)
    .order("sort_order", { ascending: true });

  const imageMap: Record<string, ProjectImage[]> = {};
  for (const img of images ?? []) {
    const pid = img.project_id as string;
    if (!imageMap[pid]) imageMap[pid] = [];
    imageMap[pid].push(img as ProjectImage);
  }

  return { techMap, highlightMap, imageMap };
}

function attachRelations(
  projects: Project[],
  techMap: Record<string, Technology[]>,
  highlightMap: Record<string, ProjectHighlight[]>,
  imageMap: Record<string, ProjectImage[]>,
): ProjectWithRelations[] {
  return projects.map((p) => ({
    ...p,
    technologies: techMap[p.id] ?? [],
    highlights: highlightMap[p.id] ?? [],
    images: imageMap[p.id] ?? [],
  }));
}

// ---------------------------------------------------------------------------
// Public Queries (cached)
// ---------------------------------------------------------------------------

/** Fetch published projects with relations (for public portfolio) */
export const getPublishedProjects = unstable_cache(
  async (): Promise<ProjectWithRelations[]> => {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[projects] fetch error:", error.message);
      return [];
    }

    const projects = (data ?? []) as Project[];
    const ids = projects.map((p) => p.id);
    const { techMap, highlightMap, imageMap } = await loadProjectRelations(supabase, ids);

    return attachRelations(projects, techMap, highlightMap, imageMap);
  },
  ["published-projects"],
  { tags: [CACHE_TAGS.PROJECTS], revalidate: 3600 },
);

/** Fetch single project by slug (for detail page if needed) */
export async function getProjectBySlug(slug: string): Promise<ProjectWithRelations | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;

  const project = data as Project;
  const { techMap, highlightMap, imageMap } = await loadProjectRelations(supabase, [project.id]);

  return attachRelations([project], techMap, highlightMap, imageMap)[0];
}

// ---------------------------------------------------------------------------
// Admin Queries
// ---------------------------------------------------------------------------

/** Fetch ALL projects (admin — ignores published flag) */
export async function getAllProjects(): Promise<ProjectWithRelations[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[projects/dev] fetch error:", error.message);
    return [];
  }

  const projects = (data ?? []) as Project[];
  const ids = projects.map((p) => p.id);
  const { techMap, highlightMap, imageMap } = await loadProjectRelations(supabase, ids);

  return attachRelations(projects, techMap, highlightMap, imageMap);
}

/** Fetch single project by ID for editing */
export async function getProjectById(id: string): Promise<ProjectWithRelations | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const project = data as Project;
  const { techMap, highlightMap, imageMap } = await loadProjectRelations(supabase, [project.id]);

  return attachRelations([project], techMap, highlightMap, imageMap)[0];
}

/**
 * Migrate a legacy cover into the gallery. If the project has a `cover_image`
 * that isn't yet a gallery row, insert it as the first image. Idempotent and
 * safe to call on every edit-page load. Returns true if a row was inserted.
 */
export async function ensureCoverInGallery(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const { data: project } = await supabase
    .from("projects")
    .select("cover_image, cover_alt")
    .eq("id", id)
    .single();

  if (!project?.cover_image) return false;

  const { data: images } = await supabase
    .from("project_images")
    .select("image_url, sort_order")
    .eq("project_id", id);

  // Already represented in the gallery — nothing to do.
  if (images?.some((img) => img.image_url === project.cover_image)) return false;

  const minOrder = images?.length
    ? Math.min(...images.map((img) => img.sort_order as number))
    : 0;

  const { error } = await supabase.from("project_images").insert({
    project_id: id,
    image_url: project.cover_image,
    alt: project.cover_alt ?? "",
    caption: null,
    sort_order: minOrder - 1, // sorts ahead of existing images without touching them
  });

  if (error) return false;

  // No revalidation here: this runs during the edit page's render (revalidateTag
  // is unsupported there). The subsequent getProjectById reads uncached, so the
  // form sees the new row immediately; the next save revalidates public caches.
  return true;
}

// ---------------------------------------------------------------------------
// Admin Mutations
// ---------------------------------------------------------------------------

export async function createProject(values: unknown) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  // Clean up empty URL strings to null
  const data = {
    ...parsed.data,
    live_url: parsed.data.live_url || null,
    repo_url: parsed.data.repo_url || null,
  };

  const { data: project, error } = await supabase
    .from("projects")
    .insert(data)
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidateProjects();
  return { success: true, id: project.id };
}

export async function updateProject(id: string, values: unknown) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const parsed = projectSchema.partial().safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const data = {
    ...parsed.data,
    ...(parsed.data.live_url !== undefined && { live_url: parsed.data.live_url || null }),
    ...(parsed.data.repo_url !== undefined && { repo_url: parsed.data.repo_url || null }),
  };

  const { error } = await supabase.from("projects").update(data).eq("id", id);

  if (error) return { error: error.message };

  revalidateProjects();
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidateProjects();
  return { success: true };
}

export async function togglePublished(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { data: project } = await supabase.from("projects").select("published").eq("id", id).single();
  if (!project) return { error: "Project not found" };

  const { error } = await supabase
    .from("projects")
    .update({ published: !project.published })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateProjects();
  return { success: true, published: !project.published };
}

export async function toggleFeatured(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { data: project } = await supabase.from("projects").select("featured").eq("id", id).single();
  if (!project) return { error: "Project not found" };

  const { error } = await supabase
    .from("projects")
    .update({ featured: !project.featured })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateProjects();
  return { success: true, featured: !project.featured };
}

export async function duplicateProject(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const existing = await getProjectById(id);
  if (!existing) return { error: "Project not found" };

  const { id: _, created_at, updated_at, technologies, highlights, images, ...rest } = existing;

  const newSlug = `${rest.slug}-copy-${Date.now()}`;
  const { data: newProject, error } = await supabase
    .from("projects")
    .insert({ ...rest, slug: newSlug, name: `${rest.name} (Copy)`, published: false })
    .select("id")
    .single();

  if (error || !newProject) return { error: error?.message ?? "Failed to duplicate" };

  // Copy highlights
  if (highlights.length > 0) {
    await supabase.from("project_highlights").insert(
      highlights.map((h) => ({
        project_id: newProject.id,
        text: h.text,
        sort_order: h.sort_order,
      })),
    );
  }

  // Copy technology associations
  if (technologies.length > 0) {
    await supabase.from("project_technologies").insert(
      technologies.map((t, i) => ({
        project_id: newProject.id,
        technology_id: t.id,
        sort_order: i,
      })),
    );
  }

  // Copy gallery images (references the same stored files)
  if (images.length > 0) {
    await supabase.from("project_images").insert(
      images.map((img, i) => ({
        project_id: newProject.id,
        image_url: img.image_url,
        alt: img.alt,
        caption: img.caption,
        sort_order: img.sort_order ?? i,
      })),
    );
  }

  revalidateProjects();
  return { success: true, id: newProject.id };
}

export async function reorderProjects(orderedIds: string[]) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const updates = orderedIds.map((id, index) =>
    supabase.from("projects").update({ sort_order: index }).eq("id", id),
  );

  await Promise.all(updates);
  revalidateProjects();
  return { success: true };
}

// ---------------------------------------------------------------------------
// Project Highlights
// ---------------------------------------------------------------------------

export async function setProjectHighlights(projectId: string, highlights: string[]) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  // Delete existing
  await supabase.from("project_highlights").delete().eq("project_id", projectId);

  // Insert new
  if (highlights.length > 0) {
    const { error } = await supabase.from("project_highlights").insert(
      highlights.map((text, i) => ({
        project_id: projectId,
        text,
        sort_order: i,
      })),
    );
    if (error) return { error: error.message };
  }

  revalidateProjects();
  return { success: true };
}

// ---------------------------------------------------------------------------
// Project Technologies
// ---------------------------------------------------------------------------

export async function setProjectTechnologies(projectId: string, technologyIds: string[]) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  // Delete existing
  await supabase.from("project_technologies").delete().eq("project_id", projectId);

  // Insert new
  if (technologyIds.length > 0) {
    const { error } = await supabase.from("project_technologies").insert(
      technologyIds.map((techId, i) => ({
        project_id: projectId,
        technology_id: techId,
        sort_order: i,
      })),
    );
    if (error) return { error: error.message };
  }

  revalidateProjects();
  return { success: true };
}

// ---------------------------------------------------------------------------
// Project Images
// ---------------------------------------------------------------------------

export async function addProjectImage(
  projectId: string,
  imageUrl: string,
  alt: string,
  caption?: string,
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  // Get max sort_order
  const { data: existing } = await supabase
    .from("project_images")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing?.[0] ? (existing[0].sort_order as number) + 1 : 0;

  const { error } = await supabase.from("project_images").insert({
    project_id: projectId,
    image_url: imageUrl,
    alt,
    caption: caption || null,
    sort_order: nextOrder,
  });

  if (error) return { error: error.message };

  revalidateProjects();
  return { success: true };
}

export async function deleteProjectImage(imageId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  // Fetch the URL first so we can also remove the stored file.
  const { data: existing } = await supabase
    .from("project_images")
    .select("project_id, image_url")
    .eq("id", imageId)
    .single();

  const { error } = await supabase.from("project_images").delete().eq("id", imageId);
  if (error) return { error: error.message };

  // If we just deleted the cover, promote the next remaining image (or clear it).
  if (existing) {
    const { data: proj } = await supabase
      .from("projects")
      .select("cover_image")
      .eq("id", existing.project_id)
      .single();

    if (proj?.cover_image === existing.image_url) {
      const { data: next } = await supabase
        .from("project_images")
        .select("image_url, alt")
        .eq("project_id", existing.project_id)
        .order("sort_order", { ascending: true })
        .limit(1);

      await supabase
        .from("projects")
        .update({
          cover_image: next?.[0]?.image_url ?? "",
          cover_alt: next?.[0]?.alt ?? "",
        })
        .eq("id", existing.project_id);
    }
  }

  // Best-effort: strip the storage object too (ignore failures — the row is gone).
  const path = storagePathFromUrl(existing?.image_url as string | undefined, "projects");
  if (path) {
    await supabase.storage.from("projects").remove([path]);
  }

  revalidateProjects();
  return { success: true };
}

/** Extract the object path within a bucket from a Supabase public URL. */
function storagePathFromUrl(url: string | undefined, bucket: string): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

export async function reorderProjectImages(orderedIds: string[]) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const updates = orderedIds.map((id, index) =>
    supabase.from("project_images").update({ sort_order: index }).eq("id", id),
  );

  await Promise.all(updates);
  revalidateProjects();
  return { success: true };
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

/**
 * Upload one image to the `projects` bucket under `folder`, converting to WebP.
 * Used by the gallery uploader.
 */
async function uploadProjectFile(formData: FormData, folder: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided" };

  // Validate
  if (file.size > 10 * 1024 * 1024) return { error: "Max file size is 10 MB" };
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Unsupported image format" };
  }

  let converted;
  try {
    converted = await convertToWebp(file);
  } catch {
    return { error: "Failed to process image" };
  }

  const fileName = `${crypto.randomUUID()}.webp`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from("projects")
    .upload(filePath, converted.buffer, {
      contentType: converted.contentType,
      upsert: false,
    });

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage.from("projects").getPublicUrl(filePath);

  return { success: true, url: urlData.publicUrl, path: filePath };
}

/**
 * Upload a gallery image for a project: convert to WebP, store it, and insert
 * a project_images row. Returns the created image row so the UI can render it.
 */
export async function uploadProjectImage(projectId: string, formData: FormData) {
  const uploaded = await uploadProjectFile(formData, `gallery/${projectId}`);
  if (uploaded.error || !uploaded.url) return { error: uploaded.error ?? "Upload failed" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  // Next sort order
  const { data: existing } = await supabase
    .from("project_images")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing?.[0] ? (existing[0].sort_order as number) + 1 : 0;

  const { data: row, error } = await supabase
    .from("project_images")
    .insert({
      project_id: projectId,
      image_url: uploaded.url,
      alt: "",
      caption: null,
      sort_order: nextOrder,
    })
    .select("*")
    .single();

  if (error) return { error: error.message };

  // First image of a project with no cover yet becomes the cover automatically.
  const { data: proj } = await supabase
    .from("projects")
    .select("cover_image")
    .eq("id", projectId)
    .single();

  if (proj && !proj.cover_image) {
    await supabase
      .from("projects")
      .update({ cover_image: uploaded.url, cover_alt: "" })
      .eq("id", projectId);
  }

  revalidateProjects();
  return { success: true, image: row as ProjectImage };
}

/** Update alt/caption on a gallery image. Keeps cover_alt in sync when this is the cover. */
export async function updateProjectImage(
  imageId: string,
  fields: { alt?: string; caption?: string | null },
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { data: img } = await supabase
    .from("project_images")
    .select("project_id, image_url")
    .eq("id", imageId)
    .single();

  const { error } = await supabase
    .from("project_images")
    .update(fields)
    .eq("id", imageId);

  if (error) return { error: error.message };

  // If this image is the project cover and its alt changed, mirror it to cover_alt.
  if (img && fields.alt !== undefined) {
    await supabase
      .from("projects")
      .update({ cover_alt: fields.alt })
      .eq("id", img.project_id)
      .eq("cover_image", img.image_url);
  }

  revalidateProjects();
  return { success: true };
}

/** Mark a gallery image as the project cover/thumbnail. */
export async function setProjectCover(imageId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { data: img, error: fetchError } = await supabase
    .from("project_images")
    .select("project_id, image_url, alt")
    .eq("id", imageId)
    .single();

  if (fetchError || !img) return { error: "Image not found" };

  const { error } = await supabase
    .from("projects")
    .update({ cover_image: img.image_url, cover_alt: img.alt ?? "" })
    .eq("id", img.project_id);

  if (error) return { error: error.message };

  revalidateProjects();
  return { success: true, coverUrl: img.image_url as string };
}
