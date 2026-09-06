import { cn } from "@/lib/utils";

/** Small monospace tag used for tech labels. Neutral by default. */
export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-1 " +
          "font-sans text-xs text-secondary font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
