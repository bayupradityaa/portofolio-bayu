"use client";

import { Flame } from "lucide-react";
import type { GitHubStreakStats } from "@/lib/github";

interface GithubAnalyticsCardProps {
  stats: GitHubStreakStats;
}

export function GithubAnalyticsCard({ stats }: GithubAnalyticsCardProps) {
  return (
    <div className="w-full">
      {/* Section Sub-heading */}
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          GitHub Analytics
        </h3>
      </div>

      {/* 3-Column Analytics Panel */}
      <div className="mt-6 rounded-2xl border border-border/60 bg-card/80 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        <div className="grid grid-cols-1 divide-y divide-border/60 md:grid-cols-3 md:divide-x md:divide-y-0">
          
          {/* Column 1: Total Contributions */}
          <div className="flex flex-col items-center justify-center py-6 text-center md:py-2 md:px-4">
            <span className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              {stats.totalContributions.toLocaleString("en-US")}
            </span>
            <span className="mt-3 text-base font-semibold text-foreground/90">
              Total Contributions
            </span>
            <span className="mt-1 text-xs text-muted">
              {stats.totalRange}
            </span>
          </div>

          {/* Column 2: Current Streak (with Green Flame Ring) */}
          <div className="flex flex-col items-center justify-center py-6 text-center md:py-2 md:px-4">
            <div className="relative mb-1 flex items-center justify-center">
              {/* Flame Icon on Top of Ring */}
              <div className="absolute -top-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-emerald-500/80 shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                <Flame className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
              </div>

              {/* Glowing Green Outer Ring */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-emerald-400/90 bg-emerald-950/20 shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                <span className="text-3xl font-bold text-foreground">
                  {stats.currentStreak.count}
                </span>
              </div>
            </div>

            <span className="mt-3 text-base font-bold text-emerald-400">
              Current Streak
            </span>
            <span className="mt-1 text-xs text-muted">
              {stats.currentStreak.startDate} - {stats.currentStreak.endDate}
            </span>
          </div>

          {/* Column 3: Longest Streak */}
          <div className="flex flex-col items-center justify-center py-6 text-center md:py-2 md:px-4">
            <span className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              {stats.longestStreak.count}
            </span>
            <span className="mt-3 text-base font-semibold text-foreground/90">
              Longest Streak
            </span>
            <span className="mt-1 text-xs text-muted">
              {stats.longestStreak.startDate} - {stats.longestStreak.endDate}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
