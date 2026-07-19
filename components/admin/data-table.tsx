"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Column<T> = {
  key: string;
  label: string;
  className?: string;
  render: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  emptyAction?: React.ReactNode;
  onRowClick?: (item: T) => void;
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage = "No data yet.",
  emptyIcon: EmptyIcon,
  emptyAction,
  onRowClick,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#27272a] bg-[#111113] px-6 py-16 text-center">
        {EmptyIcon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#18181b]">
            <EmptyIcon size={22} className="text-[#71717a]" />
          </div>
        )}
        <p className="text-sm text-[#71717a]">{emptyMessage}</p>
        {emptyAction && <div className="mt-5">{emptyAction}</div>}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#27272a] bg-[#111113]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#27272a]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#71717a]",
                  col.className,
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#27272a]">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "transition-colors hover:bg-[#18181b]",
                onRowClick && "cursor-pointer",
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-4 py-3 text-[#a1a1aa]", col.className)}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
