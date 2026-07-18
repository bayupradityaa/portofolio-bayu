"use client";

import { memo, useMemo, useState, useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionData = {
  [date: string]: {
    level: ContributionLevel;
    label?: string;
    count?: number;
  };
};

export type ThemeColors = {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
};

export type CellShape = "rounded" | "circle";

export type GithubCalendarProps = {
  username?: string; // GitHub username
  data?: ContributionData; //Optional - Only for manual data
  weeksProp?: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[][];
  startDate?: string;
  endDate?: string;
  startsOnSunday?: boolean; //Want to start weeks on Sunday or not ?
  cellSize?: number;
  cellGap?: number;
  cellShape?: CellShape; //Rounded | Circle
  theme?: "github" | ThemeColors;
  showMonthLabels?: boolean; // Want the month labels on top
  showStats?: boolean;
  showLegend?: boolean;
  className?: string; // Custom class for custom styling
};

// ─── Built-in themes (Adapted for accent green theme) ──────────────────────────

const THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "rgba(9,9,11,0.06)",
    level1: "rgba(34,197,94,0.18)",
    level2: "rgba(34,197,94,0.40)",
    level3: "rgba(34,197,94,0.65)",
    level4: "rgba(34,197,94,1.00)",
  },
};

const DARK_THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "rgba(255,255,255,0.04)",
    level1: "rgba(34,197,94,0.20)",
    level2: "rgba(34,197,94,0.45)",
    level3: "rgba(34,197,94,0.70)",
    level4: "rgba(34,197,94,1.00)",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const FULL_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatTooltipDate(dateStr: string): string {
  try {
    const date = parseDate(dateStr);
    const month = FULL_MONTH_NAMES[date.getMonth()];
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    return `${month} ${day}${suffix}`;
  } catch {
    return dateStr;
  }
}

// ─── API fetch ────────────────────────────────────────────────────────────────

type APIResponse = {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
};

async function fetchContributions(username: string): Promise<ContributionData> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}`,
  );
  if (!res.ok) {
    throw new Error(
      `Could not fetch contributions for "${username}" (${res.status})`,
    );
  }
  const json: APIResponse = await res.json();

  const result: ContributionData = {};
  for (const entry of json.contributions) {
    result[entry.date] = {
      level: Math.min(4, Math.max(0, entry.level)) as ContributionLevel,
      count: entry.count,
    };
  }
  return result;
}

// ─── Build calendar grid ──────────────────────────────────────────────────────

function buildGrid(
  startDate: string,
  endDate: string,
  startsOnSunday: boolean,
): {
  weeks: (string | null)[][];
  monthLabels: { label: string; weekIndex: number }[];
  gridStart: string;
} {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const startDay = startsOnSunday ? 0 : 1;
  const startDow = start.getDay();
  const offset = (startDow - startDay + 7) % 7;
  const gridStart = addDays(start, -offset);

  const weeks: (string | null)[][] = [];
  const monthLabels: { label: string; weekIndex: number }[] = [];

  let current = new Date(gridStart);
  let weekIndex = 0;
  let lastMonth = -1;

  while (
    current <= end ||
    (weeks.length > 0 && (weeks[weeks.length - 1]?.length ?? 0) < 7)
  ) {
    const week: (string | null)[] = [];

    for (let d = 0; d < 7; d++) {
      const dateStr = formatDate(current);
      const isInRange = current >= start && current <= end;
      week.push(isInRange ? dateStr : null);

      if (isInRange && current.getMonth() !== lastMonth) {
        lastMonth = current.getMonth();
        monthLabels.push({
          label: MONTH_NAMES[current.getMonth()]!,
          weekIndex,
        });
      }

      current = addDays(current, 1);
    }

    weeks.push(week);
    weekIndex++;

    if (
      current > end &&
      weeks.length > 0 &&
      (weeks[weeks.length - 1]?.every(
        (d) => d === null || parseDate(d) > end,
      ) ??
        false)
    )
      break;
  }

  return { weeks, monthLabels, gridStart: formatDate(gridStart) };
}

// ─── Tooltip state type ───────────────────────────────────────────────────────

type TooltipState = {
  visible: boolean;
  date: string;
  count: number | undefined;
  label: string | undefined;
  x: number;
  y: number;
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function CalendarSkeleton({
  cellSize = 12,
  cellGap = 3,
  className,
}: {
  cellSize?: number;
  cellGap?: number;
  className?: string;
}) {
  const step = cellSize + cellGap;
  const weeks = 53;
  const days = 7;
  return (
    <div className={cn("w-full space-y-3 animate-pulse", className)}>
      <div className="flex gap-6">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
      </div>
      <div className="overflow-x-auto">
        <svg
          width={weeks * step - cellGap}
          height={16 + days * step - cellGap}
          className="overflow-visible"
        >
          {Array.from({ length: weeks }).map((_, wi) =>
            Array.from({ length: days }).map((_, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * step}
                y={16 + di * step}
                width={cellSize}
                height={cellSize}
                rx={cellSize * 0.2}
                className="fill-muted/30"
              />
            )),
          )}
        </svg>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const GithubCalendar = memo(function GithubCalendar({
  username,
  data: dataProp,
  startDate,
  endDate,
  startsOnSunday = true,
  cellSize = 10,
  cellGap = 3,
  cellShape = "rounded",
  theme = "github",
  showMonthLabels = true,
  showStats = true,
  showLegend = true,
  className,
  weeksProp,
}: GithubCalendarProps) {
  const id = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.body.classList.contains("dark"),
      );
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    const opts = { attributes: true, attributeFilter: ["class"] };
    observer.observe(document.documentElement, opts);
    observer.observe(document.body, opts);

    return () => observer.disconnect();
  }, []);

  // ── Process initial data from weeksProp if provided ───────────────────
  const initialData = useMemo(() => {
    if (!weeksProp) return null;
    const result: ContributionData = {};
    weeksProp.forEach((week) => {
      week.forEach((day) => {
        if (!day) return;
        result[day.date] = {
          level: day.level as ContributionLevel,
          count: day.count,
        };
      });
    });
    return result;
  }, [weeksProp]);

  // ── Fetch state ────────────────────────────────────────────────────────
  const [fetchedData, setFetchedData] = useState<ContributionData | null>(initialData);
  const [loading, setLoading] = useState(!initialData && !!username);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Adjust state during render if props change (React recommended pattern)
  const [prevUsername, setPrevUsername] = useState(username);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (initialData !== prevInitialData || username !== prevUsername) {
    setFetchedData(initialData);
    setLoading(!initialData && !!username);
    setPrevInitialData(initialData);
    setPrevUsername(username);
  }

  useEffect(() => {
    if (initialData) return;
    if (!username) return;
    let active = true;

    fetchContributions(username)
      .then((d) => {
        if (active) setFetchedData(d);
      })
      .catch((e) => {
        if (active) setFetchError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [username, initialData]);

  // ── Choose data source ─────────────────────────────────────────────────
  const data = useMemo(
    () => dataProp ?? fetchedData ?? {},
    [dataProp, fetchedData]
  );

  // ── Resolve dates ──────────────────────────────────────────────────────
  const resolvedEnd = endDate ?? formatDate(new Date());
  const resolvedStart = useMemo(() => {
    if (startDate) return startDate;
    const d = parseDate(resolvedEnd);
    d.setFullYear(d.getFullYear() - 1);
    d.setDate(d.getDate() + 1);
    return formatDate(d);
  }, [startDate, resolvedEnd]);

  // ── Resolve theme colors ───────────────────────────────────────────────
  const activeColors = useMemo(() => {
    if (typeof theme === "object") return theme;
    return isDark ? DARK_THEMES.github : THEMES.github;
  }, [theme, isDark]);

  // ── Tooltip state ──────────────────────────────────────────────────────
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    date: "",
    count: undefined,
    label: undefined,
    x: 0,
    y: 0,
  });

  // ── Build grid ─────────────────────────────────────────────────────────
  const { weeks, monthLabels, gridStart } = useMemo(
    () => buildGrid(resolvedStart, resolvedEnd, startsOnSunday),
    [resolvedStart, resolvedEnd, startsOnSunday],
  );

  // ── Stats ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const entries = Object.entries(data);
    const total = entries.reduce(
      (sum, [date, v]) => {
        const isInRange = date >= resolvedStart && date <= resolvedEnd;
        if (!isInRange) return sum;
        return sum + (v.count ?? (v.level > 0 ? 1 : 0));
      },
      0,
    );
    const activeDays = entries.filter(([, v]) => v.level > 0).length;
    const maxStreak = (() => {
      let max = 0;
      let cur = 0;
      const sorted = entries
        .filter(([, v]) => v.level > 0)
        .map(([d]) => d)
        .sort();
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0) {
          cur = 1;
          max = 1;
          continue;
        }
        const prev = parseDate(sorted[i - 1]!);
        const curr = parseDate(sorted[i]!);
        const diff = (curr.getTime() - prev.getTime()) / 86400000;
        if (diff === 1) {
          cur++;
          max = Math.max(max, cur);
        } else cur = 1;
      }
      return max;
    })();
    return { total, activeDays, maxStreak };
  }, [data, resolvedStart, resolvedEnd]);

  // ── Dimensions ────────────────────────────────────────────────────────
  const step = cellSize + cellGap;
  const monthLabelHeight = showMonthLabels && !gameActive ? 20 : 0;
  const svgWidth = weeks.length * step - cellGap;
  const svgHeight = monthLabelHeight + 7 * step - cellGap;

  // Auto-scroll to the right end (most recent months)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [fetchedData, dataProp]);

  // Game loop and autoplay logic
  useEffect(() => {
    if (!gameActive) {
      weeks.forEach((week) => {
        week.forEach((date) => {
          if (!date) return;
          const rect = document.getElementById(`cell-${id}-${date}`);
          if (rect) {
            rect.style.opacity = "1";
            rect.style.pointerEvents = "auto";
            const originalLevel = data[date]?.level ?? 0;
            const originalColor =
              activeColors[`level${originalLevel}` as keyof ThemeColors] ||
              activeColors.level0;
            rect.setAttribute("fill", originalColor);
          }
        });
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = svgWidth;
    const height = svgHeight + 80;
    canvas.width = width;
    canvas.height = height;

    const cellLevels = new Map<string, number>();
    weeks.forEach((week) => {
      week.forEach((date) => {
        if (!date) return;
        const entry = data[date];
        const initialLevel = entry?.level ?? 0;
        cellLevels.set(date, initialLevel);
        const rect = document.getElementById(`cell-${id}-${date}`);
        if (rect) {
          if (initialLevel === 0) {
            rect.style.opacity = "0";
            rect.style.pointerEvents = "none";
          } else {
            rect.style.opacity = "1";
            rect.style.pointerEvents = "auto";
          }
        }
      });
    });

    const player = {
      x: width / 2 - 15,
      y: height - 25,
      width: 30,
      height: 20,
      speed: 4,
      direction: 1,
      color: "#22c55e", // Matching green accent
    };

    type GameBullet = {
      x: number;
      y: number;
      vy: number;
      width: number;
      height: number;
      color: string;
    };
    let bullets: GameBullet[] = [];
    let lastShot = 0;
    const cooldown = 140;

    const shoot = () => {
      bullets.push({
        x: player.x + player.width / 2 - 1.5,
        y: player.y - 4,
        vy: -6,
        width: 3,
        height: 8,
        color: "#fbbf24",
      });
    };

    const stars = Array.from({ length: 140 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 0.4 + 0.1,
      size: Math.random() * 1.2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    type GameParticle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
    };
    let particles: GameParticle[] = [];
    const explode = (x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: Math.random() * 2 + 1,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 15 + 15,
        });
      }
    };

    const update = () => {
      let minWi = -1;
      let maxWi = -1;
      weeks.forEach((week, wi) => {
        week.forEach((date) => {
          if (!date) return;
          if ((cellLevels.get(date) ?? 0) > 0) {
            if (minWi === -1) minWi = wi;
            minWi = Math.min(minWi, wi);
            maxWi = Math.max(maxWi, wi);
          }
        });
      });

      let minX = 0;
      let maxX = width - player.width;
      if (minWi !== -1 && maxWi !== -1) {
        minX = minWi * step;
        maxX = Math.max(
          minX,
          Math.min(width - player.width, (maxWi + 1) * step - player.width),
        );
      }

      player.x = Math.max(minX, Math.min(maxX, player.x));
      player.x += player.speed * player.direction;
      if (player.x >= maxX) {
        player.x = maxX;
        player.direction = -1;
      } else if (player.x <= minX) {
        player.x = minX;
        player.direction = 1;
      }

      const now = Date.now();
      if (now - lastShot >= cooldown) {
        shoot();
        lastShot = now;
      }

      let anyActive = false;
      cellLevels.forEach((level) => {
        if (level > 0) anyActive = true;
      });

      if (!anyActive) {
        weeks.forEach((week) => {
          week.forEach((date) => {
            if (!date) return;
            const originalLevel = data[date]?.level ?? 0;
            cellLevels.set(date, originalLevel);
            const rect = document.getElementById(`cell-${id}-${date}`);
            if (rect) {
              const originalColor =
                activeColors[`level${originalLevel}` as keyof ThemeColors] ||
                activeColors.level0;
              rect.setAttribute("fill", originalColor);
              if (originalLevel === 0) {
                rect.style.opacity = "0";
                rect.style.pointerEvents = "none";
              } else {
                rect.style.opacity = "1";
                rect.style.pointerEvents = "auto";
              }
            }
          });
        });
      }

      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
      });

      bullets = bullets.filter((b) => {
        b.y += b.vy;
        return b.y > 0;
      });

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;
      });
      particles = particles.filter((p) => p.life < p.maxLife);

      bullets.forEach((bullet, bulletIdx) => {
        weeks.forEach((week, wi) => {
          week.forEach((date, di) => {
            if (!date) return;

            const currentLevel = cellLevels.get(date) ?? 0;
            if (currentLevel === 0) return;

            const cellX = wi * step;
            const cellY = monthLabelHeight + di * step;

            if (
              bullet.x < cellX + cellSize &&
              bullet.x + bullet.width > cellX &&
              bullet.y < cellY + cellSize &&
              bullet.y + bullet.height > cellY
            ) {
              bullets.splice(bulletIdx, 1);
              const newLevel = currentLevel - 1;
              cellLevels.set(date, newLevel);

              const rect = document.getElementById(`cell-${id}-${date}`);
              if (rect) {
                if (newLevel === 0) {
                  rect.style.opacity = "0";
                  rect.style.pointerEvents = "none";
                } else {
                  const newColor =
                    activeColors[`level${newLevel}` as keyof ThemeColors] ||
                    activeColors.level0;
                  rect.setAttribute("fill", newColor);
                }
              }

              const hitColor =
                activeColors[`level${currentLevel}` as keyof ThemeColors] ||
                activeColors.level0;
              explode(cellX + cellSize / 2, cellY + cellSize / 2, hitColor);
            }
          });
        });
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#ffffff";
      stars.forEach((s) => {
        ctx.globalAlpha = s.alpha;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.globalAlpha = 1.0;

      bullets.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = player.color;
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.lineTo(
        player.x + player.width * 0.7,
        player.y + player.height * 0.75,
      );
      ctx.lineTo(
        player.x + player.width * 0.3,
        player.y + player.height * 0.75,
      );
      ctx.lineTo(player.x, player.y + player.height);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      update();
      render();
      if (gameActive) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    gameActive,
    data,
    weeks,
    step,
    cellSize,
    cellGap,
    monthLabelHeight,
    activeColors,
    id,
    svgWidth,
    svgHeight,
  ]);

  if (loading) {
    return (
      <CalendarSkeleton
        cellSize={cellSize}
        cellGap={cellGap}
        className={className}
      />
    );
  }

  if (fetchError) {
    return (
      <div
        className={cn(
          "w-fit mx-auto flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
          className,
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {fetchError}
      </div>
    );
  }

  const cellRx = cellShape === "circle" ? cellSize / 2 : cellSize * 0.2;

  return (
    <div
      className={cn(
        "w-full overflow-x-hidden border border-border rounded-xl transition-all duration-500 bg-card p-4",
        gameActive ? "bg-black border-neutral-800" : "",
        className,
      )}
    >
      <div className="w-full flex flex-col gap-3">
        <div
          ref={scrollRef}
          className={cn(
            "relative overflow-x-auto transition-all duration-500",
            gameActive ? "pb-[80px]" : "",
          )}
          style={
            {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties
          }
        >
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="overflow-visible"
          >
            {/* month labels */}
            {showMonthLabels &&
              !gameActive &&
              (() => {
                const byWeek = new Map<number, string>();
                monthLabels.forEach(({ label, weekIndex }) =>
                  byWeek.set(weekIndex, label),
                );
                const entries = Array.from(byWeek.entries());
                const validEntries: [number, string][] = [];
                for (let i = 0; i < entries.length; i++) {
                  const current = entries[i]!;
                  const next = entries[i + 1];
                  if (i === 0 && next && next[0] - current[0] < 3) {
                    continue;
                  }
                  const lastValid = validEntries[validEntries.length - 1];
                  if (lastValid && current[0] - lastValid[0] < 3) {
                    continue;
                  }
                  validEntries.push(current);
                }
                return validEntries.map(([weekIndex, label]) => (
                  <text
                    key={`${label}-${weekIndex}`}
                    x={weekIndex * step}
                    y={10}
                    fontSize={10}
                    className="fill-muted font-mono"
                  >
                    {label}
                  </text>
                ));
              })()}

            {/* cells */}
            {weeks.map((week, wi) =>
              week.map((date, di) => {
                const entry = date ? data[date] : undefined;
                const level: ContributionLevel = entry?.level ?? 0;
                const cellCenterX = wi * step + cellSize / 2;
                const cellTopY = monthLabelHeight + di * step;

                if (!date) {
                  const cellDate = formatDate(
                    addDays(parseDate(gridStart), wi * 7 + di),
                  );
                  if (cellDate > resolvedEnd) return null;
                }

                return (
                  <rect
                    key={`${wi}-${di}`}
                    id={date ? `cell-${id}-${date}` : undefined}
                    x={wi * step}
                    y={cellTopY}
                    width={cellSize}
                    height={cellSize}
                    rx={cellRx}
                    fill={activeColors[`level${level}` as keyof ThemeColors]}
                    style={{
                      transition: "opacity 0.1s",
                      opacity: gameActive ? (level === 0 || !date ? 0 : 1) : 1,
                      pointerEvents: gameActive
                        ? level === 0 || !date
                          ? "none"
                          : "auto"
                        : "auto",
                    }}
                    onMouseEnter={() => {
                      if (!date || gameActive) return;
                      setTooltip({
                        visible: true,
                        date,
                        count: entry?.count,
                        label: entry?.label,
                        x: cellCenterX,
                        y: cellTopY,
                      });
                    }}
                    onMouseLeave={() =>
                      setTooltip((t) => ({ ...t, visible: false }))
                    }
                  />
                );
              }),
            )}
          </svg>

          {/* Game canvas overlay */}
          {gameActive && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-auto z-10 cursor-crosshair"
              style={{ width: svgWidth, height: svgHeight + 80 }}
            />
          )}

          {/* custom tooltip */}
          {tooltip.visible &&
            (() => {
              const count = tooltip.count ?? 0;
              const formattedDate = formatTooltipDate(tooltip.date);
              const tooltipText = tooltip.label
                ? `${tooltip.label} on ${formattedDate}.`
                : count === 0
                  ? `No contributions on ${formattedDate}.`
                  : `${count} contribution${count !== 1 ? "s" : ""} on ${formattedDate}.`;

              return (
                <div
                  className="pointer-events-none absolute z-50 rounded bg-[#24292e] dark:bg-[#161b22] px-2.5 py-1 text-[11px] font-medium text-white shadow-md border border-neutral-700/30 whitespace-nowrap"
                  style={{
                    left: tooltip.x,
                    top: tooltip.y,
                    transform: "translate(-50%, calc(-100% - 6px))",
                  }}
                >
                  {tooltipText}
                  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-[#24292e] dark:bg-[#161b22] border-r border-b border-neutral-700/30" />
                </div>
              );
            })()}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 border-t border-border/60 pt-3">
          {/* legend (left) */}
          {showLegend && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground shrink-0 mt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted">Less</span>
                {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
                  <svg key={level} width={cellSize} height={cellSize}>
                    <rect
                      width={cellSize}
                      height={cellSize}
                      rx={cellRx}
                      fill={activeColors[`level${level}`]}
                    />
                  </svg>
                ))}
                <span className="text-[11px] text-muted">More</span>
              </div>

              {/* Game Mode Switch */}
              <div className="flex items-center gap-2 border-l border-border/80 pl-4">
                <span className="text-[11px] text-muted select-none">Game Mode</span>
                <button
                  onClick={() => setGameActive(!gameActive)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    gameActive ? "bg-accent" : "bg-neutral-800"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      gameActive ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>
          )}

          {/* stats line (right) */}
          {showStats && (
            <div className="flex flex-wrap text-xs md:text-sm font-sans tracking-wide">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-1 text-muted hover:text-foreground transition-colors select-none"
              >
                <span className="font-semibold text-foreground">
                  @{username}
                </span>
                <span>contributed</span>
                <span className="font-bold text-accent">
                  {stats.total.toLocaleString()}
                </span>
                <span>this year</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

GithubCalendar.displayName = "GithubCalendar";

export default GithubCalendar;
