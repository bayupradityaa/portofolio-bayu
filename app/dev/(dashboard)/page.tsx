import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/admin/page-header";
import { FolderKanban, MessageSquare, Eye, Download } from "lucide-react";
import { getAllProjects } from "@/lib/actions/projects";
import { getUnreadCount } from "@/lib/actions/messages";
import { getAnalytics } from "@/lib/actions/analytics";

export default async function AdminDashboardPage() {
  const [projects, unread, analytics] = await Promise.all([
    getAllProjects(),
    getUnreadCount(),
    getAnalytics("month"),
  ]);

  const published = projects.filter((p) => p.published).length;
  const draft = projects.length - published;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your portfolio" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Projects"
          value={projects.length}
          icon={FolderKanban}
          trend={`${published} published, ${draft} draft`}
        />
        <StatCard
          label="Unread Messages"
          value={unread}
          icon={MessageSquare}
        />
        <StatCard
          label="Page Views"
          value={analytics.page_views}
          icon={Eye}
          trend="Last 30 days"
        />
        <StatCard
          label="Resume Downloads"
          value={analytics.resume_downloads}
          icon={Download}
          trend="Last 30 days"
        />
      </div>
    </div>
  );
}
