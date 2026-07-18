import { cn } from "@/lib/utils";

/** Standard section shell: id anchor, vertical rhythm, centered max width. */
export function Section({
  id,
  className,
  children,
  hairline = true,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  hairline?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-24 md:py-32",
        hairline && "hairline-t",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
    </section>
  );
}

/**
 * Section heading. `index` is an ordinal shown only where the content is truly a
 * sequence; leave it off elsewhere. Eyebrows are used sparingly across the page.
 */
export function SectionHeading({
  title,
  lead,
  className,
}: {
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h2>
      {lead ? (
        <p className="mt-5 text-base leading-relaxed text-secondary md:text-lg">
          {lead}
        </p>
      ) : null}
    </div>
  );
}
