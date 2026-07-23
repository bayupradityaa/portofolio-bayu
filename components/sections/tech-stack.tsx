"use client";

import React, { useState } from "react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { ScrollFloat } from "@/components/motion/scroll-float";

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
  PostgreSQL: PostgresqlIcon,
  MySQL: MysqlIcon,
  Firebase: FirebaseIcon,
  Supabase: SupabaseIcon,
  Cloudflare: CloudflareIcon,
  Docker: DockerIcon,
  Git: GitIcon,
  GitHub: GithubIcon,
  "GitHub Actions": GithubactionsIcon,
  Postman: PostmanIcon,
  "VS Code": VisualstudiocodeIcon,
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
  PostgreSQL: "Advanced SQL database",
  MySQL: "Relational SQL storage",
  Firebase: "Realtime backend platform",
  Supabase: "Open-source Firebase alternative",
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
    "React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion", "Lenis",
    "Go", "Fiber", "Node.js", "Express", "REST API", "Python", "Flask"
  ];
  const defaultRow2 = [
    "PostgreSQL", "MySQL", "Firebase", "Supabase", "Cloudflare", "Docker",
    "Git", "GitHub", "GitHub Actions", "Postman", "VS Code", "Figma"
  ];

  const row1 = technologies.length > 0 ? technologies.slice(0, Math.ceil(technologies.length / 2)) : defaultRow1;
  const row2 = technologies.length > 0 ? technologies.slice(Math.ceil(technologies.length / 2)) : defaultRow2;

  return (
    <Section id="stack" className="bg-background text-foreground pb-32 md:pb-44 lg:pb-56 overflow-hidden">
      {/* Centered Minimal Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 md:mb-20">
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
        <p className="mt-6 text-base leading-relaxed text-secondary md:text-lg max-w-[580px]">
          The tools behind every product I build.<br />
          Chosen for performance, reliability, and great developer experience.
        </p>
      </div>

      {/* Technology Marquee Area */}
      <div className="relative w-full overflow-hidden">
        {/* Edge Fade Masks for Smooth Transitions */}
        <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-20 bg-gradient-to-r from-background to-transparent md:w-36 lg:w-48" />
        <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-20 bg-gradient-to-l from-background to-transparent md:w-36 lg:w-48" />

        <div className="flex flex-col gap-6">
          {/* Row 1: moves left */}
          <MarqueeRow
            items={row1}
            direction="left"
            duration={38}
            activeTech={activeTech}
            onTechClick={handleTechClick}
          />

          {/* Row 2: moves right */}
          <MarqueeRow
            items={row2}
            direction="right"
            duration={32}
            activeTech={activeTech}
            onTechClick={handleTechClick}
          />
        </div>
      </div>
    </Section>
  );
}

function MarqueeRow({
  items,
  direction,
  duration = 35,
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
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className={cn("marquee-container overflow-hidden py-2 select-none", className)}>
      <div
        className={cn(
          "flex gap-4 w-max transform-gpu will-change-transform",
          animClass
        )}
        style={
          {
            "--marquee-duration": `${duration}s`,
          } as React.CSSProperties
        }
      >
        {/* Quadruple items to ensure 100% seamless infinite looping across all screen sizes */}
        {[...items, ...items, ...items, ...items].map((logo, idx) => (
          <LogoPill
            key={`${logo}-${idx}`}
            name={logo}
            isActive={activeTech === logo}
            onClick={() => onTechClick(logo)}
          />
        ))}
      </div>
    </div>
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
  const Icon = logoIcons[name];
  const tooltipText = logoTooltips[name];

  if (!Icon) return null;

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
        "group relative flex h-[52px] items-center gap-3 rounded-full border bg-card/90 px-6 py-3 outline-none shadow-sm transition-all duration-[300ms] ease-out transform-gpu will-change-transform cursor-pointer select-none",
        isActive
          ? "border-accent/60 bg-accent/10 text-accent shadow-[0_0_22px_rgba(34,197,94,0.25)] scale-[1.04] -translate-y-1"
          : "border-border text-secondary hover:-translate-y-1 hover:scale-[1.04] hover:border-accent/40 hover:text-accent hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] active:border-accent/40 active:text-accent active:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:-translate-y-1 focus-visible:scale-[1.04] focus-visible:border-accent/40"
      )}
    >
      <Icon
        size={18}
        className={cn(
          "transition-colors duration-[300ms] ease-out",
          isActive
            ? "text-accent"
            : "text-secondary/70 group-hover:text-accent group-active:text-accent group-focus:text-accent"
        )}
      />
      <span
        className={cn(
          "font-mono text-[11px] font-medium transition-colors duration-[300ms] ease-out",
          isActive
            ? "text-accent"
            : "text-secondary group-hover:text-accent group-active:text-accent group-focus:text-accent"
        )}
      >
        {name}
      </span>

      {/* Floating Tooltip */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 mb-3 w-48 -translate-x-1/2 rounded-xl border border-border bg-card p-3 text-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 z-50 transform",
          isActive
            ? "opacity-100 translate-y-0 border-accent/40"
            : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0"
        )}
      >
        <div className="font-mono text-xs font-semibold text-foreground">{name}</div>
        <div className="mt-1 font-mono text-[10px] leading-relaxed text-muted">{tooltipText}</div>
        {/* Subtle arrow pointer */}
        <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-border bg-card" />
      </div>
    </div>
  );
}
