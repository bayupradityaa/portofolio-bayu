import { LoadingScreen } from "@/components/shell/loading-screen";
import { Nav } from "@/components/shell/nav";
import { Footer } from "@/components/shell/footer";
import { Hero } from "@/components/hero/hero";
import { About } from "@/components/sections/about";
import dynamic from "next/dynamic";
import { WorkSection, WorkItem } from "@/components/sections/work-section";
import { workSectionData } from "@/components/sections/work-section-data";
import { Journey } from "@/components/sections/journey";
import { Certificates } from "@/components/sections/certificates";
import { Contact } from "@/components/sections/contact";
import { SectionRule } from "@/components/ui/section-rule";
import { getPublishedTechnologies } from "@/lib/actions/technologies";
import { getPublishedProjects } from "@/lib/actions/projects";

// Marquee is client-heavy. Split into chunk.
const TechStack = dynamic(
  () => import("@/components/sections/tech-stack").then((m) => ({ default: m.TechStack })),
);

export default async function Home() {
  const [technologies, publishedProjects] = await Promise.all([
    getPublishedTechnologies(),
    getPublishedProjects(),
  ]);

  const techNames = technologies.map((t) => t.name);

  // Map real database projects if available, otherwise use real portfolio entries
  const workItems: WorkItem[] =
    publishedProjects && publishedProjects.length > 0
      ? publishedProjects.map((p, idx) => ({
          index: String(idx + 1).padStart(2, "0"),
          title: p.name,
          category: p.category || "Full-Stack Project",
          year: p.year ? p.year.toString() : "2025",
          description: p.summary || p.tagline || "",
          image: p.cover_image || "/works/pulse-studio.svg",
          link: p.slug ? `/projects/${p.slug}` : `/projects`,
        }))
      : workSectionData;

  return (
    <>
      <LoadingScreen />
      <Nav />
      <main id="main" className="flex-1">
        <Hero />
        <div
          id="content-container"
          className="relative z-20 w-full bg-background"
        >
          <SectionRule number="01" label="About" />
          <About />
          <SectionRule number="02" label="Stack" />
          <TechStack technologies={techNames} />
          <SectionRule number="03" label="Project" />
          <WorkSection items={workItems} />
          <SectionRule number="04" label="Journey" />
          <Journey />
          <SectionRule number="05" label="Certificates" />
          <Certificates />
          <SectionRule number="06" label="Contact" />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
