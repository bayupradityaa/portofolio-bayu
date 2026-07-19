"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

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
  "Next.js": "Full-stack React Framework",
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

export function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Balanced 2-Row Layout Configuration (Static and highly optimized)
  const row1 = [
    "React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion", "Lenis",
    "Go", "Fiber", "Node.js", "Express", "REST API", "Python", "Flask"
  ];
  const row2 = [
    "PostgreSQL", "MySQL", "Firebase", "Supabase", "Cloudflare", "Docker",
    "Git", "GitHub", "GitHub Actions", "Postman", "VS Code", "Figma"
  ];

  // Custom mousemove handler to update a single CSS custom variable on the parent container
  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offsetX = e.clientX - centerX;
    const targetX = (offsetX / (rect.width / 2)) * 12; // Subtle shift (Max 12px)
    
    container.style.setProperty("--row-parallax-x", `${targetX}px`);
  };

  const handleMouseLeave = () => {
    containerRef.current?.style.setProperty("--row-parallax-x", "0px");
  };

  return (
    <Section id="stack" className="bg-[#090909] text-foreground pb-32 md:pb-44 lg:pb-56 overflow-hidden">
      {/* Centered Minimal Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20 md:mb-24">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          STACK
        </span>
        <h2 className="mt-4 text-5xl md:text-7xl lg:text-[72px] font-semibold tracking-tight text-foreground leading-[1.1] max-w-[700px]">
          Technology Ecosystem
        </h2>
        <p className="mt-6 text-base leading-relaxed text-secondary md:text-lg max-w-[580px]">
          The tools behind every product I build.<br />
          Chosen for performance, reliability, and great developer experience.
        </p>
      </div>

      {/* Technology Marquee Area */}
      <div 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full"
      >
        {/* Edge Fade Masks for Smooth Transitions */}
        <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-20 bg-gradient-to-r from-[#090909] to-transparent md:w-36 lg:w-48" />
        <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-20 bg-gradient-to-l from-[#090909] to-transparent md:w-36 lg:w-48" />

        <div className="flex flex-col gap-5">
          {/* Row 1: moves left */}
          <MarqueeRow items={row1} direction="left" speed={28} />

          {/* Row 2: moves right */}
          <MarqueeRow items={row2} direction="right" speed={18} />
        </div>
      </div>
    </Section>
  );
}

function MarqueeRow({
  items,
  direction,
  speed,
  className,
}: {
  items: string[];
  direction: "left" | "right";
  speed: number;
  className?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tl: gsap.core.Timeline;
    let onScroll: () => void;
    let tickFn: () => void;

    const initMarquee = () => {
      if (tl) tl.kill();
      if (onScroll) window.removeEventListener("scroll", onScroll);
      if (tickFn) gsap.ticker.remove(tickFn);

      const row = rowRef.current;
      if (!row) return;

      const totalWidth = row.scrollWidth;
      const halfWidth = totalWidth / 2;

      const fromX = direction === "left" ? 0 : -halfWidth;
      const toX = direction === "left" ? -halfWidth : 0;
      const duration = halfWidth / speed;

      gsap.set(row, { x: fromX });

      tl = gsap.timeline({ repeat: -1 });
      tl.to(row, {
        x: toX,
        duration: duration,
        ease: "none",
      });

      // Frame-tick scroll velocity interpolation:
      // ZERO garbage collection, runs fully at 120fps/60fps.
      let lastScrollTop = window.scrollY;
      let currentScale = 1.0;
      let targetScale = 1.0;

      tickFn = () => {
        // Automatically decay targetScale back to 1.0 (deceleration)
        targetScale += (1.0 - targetScale) * 0.05;
        // Lerp currentScale toward targetScale for buttery smooth transitions
        currentScale += (targetScale - currentScale) * 0.08;
        // Apply directly to GSAP timeline
        tl.timeScale(currentScale);
      };

      gsap.ticker.add(tickFn);

      onScroll = () => {
        const currentScrollTop = window.scrollY;
        const delta = Math.abs(currentScrollTop - lastScrollTop);
        lastScrollTop = currentScrollTop;

        // Subtle 15-20% scroll acceleration:
        targetScale = 1.0 + Math.min(delta / 30, 0.2);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
    };

    // Wait briefly for layout calculation
    const timer = setTimeout(initMarquee, 100);

    const handleResize = () => {
      initMarquee();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      if (tl) tl.kill();
      if (onScroll) window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      if (tickFn) gsap.ticker.remove(tickFn);
    };
  }, [items, direction, speed]);

  return (
    <div className={cn("overflow-hidden py-2", className)}>
      <div 
        ref={wrapperRef} 
        className="marquee-row-wrapper"
        style={{
          transform: "translateX(var(--row-parallax-x, 0px))",
          transition: "transform 1.0s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <div ref={rowRef} className="flex gap-4 w-max">
          {/* Double items for an infinite loop */}
          {[...items, ...items].map((logo, idx) => (
            <LogoPill key={`${logo}-${idx}`} name={logo} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LogoPill({ name }: { name: string }) {
  const Icon = logoIcons[name];
  const tooltipText = logoTooltips[name];

  if (!Icon) return null;

  return (
    <div
      tabIndex={0}
      className={cn(
        "group relative flex h-[52px] items-center gap-3 rounded-full border border-white/[0.06] bg-[#111111]/80 px-6 py-3 outline-none text-muted-foreground shadow-sm transition-all duration-[350ms] ease-out",
        "hover:-translate-y-1 hover:scale-[1.04] hover:border-accent/40 hover:text-accent hover:shadow-[0_0_20px_rgba(34,197,94,0.12)] focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:-translate-y-1 focus-visible:scale-[1.04] focus-visible:border-accent/40",
        "cursor-pointer select-none"
      )}
    >
      <Icon size={18} className="text-muted-foreground/70 group-hover:text-accent transition-colors duration-[350ms] ease-out" />
      <span className="font-mono text-[11px] font-medium text-secondary group-hover:text-accent transition-colors duration-[350ms] ease-out">
        {name}
      </span>

      {/* Understated Floating Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-48 -translate-x-1/2 rounded-xl border border-white/[0.08] bg-[#111111] p-3 text-center opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100 z-50 transform translate-y-1 group-hover:-translate-y-0">
        <div className="font-mono text-xs font-semibold text-foreground">{name}</div>
        <div className="mt-1 font-mono text-[10px] leading-relaxed text-muted-foreground">{tooltipText}</div>
        {/* Subtle arrow pointer */}
        <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-white/[0.08] bg-[#111111]" />
      </div>
    </div>
  );
}
