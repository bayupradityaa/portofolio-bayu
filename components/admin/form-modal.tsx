"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

type FormModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  submitLabel?: string;
};

export function FormModal({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel = "Save",
}: FormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        action={onSubmit}
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-[#27272a] bg-[#111113] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#27272a] px-6 py-4">
          <h2 className="text-base font-semibold text-[#fafafa]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-[#fafafa]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">{children}</div>

        <div className="flex justify-end gap-3 border-t border-[#27272a] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#27272a] bg-[#18181b] px-4 py-2 text-sm font-medium text-[#a1a1aa] transition-colors hover:text-[#fafafa]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#22c55e] px-4 py-2 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
