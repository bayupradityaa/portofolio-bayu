import { LoadingScreen } from "@/components/shell/loading-screen";
import { Nav } from "@/components/shell/nav";
import { Footer } from "@/components/shell/footer";
import { Hero } from "@/components/hero/hero";
import { About } from "@/components/sections/about";
import dynamic from "next/dynamic";
import { WorkSection, WorkItem } from "@/components/sections/work-section";
import { Journey } from "@/components/sections/journey";
import { Contact } from "@/components/sections/contact";
import { getPublishedTechnologies } from "@/lib/actions/technologies";
import { getPublishedProjects } from "@/lib/actions/projects";
import { getProfileSettings } from "@/lib/actions/settings";

// Marquee is client-heavy. Split into chunk.
const TechStack = dynamic(
  () => import("@/components/sections/tech-stack").then((m) => ({ default: m.TechStack })),
);

export default async function Home() {
  const [technologies, publishedProjects, settings] = await Promise.all([
    getPublishedTechnologies(),
    getPublishedProjects(),
    getProfileSettings(),
  ]);

  const techNames = technologies.map((t) => t.name);

  // Filter projects chosen for Home (featured === true)
  // Fallback to all published projects if no projects are marked featured yet
  const featuredProjects = (publishedProjects || []).filter((p) => p.featured);
  const homeProjects = featuredProjects.length > 0 ? featuredProjects : (publishedProjects || []);

  const workItems: WorkItem[] = homeProjects.map((p, idx) => ({
    index: String(idx + 1).padStart(2, "0"),
    title: p.name,
    category: p.category || "Full-Stack Project",
    description: p.summary || p.tagline || "",
    image: p.cover_image || "",
    status: p.status,
    link: p.slug ? `/projects/${p.slug}` : `/projects`,
  }));

  return (
    <>
      <LoadingScreen />
      <Nav settings={settings} />
      <main id="main" className="flex-1">
        <Hero settings={settings} />
        <div
          id="content-container"
          className="relative z-20 w-full bg-background"
        >
          <About settings={settings} />
          <TechStack technologies={techNames} />
          <WorkSection items={workItems} />
          <div id="journey-section" className="relative z-10 w-full bg-[#000000] text-white">
            <Journey />
          </div>
          <Contact />
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
