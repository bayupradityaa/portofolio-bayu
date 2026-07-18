import { cn } from "@/lib/utils";

/**
 * Monogram mark: "BP" set in the display font with the accent as an underscore
 * cursor, nodding to a terminal prompt without being a literal terminal.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-semibold tracking-tight",
        className,
      )}
      aria-label="Bayu Praditya"
    >
      <span>bayu</span>
      <span className="text-accent">.</span>
      <span className="sr-only">Praditya</span>
    </span>
  );
}
