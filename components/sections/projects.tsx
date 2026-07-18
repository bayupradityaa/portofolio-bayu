import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export function Projects() {
  return (
    <Section id="work">
      <SectionHeading
        title="Selected work"
        lead="A few projects that show how I think about problems, from data model to the last detail of the interface."
      />

      <div className="mt-16 flex flex-col gap-20 md:gap-28">
        {projects.map((project, i) => (
          <ProjectCase key={project.slug} project={project} flip={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCase({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <Reveal as="div">
      <article className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14">
        {/* Media */}
        <div className={cn("group relative", flip && "md:order-2")}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface">
            <Image
              src={project.cover}
              alt={`${project.name} — ${project.tagline}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </div>

        {/* Detail */}
        <div className={cn(flip && "md:order-1")}>
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span>{project.year}</span>
            <span className="h-3 w-px bg-border" />
            <span>{project.role}</span>
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
            {project.name}
          </h3>
          <p className="mt-1 text-lg text-accent">{project.tagline}</p>

          <p className="mt-5 max-w-[54ch] leading-relaxed text-secondary">
            {project.summary}
          </p>

          <ul className="mt-6 space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm text-secondary">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-5 text-sm">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-accent"
              >
                Live demo
                <ArrowUpRight size={16} strokeWidth={1.75} />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-secondary transition-colors hover:text-foreground"
              >
                <GithubIcon size={16} />
                Source
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
