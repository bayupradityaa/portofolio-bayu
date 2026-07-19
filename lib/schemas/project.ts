import { z } from "zod";

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
  name: z.string().trim().min(1, "Name is required").max(200),
  tagline: z.string().trim().max(300),
  summary: z.string().trim().max(5000),
  year: z.number().int().min(2000).max(2099),
  role: z.string().trim().max(200),
  status: z.enum(["Live", "Local Development", "Coming Soon"]),
  category: z.string().trim().max(100).nullable(),
  live_url: z.string().trim().url("Must be a valid URL").nullable().or(z.literal("")),
  repo_url: z.string().trim().url("Must be a valid URL").nullable().or(z.literal("")),
  live_url_label: z.string().trim().max(100).nullable(),
  cover_image: z.string().trim(),
  cover_alt: z.string().trim().max(300),
  featured: z.boolean(),
  published: z.boolean(),
  is_open_source: z.boolean(),
  is_personal: z.boolean(),
  sort_order: z.number().int().min(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

/** Validate cover image upload */
export const coverUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 5 * 1024 * 1024, "Max file size is 5 MB")
    .refine(
      (f) => ["image/png", "image/jpeg", "image/webp"].includes(f.type),
      "Only PNG, JPG, and WEBP are allowed",
    ),
  alt: z.string().trim().max(300).default(""),
});
