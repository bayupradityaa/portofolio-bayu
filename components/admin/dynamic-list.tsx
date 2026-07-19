"use client";

import { Plus, X, GripVertical } from "lucide-react";
import { useState } from "react";

type DynamicListProps = {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  maxItems?: number;
};

export function DynamicList({
  values,
  onChange,
  placeholder = "Add item...",
  label = "Items",
  maxItems = 20,
}: DynamicListProps) {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed || values.length >= maxItems) return;
    onChange([...values, trimmed]);
    setNewItem("");
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= values.length) return;
    const updated = [...values];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#fafafa]">{label}</label>
      )}

      {/* Existing items */}
      {values.length > 0 && (
        <ul className="mb-3 space-y-2">
          {values.map((item, i) => (
            <li
              key={i}
              className="group flex items-center gap-2 rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2"
            >
              <button
                type="button"
                className="cursor-grab text-[#71717a] transition-colors hover:text-[#fafafa] active:cursor-grabbing"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => moveItem(i, i - 1)}
              >
                <GripVertical size={14} />
              </button>
              <span className="flex-1 text-sm text-[#a1a1aa]">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-[#71717a] transition-colors hover:text-red-400"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add new */}
      {values.length < maxItems && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-[#27272a] bg-[#111113] px-3 py-2 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
          />
          <button
            type="button"
            onClick={addItem}
            disabled={!newItem.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-[#18181b] px-3 py-2 text-sm font-medium text-[#a1a1aa] transition-colors hover:bg-[#27272a] hover:text-[#fafafa] disabled:opacity-40"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      )}
    </div>
  );
}
