"use client";

import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onChange: (key: string) => void;
};

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 rounded-lg border border-[#27272a] bg-[#0a0a0c] p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === tab.key
              ? "bg-[#18181b] text-[#fafafa]"
              : "text-[#71717a] hover:text-[#a1a1aa]",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
