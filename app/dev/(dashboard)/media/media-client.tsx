"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Trash2, Copy, Check, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { uploadFile, deleteFile } from "@/lib/actions/media";
import { cn } from "@/lib/utils";

type MediaItem = {
  name: string;
  bucket: string;
  path: string;
  url: string;
  size: number;
  created_at: string;
  content_type: string;
};

export function MediaClient({ media }: { media: MediaItem[] }) {
  const router = useRouter();
  const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [uploading, setUploading] = useState(false);

  const buckets = ["all", ...new Set(media.map((m) => m.bucket))];
  const filtered = filter === "all" ? media : media.filter((m) => m.bucket === filter);

  const handleDelete = async () => {
    if (!deleteItem) return;
    const result = await deleteFile(deleteItem.bucket as "avatars" | "projects" | "certificates" | "documents" | "media", deleteItem.path);
    if (result.error) toast.error(result.error);
    else { toast.success("Deleted"); router.refresh(); }
    setDeleteItem(null);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadFile("media", formData);
    if (result.error) toast.error(result.error);
    else { toast.success("Uploaded"); router.refresh(); }
    setUploading(false);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const isImage = (type: string) => type.startsWith("image/");
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle={`${media.length} files`}
        action={
          <label className={cn("inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]", uploading && "opacity-50 pointer-events-none")}>
            <Upload size={16} /> {uploading ? "Uploading..." : "Upload"}
            <input type="file" onChange={handleUpload} className="hidden" />
          </label>
        }
      />

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {buckets.map((b) => (
          <button
            key={b}
            onClick={() => setFilter(b)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              filter === b ? "bg-[#18181b] text-[#fafafa]" : "text-[#71717a] hover:text-[#a1a1aa]",
            )}
          >
            {b}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#27272a] bg-[#111113] py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#18181b]">
            <ImageIcon size={22} className="text-[#71717a]" />
          </div>
          <p className="text-sm text-[#71717a]">No files in this bucket.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <div key={item.path} className="group relative rounded-xl border border-[#27272a] bg-[#111113] overflow-hidden">
              {isImage(item.content_type) ? (
                <div className="relative aspect-square">
                  <Image src={item.url} alt={item.name} fill className="object-cover" sizes="200px" />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-[#18181b]">
                  <span className="text-xs font-mono text-[#71717a]">{item.name.split(".").pop()?.toUpperCase()}</span>
                </div>
              )}
              <div className="p-3">
                <p className="truncate text-xs font-medium text-[#a1a1aa]">{item.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-[#71717a]">{formatSize(item.size)}</span>
                  <span className="rounded bg-[#18181b] px-1.5 py-0.5 text-[10px] text-[#71717a]">{item.bucket}</span>
                </div>
              </div>
              {/* Actions overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => copyUrl(item.url)} title="Copy URL" aria-label="Copy URL" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa]">
                  {copied === item.url ? <Check size={14} className="text-[#22c55e]" /> : <Copy size={14} />}
                </button>
                <button onClick={() => setDeleteItem(item)} title="Delete" aria-label="Delete file" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#18181b] text-[#a1a1aa] hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={deleteItem !== null} title="Delete file?" description={`This will permanently delete ${deleteItem?.name ?? "this file"} from storage.`} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} />
    </div>
  );
}
