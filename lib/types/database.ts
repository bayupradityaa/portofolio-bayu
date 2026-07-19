// ============================================================================
// Database Types — Single source of truth for all Supabase table types
// ============================================================================

/** project_status enum */
export type ProjectStatus = "Live" | "Local Development" | "Coming Soon";

// ---------------------------------------------------------------------------
// Profile Settings
// ---------------------------------------------------------------------------
export type ProfileSettings = {
  id: string;
  name: string;
  headline: string;
  subtitle: string;
  about: string[];
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  resume_url: string | null;
  cv_url: string | null;
  avatar_url: string | null;
  location: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  og_image: string | null;
  site_url: string;
  updated_at: string;
};

export type ProfileSettingsUpdate = Partial<Omit<ProfileSettings, "id" | "updated_at">>;

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export type Project = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  year: number;
  role: string;
  status: ProjectStatus;
  category: string | null;
  live_url: string | null;
  repo_url: string | null;
  live_url_label: string | null;
  cover_image: string;
  cover_alt: string;
  featured: boolean;
  published: boolean;
  is_open_source: boolean;
  is_personal: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<Omit<Project, "id" | "created_at" | "updated_at">>;

/** Project with all relational data loaded */
export type ProjectWithRelations = Project & {
  technologies: Technology[];
  highlights: ProjectHighlight[];
  images: ProjectImage[];
};

// ---------------------------------------------------------------------------
// Technologies
// ---------------------------------------------------------------------------
export type Technology = {
  id: string;
  name: string;
  icon: string | null;
  category: string;
  website: string | null;
  sort_order: number;
  published: boolean;
};

export type TechnologyInsert = Omit<Technology, "id">;
export type TechnologyUpdate = Partial<Omit<Technology, "id">>;

// ---------------------------------------------------------------------------
// Project Technologies (Junction)
// ---------------------------------------------------------------------------
export type ProjectTechnology = {
  project_id: string;
  technology_id: string;
  sort_order: number;
};

// ---------------------------------------------------------------------------
// Project Highlights
// ---------------------------------------------------------------------------
export type ProjectHighlight = {
  id: string;
  project_id: string;
  text: string;
  sort_order: number;
};

export type ProjectHighlightInsert = Omit<ProjectHighlight, "id">;

// ---------------------------------------------------------------------------
// Project Images
// ---------------------------------------------------------------------------
export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  alt: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type ProjectImageInsert = Omit<ProjectImage, "id" | "created_at">;

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
export type Experience = {
  id: string;
  period: string;
  title: string;
  org: string;
  description: string;
  employment_type: string | null;
  location: string | null;
  website: string | null;
  logo: string | null;
  tags: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ExperienceInsert = Omit<Experience, "id" | "created_at" | "updated_at">;
export type ExperienceUpdate = Partial<Omit<Experience, "id" | "created_at" | "updated_at">>;

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_year: number;
  end_year: number | null;
  description: string | null;
  gpa: string | null;
  activities: string[] | null;
  logo: string | null;
  website: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type EducationInsert = Omit<Education, "id" | "created_at" | "updated_at">;
export type EducationUpdate = Partial<Omit<Education, "id" | "created_at" | "updated_at">>;

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------
export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  credential_id: string | null;
  credential_url: string | null;
  image: string | null;
  issuer_logo: string | null;
  issue_date: string | null;
  expire_date: string | null;
  skills: string[] | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type CertificateInsert = Omit<Certificate, "id" | "created_at" | "updated_at">;
export type CertificateUpdate = Partial<Omit<Certificate, "id" | "created_at" | "updated_at">>;

// ---------------------------------------------------------------------------
// Contact Messages
// ---------------------------------------------------------------------------
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  replied: boolean;
  ip_hash: string | null;
  country: string | null;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------
export type AnalyticsEvent = {
  id: string;
  event: string;
  metadata: Record<string, unknown> | null;
  ip_hash: string | null;
  country: string | null;
  created_at: string;
};

export type AnalyticsEventInsert = Omit<AnalyticsEvent, "id" | "created_at">;

/** Supported analytics event types */
export type AnalyticsEventType =
  | "page_view"
  | "contact_click"
  | "resume_download"
  | "github_click"
  | "project_click";
