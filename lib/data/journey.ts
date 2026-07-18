import type { Certificate, TimelineEntry } from "./types";

/**
 * PLACEHOLDER CONTENT — a timeline is genuinely ordered, so it reads top to bottom.
 */
export const timeline: TimelineEntry[] = [
  {
    period: "2025 — now",
    title: "Building in public",
    org: "Independent",
    description:
      "Shipping AI and backend side-projects in the open, writing about the decisions behind them, and turning feedback into the next iteration.",
    tags: ["AI", "Open source", "Writing"],
  },
  {
    period: "2024",
    title: "Full stack projects",
    org: "University coursework and freelance",
    description:
      "Took products end to end: schema design, typed APIs, and front-ends with real motion. Learned that the last 10% of polish is where trust is won.",
    tags: ["Next.js", "PostgreSQL", "TypeScript"],
  },
  {
    period: "2023",
    title: "Foundations in engineering",
    org: "Informatics program",
    description:
      "Data structures, algorithms, and systems thinking. Started treating side-projects as a lab for everything the syllabus could not cover.",
    tags: ["Algorithms", "Systems", "C++"],
  },
  {
    period: "2022",
    title: "First lines of code",
    org: "Self-taught",
    description:
      "Fell for the loop of write, run, break, fix. Built small tools for problems I actually had, and never really stopped.",
    tags: ["Python", "Curiosity"],
  },
];

export const certificates: Certificate[] = [
  {
    title: "Machine Learning Specialization",
    issuer: "DeepLearning.AI",
    year: "2025",
    credentialUrl: "https://coursera.org/verify/example",
  },
  {
    title: "Backend Development & APIs",
    issuer: "Meta",
    year: "2024",
    credentialUrl: "https://coursera.org/verify/example",
  },
  {
    title: "Full Stack Web Development",
    issuer: "The Odin Project",
    year: "2024",
  },
  {
    title: "Cloud Fundamentals",
    issuer: "Google Cloud",
    year: "2023",
    credentialUrl: "https://cloudskillsboost.google/verify/example",
  },
  {
    title: "Data Structures & Algorithms",
    issuer: "Coursera",
    year: "2023",
  },
  {
    title: "TypeScript Deep Dive",
    issuer: "Frontend Masters",
    year: "2024",
  },
];
