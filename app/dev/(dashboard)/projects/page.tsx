import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProjects } from "@/lib/actions/projects";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectsClient } from "./projects-client";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} total`}
        action={
          <Link
            href="/dev/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80]"
          >
            <Plus size={16} />
            New Project
          </Link>
        }
      />

      <ProjectsClient projects={projects} />
    </div>
  );
}
