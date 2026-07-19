"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { projectSchema, type ProjectFormValues } from "@/lib/schemas/project";
import { createProject, updateProject, setProjectHighlights, setProjectTechnologies } from "@/lib/actions/projects";
import { DynamicList } from "@/components/admin/dynamic-list";
import { TechnologySelect } from "@/components/admin/technology-select";
import { ProjectGallery } from "./project-gallery";
import type { ProjectWithRelations, Technology } from "@/lib/types/database";

type ProjectFormProps = {
  project?: ProjectWithRelations;
  technologies: Technology[];
};

export function ProjectForm({ project, technologies }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          slug: project.slug,
          name: project.name,
          tagline: project.tagline,
          summary: project.summary,
          year: project.year,
          role: project.role,
          status: project.status,
          category: project.category,
          live_url: project.live_url ?? "",
          repo_url: project.repo_url ?? "",
          live_url_label: project.live_url_label ?? "",
          cover_image: project.cover_image,
          cover_alt: project.cover_alt,
          featured: project.featured,
          published: project.published,
          is_open_source: project.is_open_source,
          is_personal: project.is_personal,
          sort_order: project.sort_order,
        }
      : {
          slug: "",
          name: "",
          tagline: "",
          summary: "",
          role: "",
          status: "Coming Soon",
          category: null,
          live_url: "",
          repo_url: "",
          live_url_label: "",
          cover_image: "",
          cover_alt: "",
          year: new Date().getFullYear(),
          published: true,
          featured: false,
          is_open_source: false,
          is_personal: true,
          sort_order: 0,
        },
  });

  // State for relational data (not in the Zod schema for the main form)
  const highlights = project?.highlights.map((h) => h.text) ?? [];
  const selectedTechIds = project?.technologies.map((t) => t.id) ?? [];

  const coverImage = watch("cover_image");

  const onSubmit = async (values: ProjectFormValues) => {
    const clean = {
      ...values,
      live_url: values.live_url || null,
      repo_url: values.repo_url || null,
    };

    if (isEditing) {
      const result = await updateProject(project.id, clean);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Project updated");
    } else {
      const result = await createProject(clean);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      // Set highlights and technologies for new project
      if (result.id) {
        const formEl = document.getElementById("project-form") as HTMLFormElement;
        const highlightsData = formEl?.dataset.highlights;
        const techIdsData = formEl?.dataset.techIds;

        if (highlightsData) {
          await setProjectHighlights(result.id, JSON.parse(highlightsData));
        }
        if (techIdsData) {
          await setProjectTechnologies(result.id, JSON.parse(techIdsData));
        }
      }
      toast.success("Project created");
    }

    router.push("/dev/projects");
    router.refresh();
  };

  // Auto-generate slug from name
  const autoSlug = () => {
    const name = watch("name");
    if (name && !isEditing) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  };

  return (
    <form id="project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dev/projects"
            title="Back to projects"
            aria-label="Back to projects"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#27272a] text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-[#fafafa]"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-xl font-semibold text-[#fafafa]">
            {isEditing ? "Edit Project" : "New Project"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80] disabled:opacity-50"
        >
          <Save size={16} />
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic info */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717a]">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="pf-name" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Name</label>
                <input
                  id="pf-name"
                  {...register("name", { onBlur: autoSlug })}
                  className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
                  placeholder="Project name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="pf-slug" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Slug</label>
                <input
                  id="pf-slug"
                  {...register("slug")}
                  className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 font-mono text-sm text-[#a1a1aa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
                  placeholder="project-slug"
                />
                {errors.slug && <p className="mt-1 text-xs text-red-400">{errors.slug.message}</p>}
              </div>

              <div>
                <label htmlFor="pf-tagline" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Tagline</label>
                <input
                  id="pf-tagline"
                  {...register("tagline")}
                  className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
                  placeholder="Short tagline"
                />
              </div>

              <div>
                <label htmlFor="pf-summary" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Summary</label>
                <textarea
                  id="pf-summary"
                  {...register("summary")}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
                  placeholder="Project summary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pf-year" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Year</label>
                  <input
                    id="pf-year"
                    type="number"
                    {...register("year", { valueAsNumber: true })}
                    className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] focus:border-[#22c55e] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="pf-role" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Role</label>
                  <input
                    id="pf-role"
                    {...register("role")}
                    className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
                    placeholder="Full Stack Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pf-status" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Status</label>
                  <select
                    id="pf-status"
                    {...register("status")}
                    className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] focus:border-[#22c55e] focus:outline-none"
                  >
                    <option value="Live">Live</option>
                    <option value="Local Development">Local Development</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pf-category" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Category</label>
                  <input
                    id="pf-category"
                    {...register("category")}
                    className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
                    placeholder="AI, Commercial, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717a]">URLs</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="pf-liveurl" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Live URL</label>
                <input id="pf-liveurl" {...register("live_url")} className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none" placeholder="https://" />
              </div>
              <div>
                <label htmlFor="pf-repourl" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Repository URL</label>
                <input id="pf-repourl" {...register("repo_url")} className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none" placeholder="https://github.com/..." />
              </div>
              <div>
                <label htmlFor="pf-urllabel" className="mb-1.5 block text-sm font-medium text-[#fafafa]">Button Label</label>
                <input id="pf-urllabel" {...register("live_url_label")} className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none" placeholder="Visit Website" />
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717a]">Highlights</h2>
            <HighlightsEditor projectId={project?.id} initialHighlights={highlights} />
          </div>

          {/* Technologies */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717a]">Technologies</h2>
            <TechEditor projectId={project?.id} technologies={technologies} initialSelectedIds={selectedTechIds} />
          </div>

          {/* Gallery & Cover */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-6">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#71717a]">Gallery &amp; Cover</h2>
            <p className="mb-4 text-xs text-[#71717a]">
              Screenshots shown in the lightbox on the public site. The image marked with a star is the cover/thumbnail. Drag to reorder.
            </p>
            <input type="hidden" {...register("cover_image")} />
            <ProjectGallery
              projectId={project?.id}
              initialImages={project?.images ?? []}
              coverImage={coverImage}
              onCoverChange={(url) => setValue("cover_image", url)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Flags */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717a]">Visibility</h2>
            <div className="space-y-3">
              {(
                [
                  ["published", "Published"],
                  ["featured", "Featured"],
                  ["is_open_source", "Open Source"],
                  ["is_personal", "Personal Project"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    {...register(key)}
                    className="h-4 w-4 rounded border-[#27272a] bg-[#0a0a0c] text-[#22c55e] focus:ring-[#22c55e]"
                  />
                  <span className="text-sm text-[#a1a1aa]">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Order */}
          <div className="rounded-xl border border-[#27272a] bg-[#111113] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717a]">Sort Order</h2>
            <input
              type="number"
              {...register("sort_order", { valueAsNumber: true })}
              className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] focus:border-[#22c55e] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

// Sub-components for highlights and technologies editing
function HighlightsEditor({ projectId, initialHighlights }: { projectId?: string; initialHighlights: string[] }) {
  const [items, setItems] = useState(initialHighlights);

  const handleChange = async (newItems: string[]) => {
    setItems(newItems);
    if (projectId) {
      await setProjectHighlights(projectId, newItems);
    }
    // For new projects, store in a data attribute on the form
    const formEl = document.getElementById("project-form") as HTMLFormElement;
    if (formEl) formEl.dataset.highlights = JSON.stringify(newItems);
  };

  return <DynamicList values={items} onChange={handleChange} placeholder="Add highlight..." label="" />;
}

function TechEditor({ projectId, technologies, initialSelectedIds }: { projectId?: string; technologies: Technology[]; initialSelectedIds: string[] }) {
  const [selected, setSelected] = useState(initialSelectedIds);

  const handleChange = async (ids: string[]) => {
    setSelected(ids);
    if (projectId) {
      await setProjectTechnologies(projectId, ids);
    }
    const formEl = document.getElementById("project-form") as HTMLFormElement;
    if (formEl) formEl.dataset.techIds = JSON.stringify(ids);
  };

  return <TechnologySelect technologies={technologies} selectedIds={selected} onChange={handleChange} />;
}
