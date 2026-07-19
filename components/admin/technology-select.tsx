"use client";

import { useState, useMemo } from "react";
import { Check, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Technology } from "@/lib/types/database";

type TechnologySelectProps = {
  technologies: Technology[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function TechnologySelect({ technologies, selectedIds, onChange }: TechnologySelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return technologies;
    const lower = search.toLowerCase();
    return technologies.filter((t) => t.name.toLowerCase().includes(lower));
  }, [technologies, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, Technology[]> = {};
    for (const tech of filtered) {
      if (!groups[tech.category]) groups[tech.category] = [];
      groups[tech.category].push(tech);
    }
    return groups;
  }, [filtered]);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedTechs = technologies.filter((t) => selectedIds.includes(t.id));

  return (
    <div>
      {/* Selected chips */}
      {selectedTechs.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedTechs.map((tech) => (
            <span
              key={tech.id}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#27272a] bg-[#18181b] px-2 py-1 text-xs font-medium text-[#a1a1aa]"
            >
              {tech.name}
              <button type="button" onClick={() => toggle(tech.id)} className="text-[#71717a] hover:text-red-400">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Toggle dropdown */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-lg border border-[#27272a] bg-[#111113] px-3 py-2.5 text-left text-sm text-[#a1a1aa] transition-colors hover:border-[#3f3f46]"
      >
        {selectedIds.length === 0
          ? "Select technologies..."
          : `${selectedIds.length} selected`}
      </button>

      {open && (
        <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-[#27272a] bg-[#111113] shadow-xl">
          {/* Search */}
          <div className="sticky top-0 flex items-center gap-2 border-b border-[#27272a] bg-[#111113] px-3 py-2">
            <Search size={14} className="text-[#71717a]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm text-[#fafafa] placeholder:text-[#71717a] focus:outline-none"
            />
          </div>

          {/* Grouped list */}
          {Object.entries(grouped).map(([category, techs]) => (
            <div key={category}>
              <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#71717a]">
                {category}
              </p>
              {techs.map((tech) => {
                const selected = selectedIds.includes(tech.id);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => toggle(tech.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-[#18181b]",
                      selected && "text-[#22c55e]",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        selected
                          ? "border-[#22c55e] bg-[#22c55e]/10"
                          : "border-[#27272a]",
                      )}
                    >
                      {selected && <Check size={10} />}
                    </div>
                    <span>{tech.name}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
