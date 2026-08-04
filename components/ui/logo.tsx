import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-semibold tracking-tight",
        className,
      )}
      aria-label="Bayu Praditya"
    >
      <span>Bayu Praditya</span>
      <span className="text-accent">.</span>
    </span>
  );
}
