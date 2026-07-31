import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { getGitHubActivity } from "@/lib/github";
import { getProfileSettings } from "@/lib/actions/settings";
import { GithubAnalyticsCard } from "./github-analytics-card";
import { GithubContributionGraph } from "./github-contribution-graph";
import { OrganicTransition } from "@/components/ui/organic-transition";
import dynamic from "next/dynamic";

const GithubCalendar = dynamic(
  () => import("./github-calendar").then((m) => ({ default: m.GithubCalendar })),
);

/** Server Component: fetches public GitHub data & analytics. */
export async function GitHubActivity() {
  const settings = await getProfileSettings();
  const githubUser = settings?.github ? settings.github.trim().split("/").pop() || "bayupradityaa" : "bayupradityaa";
  const activity = await getGitHubActivity(githubUser);

  const displayName = settings?.name || "Bayu Praditya";

  return (
    <section id="github" className="relative w-full bg-ch-github text-foreground pt-28 pb-36 md:pt-36 md:pb-48 overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <SectionHeading
            title="Building in public"
            lead="Live contribution activity and analytics tracked directly from GitHub."
          />
          <a
            href={`https://github.com/${githubUser}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-emerald-400 hover:text-emerald-300 transition-colors self-start sm:self-auto"
          >
            @{githubUser}
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </a>
        </div>

        {/* GitHub Analytics Card (Total Contributions, Current Streak with Flame Ring, Longest Streak) */}
        <Reveal as="div">
          <GithubAnalyticsCard stats={activity.streakStats} />
        </Reveal>

        {/* Contribution Activity Line Graph */}
        <Reveal as="div" delay={0.08} className="mt-8">
          <GithubContributionGraph userName={displayName} data={activity.streakStats.last30Days} />
        </Reveal>

        {/* Full Year Contribution Heatmap Calendar */}
        <Reveal as="div" delay={0.12} className="mt-12">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-mono text-sm font-semibold uppercase tracking-wider text-muted">
                Annual Contribution Heatmap
              </h4>
              <span className="text-xs font-mono text-emerald-400">
                {activity.totalContributions.toLocaleString("en-US")} commits this year
              </span>
            </div>
            <GithubCalendar
              username={githubUser}
              weeksProp={activity.weeks}
              showStats={false}
              className="border-none p-0 bg-transparent"
            />
          </div>
        </Reveal>

        {activity.isPlaceholder && (
          <p className="mt-6 text-xs text-muted">
            Showing calculated data. Set a real GitHub URL in the Admin Settings Panel to pull live activity.
          </p>
        )}
      </div>

      {/* Organic transition boundary into Contact */}
      <OrganicTransition fillColor="fill-ch-contact" variant="slope-right" />
    </section>
  );
}
