"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { FormModal } from "@/components/admin/form-modal";
import { FormField } from "@/components/admin/form-field";
import { deleteExperience, toggleExperiencePublished, createExperience, updateExperience } from "@/lib/actions/experience";
import type { Experience } from "@/lib/types/database";

export function CrudPage({ data }: { data: Experience[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteExperience(deleteId);
    if (result.error) toast.error(result.error);
    else { toast.success("Deleted"); router.refresh(); }
    setDeleteId(null);
  };

  const handleToggle = async (id: string) => {
    await toggleExperiencePublished(id);
    router.refresh();
  };

  const handleSave = async (formData: FormData) => {
    const values = {
      period: formData.get("period") as string,
      title: formData.get("title") as string,
      org: formData.get("org") as string,
      description: formData.get("description") as string,
      employment_type: (formData.get("employment_type") as string) || null,
      location: (formData.get("location") as string) || null,
      website: (formData.get("website") as string) || null,
      tags: (formData.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) ?? [],
      sort_order: Number(formData.get("sort_order")) || 0,
      published: formData.get("published") === "on",
    };

    const result = editing
      ? await updateExperience(editing.id, values)
      : await createExperience(values);

    if (result.error) toast.error(result.error);
    else { toast.success(editing ? "Updated" : "Created"); setShowForm(false); setEditing(null); router.refresh(); }
  };

  const columns = [
    { key: "title", label: "Title", render: (e: Experience) => <span className="font-medium text-[#fafafa]">{e.title}</span> },
    { key: "org", label: "Organization", render: (e: Experience) => <span>{e.org}</span> },
    { key: "period", label: "Period", render: (e: Experience) => <span className="font-mono text-xs">{e.period}</span> },
    { key: "type", label: "Type", render: (e: Experience) => <span className="text-xs">{e.employment_type ?? "—"}</span> },
    {
      key: "published", label: "Published", className: "w-20",
      render: (e: Experience) => (
        <button
          onClick={(ev) => { ev.stopPropagation(); handleToggle(e.id); }}
          title={e.published ? "Published — click to hide" : "Hidden — click to publish"}
          aria-label={e.published ? "Published, click to hide" : "Hidden, click to publish"}
        >
          {e.published ? <Eye size={16} className="text-emerald-400" /> : <EyeOff size={16} className="text-[#71717a]" />}
        </button>
      ),
    },
    {
      key: "actions", label: "Actions", className: "w-24",
      render: (e: Experience) => (
        <div className="flex gap-1">
          <button onClick={(ev) => { ev.stopPropagation(); setEditing(e); setShowForm(true); }} title="Edit" aria-label="Edit" className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-[#fafafa]"><Pencil size={14} /></button>
          <button onClick={(ev) => { ev.stopPropagation(); setDeleteId(e.id); }} title="Delete" aria-label="Delete" className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  const closeForm = () => { setShowForm(false); setEditing(null); };

  return (
    <div>
      <PageHeader
        title="Experience"
        subtitle={`${data.length} entries`}
        action={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]">
            <Plus size={16} /> Add
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={data}
        emptyIcon={Briefcase}
        emptyMessage="No experience entries yet."
        emptyAction={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]">
            <Plus size={16} /> Add experience
          </button>
        }
      />

      <FormModal open={showForm} title={editing ? "Edit Experience" : "New Experience"} onClose={closeForm} onSubmit={handleSave}>
        <FormField name="title" label="Title" defaultValue={editing?.title} />
        <FormField name="org" label="Organization" defaultValue={editing?.org} />
        <FormField name="period" label="Period" defaultValue={editing?.period} placeholder="2025 — now" />
        <FormField name="description" label="Description" defaultValue={editing?.description} />
        <FormField name="employment_type" label="Type" defaultValue={editing?.employment_type} placeholder="Full-time, Internship, etc." />
        <FormField name="location" label="Location" defaultValue={editing?.location} />
        <FormField name="website" label="Website" defaultValue={editing?.website} />
        <FormField name="tags" label="Tags (comma separated)" defaultValue={editing?.tags?.join(", ")} />
        <FormField name="sort_order" label="Sort Order" defaultValue={String(editing?.sort_order ?? 0)} type="number" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={editing?.published ?? true} className="rounded border-[#27272a]" />
          <span className="text-sm text-[#a1a1aa]">Published</span>
        </label>
      </FormModal>

      <ConfirmDialog open={deleteId !== null} title="Delete experience?" description="This will permanently remove this entry." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
