import { LoadingScreen } from "@/components/shell/loading-screen";
import { Nav } from "@/components/shell/nav";
import { Footer } from "@/components/shell/footer";
import { Hero } from "@/components/hero/hero";
import { About } from "@/components/sections/about";
import dynamic from "next/dynamic";
import { FeaturedProjects } from "@/components/projects/featured/FeaturedProjects";
import { GitHubActivity } from "@/components/sections/github/github-activity";
import { Journey } from "@/components/sections/journey";
import { Certificates } from "@/components/sections/certificates";
import { Contact } from "@/components/sections/contact";
import { getPublishedTechnologies } from "@/lib/actions/technologies";

import { SectionOverlap } from "@/components/ui/section-overlap";

// Marquee is client-heavy (icon map + interactive pills). Split it into its own
// chunk so it hydrates after the initial paint. ssr:true keeps the server HTML
// identical — desktop output is byte-for-byte unchanged; only the JS is deferred.
const TechStack = dynamic(
  () => import("@/components/sections/tech-stack").then((m) => ({ default: m.TechStack })),
);

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
          <FeaturedProjects />
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
