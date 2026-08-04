import { cn } from "@/lib/utils";

/**
 * Section boundary.
 *
 * Replaces the old SVG wave transitions. Editorial design doesn't blur
 * sections into each other; it sets them off with a hairline and a tiny
 * mono caption. The whole page reads as one continuous printed sheet with
 * labelled chapters.
 */
export function SectionRule({
  number,
  label,
  id,
  className,
}: {
  number?: string;
  label: string;
  id?: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "mx-auto flex w-full max-w-7xl items-center gap-6 px-6 py-8",
        className,
      )}
    >
      {number && (
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {number}
        </span>
      )}
      <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-80">
        {label}
      </span>
      <span className="h-px flex-1 bg-current opacity-25" />
    </div>
  );
}
