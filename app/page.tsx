import { LoadingScreen } from "@/components/shell/loading-screen";
import { Nav } from "@/components/shell/nav";
import { Footer } from "@/components/shell/footer";
import { Hero } from "@/components/hero/hero";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { Projects } from "@/components/sections/projects";
import { GitHubActivity } from "@/components/sections/github/github-activity";
import { Journey } from "@/components/sections/journey";
import { Certificates } from "@/components/sections/certificates";
import { Contact } from "@/components/sections/contact";
import { getPublishedTechnologies } from "@/lib/actions/technologies";

import { SectionOverlap } from "@/components/ui/section-overlap";

export default async function Home() {
  const technologies = await getPublishedTechnologies();
  const techNames = technologies.map((t) => t.name);

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
          <About />
          <TechStack technologies={techNames} />
          <Projects />
          <Journey />
          <Certificates />
          <GitHubActivity />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
