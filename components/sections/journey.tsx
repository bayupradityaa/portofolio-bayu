import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { getPublishedExperience } from "@/lib/actions/experience";

export async function Journey() {
  const timeline = await getPublishedExperience();

  if (timeline.length === 0) return null;

  return (
    <Section id="journey">
      <SectionHeading
        title="The path so far"
        lead="How I got from first lines of code to building products end to end. Most recent first."
      />

      <ol className="mt-14 border-l border-border">
        {timeline.map((entry, i) => (
          <Reveal key={entry.id} delay={i * 0.06} as="li">
            <div className="relative pb-12 pl-8 last:pb-0">
              {/* node */}
              <span className="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-accent" />

              <p className="font-mono text-xs text-muted">{entry.period}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                {entry.title}
              </h3>
              <p className="mt-0.5 text-sm text-accent">{entry.org}</p>
              <p className="mt-3 max-w-[58ch] leading-relaxed text-secondary">
                {entry.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
