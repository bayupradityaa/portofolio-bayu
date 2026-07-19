"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { FormModal } from "@/components/admin/form-modal";
import { FormField } from "@/components/admin/form-field";
import { deleteEducation, toggleEducationPublished, createEducation, updateEducation } from "@/lib/actions/education";
import type { Education } from "@/lib/types/database";

export function EducationClient({ data }: { data: Education[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Education | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteEducation(deleteId);
    if (result.error) toast.error(result.error);
    else { toast.success("Deleted"); router.refresh(); }
    setDeleteId(null);
  };

  const handleSave = async (formData: FormData) => {
    const values = {
      institution: formData.get("institution") as string,
      degree: formData.get("degree") as string,
      field: formData.get("field") as string,
      start_year: Number(formData.get("start_year")),
      end_year: Number(formData.get("end_year")) || null,
      description: (formData.get("description") as string) || null,
      gpa: (formData.get("gpa") as string) || null,
      activities: (formData.get("activities") as string)?.split(",").map((s) => s.trim()).filter(Boolean) || null,
      website: (formData.get("website") as string) || null,
      sort_order: Number(formData.get("sort_order")) || 0,
      published: formData.get("published") === "on",
    };

    const result = editing ? await updateEducation(editing.id, values) : await createEducation(values);
    if (result.error) toast.error(result.error);
    else { toast.success(editing ? "Updated" : "Created"); setShowForm(false); setEditing(null); router.refresh(); }
  };

  const columns = [
    { key: "institution", label: "Institution", render: (e: Education) => <span className="font-medium text-[#fafafa]">{e.institution}</span> },
    { key: "degree", label: "Degree", render: (e: Education) => <span>{e.degree}</span> },
    { key: "field", label: "Field", render: (e: Education) => <span>{e.field}</span> },
    { key: "years", label: "Years", render: (e: Education) => <span className="font-mono text-xs">{e.start_year}–{e.end_year ?? "now"}</span> },
    { key: "gpa", label: "GPA", render: (e: Education) => <span className="text-xs">{e.gpa ?? "—"}</span> },
    { key: "published", label: "Published", className: "w-20", render: (e: Education) => (
      <button
        onClick={(ev) => { ev.stopPropagation(); toggleEducationPublished(e.id).then(() => router.refresh()); }}
        title={e.published ? "Published — click to hide" : "Hidden — click to publish"}
        aria-label={e.published ? "Published, click to hide" : "Hidden, click to publish"}
      >
        {e.published ? <Eye size={16} className="text-emerald-400" /> : <EyeOff size={16} className="text-[#71717a]" />}
      </button>
    )},
    { key: "actions", label: "Actions", className: "w-24", render: (e: Education) => (
      <div className="flex gap-1">
        <button onClick={(ev) => { ev.stopPropagation(); setEditing(e); setShowForm(true); }} title="Edit" aria-label="Edit" className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-[#fafafa]"><Pencil size={14} /></button>
        <button onClick={(ev) => { ev.stopPropagation(); setDeleteId(e.id); }} title="Delete" aria-label="Delete" className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-red-400"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  const closeForm = () => { setShowForm(false); setEditing(null); };

  return (
    <div>
      <PageHeader
        title="Education"
        subtitle={`${data.length} entries`}
        action={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]"><Plus size={16} /> Add</button>
        }
      />

      <DataTable
        columns={columns}
        data={data}
        emptyIcon={GraduationCap}
        emptyMessage="No education entries yet."
        emptyAction={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]"><Plus size={16} /> Add education</button>
        }
      />

      <FormModal open={showForm} title={editing ? "Edit Education" : "New Education"} onClose={closeForm} onSubmit={handleSave}>
        <FormField name="institution" label="Institution" defaultValue={editing?.institution} />
        <FormField name="degree" label="Degree" defaultValue={editing?.degree} />
        <FormField name="field" label="Field of Study" defaultValue={editing?.field} />
        <FormField name="start_year" label="Start Year" defaultValue={String(editing?.start_year ?? "")} type="number" />
        <FormField name="end_year" label="End Year (blank if current)" defaultValue={editing?.end_year ? String(editing.end_year) : ""} type="number" />
        <FormField name="gpa" label="GPA" defaultValue={editing?.gpa} />
        <FormField name="description" label="Description" defaultValue={editing?.description} />
        <FormField name="activities" label="Activities (comma separated)" defaultValue={editing?.activities?.join(", ")} />
        <FormField name="website" label="Website" defaultValue={editing?.website} />
        <FormField name="sort_order" label="Sort Order" defaultValue={String(editing?.sort_order ?? 0)} type="number" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={editing?.published ?? true} className="rounded border-[#27272a]" />
          <span className="text-sm text-[#a1a1aa]">Published</span>
        </label>
      </FormModal>

      <ConfirmDialog open={deleteId !== null} title="Delete education?" description="This will permanently remove this entry." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
