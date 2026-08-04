"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollFloat } from "@/components/motion/scroll-float";
import { SectionRule } from "@/components/ui/section-rule";
import { Marquee } from "@/components/ui/marquee";

// Import custom monochrome brand SVG icons
import {
  ReactIcon,
  NextdotjsIcon,
  TypescriptIcon,
  TailwindcssIcon,
  GsapIcon,
  FramermotionIcon,
  GoIcon,
  NodedotjsIcon,
  PythonIcon,
  FlaskIcon,
  DockerIcon,
  GithubIcon,
  GithubactionsIcon,
  CloudflareIcon,
  FirebaseIcon,
  SupabaseIcon,
  MysqlIcon,
  PostgresqlIcon,
  PostmanIcon,
  VisualstudiocodeIcon,
  FigmaIcon,
  GitIcon,
  ExpressIcon,
  GoogleappsscriptIcon,
  GooglesheetsIcon,
  GooglecloudIcon,
  MongodbIcon,
  LaravelIcon,
  AstroIcon,
  StreamlitIcon,
  ThreejsIcon,
  DjangoIcon,
  TensorflowIcon,
  VuejsIcon,
  CypressIcon,
  FastifyIcon,
  JupyternotebookIcon,
  NuxtjsIcon,
  TechIcon,
} from "@/components/ui/tech-icons";

// Custom local SVG icons for Lenis, Fiber, and REST API to maintain monochrome consistent style
function LenisIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 12c3-4 6-4 9 0s6 4 9 0s3-4 4-2" />
    </svg>
  );
}

function FiberIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function RestApiIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="6" height="6" rx="1" />
      <rect x="16" y="2" width="6" height="6" rx="1" />
      <rect x="9" y="16" width="6" height="6" rx="1" />
      <path d="M5 8v4a2 2 0 002 2h2m0 0V9m0 5h7a2 2 0 002-2V8" />
    </svg>
  );
}

// Map of marquee brand name to brand icon component
const logoIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  React: ReactIcon,
  "Next.js": NextdotjsIcon,
  TypeScript: TypescriptIcon,
  "Tailwind CSS": TailwindcssIcon,
  GSAP: GsapIcon,
  "Framer Motion": FramermotionIcon,
  Lenis: LenisIcon,
  Go: GoIcon,
  Fiber: FiberIcon,
  "Node.js": NodedotjsIcon,
  Express: ExpressIcon,
  "REST API": RestApiIcon,
  Python: PythonIcon,
  Flask: FlaskIcon,
  "Apps Script": GoogleappsscriptIcon,
  "Google Apps Script": GoogleappsscriptIcon,
  Spreadsheet: GooglesheetsIcon,
  "Google Sheets": GooglesheetsIcon,
  PostgreSQL: PostgresqlIcon,
  MySQL: MysqlIcon,
  MongoDB: MongodbIcon,
  mongoDB: MongodbIcon,
  mongodb: MongodbIcon,
  Laravel: LaravelIcon,
  laravel: LaravelIcon,
  Astro: AstroIcon,
  astro: AstroIcon,
  Streamlit: StreamlitIcon,
  streamlit: StreamlitIcon,
  "Three.js": ThreejsIcon,
  Threejs: ThreejsIcon,
  threejs: ThreejsIcon,
  Django: DjangoIcon,
  django: DjangoIcon,
  TensorFlow: TensorflowIcon,
  tensorflow: TensorflowIcon,
  "Vue.js": VuejsIcon,
  Vue: VuejsIcon,
  vue: VuejsIcon,
  Cypress: CypressIcon,
  cypress: CypressIcon,
  Fastify: FastifyIcon,
  fastify: FastifyIcon,
  "Jupyter Notebook": JupyternotebookIcon,
  Jupyter: JupyternotebookIcon,
  jupyter: JupyternotebookIcon,
  "Nuxt.js": NuxtjsIcon,
  Nuxt: NuxtjsIcon,
  nuxt: NuxtjsIcon,
  Firebase: FirebaseIcon,
  Supabase: SupabaseIcon,
  "Google Cloud": GooglecloudIcon,
  GCP: GooglecloudIcon,
  Cloudflare: CloudflareIcon,
  Docker: DockerIcon,
  Git: GitIcon,
  GitHub: GithubIcon,
  "GitHub Actions": GithubactionsIcon,
  Postman: PostmanIcon,
  Figma: FigmaIcon,
};

// Custom brand-specific tooltips for the marquee
const logoTooltips: Record<string, string> = {
  React: "Interactive UI Library",
  "Next.js": "Modern React Web Framework",
  TypeScript: "Type-safe development",
  "Tailwind CSS": "Utility-first CSS styling",
  GSAP: "High-performance web animation",
  "Framer Motion": "Declarative UI transitions",
  Lenis: "Smooth scroll orchestration",
  Go: "High-performance backend",
  Fiber: "Fast web framework for Go",
  "Node.js": "JavaScript server runtime",
  Express: "Minimalist Node.js APIs",
  "REST API": "API architectural standards",
  Python: "Machine learning & scripting",
  Flask: "Micro web framework for Python",
  "Apps Script": "Workflow & Google Workspace automation",
  "Google Apps Script": "Workflow & Google Workspace automation",
  Spreadsheet: "Data management & structured reporting",
  "Google Sheets": "Data management & structured reporting",
  PostgreSQL: "Advanced SQL database",
  MySQL: "Relational SQL storage",
  MongoDB: "Document-based NoSQL database",
  mongoDB: "Document-based NoSQL database",
  mongodb: "Document-based NoSQL database",
  Laravel: "PHP web application framework",
  Astro: "All-in-one web framework for content-driven sites",
  Streamlit: "Turn Python scripts into interactive web apps",
  "Three.js": "3D WebGL JavaScript library",
  Django: "High-level Python web framework",
  TensorFlow: "Open-source machine learning platform",
  "Vue.js": "Progressive JavaScript framework",
  Cypress: "Next generation front-end testing tool",
  Fastify: "Fast and low overhead web framework for Node.js",
  "Jupyter Notebook": "Interactive computing environment",
  "Nuxt.js": "Intuitive Vue framework",
  Firebase: "Realtime backend & cloud platform",
  Supabase: "Open-source Firebase alternative",
  "Google Cloud": "Cloud infrastructure & enterprise services",
  GCP: "Cloud infrastructure & enterprise services",
  Cloudflare: "Global Edge Network",
  Docker: "Containerized deployment",
  Git: "Distributed version control",
  GitHub: "Code collaboration & hosting",
  "GitHub Actions": "CI/CD Automation",
  Postman: "API testing & debugging",
  "VS Code": "Extensible code workspace",
  Figma: "Vector design & prototyping",
};

export function TechStack({ technologies = [] }: { technologies?: string[] }) {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const handleTechClick = (name: string) => {
    setActiveTech((prev) => (prev === name ? null : name));
  };

  // Balanced 2-Row Layout Configuration
  const defaultRow1 = [
    "React", "Next.js", "Vue.js", "Nuxt.js", "Astro", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion", "Lenis",
    "Go", "Fiber", "Node.js", "Express", "Fastify", "REST API", "Python", "Django", "Flask", "Laravel", "Apps Script"
  ];
  const defaultRow2 = [
    "Spreadsheet", "Firebase", "Google Cloud", "PostgreSQL", "MySQL", "MongoDB", "Supabase", "Cloudflare", "Docker",
    "TensorFlow", "Jupyter Notebook", "Three.js", "Cypress", "Streamlit", "Git", "GitHub", "GitHub Actions", "Postman", "VS Code", "Figma"
  ];

  // Deduplicate and split technology list
  const uniqueTechs = Array.from(
    new Set(technologies.length > 0 ? technologies : [...defaultRow1, ...defaultRow2]),
  );
  const midPoint = Math.ceil(uniqueTechs.length / 2);

  const row1 = uniqueTechs.slice(0, midPoint);
  const row2 = uniqueTechs.slice(midPoint);

  return (
    <section id="stack" className="relative w-full bg-ch-stack text-foreground pt-28 pb-32 md:pt-40 md:pb-44 overflow-hidden">
      {/* Technical engineering grid texture */}
      <div className="grid-faint opacity-30 pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Centered Minimal Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto mb-16 md:mb-20 px-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          STACK
        </span>
        <ScrollFloat
          animationDuration={1.8}
          ease="back.out(1.5)"
          scrollStart="top bottom-=15%"
          scrollEnd="center center-=10%"
          stagger={0.04}
          containerClassName="mt-4 max-w-[700px]"
          textClassName="text-5xl md:text-7xl lg:text-[72px] font-semibold tracking-tight text-foreground leading-[1.1]"
        >
          Technology Ecosystem
        </ScrollFloat>
        <p className="mt-6 text-base leading-relaxed text-secondary md:text-lg max-w-145">
          The tools behind every product I build.<br />
          Chosen for performance, reliability, and great developer experience.
        </p>
      </div>

      {/* Technology Marquee Area */}
      <div className="relative z-10 w-full overflow-hidden">
        {/* Edge Fade Masks for Smooth Transitions */}
        <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-20 bg-linear-to-r from-ch-stack to-transparent md:w-36 lg:w-48" />
        <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-20 bg-linear-to-l from-ch-stack to-transparent md:w-36 lg:w-48" />

        <div className="flex flex-col gap-3 md:gap-4">
          {/* Row 1: moves left */}
          <MarqueeRow
            items={row1}
            direction="left"
            duration={65}
            activeTech={activeTech}
            onTechClick={handleTechClick}
          />

          {/* Row 2: moves right */}
          <MarqueeRow
            items={row2}
            direction="right"
            duration={55}
            activeTech={activeTech}
            onTechClick={handleTechClick}
          />
        </div>
      </div>

    </section>
  );
}

function MarqueeRow({
  items,
  direction,
  duration = 50,
  className,
  activeTech,
  onTechClick,
}: {
  items: string[];
  direction: "left" | "right";
  duration?: number;
  className?: string;
  activeTech: string | null;
  onTechClick: (name: string) => void;
}) {
  return (
    <Marquee
      direction={direction}
      speed={duration}
      pauseOnHover={true}
      className={className}
    >
      {items.map((logo, idx) => (
        <LogoPill
          key={`${logo}-${idx}`}
          name={logo}
          isActive={activeTech === logo}
          onClick={() => onTechClick(logo)}
        />
      ))}
    </Marquee>
  );
}

function LogoPill({
  name,
  isActive,
  onClick,
}: {
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const tooltipText = logoTooltips[name] || `${name} Technology`;

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "group relative flex items-center gap-3.5 px-5 py-3 rounded-2xl outline-none transition-all duration-300 ease-out transform-gpu will-change-transform cursor-pointer select-none",
        isActive
          ? "bg-accent/15 text-accent scale-[1.06] -translate-y-1 font-semibold shadow-lg shadow-accent/10"
          : "text-secondary hover:text-foreground hover:bg-foreground/5 hover:-translate-y-1 hover:scale-[1.04] active:scale-95 focus-visible:ring-2 focus-visible:ring-accent/50"
      )}
    >
      <TechIcon
        name={name}
        size={24}
        className={cn(
          "transition-colors duration-300 ease-out shrink-0",
          isActive
            ? "text-accent"
            : "text-secondary/70 group-hover:text-accent group-focus:text-accent"
        )}
      />
      <span
        className={cn(
          "font-jakarta text-sm font-semibold tracking-tight transition-colors duration-300 ease-out md:text-base",
          isActive
            ? "text-accent font-bold"
            : "text-secondary group-hover:text-foreground group-focus:text-foreground"
        )}
      >
        {name}
      </span>

      {/* Floating Tooltip */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 mb-3 w-48 -translate-x-1/2 rounded-xl border border-border bg-card/95 p-3 text-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 z-50 transform",
          isActive
            ? "opacity-100 translate-y-0 border-accent/40"
            : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0"
        )}
      >
        <div className="font-jakarta text-xs font-semibold text-foreground">{name}</div>
        <div className="mt-1 font-jakarta text-[11px] leading-relaxed text-muted">{tooltipText}</div>
        {/* Subtle arrow pointer */}
        <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-border bg-card" />
      </div>
    </div>
  );
}
