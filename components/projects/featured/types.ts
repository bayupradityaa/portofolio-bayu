import type { ProjectStatus } from "@/lib/types/database";

/**
 * Serializable, view-ready shape consumed by the client showcase.
 * Kept intentionally flat so the Server Component can pass it across the
 * boundary without leaking Supabase relation objects into the client bundle.
 */
export type FeaturedProject = {
  slug: string;
  index: string; // pre-formatted "01", "02", … for the pinned counter
  name: string;
  tagline: string;
  category: string; // uppercase label, e.g. "WEB APPLICATION"
  summary: string;
  status: ProjectStatus;
  coverImage: string | null;
  coverAlt: string;
  liveUrl: string | null;
  liveUrlLabel: string | null;
  repoUrl: string | null;
  technologies: string[];
  highlights: string[];
  /** Optional headline stats rendered under the description. */
  stats: { label: string; value: string }[];
};
