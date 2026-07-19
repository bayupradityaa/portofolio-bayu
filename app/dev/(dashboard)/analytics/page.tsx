import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/admin/page-header";
import { Eye, MousePointer, Download, ExternalLink, MessageSquare } from "lucide-react";
import { getAnalytics } from "@/lib/actions/analytics";

export default async function AdminAnalyticsPage() {
  const [today, week, month] = await Promise.all([
    getAnalytics("today"),
    getAnalytics("week"),
    getAnalytics("month"),
  ]);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Track engagement across your portfolio" />

      {/* Today */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717a]">Today</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Page Views" value={today.page_views} icon={Eye} />
        <StatCard label="Project Clicks" value={today.project_clicks} icon={MousePointer} />
        <StatCard label="Resume Downloads" value={today.resume_downloads} icon={Download} />
        <StatCard label="GitHub Clicks" value={today.github_clicks} icon={ExternalLink} />
        <StatCard label="Contact Clicks" value={today.contact_clicks} icon={MessageSquare} />
      </div>

      {/* This Week */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717a]">This Week</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Page Views" value={week.page_views} icon={Eye} />
        <StatCard label="Project Clicks" value={week.project_clicks} icon={MousePointer} />
        <StatCard label="Resume Downloads" value={week.resume_downloads} icon={Download} />
        <StatCard label="GitHub Clicks" value={week.github_clicks} icon={ExternalLink} />
        <StatCard label="Contact Clicks" value={week.contact_clicks} icon={MessageSquare} />
      </div>

      {/* This Month */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717a]">This Month</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Page Views" value={month.page_views} icon={Eye} />
        <StatCard label="Project Clicks" value={month.project_clicks} icon={MousePointer} />
        <StatCard label="Resume Downloads" value={month.resume_downloads} icon={Download} />
        <StatCard label="GitHub Clicks" value={month.github_clicks} icon={ExternalLink} />
        <StatCard label="Contact Clicks" value={month.contact_clicks} icon={MessageSquare} />
      </div>
    </div>
  );
}
