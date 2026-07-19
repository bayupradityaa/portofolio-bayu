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
          className="relative z-20 bg-background rounded-t-[40px] md:rounded-t-[100px] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
        >
          <About />
          <TechStack technologies={techNames} />
          <GitHubActivity />
          <Projects />
          <Journey />
          <Certificates />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
