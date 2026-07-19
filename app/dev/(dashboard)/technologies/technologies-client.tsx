"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Cpu } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { FormModal } from "@/components/admin/form-modal";
import { FormField } from "@/components/admin/form-field";
import { deleteTechnology, createTechnology, updateTechnology } from "@/lib/actions/technologies";
import type { Technology } from "@/lib/types/database";

export function TechnologiesClient({ data }: { data: Technology[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Technology | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteTechnology(deleteId);
    if (result.error) toast.error(result.error);
    else { toast.success("Deleted"); router.refresh(); }
    setDeleteId(null);
  };

  const handleSave = async (formData: FormData) => {
    const values = {
      name: formData.get("name") as string,
      icon: (formData.get("icon") as string) || null,
      category: formData.get("category") as string,
      website: (formData.get("website") as string) || null,
      sort_order: Number(formData.get("sort_order")) || 0,
      published: formData.get("published") === "on",
    };

    const result = editing ? await updateTechnology(editing.id, values) : await createTechnology(values);
    if (result.error) toast.error(result.error);
    else { toast.success(editing ? "Updated" : "Created"); setShowForm(false); setEditing(null); router.refresh(); }
  };

  const columns = [
    { key: "name", label: "Name", render: (t: Technology) => <span className="font-medium text-[#fafafa]">{t.name}</span> },
    { key: "category", label: "Category", render: (t: Technology) => (
      <span className="rounded-md border border-[#27272a] bg-[#18181b] px-2 py-0.5 text-xs">{t.category}</span>
    )},
    { key: "icon", label: "Icon Key", render: (t: Technology) => <span className="font-mono text-xs text-[#71717a]">{t.icon ?? "—"}</span> },
    { key: "order", label: "Order", render: (t: Technology) => <span className="font-mono text-xs">{t.sort_order}</span> },
    { key: "published", label: "Visible", className: "w-20", render: (t: Technology) => (
      <span title={t.published ? "Visible in marquee" : "Hidden"} aria-label={t.published ? "Visible" : "Hidden"}>
        {t.published ? <Eye size={16} className="text-emerald-400" /> : <EyeOff size={16} className="text-[#71717a]" />}
      </span>
    )},
    { key: "actions", label: "Actions", className: "w-24", render: (t: Technology) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditing(t); setShowForm(true); }} title="Edit" aria-label="Edit" className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-[#fafafa]"><Pencil size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteId(t.id); }} title="Delete" aria-label="Delete" className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-red-400"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  const closeForm = () => { setShowForm(false); setEditing(null); };

  return (
    <div>
      <PageHeader
        title="Technologies"
        subtitle={`${data.length} total`}
        action={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]"><Plus size={16} /> Add</button>
        }
      />

      <DataTable
        columns={columns}
        data={data}
        emptyIcon={Cpu}
        emptyMessage="No technologies yet."
        emptyAction={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]"><Plus size={16} /> Add technology</button>
        }
      />

      <FormModal open={showForm} title={editing ? "Edit Technology" : "New Technology"} onClose={closeForm} onSubmit={handleSave}>
        <FormField name="name" label="Name" defaultValue={editing?.name} />
        <FormField name="icon" label="Icon Key (must match TechIcon)" defaultValue={editing?.icon} />
        <FormField name="category" label="Category" defaultValue={editing?.category} placeholder="Frontend, Backend, AI & ML, Data & Cloud, Workflow" />
        <FormField name="website" label="Website" defaultValue={editing?.website} />
        <FormField name="sort_order" label="Sort Order" defaultValue={String(editing?.sort_order ?? 0)} type="number" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={editing?.published ?? true} className="rounded border-[#27272a]" />
          <span className="text-sm text-[#a1a1aa]">Published (visible in marquee)</span>
        </label>
      </FormModal>

      <ConfirmDialog open={deleteId !== null} title="Delete technology?" description="This will remove all project associations." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
