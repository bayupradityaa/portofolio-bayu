"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { convertToWebp, ACCEPTED_IMAGE_TYPES } from "@/lib/image";

type StorageBucket = "avatars" | "projects" | "certificates" | "documents" | "media";

/** Buckets that hold images — uploads here are auto-converted to WebP. */
const IMAGE_BUCKETS: StorageBucket[] = ["avatars", "projects", "certificates", "media"];

/** Upload a file to a Supabase Storage bucket. Images are converted to WebP. */
export async function uploadFile(bucket: StorageBucket, formData: FormData, folder?: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided" };

  // Validate size (10MB general limit)
  if (file.size > 10 * 1024 * 1024) return { error: "Max file size is 10 MB" };

  const isImage = file.type.startsWith("image/");
  const treatAsImage = IMAGE_BUCKETS.includes(bucket) && isImage;

  let body: File | Buffer = file;
  let contentType = file.type;
  let ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";

  if (treatAsImage) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return { error: "Unsupported image format" };
    }
    try {
      const converted = await convertToWebp(file);
      body = converted.buffer;
      contentType = converted.contentType;
      ext = "webp";
    } catch {
      return { error: "Failed to process image" };
    }
  }

  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, body, { contentType, upsert: false });

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return { success: true, url: urlData.publicUrl, path: filePath };
}

/** Delete a file from a Supabase Storage bucket */
export async function deleteFile(bucket: StorageBucket, path: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { error: error.message };

  return { success: true };
}

type MediaItem = {
  name: string;
  bucket: string;
  path: string;
  url: string;
  size: number;
  created_at: string;
  content_type: string;
};

/** List all files in a specific bucket/folder */
export async function listFiles(
  bucket: StorageBucket,
  folder?: string,
): Promise<MediaItem[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase.storage.from(bucket).list(folder ?? "", {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error || !data) return [];

  return data
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => {
      const filePath = folder ? `${folder}/${f.name}` : f.name;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return {
        name: f.name,
        bucket,
        path: filePath,
        url: urlData.publicUrl,
        size: (f.metadata as Record<string, unknown>)?.size as number ?? 0,
        created_at: f.created_at ?? "",
        content_type: (f.metadata as Record<string, unknown>)?.mimetype as string ?? "",
      };
    });
}

/** Get all media from all buckets */
export async function getAllMedia(): Promise<MediaItem[]> {
  const buckets: StorageBucket[] = ["avatars", "projects", "certificates", "documents", "media"];
  const results = await Promise.all(buckets.map((b) => listFiles(b)));
  return results.flat().sort((a, b) => b.created_at.localeCompare(a.created_at));
}
