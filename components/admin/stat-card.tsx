import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
};

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#27272a] bg-[#111113] p-5 transition-colors hover:border-[#3f3f46]",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-[#71717a]">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#18181b]">
          <Icon size={16} className="text-[#22c55e]" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-[#fafafa]">{value}</p>
      {trend && <p className="mt-1 text-xs text-[#71717a]">{trend}</p>}
    </div>
  );
}
