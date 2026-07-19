import { z } from "zod";

export const technologySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  icon: z.string().trim().max(100).nullable().default(null),
  category: z.string().trim().min(1, "Category is required").max(100),
  website: z.string().trim().url("Must be a valid URL").nullable().default(null).or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export type TechnologyFormValues = z.infer<typeof technologySchema>;
