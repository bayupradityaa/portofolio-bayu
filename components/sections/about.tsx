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
    <section id="about" className="relative w-full bg-[#FFD177] text-black pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden select-none">
      {/* Top Black SVG Wave Transition flowing from Dark Hero (#000000) into Gold About Stage (#FFD177) */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none select-none z-20">
        <svg
          className="relative block w-full h-8 sm:h-12 lg:h-16 text-[#000000]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 L1440,0 L1440,40 C1280,85 1100,105 920,70 C740,35 560,90 380,75 C200,60 100,35 0,55 Z" />
        </svg>
      </div>

      {/* Ambient Lighting Overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto w-full max-w-6xl px-6 relative z-10 pt-4">

        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-black">
            About Me
          </h2>

          <div className="mt-8 max-w-4xl">
            <MagicText paragraphs={bio} activeColorClassName="text-black" />
          </div>
        </div>

        <dl className="relative z-10 mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-black/20 pt-12 md:mt-24 md:grid-cols-4">
          {defaultStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} as="div" className="text-center">
              <dt className="text-xs font-mono font-semibold uppercase tracking-wider text-black/70">{s.label}</dt>
              <dd className="mt-2 font-mono text-4xl font-extrabold tracking-tight text-black md:text-5xl">
                <Counter value={s.value} prefix={undefined} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>

      {/* Bottom Dark SVG Wave Transition flowing from Gold About Stage (#FFD177) into Dark TechStack (#000000) */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none select-none translate-y-px z-20">
        <svg
          className="relative block w-full h-8 sm:h-12 lg:h-16 text-[#000000]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,45 C180,85 360,35 540,75 C720,105 900,45 1080,70 C1260,95 1380,60 1440,40 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
