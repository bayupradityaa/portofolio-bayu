"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import type { AnalyticsEventType } from "@/lib/types/database";

/** Track an analytics event (called from frontend or server) */
export async function trackEvent(
  event: AnalyticsEventType,
  metadata?: Record<string, unknown>,
  ipHash?: string,
  country?: string,
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await supabase.from("analytics").insert({
    event,
    metadata: metadata ?? null,
    ip_hash: ipHash ?? null,
    country: country ?? null,
  });
}

type AnalyticsSummary = {
  page_views: number;
  project_clicks: number;
  resume_downloads: number;
  github_clicks: number;
  contact_clicks: number;
};

/** Get analytics summary for a given period */
export async function getAnalytics(
  period: "today" | "week" | "month" | "all",
): Promise<AnalyticsSummary> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { page_views: 0, project_clicks: 0, resume_downloads: 0, github_clicks: 0, contact_clicks: 0 };
  }

  let query = supabase.from("analytics").select("event");

  if (period !== "all") {
    const now = new Date();
    let since: Date;

    switch (period) {
      case "today":
        since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    query = query.gte("created_at", since!.toISOString());
  }

  const { data, error } = await query;

  if (error || !data) {
    return { page_views: 0, project_clicks: 0, resume_downloads: 0, github_clicks: 0, contact_clicks: 0 };
  }

  const summary: AnalyticsSummary = {
    page_views: 0,
    project_clicks: 0,
    resume_downloads: 0,
    github_clicks: 0,
    contact_clicks: 0,
  };

  for (const row of data) {
    switch (row.event) {
      case "page_view": summary.page_views++; break;
      case "project_click": summary.project_clicks++; break;
      case "resume_download": summary.resume_downloads++; break;
      case "github_click": summary.github_clicks++; break;
      case "contact_click": summary.contact_clicks++; break;
    }
  }

  return summary;
}

/** Get project click breakdown */
export async function getProjectClicks(
  period: "today" | "week" | "month" | "all",
): Promise<Record<string, number>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return {};

  let query = supabase
    .from("analytics")
    .select("metadata")
    .eq("event", "project_click");

  if (period !== "all") {
    const now = new Date();
    let since: Date;
    switch (period) {
      case "today":
        since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }
    query = query.gte("created_at", since!.toISOString());
  }

  const { data } = await query;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const slug = (row.metadata as Record<string, unknown>)?.slug as string;
    if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
  }

  return counts;
}
