import type { SocialLink, Stat } from "./types";

/**
 * PLACEHOLDER CONTENT — swap the copy below for Bayu's real details.
 * Everything here is safe to edit; nothing else depends on the exact strings.
 */
export const profile = {
  name: "Bayu Praditya",
  firstName: "Bayu",
  role: "Full Stack Software Engineer",
  focus: ["AI", "Backend Engineering", "Modern Frontend"],
  location: "Bogor, Indonesia",
  githubUser: "bayupradityaa",
  email: "bayuupraditya@gmail.com",
  resumeUrl: "/resume.pdf",
  // One-liner for the hero. <= 20 words, reads in a glance.
  intro:
    "Informatics student building AI-driven, backend-solid, front-of-mind web products. I care about how software feels, not just what it does.",
  // Longer bio for the About section (kept to a comfortable reading width).
  bio: [
    "I am an Informatics student and full stack engineer in the making, most at home where product thinking meets systems work. My days move between training small models, shaping resilient APIs, and pushing pixels until an interface feels inevitable.",
    "What drives me is craft: the difference between a feature that works and one that feels considered. I build in public, learn in the open, and treat every project as a chance to raise my own bar.",
  ],
};

export const stats: Stat[] = [
  { label: "Projects shipped", value: 18, suffix: "+" },
  { label: "Public repositories", value: 42, suffix: "" },
  { label: "Technologies in rotation", value: 25, suffix: "+" },
  { label: "Coffee-fueled commits", value: 1400, suffix: "+" },
];

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/bayupradityaa", handle: "@bayupradityaa" },
  { label: "LinkedIn", href: "https://linkedin.com", handle: "LinkedIn" },
  { label: "Instagram", href: "https://www.instagram.com/bayuupradityaa", handle: "@bayuupradityaa" },
  { label: "Email", href: "mailto:bayuupraditya@gmail.com", handle: "bayuupraditya@gmail.com" },
];
