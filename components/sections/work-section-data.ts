import type { WorkItem } from "./work-section";

/**
 * Sample case study dataset for {@link WorkSection}.
 *
 * Each project entry includes metadata consumed by the TRIONN-style pinned
 * horizontal scroll section.
 */
export const workSectionData: WorkItem[] = [
  {
    index: "01",
    title: "Pulse Studio",
    category: "Motion & Brand Experience",
    year: "2025",
    description:
      "A motion-led studio website showcasing artists, projects, and culture in cinematic scroll.",
    image: "/works/pulse-studio.svg",
    link: "/work/pulse-studio",
  },
  {
    index: "02",
    title: "Loftloom",
    category: "Real Estate & Web Platform",
    year: "2025",
    description:
      "Seamless real estate platform for effortless property discovery and immersive listings.",
    image: "/works/loftloom.svg",
    link: "/work/loftloom",
  },
  {
    index: "03",
    title: "E-Commerce Rebuild",
    category: "Headless Storefront",
    year: "2024",
    description:
      "Headless storefront built on Next.js with a 92 Lighthouse mobile score and 38% conversion lift.",
    image: "/works/ecommerce.svg",
    link: "/work/ecommerce",
  },
  {
    index: "04",
    title: "AI Quote Engine",
    category: "AI & Internal Tooling",
    year: "2024",
    description:
      "Internal tooling that drafts pricing quotes from a short brief — days of work, minutes of waiting.",
    image: "/works/ai-quote.svg",
    link: "/work/ai-quote",
  },
  {
    index: "05",
    title: "Design System",
    category: "Figma & React Library",
    year: "2024",
    description:
      "Figma + React component library shared across four product squads, CI-tested and themable.",
    image: "/works/design-system.svg",
    link: "/work/design-system",
  },
  {
    index: "06",
    title: "Realtime Dashboard",
    category: "Data Vis & Infrastructure",
    year: "2023",
    description:
      "Operator dashboard for live infrastructure events with sub-100ms feed and offline-first sync.",
    image: "/works/realtime-dashboard.svg",
    link: "/work/realtime-dashboard",
  },
];
