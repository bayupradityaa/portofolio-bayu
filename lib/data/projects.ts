import type { Project } from "./types";

/**
 * PLACEHOLDER CONTENT — replace with real projects.
 * `cover` uses picsum seeds as labelled placeholders. Swap for real screenshots
 * in /public/projects/<slug>.webp when you have them.
 */
export const projects: Project[] = [
  {
    slug: "atlas-ai",
    name: "Atlas",
    tagline: "Semantic search for your own documents",
    year: "2025",
    role: "Solo engineer",
    summary:
      "A retrieval layer that turns a messy folder of PDFs and notes into an answerable knowledge base. Embeddings run on device where possible, with a streaming answer UI that cites its sources.",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "pgvector", "PyTorch"],
    highlights: [
      "Sub-300ms retrieval across 40k chunks",
      "Source-cited streaming answers",
      "On-device embedding fallback",
    ],
    repoUrl: "https://github.com/bayupraditya/atlas",
    liveUrl: "https://atlas.demo.dev",
    cover: "https://picsum.photos/seed/atlas-ai-search-dark/1280/800",
    featured: true,
  },
  {
    slug: "relay-api",
    name: "Relay",
    tagline: "A typed gateway for background jobs",
    year: "2024",
    role: "Backend lead",
    summary:
      "A queue and scheduling service with a fully typed client. Relay handles retries, dead-letter routing, and observability so product teams stop hand-rolling cron jobs.",
    stack: ["Node.js", "TypeScript", "Redis", "PostgreSQL", "Docker"],
    highlights: [
      "Exactly-once delivery semantics",
      "Typed SDK generated from schema",
      "Built-in retry and DLQ dashboards",
    ],
    repoUrl: "https://github.com/bayupraditya/relay",
    cover: "https://picsum.photos/seed/relay-queue-infra/1280/800",
    featured: true,
  },
  {
    slug: "canvas-folio",
    name: "Canvas",
    tagline: "Scroll-driven portfolio engine",
    year: "2024",
    role: "Design engineer",
    summary:
      "A reusable engine for cinematic, scroll-scrubbed portfolios. Image-sequence rendering on canvas, Lenis smooth scroll, and a motion system that respects reduced-motion by default.",
    stack: ["Next.js", "GSAP", "Lenis", "Canvas API"],
    highlights: [
      "60fps image-sequence scrubbing",
      "Reduced-motion static fallback",
      "Lighthouse 98 on mobile",
    ],
    repoUrl: "https://github.com/bayupraditya/canvas",
    liveUrl: "https://canvas.demo.dev",
    cover: "https://picsum.photos/seed/canvas-scroll-portfolio/1280/800",
    featured: true,
  },
];
