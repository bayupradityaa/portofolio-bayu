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

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Nav />
      <main id="main" className="flex-1">
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <GitHubActivity />
        <Journey />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
