import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { techGroups } from "@/lib/data/techstack";
import type { TechGroup } from "@/lib/data/types";

const spanClass: Record<TechGroup["span"], string> = {
  lg: "md:col-span-2 md:row-span-2",
  md: "md:col-span-2",
  sm: "md:col-span-1",
};

export function TechStack() {
  return (
    <Section id="stack">
      <SectionHeading
        title="A stack chosen on purpose"
        lead="Tools I reach for because they hold up in production, not because they trend. Grouped by where they do their work."
      />

      <div className="mt-14 grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 md:grid-cols-4">
        {techGroups.map((group, i) => (
          <Reveal
            key={group.id}
            delay={i * 0.05}
            as="div"
            className={cn(spanClass[group.span])}
          >
            <BentoCell group={group} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function BentoCell({ group }: { group: TechGroup }) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-300",
        group.accent
          ? "border-accent/25 bg-card"
          : "border-border bg-card hover:border-secondary/40",
      )}
    >
      {group.accent && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(90% 60% at 100% 0%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 55%)",
          }}
        />
      )}

      <div className="relative">
        <h3 className="text-lg font-semibold tracking-tight">{group.title}</h3>
        <p className="mt-1.5 text-sm text-muted">{group.blurb}</p>
      </div>

      <ul className="relative mt-6 flex flex-1 flex-col justify-end gap-2.5">
        {group.items.map((item) => (
          <li
            key={item.name}
            className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2.5 last:border-0"
          >
            <span className="text-sm font-medium text-foreground">
              {item.name}
            </span>
            <span className="font-mono text-xs text-muted">{item.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
