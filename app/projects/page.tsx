import type { Metadata } from "next";
import { Nav } from "@/components/shell/nav";
import { Footer } from "@/components/shell/footer";
import { LoadingScreen } from "@/components/shell/loading-screen";
import { AllProjectsClient } from "@/components/projects/all-projects-client";
import { getPublicProjects } from "@/lib/actions/projects";
import { getProfileSettings } from "@/lib/actions/settings";

export const metadata: Metadata = {
  title: "All Projects — Bayu Praditya",
  description:
    "Explore the complete portfolio archive of software engineering projects, web applications, AI models, and backend systems built by Bayu Praditya.",
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    getPublicProjects(),
    getProfileSettings(),
  ]);

  return (
    <>
      <LoadingScreen />
      <Nav settings={settings} />
      <main id="main" className="flex-1">
        <AllProjectsClient projects={projects} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
