"use client";

import { motion, type Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { TechIcon } from "@/components/ui/tech-icons";
import { ProjectImage } from "./ProjectImage";
import type { FeaturedProject } from "./types";

/** Tech badges fade upward in a small stagger on hover-in / view. */
const badgeStagger: Variants = {
  rest: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const badgeItem: Variants = {
  rest: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * A single ~100vh project panel in the scrolling right column.
 * Exposes named element refs (via callback) so the GSAP hook can pin/scrub
 * without owning any layout. Purely presentational otherwise.
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
  const primaryLabel = project.liveUrlLabel || "Visit Website";

  return (
    <div className="flex min-h-screen w-full items-center py-16 lg:py-0">
      <div
        ref={slideRef}
        className="flex w-full flex-col gap-7"
        style={{ willChange: "transform, opacity, filter" }}
      >
        {/* On mobile the counter is inline since the sidebar isn't pinned. */}
        <div className="flex items-baseline gap-4 lg:hidden">
          <span className="font-sans text-5xl font-thin leading-none tracking-tighter text-secondary/50">
            {project.index}
          </span>
          <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-wider text-accent">
            {project.category}
          </span>
        </div>

        {/* Image */}
        <ProjectImage
          ref={imageRef}
          src={project.coverImage}
          alt={project.coverAlt}
          priority={priority}
        />

        {/* Title — mobile only (desktop shows it in the pinned sidebar) */}
        <div className="lg:hidden">
          <h3 className="text-2xl font-semibold tracking-tight">{project.name}</h3>
          <p className="mt-1 text-lg text-accent">{project.tagline}</p>
        </div>

        {/* Tagline on desktop sits above the description */}
        <p className="hidden text-lg text-accent lg:block">{project.tagline}</p>

        {/* Description — comfortable reading width */}
        <p className="max-w-[56ch] leading-relaxed text-secondary">{project.summary}</p>

        {/* Optional statistics */}
        {project.stats.length > 0 && (
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {project.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="text-xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </span>
                <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tech badges — small rounded pills, fade upward */}
        <motion.div
          className="flex flex-wrap gap-2"
          variants={badgeStagger}
          initial="rest"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          {project.technologies.map((tech) => (
            <motion.span
              key={tech}
              variants={badgeItem}
              className="group/tech inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-secondary transition-colors duration-300 hover:border-accent/40 hover:text-accent"
            >
              <TechIcon
                name={tech}
                className="h-3.5 w-3.5 text-muted transition-colors duration-300 group-hover/tech:text-accent"
              />
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* CTAs */}
        <div className="mt-1 flex flex-wrap items-center gap-6">
          {project.status === "Live" && primaryHref ? (
            <motion.a
              href={primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              initial="rest"
              whileHover="hover"
              className="group inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-5 py-3 font-sans text-xs font-semibold text-accent transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-contrast hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]"
            >
              <span>{primaryLabel}</span>
              <motion.span
                variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex"
              >
                <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
              </motion.span>
            </motion.a>
          ) : project.status === "Local Development" ? (
            <span className="inline-flex cursor-not-allowed select-none items-center gap-1.5 text-sm font-medium text-muted">
              Running locally
            </span>
          ) : project.status === "Coming Soon" ? (
            <span className="inline-flex cursor-not-allowed select-none items-center gap-1.5 text-sm font-medium text-muted">
              Coming Soon
            </span>
          ) : null}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            >
              <GithubIcon size={16} aria-hidden="true" />
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
