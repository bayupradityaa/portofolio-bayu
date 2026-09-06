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
    revalidateTag(CACHE_TAGS.PROJECTS, { expire: 0 });
  } catch {}
  try {
    revalidatePath("/", "layout");
    revalidatePath("/projects", "layout");
    revalidatePath("/dev/projects", "layout");
    revalidatePath("/sitemap.xml");
  } catch {}
}

export function revalidateTechnologies() {
  try {
    revalidateTag(CACHE_TAGS.TECHNOLOGIES, { expire: 0 });
  } catch {}
  try {
    revalidatePath("/", "layout");
    revalidatePath("/projects", "layout");
    revalidatePath("/dev/technologies", "layout");
  } catch {}
}

export function revalidateExperience() {
  try {
    revalidateTag(CACHE_TAGS.EXPERIENCE, { expire: 0 });
  } catch {}
  try {
    revalidatePath("/", "layout");
    revalidatePath("/dev/experience", "layout");
  } catch {}
}

export function revalidateEducation() {
  try {
    revalidateTag(CACHE_TAGS.EDUCATION, { expire: 0 });
  } catch {}
  try {
    revalidatePath("/", "layout");
    revalidatePath("/dev/education", "layout");
  } catch {}
}

export function revalidateCertificates() {
  try {
    revalidateTag(CACHE_TAGS.CERTIFICATES, { expire: 0 });
  } catch {}
  try {
    revalidatePath("/", "layout");
    revalidatePath("/dev/certificates", "layout");
  } catch {}
}

export function revalidateSettings() {
  try {
    revalidateTag(CACHE_TAGS.SETTINGS, { expire: 0 });
  } catch {}
  try {
    revalidatePath("/", "layout");
    revalidatePath("/projects", "layout");
    revalidatePath("/dev/settings", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/robots.txt");
  } catch {}
}

export function revalidateMessages() {
  try {
    revalidateTag(CACHE_TAGS.MESSAGES, { expire: 0 });
  } catch {}
  try {
    revalidatePath("/dev", "layout");
    revalidatePath("/dev/messages", "layout");
  } catch {}
}
