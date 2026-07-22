import type { Metadata } from "next";
import { Nav } from "@/components/shell/nav";
import { Footer } from "@/components/shell/footer";
import { LoadingScreen } from "@/components/shell/loading-screen";
import { AllProjectsClient } from "@/components/projects/all-projects-client";
import { getPublishedProjects } from "@/lib/actions/projects";

export const metadata: Metadata = {
  title: "All Projects — Bayu Praditya",
  description:
    "Explore the complete portfolio archive of software engineering projects, web applications, AI models, and backend systems built by Bayu Praditya.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <LoadingScreen />
      <Nav />
      <main id="main" className="flex-1">
        <AllProjectsClient projects={projects} />
      </main>
      <Footer />
    </>
  );
}
