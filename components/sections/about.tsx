import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { MagicText } from "@/components/motion/magic-text";
import { profile, stats } from "@/lib/data/profile";

export function About() {
  return (
    <Section id="about">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-5xl text-accent">
          About
        </h2>

        <div className="mt-8 max-w-4xl">
          <MagicText paragraphs={profile.bio} />
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-12 md:mt-24 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} as="div" className="text-center">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-2 font-mono text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
