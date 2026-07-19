import { z } from "zod";

export const certificateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  issuer: z.string().trim().min(1, "Issuer is required").max(200),
  credential_id: z.string().trim().max(200).nullable().default(null),
  credential_url: z.string().trim().url("Must be a valid URL").nullable().default(null).or(z.literal("")),
  image: z.string().trim().nullable().default(null),
  issuer_logo: z.string().trim().nullable().default(null),
  issue_date: z.string().nullable().default(null),
  expire_date: z.string().nullable().default(null),
  skills: z.array(z.string().trim()).nullable().default(null),
  sort_order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;
