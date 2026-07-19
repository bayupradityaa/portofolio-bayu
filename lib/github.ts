
export type Repo = {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  updatedAt: string;
};

export type ContributionDay = {
  date: string;
  count: number;
  /** 0-4 intensity bucket for the heatmap. */
  level: 0 | 1 | 2 | 3 | 4;
};

export type GitHubActivity = {
  repos: Repo[];
  totalContributions: number;
  weeks: ContributionDay[][];
  isPlaceholder: boolean;
};

const REVALIDATE_SECONDS = 60 * 60 * 6; // 6h — activity does not change fast

/**
 * Fetch latest public repos from the GitHub REST API (no auth required for public data).
 * Falls back gracefully so the section always renders.
 */
async function fetchRepos(user: string): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${user}/repos?sort=updated&per_page=6`,
    {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE_SECONDS },
    },
  );
  if (!res.ok) throw new Error(`GitHub repos ${res.status}`);
  const data = (await res.json()) as Array<{
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    updated_at: string;
    fork: boolean;
  }>;
  return data
    .filter((r) => !r.fork)
    .slice(0, 4)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count,
      language: r.language,
      updatedAt: r.updated_at,
    }));
}

/**
 * Contribution calendar. GitHub's official contribution graph is only exposed via the
 * GraphQL API (requires a token). To keep this key-free by default we read a small
 * public proxy; if it is unavailable we synthesize a stable placeholder calendar.
 * Wire GITHUB_TOKEN + the GraphQL query later for exact numbers.
 */
async function fetchContributions(
  user: string,
): Promise<{ total: number; weeks: ContributionDay[][] } | null> {
  try {
    const res = await fetch(
      `https://github.com/users/${user}/contributions`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        next: { revalidate: 60 * 5 }, // 5 minutes cache
      },
    );
    if (!res.ok) return null;
    const html = await res.text();

    const tooltips = new Map<string, string>();
    const tooltipRegex =
      /<tool-tip[^>]+for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
    let match;
    while ((match = tooltipRegex.exec(html)) !== null) {
      if (match[1] && match[2]) {
        tooltips.set(match[1], match[2].trim());
      }
    }

    const days: ContributionDay[] = [];
    const tdRegex =
      /<td[^>]+data-date="([^"]+)"[^>]+id="([^"]+)"[^>]+data-level="([^"]+)"/g;
    while ((match = tdRegex.exec(html)) !== null) {
      const date = match[1]!;
      const id = match[2]!;
      const levelVal = parseInt(match[3]!) as 0 | 1 | 2 | 3 | 4;

      const tooltipText = tooltips.get(id) || "";
      let count = 0;
      if (tooltipText && !tooltipText.startsWith("No")) {
        const parts = tooltipText.split(/\s+/);
        const parsed = parseInt(parts[0] || "0");
        if (!isNaN(parsed)) count = parsed;
      }

      days.push({
        date,
        count,
        level: levelVal,
      });
    }

    if (days.length === 0) return null;

    days.sort((a, b) => a.date.localeCompare(b.date));

    const weeks: ContributionDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const total = days.reduce((sum, d) => sum + d.count, 0);
    return { total, weeks };
  } catch {
    return null;
  }
}

/** Deterministic placeholder calendar so the UI is never empty. */
function placeholderCalendar(): { total: number; weeks: ContributionDay[][] } {
  const weeks: ContributionDay[][] = [];
  let total = 0;
  const now = new Date();
  for (let w = 51; w >= 0; w--) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      // Pseudo-random but stable pattern.
      const seed = (w * 7 + d) * 2654435761;
      const r = (seed % 100) / 100;
      const count = r > 0.55 ? Math.floor(r * 9) : 0;
      total += count;
      const level = (count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 7 ? 3 : 4) as ContributionDay["level"];
      const date = new Date(now);
      date.setDate(now.getDate() - (w * 7 + (6 - d)));
      week.push({ date: date.toISOString().slice(0, 10), count, level });
    }
    weeks.push(week);
  }
  return { total, weeks };
}

const placeholderRepos: Repo[] = [
  {
    name: "atlas",
    description: "Semantic search over your own documents, with cited streaming answers.",
    url: "https://github.com/bayupraditya/atlas",
    stars: 128,
    language: "TypeScript",
    updatedAt: new Date().toISOString(),
  },
  {
    name: "relay",
    description: "A typed gateway for background jobs: retries, DLQ, and observability.",
    url: "https://github.com/bayupraditya/relay",
    stars: 76,
    language: "TypeScript",
    updatedAt: new Date().toISOString(),
  },
  {
    name: "canvas",
    description: "Scroll-driven, image-sequence portfolio engine with reduced-motion support.",
    url: "https://github.com/bayupraditya/canvas",
    stars: 54,
    language: "TypeScript",
    updatedAt: new Date().toISOString(),
  },
  {
    name: "notes-ml",
    description: "Experiments in small on-device models for personal knowledge tools.",
    url: "https://github.com/bayupraditya/notes-ml",
    stars: 31,
    language: "Python",
    updatedAt: new Date().toISOString(),
  },
];

export async function getGitHubActivity(user: string): Promise<GitHubActivity> {
  try {
    const [repos, contributions] = await Promise.all([
      fetchRepos(user),
      fetchContributions(user),
    ]);
    const calendar = contributions ?? placeholderCalendar();
    return {
      repos: repos.length ? repos : placeholderRepos,
      totalContributions: calendar.total,
      weeks: calendar.weeks,
      isPlaceholder: !contributions || repos.length === 0,
    };
  } catch {
    const calendar = placeholderCalendar();
    return {
      repos: placeholderRepos,
      totalContributions: calendar.total,
      weeks: calendar.weeks,
      isPlaceholder: true,
    };
  }
}
