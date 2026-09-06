import { revalidateTag, revalidatePath } from "next/cache";

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
  try {
    revalidateTag(CACHE_TAGS.PROJECTS, "max");
  } catch {}
  try {
    revalidatePath("/", "page");
    revalidatePath("/projects", "page");
    revalidatePath("/projects/[slug]", "page");
    revalidatePath("/dev/projects", "page");
    revalidatePath("/sitemap.xml");
  } catch {}
}

export function revalidateTechnologies() {
  try {
    revalidateTag(CACHE_TAGS.TECHNOLOGIES, "max");
  } catch {}
  try {
    revalidatePath("/", "page");
    revalidatePath("/projects", "page");
    revalidatePath("/dev/technologies", "page");
  } catch {}
}

export function revalidateExperience() {
  try {
    revalidateTag(CACHE_TAGS.EXPERIENCE, "max");
  } catch {}
  try {
    revalidatePath("/", "page");
    revalidatePath("/dev/experience", "page");
  } catch {}
}

export function revalidateEducation() {
  try {
    revalidateTag(CACHE_TAGS.EDUCATION, "max");
  } catch {}
  try {
    revalidatePath("/", "page");
    revalidatePath("/dev/education", "page");
  } catch {}
}

export function revalidateCertificates() {
  try {
    revalidateTag(CACHE_TAGS.CERTIFICATES, "max");
  } catch {}
  try {
    revalidatePath("/", "page");
    revalidatePath("/dev/certificates", "page");
  } catch {}
}

export function revalidateSettings() {
  try {
    revalidateTag(CACHE_TAGS.SETTINGS, "max");
  } catch {}
  try {
    revalidatePath("/", "layout");
    revalidatePath("/", "page");
    revalidatePath("/projects", "page");
    revalidatePath("/dev/settings", "page");
    revalidatePath("/sitemap.xml");
    revalidatePath("/robots.txt");
  } catch {}
}

export function revalidateMessages() {
  try {
    revalidateTag(CACHE_TAGS.MESSAGES, "max");
  } catch {}
  try {
    revalidatePath("/dev", "page");
    revalidatePath("/dev/messages", "page");
  } catch {}
}
