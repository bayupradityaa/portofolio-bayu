import { z } from "zod";

export const experienceSchema = z.object({
  period: z.string().trim().min(1, "Period is required").max(100),
  title: z.string().trim().min(1, "Title is required").max(200),
  org: z.string().trim().min(1, "Organization is required").max(200),
  description: z.string().trim().max(2000).default(""),
  employment_type: z.string().trim().max(100).nullable().default(null),
  location: z.string().trim().max(200).nullable().default(null),
  website: z.string().trim().url("Must be a valid URL").nullable().default(null).or(z.literal("")),
  logo: z.string().trim().nullable().default(null),
  tags: z.array(z.string().trim()).default([]),
  sort_order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
