import type { TechGroup } from "./types";

/**
 * PLACEHOLDER CONTENT — the bento grid has exactly as many cells as groups here.
 * Add/remove groups freely; the layout adapts. Keep spans balanced (see section).
 */
export const techGroups: TechGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Interfaces that feel fast and read clean.",
    span: "lg",
    accent: true,
    items: [
      { name: "React", note: "component model" },
      { name: "Next.js", note: "app router, RSC" },
      { name: "TypeScript", note: "typed end to end" },
      { name: "Tailwind CSS", note: "design tokens" },
      { name: "GSAP", note: "scroll storytelling" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "APIs built to stay standing under load.",
    span: "md",
    items: [
      { name: "Node.js", note: "services" },
      { name: "Python", note: "FastAPI" },
      { name: "PostgreSQL", note: "relational core" },
      { name: "Supabase", note: "auth + data" },
    ],
  },
  {
    id: "ai",
    title: "AI & ML",
    blurb: "Models that earn their place in a product.",
    span: "md",
    items: [
      { name: "PyTorch", note: "training" },
      { name: "Transformers", note: "fine-tuning" },
      { name: "LangChain", note: "orchestration" },
    ],
  },
  {
    id: "infra",
    title: "Infra & Tooling",
    blurb: "Ship it, measure it, keep it healthy.",
    span: "sm",
    items: [
      { name: "Docker", note: "containers" },
      { name: "Vercel", note: "edge deploys" },
      { name: "Git", note: "flow" },
    ],
  },
  {
    id: "practice",
    title: "Practices",
    blurb: "The habits behind the code.",
    span: "sm",
    items: [
      { name: "Testing", note: "unit + e2e" },
      { name: "Accessibility", note: "WCAG AA" },
      { name: "Performance", note: "Core Web Vitals" },
    ],
  },
];
