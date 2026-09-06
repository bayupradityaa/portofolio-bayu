"use client";

import { ProjectsHero } from "@/components/projects/projects-hero";
import { EditorialProjectArchive } from "@/components/projects/editorial-project-archive";
import { ProjectsCTA } from "@/components/projects/projects-cta";
import type { ProjectWithRelations } from "@/lib/types/database";

interface AllProjectsClientProps {
  projects: ProjectWithRelations[];
}

export function AllProjectsClient({ projects }: AllProjectsClientProps) {
  return (
    <div className="relative w-full overflow-x-clip min-h-screen bg-background text-foreground selection:bg-accent selection:text-black">
      {/* ── 01. HERO / ARCHIVE INTRODUCTION ── */}
      <ProjectsHero totalCount={projects.length} />

      {/* ── 02. UNIFIED 30/70 SCROLL-DRIVEN EDITORIAL ARCHIVE (01 — 05) ── */}
      <EditorialProjectArchive projects={projects} />

      {/* ── 03. CLOSING EDITORIAL CTA ── */}
      <ProjectsCTA />
    </div>
  );
}
