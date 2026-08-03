"use client";

import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ProjectImage } from "./ProjectImage";
import type { FeaturedProject } from "./types";

/**
 * A single project panel in the scrolling right column.
 *
 * Editorial treatment: data is presented as a specimen sheet — mono labels,
 * hairline rules, hard edges, no cards. Enter motion is owned entirely by the
 * GSAP hook via `slideRef`; nothing animates itself here, so there's a single
 * place to reason about the section's timing.
 */
export function ProjectSlide({
  project,
  priority,
  slideRef,
  imageRef,
}: {
  project: FeaturedProject;
  priority: boolean;
  slideRef: (el: HTMLDivElement | null) => void;
  imageRef: (el: HTMLDivElement | null) => void;
}) {
  const primaryHref = project.liveUrl;
  const primaryLabel = project.liveUrlLabel || "Visit site";

  return (
    <div className="w-full border-b border-border py-16 last:border-b-0 md:py-24">
      <div ref={slideRef} className="flex w-full flex-col gap-8">
        {/* Index + category — mobile only; desktop carries these in the sidebar */}
        <div className="flex items-center gap-4 lg:hidden">
          <span className="font-mono text-xs text-muted">{project.index}</span>
          <span className="h-px flex-1 bg-border" />
          <span className="eyebrow">{project.category}</span>
        </div>

        <h3 className="text-display lg:hidden">{project.name}</h3>

        {/* Tagline — the one line that has to land */}
        <p className="max-w-[38ch] font-display text-xl leading-tight tracking-tight text-foreground md:text-2xl">
          {project.tagline}
        </p>

        <ProjectImage
          ref={imageRef}
          src={project.coverImage}
          alt={project.coverAlt}
          priority={priority}
        />

        {/* Two-column specimen block: prose left, hard data right */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:gap-16">
          <p className="max-w-[62ch] leading-relaxed text-secondary">
            {project.summary}
          </p>

          {project.stats.length > 0 && (
            <dl className="flex shrink-0 gap-10 md:flex-col md:gap-5">
              {project.stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-display text-2xl tracking-tight text-foreground">
                    {stat.value}
                  </dd>
                  <dt className="eyebrow mt-1">{stat.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Stack — plain mono list separated by rules, not pills */}
        <div className="border-t border-border pt-5">
          <span className="eyebrow">Stack</span>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="font-mono text-xs text-secondary">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs — text links with a drawn underline. No buttons in the body. */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {project.status === "Live" && primaryHref ? (
            <a
              href={primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-display text-base tracking-tight text-accent"
            >
              <span className="link-underline">{primaryLabel}</span>
              <ArrowUpRight
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          ) : (
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              {project.status === "Local Development" ? "Running locally" : project.status}
            </span>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-foreground"
            >
              <GithubIcon size={15} aria-hidden="true" />
              <span className="link-underline">Source</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
