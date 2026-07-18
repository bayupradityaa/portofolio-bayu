import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { profile, stats } from "@/lib/data/profile";

export function About() {
  return (
    <Section id="about">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div>
          <p className="font-mono text-sm text-accent">About</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Engineering as a
            <br />
            craft, not a checklist.
          </h2>
        </div>

        <div className="space-y-6">
          {profile.bio.map((para, i) => (
            <Reveal key={i} delay={i * 0.08} as="div">
              <p className="max-w-[62ch] text-lg leading-relaxed text-secondary">
                {para}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-12 md:mt-24 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} as="div">
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
