export type Stat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

export type TechItem = {
  name: string;
  note: string;
};

export type TechGroup = {
  id: string;
  title: string;
  description: string;
  items: TechItem[];
  capability: string;
  /** Grid span hint for the bento layout. */
  span: "sm" | "lg";
  accent?: boolean;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  role: string;
  summary: string;
  stack: string[];
  highlights: string[];
  repoUrl?: string;
  liveUrl?: string;
  /** Path under /public, or a picsum seed URL as a labelled placeholder. */
  cover: string;
  featured?: boolean;
};

export type TimelineEntry = {
  period: string;
  title: string;
  org: string;
  description: string;
  tags: string[];
};

export type Certificate = {
  title: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
};

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};
