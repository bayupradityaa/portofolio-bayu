import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { MagicText } from "@/components/motion/magic-text";
import { getProfileSettings } from "@/lib/actions/settings";

// Fallback stats — these can be moved to Supabase later
const defaultStats = [
  { label: "Business active since", value: 2023, suffix: "" },
  { label: "Happy Gamers / Orders", value: 5000, suffix: "+" },
  { label: "Technologies in rotation", value: 10, suffix: "+" },
  { label: "Design assets crafted", value: 30, suffix: "+" },
];

export async function About() {
  const settings = await getProfileSettings();

  const bio = settings?.about && settings.about.length > 0
    ? settings.about
    : ["No bio configured yet."];

  return (
    <Section id="about" hairline={false}>
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-5xl text-accent">
          About
        </h2>

        <div className="mt-8 max-w-4xl">
          <MagicText paragraphs={bio} />
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-12 md:mt-24 md:grid-cols-4">
        {defaultStats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} as="div" className="text-center">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-2 font-mono text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              <Counter value={s.value} prefix={undefined} suffix={s.suffix} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
