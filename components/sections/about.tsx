import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { MagicText } from "@/components/motion/magic-text";
import type { ProfileSettings } from "@/lib/types/database";

// Fallback stats — these can be moved to Supabase later
const defaultStats = [
  { label: "Business active since", value: 2023, suffix: "" },
  { label: "Happy Gamers / Orders", value: 5000, suffix: "+" },
  { label: "Technologies in rotation", value: 10, suffix: "+" },
  { label: "Design assets crafted", value: 30, suffix: "+" },
];

export async function About({ settings }: { settings: ProfileSettings | null }) {

  const bio = settings?.about && settings.about.length > 0
    ? settings.about
    : ["No bio configured yet."];

  return (
    <section
      id="about"
      className="relative w-full bg-background text-foreground pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden select-none"
    >
      {/* Editorial hairline separating hero from about */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border/40" />

      {/* Subtle accent glow — much softer than the gold era */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto w-full max-w-6xl px-6 relative z-10 pt-4">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            About Me
          </h2>

          <div className="mt-8 max-w-4xl">
            <MagicText paragraphs={bio} activeColorClassName="text-accent" />
          </div>
        </div>

        <dl className="relative z-10 mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-12 md:mt-24 md:grid-cols-4">
          {defaultStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} as="div" className="text-center">
              <dt className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">{s.label}</dt>
              <dd className="mt-2 font-mono text-4xl font-extrabold tracking-tight text-accent md:text-5xl">
                <Counter value={s.value} prefix={undefined} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
