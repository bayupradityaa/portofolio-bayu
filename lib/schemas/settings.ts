import { z } from "zod";

export const settingsSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  headline: z.string().trim().max(300).default(""),
  subtitle: z.string().trim().max(500).default(""),
  about: z.array(z.string().trim()).default([]),
  email: z.string().trim().email("Must be a valid email").max(200),
  github: z.string().trim().url("Must be a valid URL").or(z.literal("")).default(""),
  linkedin: z.string().trim().url("Must be a valid URL").or(z.literal("")).default(""),
  instagram: z.string().trim().url("Must be a valid URL").or(z.literal("")).default(""),
  resume_url: z.string().trim().nullable().default(null),
  cv_url: z.string().trim().nullable().default(null),
  avatar_url: z.string().trim().nullable().default(null),
  location: z.string().trim().max(200).default(""),
  seo_title: z.string().trim().max(200).default(""),
  seo_description: z.string().trim().max(500).default(""),
  seo_keywords: z.array(z.string().trim()).default([]),
  og_image: z.string().trim().nullable().default(null),
  site_url: z.string().trim().url("Must be a valid URL").or(z.literal("")).default(""),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
