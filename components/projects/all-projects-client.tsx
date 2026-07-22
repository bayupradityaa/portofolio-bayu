"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  ImageOff,
  FolderKanban,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { TechIcon } from "@/components/ui/tech-icons";
import { Reveal } from "@/components/motion/reveal";
import { ProjectDetailModal } from "@/components/projects/project-detail-modal";
import type { ProjectWithRelations } from "@/lib/types/database";

interface AllProjectsClientProps {
  projects: ProjectWithRelations[];
}

export function AllProjectsClient({ projects }: AllProjectsClientProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithRelations | null>(null);

  return (
    <div className="pt-28 pb-32 md:pt-36 md:pb-44 min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-2 text-xs font-sans font-medium text-secondary transition-all duration-300 hover:border-accent/40 hover:text-accent shadow-sm"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>Back to Home</span>
          </Link>

          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3.5 py-1.5 font-mono text-xs text-muted">
            <FolderKanban size={13} className="text-accent" />
            <span>{projects.length} Total Projects</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl text-foreground font-sans">
            All Projects & Works
          </h1>

          <p className="mt-4 text-base leading-relaxed text-secondary md:text-lg font-sans">
            A comprehensive archive of software engineering projects across web development, backend microservices, AI applications, and digital products.
          </p>
        </div>

        {/* Projects Grid — 3 Columns on Desktop */}
        {projects.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelectProject={(proj) => setSelectedProject(proj)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/40 py-16 px-6 text-center">
            <p className="text-sm font-sans text-secondary">No projects available at the moment.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

function ProjectCard({
  project,
  onSelectProject,
}: {
  project: ProjectWithRelations;
  onSelectProject: (project: ProjectWithRelations) => void;
}) {
  const stackNames = project.technologies.map((t) => t.name);
  const highlights = project.highlights.map((h) => h.text);
  const coverAlt = project.cover_alt || `${project.name} — ${project.tagline}`;
  const coverUrl = project.cover_image || project.images[0]?.image_url || "";
  const hasCover = Boolean(coverUrl);

  return (
    <Reveal as="div">
      <article
        onClick={() => onSelectProject(project)}
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-surface/70 backdrop-blur-md shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_35px_rgba(0,0,0,0.5)]"
      >
        {/* Cover Media Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-surface">
          {hasCover ? (
            <Image
              src={coverUrl}
              alt={coverAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface text-secondary">
              <ImageOff size={28} strokeWidth={1.5} aria-hidden="true" />
            </div>
          )}

          {/* Hover Overlay with "View Detail Project" Button */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 opacity-0 backdrop-blur-[3px] transition-all duration-300 group-hover:opacity-100 p-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-accent/20 px-4 py-2 font-sans text-xs font-semibold text-accent backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-transform duration-300 scale-90 group-hover:scale-100">
              <Eye size={15} />
              <span>View Detail Project</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-lg font-semibold tracking-tight text-foreground font-sans group-hover:text-accent transition-colors duration-300">
            {project.name}
          </h3>

          <p className="mt-1 font-sans text-xs font-semibold text-accent line-clamp-1">
            {project.tagline}
          </p>

          <p className="mt-3 font-sans text-xs leading-relaxed text-secondary line-clamp-2">
            {project.summary}
          </p>

          {/* Highlights */}
          {highlights.length > 0 && (
            <ul className="mt-4 space-y-1.5 border-t border-border/50 pt-3 font-sans">
              {highlights.slice(0, 2).map((h) => (
                <li key={h} className="flex items-start gap-2 text-xs text-secondary font-sans">
                  <CheckCircle2
                    size={13}
                    className="mt-0.5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <span className="line-clamp-1">{h}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Tech Stack Pills */}
          <div className="mt-auto pt-4 flex flex-wrap gap-1.5 border-t border-border/50">
            {stackNames.slice(0, 4).map((s) => (
              <div
                key={s}
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/60 px-2 py-0.5 font-mono text-[10px] font-medium text-secondary"
              >
                <TechIcon name={s} className="h-3 w-3 text-muted shrink-0" />
                <span>{s}</span>
              </div>
            ))}
            {stackNames.length > 4 && (
              <span className="inline-flex items-center rounded-md border border-border/60 bg-card/40 px-1.5 py-0.5 font-mono text-[10px] text-muted">
                +{stackNames.length - 4}
              </span>
            )}
          </div>

          {/* Action Links Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(project);
              }}
              className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-accent hover:underline cursor-pointer"
            >
              <span>View Details</span>
              <ArrowUpRight size={13} />
            </button>

            <div className="flex items-center gap-3 text-xs font-sans">
              {project.status === "Live" && project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 font-sans text-[11px] font-medium text-secondary hover:text-accent"
                  title="Visit Website"
                >
                  <span>Live</span>
                  <ArrowUpRight size={12} />
                </a>
              )}

              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 font-sans text-[11px] font-medium text-secondary hover:text-foreground"
                  title="View Source Code"
                >
                  <GithubIcon size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
