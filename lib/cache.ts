import { revalidateTag } from "next/cache";

/** Cache tag constants used by unstable_cache and revalidateTag */
export const CACHE_TAGS = {
  PROJECTS: "projects",
  TECHNOLOGIES: "technologies",
  EXPERIENCE: "experience",
  EDUCATION: "education",
  CERTIFICATES: "certificates",
  SETTINGS: "settings",
  MESSAGES: "messages",
  ANALYTICS: "analytics",
} as const;

/** Revalidation helpers — call after admin mutations */
export function revalidateProjects() {
  revalidateTag(CACHE_TAGS.PROJECTS, "max");
}

export function revalidateTechnologies() {
  revalidateTag(CACHE_TAGS.TECHNOLOGIES, "max");
}

export function revalidateExperience() {
  revalidateTag(CACHE_TAGS.EXPERIENCE, "max");
}

export function revalidateEducation() {
  revalidateTag(CACHE_TAGS.EDUCATION, "max");
}

export function revalidateCertificates() {
  revalidateTag(CACHE_TAGS.CERTIFICATES, "max");
}

export function revalidateSettings() {
  revalidateTag(CACHE_TAGS.SETTINGS, "max");
}

export function revalidateMessages() {
  revalidateTag(CACHE_TAGS.MESSAGES, "max");
}
