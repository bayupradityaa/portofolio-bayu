import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "That name is a little too long"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(10, "A few more words would help")
    .max(2000, "Keep it under 2000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
