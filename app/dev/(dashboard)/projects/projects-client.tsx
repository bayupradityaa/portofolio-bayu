"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Copy, Star, Eye, EyeOff, Globe, FolderKanban } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteProject, togglePublished, toggleFeatured, toggleShowOnPublic, duplicateProject } from "@/lib/actions/projects";
import type { ProjectWithRelations } from "@/lib/types/database";
import { toast } from "sonner";

export function ProjectsClient({ projects }: { projects: ProjectWithRelations[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteProject(deleteId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Project deleted");
      router.refresh();
    }
    setDeleteId(null);
  };

  const handleTogglePublished = async (id: string) => {
    const result = await togglePublished(id);
    if (result.error) toast.error(result.error);
    else router.refresh();
  };

  const handleToggleFeatured = async (id: string) => {
    const result = await toggleFeatured(id);
    if (result.error) toast.error(result.error);
    else router.refresh();
  };

  const handleToggleShowOnPublic = async (id: string) => {
    const result = await toggleShowOnPublic(id);
    if (result.error) toast.error(result.error);
    else router.refresh();
  };

  const handleDuplicate = async (id: string) => {
    const result = await duplicateProject(id);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Project duplicated");
      router.refresh();
    }
  };

  const columns = [
    {
      key: "cover",
      label: "Cover",
      className: "w-16",
      render: (p: ProjectWithRelations) =>
        p.cover_image ? (
          <div className="relative h-10 w-16 overflow-hidden rounded-md border border-[#27272a]">
            <Image src={p.cover_image} alt={p.cover_alt} fill className="object-cover" sizes="64px" />
          </div>
        ) : (
          <div className="h-10 w-16 rounded-md bg-[#18181b]" />
        ),
    },
    {
      key: "name",
      label: "Name",
      render: (p: ProjectWithRelations) => (
        <div>
          <p className="font-medium text-[#fafafa]">{p.name}</p>
          <p className="text-xs text-[#71717a]">{p.slug}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (p: ProjectWithRelations) => <StatusBadge status={p.status} />,
    },
    {
      key: "category",
      label: "Category",
      render: (p: ProjectWithRelations) => (
        <span className="text-xs text-[#71717a]">{p.category ?? "—"}</span>
      ),
    },
    {
      key: "featured",
      label: "Home (Work)",
      className: "w-28 text-center",
      render: (p: ProjectWithRelations) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleFeatured(p.id); }}
          title={p.featured ? "Tampil di Section Work Beranda — Klik untuk sembunyikan" : "Sembunyi dari Beranda — Klik untuk tampilkan di Beranda"}
          aria-label={p.featured ? "Tampil di Beranda" : "Sembunyi dari Beranda"}
          className="transition-colors hover:scale-110 p-1"
        >
          <Star size={16} className={p.featured ? "fill-amber-400 text-amber-400" : "text-[#71717a]"} />
        </button>
      ),
    },
    {
      key: "show_on_public",
      label: "Archive (/projects)",
      className: "w-32 text-center",
      render: (p: ProjectWithRelations) => {
        const isVisible = ((p as Record<string, unknown>).show_on_public as boolean) ?? true;
        return (
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleShowOnPublic(p.id); }}
            title={isVisible ? "Tampil di Halaman /projects — Klik untuk sembunyikan" : "Sembunyi dari /projects — Klik untuk tampilkan"}
            aria-label="Toggle /projects visibility"
            className="transition-colors hover:scale-110 p-1"
          >
            <Globe size={16} className={isVisible ? "text-[#38bdf8]" : "text-[#52525b]"} />
          </button>
        );
      },
    },
    {
      key: "published",
      label: "Status",
      className: "w-20 text-center",
      render: (p: ProjectWithRelations) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleTogglePublished(p.id); }}
          title={p.published ? "Published (Aktif) — Klik untuk jadikan Draft" : "Draft (Nonaktif) — Klik untuk Publish"}
          aria-label={p.published ? "Published" : "Draft"}
          className="transition-colors p-1"
        >
          {p.published ? (
            <Eye size={16} className="text-emerald-400" />
          ) : (
            <EyeOff size={16} className="text-[#71717a]" />
          )}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-32",
      render: (p: ProjectWithRelations) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/dev/projects/${p.id}/edit`}
            onClick={(e) => e.stopPropagation()}
            title="Edit"
            aria-label="Edit project"
            className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-[#fafafa]"
          >
            <Pencil size={14} />
          </Link>
          <button
            onClick={(e) => { e.stopPropagation(); handleDuplicate(p.id); }}
            title="Duplicate"
            aria-label="Duplicate project"
            className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-[#fafafa]"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
            title="Delete"
            aria-label="Delete project"
            className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={projects}
        emptyIcon={FolderKanban}
        emptyMessage="No projects yet. Create your first one."
        emptyAction={
          <Link href="/dev/projects/new" className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]">
            <Plus size={16} /> New Project
          </Link>
        }
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete project?"
        description="This will permanently remove this project from the database. Storage files will not be deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
