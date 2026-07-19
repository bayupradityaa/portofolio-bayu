import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/types/database";

const statusStyles: Record<ProjectStatus, string> = {
  Live: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Local Development": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Coming Soon": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
}

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        published
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      )}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}
