import { z } from "zod";

export const educationSchema = z.object({
  institution: z.string().trim().min(1, "Institution is required").max(300),
  degree: z.string().trim().min(1, "Degree is required").max(200),
  field: z.string().trim().min(1, "Field is required").max(200),
  start_year: z.coerce.number().int().min(1990).max(2099),
  end_year: z.coerce.number().int().min(1990).max(2099).nullable().default(null),
  description: z.string().trim().max(2000).nullable().default(null),
  gpa: z.string().trim().max(20).nullable().default(null),
  activities: z.array(z.string().trim()).nullable().default(null),
  logo: z.string().trim().nullable().default(null),
  website: z.string().trim().url("Must be a valid URL").nullable().default(null).or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export type EducationFormValues = z.infer<typeof educationSchema>;
