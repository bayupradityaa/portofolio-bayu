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

export type GitHubStreakStats = {
  totalContributions: number;
  totalRange: string;
  currentStreak: {
    count: number;
    startDate: string;
    endDate: string;
  };
  longestStreak: {
    count: number;
    startDate: string;
    endDate: string;
  };
  last30Days: Array<{
    day: number;
    count: number;
    date: string;
  }>;
};

export type GitHubActivity = {
  repos: Repo[];
  totalContributions: number;
  weeks: ContributionDay[][];
  streakStats: GitHubStreakStats;
  isPlaceholder: boolean;
};

const REVALIDATE_SECONDS = 60 * 60 * 6; // 6h — activity does not change fast

/**
 * Fetch latest public repos from the GitHub REST API (no auth required for public data).
 */
async function fetchRepos(user: string): Promise<Repo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${user}/repos?sort=updated&per_page=6`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) return [];
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
  } catch {
    return [];
  }
}

/**
 * Contribution calendar fetch.
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
];

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateRange(startDateStr: string): string {
  const d = new Date(startDateStr);
  if (isNaN(d.getTime())) return "May 5, 2023 - Present";
  const start = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${start} - Present`;
}

export function getFallbackStreakStats(): GitHubStreakStats {
  const fallbackCounts = [
    0, 0, 0, 0, 0, 19, 3, 3, 5, 3,
    6, 13, 5, 4, 5, 0, 0, 7, 6, 4,
    3, 8, 2, 0, 8, 3, 6, 6, 7, 11
  ];

  return {
    totalContributions: 279,
    totalRange: "May 5, 2023 - Present",
    currentStreak: {
      count: 6,
      startDate: "Jul 25",
      endDate: "Jul 30",
    },
    longestStreak: {
      count: 11,
      startDate: "Jun 13",
      endDate: "Jun 23",
    },
    last30Days: fallbackCounts.map((count, i) => ({
      day: i + 1,
      count,
      date: `Day ${i + 1}`,
    })),
  };
}

export function computeStreakStats(
  weeks: ContributionDay[][],
): GitHubStreakStats {
  const allDays = weeks.flat().filter((d) => Boolean(d.date));
  if (allDays.length === 0) {
    return getFallbackStreakStats();
  }

  const totalContributions = allDays.reduce((acc, d) => acc + d.count, 0);

  const firstActive = allDays.find((d) => d.count > 0) || allDays[0];
  const totalRange = firstActive ? formatDateRange(firstActive.date) : "May 5, 2023 - Present";

  let maxStreak = 0;
  let maxStart = "";
  let maxEnd = "";

  let tempStreak = 0;
  let tempStart = "";

  for (let i = 0; i < allDays.length; i++) {
    const day = allDays[i];
    if (day.count > 0) {
      if (tempStreak === 0) tempStart = day.date;
      tempStreak++;
      if (tempStreak >= maxStreak) {
        maxStreak = tempStreak;
        maxStart = tempStart;
        maxEnd = day.date;
      }
    } else {
      tempStreak = 0;
    }
  }

  let currentStreakCount = 0;
  let currentStart = "";
  let currentEnd = "";

  let i = allDays.length - 1;
  // If today has 0 contributions so far, check if yesterday was part of active streak
  if (i >= 0 && allDays[i].count === 0 && i > 0 && allDays[i - 1].count > 0) {
    i = i - 1;
  }

  if (i >= 0 && allDays[i].count > 0) {
    currentEnd = allDays[i].date;
    while (i >= 0 && allDays[i].count > 0) {
      currentStreakCount++;
      currentStart = allDays[i].date;
      i--;
    }
  }

  const last30 = allDays.slice(-30);
  const last30Days = last30.map((d, index) => ({
    day: index + 1,
    count: d.count,
    date: d.date,
  }));

  return {
    totalContributions,
    totalRange,
    currentStreak: {
      count: currentStreakCount,
      startDate: currentStart ? formatDateShort(currentStart) : "N/A",
      endDate: currentEnd ? formatDateShort(currentEnd) : "N/A",
    },
    longestStreak: {
      count: maxStreak,
      startDate: maxStart ? formatDateShort(maxStart) : "N/A",
      endDate: maxEnd ? formatDateShort(maxEnd) : "N/A",
    },
    last30Days: last30Days.length === 30 ? last30Days : getFallbackStreakStats().last30Days,
  };
}

export async function getGitHubActivity(user: string): Promise<GitHubActivity> {
  try {
    const [repos, contributions] = await Promise.all([
      fetchRepos(user),
      fetchContributions(user),
    ]);
    const calendar = contributions ?? placeholderCalendar();
    const streakStats = computeStreakStats(calendar.weeks);
    return {
      repos: repos.length ? repos : placeholderRepos,
      totalContributions: calendar.total,
      weeks: calendar.weeks,
      streakStats,
      isPlaceholder: !contributions || repos.length === 0,
    };
  } catch {
    const calendar = placeholderCalendar();
    const streakStats = getFallbackStreakStats();
    return {
      repos: placeholderRepos,
      totalContributions: calendar.total,
      weeks: calendar.weeks,
      streakStats,
      isPlaceholder: true,
    };
  }
}
