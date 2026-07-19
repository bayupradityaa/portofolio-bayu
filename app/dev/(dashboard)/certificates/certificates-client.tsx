"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Award } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { FormModal } from "@/components/admin/form-modal";
import { FormField } from "@/components/admin/form-field";
import { deleteCertificate, toggleCertificatePublished, createCertificate, updateCertificate } from "@/lib/actions/certificates";
import type { Certificate } from "@/lib/types/database";

export function CertificatesClient({ data }: { data: Certificate[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteCertificate(deleteId);
    if (result.error) toast.error(result.error);
    else { toast.success("Deleted"); router.refresh(); }
    setDeleteId(null);
  };

  const handleToggle = async (id: string) => {
    await toggleCertificatePublished(id);
    router.refresh();
  };

  const handleSave = async (formData: FormData) => {
    const values = {
      title: formData.get("title") as string,
      issuer: formData.get("issuer") as string,
      credential_id: (formData.get("credential_id") as string) || null,
      credential_url: (formData.get("credential_url") as string) || null,
      issue_date: (formData.get("issue_date") as string) || null,
      expire_date: (formData.get("expire_date") as string) || null,
      skills: (formData.get("skills") as string)?.split(",").map((s) => s.trim()).filter(Boolean) ?? null,
      sort_order: Number(formData.get("sort_order")) || 0,
      published: formData.get("published") === "on",
    };

    const result = editing ? await updateCertificate(editing.id, values) : await createCertificate(values);
    if (result.error) toast.error(result.error);
    else { toast.success(editing ? "Updated" : "Created"); setShowForm(false); setEditing(null); router.refresh(); }
  };

  const columns = [
    { key: "title", label: "Title", render: (c: Certificate) => <span className="font-medium text-[#fafafa]">{c.title}</span> },
    { key: "issuer", label: "Issuer", render: (c: Certificate) => <span>{c.issuer}</span> },
    { key: "date", label: "Issue Date", render: (c: Certificate) => <span className="font-mono text-xs">{c.issue_date ?? "—"}</span> },
    { key: "skills", label: "Skills", render: (c: Certificate) => <span className="text-xs">{c.skills?.join(", ") ?? "—"}</span> },
    { key: "published", label: "Published", className: "w-20", render: (c: Certificate) => (
      <button
        onClick={(e) => { e.stopPropagation(); handleToggle(c.id); }}
        title={c.published ? "Published — click to hide" : "Hidden — click to publish"}
        aria-label={c.published ? "Published, click to hide" : "Hidden, click to publish"}
      >
        {c.published ? <Eye size={16} className="text-emerald-400" /> : <EyeOff size={16} className="text-[#71717a]" />}
      </button>
    )},
    { key: "actions", label: "Actions", className: "w-24", render: (c: Certificate) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditing(c); setShowForm(true); }} title="Edit" aria-label="Edit" className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-[#fafafa]"><Pencil size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteId(c.id); }} title="Delete" aria-label="Delete" className="rounded-md p-1.5 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-red-400"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  const closeForm = () => { setShowForm(false); setEditing(null); };

  return (
    <div>
      <PageHeader
        title="Certificates"
        subtitle={`${data.length} entries`}
        action={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]"><Plus size={16} /> Add</button>
        }
      />

      <DataTable
        columns={columns}
        data={data}
        emptyIcon={Award}
        emptyMessage="No certificates yet."
        emptyAction={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]"><Plus size={16} /> Add certificate</button>
        }
      />

      <FormModal open={showForm} title={editing ? "Edit Certificate" : "New Certificate"} onClose={closeForm} onSubmit={handleSave}>
        <FormField name="title" label="Title" defaultValue={editing?.title} />
        <FormField name="issuer" label="Issuer" defaultValue={editing?.issuer} />
        <FormField name="credential_id" label="Credential ID" defaultValue={editing?.credential_id} />
        <FormField name="credential_url" label="Credential URL" defaultValue={editing?.credential_url} />
        <FormField name="issue_date" label="Issue Date" defaultValue={editing?.issue_date} type="date" />
        <FormField name="expire_date" label="Expire Date" defaultValue={editing?.expire_date} type="date" />
        <FormField name="skills" label="Skills (comma separated)" defaultValue={editing?.skills?.join(", ")} />
        <FormField name="sort_order" label="Sort Order" defaultValue={String(editing?.sort_order ?? 0)} type="number" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={editing?.published ?? true} className="rounded border-[#27272a]" />
          <span className="text-sm text-[#a1a1aa]">Published</span>
        </label>
      </FormModal>

      <ConfirmDialog open={deleteId !== null} title="Delete certificate?" description="This will permanently remove this entry." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
