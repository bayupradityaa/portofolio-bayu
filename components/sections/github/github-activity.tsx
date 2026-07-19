import { ArrowUpRight, GitBranch, Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { getGitHubActivity } from "@/lib/github";
import { getProfileSettings } from "@/lib/actions/settings";
import { GithubCalendar } from "./github-calendar";

/** Server Component: fetches (and caches) public GitHub data at build/revalidate. */
export async function GitHubActivity() {
  const settings = await getProfileSettings();
  const githubUser = settings?.github ? settings.github.trim().split("/").pop() || "bayupradityaa" : "bayupradityaa";
  const activity = await getGitHubActivity(githubUser);

  return (
    <Section id="github">
      <SectionHeading
        title="Building in public"
        lead="I ship in the open. Contributions, latest repositories, and what I am working through right now."
      />

      <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Contribution graph — spans two columns */}
        <Reveal as="div" className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-mono text-4xl font-semibold tracking-tight">
                {activity.totalContributions.toLocaleString("en-US")}
              </h3>
              <a
                href={`https://github.com/${githubUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-secondary transition-colors hover:text-foreground"
              >
                @{githubUser}
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </a>
            </div>
            <p className="mt-1 text-sm text-muted">
              contributions in the last year
            </p>

            <div className="mt-6 flex-1">
              <GithubCalendar
                username={githubUser}
                weeksProp={activity.weeks}
                showStats={false}
                className="border-none p-0 bg-transparent"
              />
            </div>
          </div>
        </Reveal>

        {/* Building-in-public note */}
        <Reveal as="div" delay={0.08}>
          <div className="flex h-full flex-col justify-between rounded-2xl border border-accent/25 bg-card p-6">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                now building
              </span>
              <p className="mt-4 text-lg leading-relaxed text-foreground">
                An on-device retrieval layer for personal knowledge tools, plus
                writing about every decision along the way.
              </p>
            </div>
            <p className="mt-6 text-sm text-muted">
              Follow along on GitHub for weekly commits and notes.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Latest repositories */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {activity.repos.map((repo, i) => (
          <Reveal key={repo.name} delay={i * 0.05} as="div">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-secondary/40"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-mono text-sm text-foreground">
                  <GitBranch size={15} strokeWidth={1.5} className="text-accent" />
                  {repo.name}
                </span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.5}
                  className="text-muted transition-colors group-hover:text-accent"
                />
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary">
                {repo.description ?? "No description provided."}
              </p>
              <div className="mt-5 flex items-center gap-4 text-xs text-muted">
                {repo.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {repo.language}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Star size={13} strokeWidth={1.5} />
                  {repo.stars}
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      {activity.isPlaceholder && (
        <p className="mt-6 text-xs text-muted">
          Showing sample data. Set a real GitHub URL in the Admin Settings Panel
          to pull live activity.
        </p>
      )}
    </Section>
  );
}
