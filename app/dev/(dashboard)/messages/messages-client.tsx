"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Mail, MailOpen, Reply } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { deleteMessage, markRead, markReplied } from "@/lib/actions/messages";
import type { ContactMessage } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export function MessagesClient({ data }: { data: ContactMessage[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteMessage(deleteId);
    if (result.error) toast.error(result.error);
    else { toast.success("Deleted"); router.refresh(); }
    setDeleteId(null);
  };

  const handleMarkRead = async (id: string) => {
    await markRead(id);
    router.refresh();
  };

  const handleMarkReplied = async (id: string) => {
    await markReplied(id);
    router.refresh();
  };

  const unread = data.filter((m) => !m.is_read).length;

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${data.length} total • ${unread} unread`} />

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#27272a] bg-[#111113] py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#18181b]">
            <Mail size={22} className="text-[#71717a]" />
          </div>
          <p className="text-sm text-[#71717a]">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "rounded-xl border border-[#27272a] bg-[#111113] transition-colors",
                !msg.is_read && "border-[#22c55e]/20 bg-[#22c55e]/[0.02]",
              )}
            >
              <button
                onClick={() => {
                  setExpanded(expanded === msg.id ? null : msg.id);
                  if (!msg.is_read) handleMarkRead(msg.id);
                }}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                {msg.is_read ? (
                  <MailOpen size={16} className="shrink-0 text-[#71717a]" />
                ) : (
                  <Mail size={16} className="shrink-0 text-[#22c55e]" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className={cn("text-sm font-medium", msg.is_read ? "text-[#a1a1aa]" : "text-[#fafafa]")}>{msg.name}</span>
                    <span className="text-xs text-[#71717a]">{msg.email}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[#71717a]">{msg.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {msg.replied && <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">Replied</span>}
                  <span className="text-[10px] font-mono text-[#71717a]">{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
              </button>

              {expanded === msg.id && (
                <div className="border-t border-[#27272a] px-5 py-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#a1a1aa]">{msg.message}</p>
                  {msg.country && <p className="mt-2 text-xs text-[#71717a]">Country: {msg.country}</p>}
                  <div className="mt-4 flex gap-2">
                    {!msg.replied && (
                      <button onClick={() => handleMarkReplied(msg.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272a] px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-[#fafafa]">
                        <Reply size={12} /> Mark Replied
                      </button>
                    )}
                    <a href={`mailto:${msg.email}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[#22c55e] px-3 py-1.5 text-xs font-medium text-[#04120a]">
                      <Mail size={12} /> Reply via Email
                    </a>
                    <button onClick={() => setDeleteId(msg.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272a] px-3 py-1.5 text-xs text-[#71717a] hover:text-red-400">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} title="Delete message?" description="This cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
