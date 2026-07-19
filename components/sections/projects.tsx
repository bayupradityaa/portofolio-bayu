import Image from "next/image";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { TechIcon } from "@/components/ui/tech-icons";
import { getPublishedProjects } from "@/lib/actions/projects";
import type { ProjectWithRelations } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { ProjectGalleryLightbox, type GallerySlide } from "./project-gallery-lightbox";

export async function Projects() {
  const projects = await getPublishedProjects();

  if (projects.length === 0) return null;

  return (
    <Section id="work">
      <SectionHeading
        title="My Projects"
        lead="A collection of real-world projects spanning full-stack development, artificial intelligence, and digital business—each built with a focus on performance, scalability, and meaningful user experiences."
      />

      <div className="mt-16 flex flex-col gap-20 md:gap-28">
        {projects.map((project, i) => (
          <ProjectCase key={project.slug} project={project} flip={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCase({ project, flip }: { project: ProjectWithRelations; flip: boolean }) {
  const stackNames = project.technologies.map((t) => t.name);
  const highlights = project.highlights.map((h) => h.text);

  const coverAlt = project.cover_alt || `${project.name} — ${project.tagline}`;
  // Gallery images already include the cover after backfill; fall back to the
  // first gallery image when a legacy project has no cover_image set.
  const galleryUrls = new Set(project.images.map((img) => img.image_url));
  const slides: GallerySlide[] = [
    ...(project.cover_image && !galleryUrls.has(project.cover_image)
      ? [{ url: project.cover_image, alt: coverAlt }]
      : []),
    ...project.images.map((img) => ({ url: img.image_url, alt: img.alt, caption: img.caption })),
  ];
  const coverUrl = project.cover_image || project.images[0]?.image_url || "";
  const hasGallery = slides.length > 1 && Boolean(coverUrl);
  const hasCover = Boolean(coverUrl);

  const coverImage = hasCover ? (
    <Image
      src={coverUrl}
      alt={coverAlt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      priority={project.sort_order <= 1}
      className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.03] group-hover:scale-[1.03]"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-surface text-secondary">
      <ImageOff size={28} strokeWidth={1.5} aria-hidden="true" />
    </div>
  );

  return (
    <Reveal as="div">
      <article className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14">
        {/* Media */}
        <div className={cn("group relative", flip && "md:order-2")}>
          {hasGallery ? (
            <ProjectGalleryLightbox
              projectName={project.name}
              slides={slides}
              coverImage={coverUrl}
              coverAlt={coverAlt}
              priority={project.sort_order <= 1}
            />
          ) : project.status === "Live" && project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/image relative block aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface focus-visible:outline-2 focus-visible:outline-accent"
              aria-label={`${project.live_url_label || "Visit Website"} for ${project.name}`}
            >
              {coverImage}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/image:opacity-100 backdrop-blur-[2px]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-[#09090b]/90 px-3.5 py-1.5 font-mono text-xs font-semibold text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]">
                  {project.live_url_label || "Visit Website"}
                  <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                </span>
              </div>
            </a>
          ) : (
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface">
              {coverImage}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2.5 text-xs font-mono text-secondary">
            {stackNames.map((s) => (
              <div
                key={s}
                className="group/tech inline-flex items-center gap-1.5 py-0.5 transition-colors duration-300 hover:text-accent cursor-default"
              >
                <TechIcon
                  name={s}
                  className="h-3.5 w-3.5 text-muted transition-colors duration-300 group-hover/tech:text-accent shrink-0"
                />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className={cn(flip && "md:order-1")}>
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {project.name}
          </h3>

          <p className="mt-1 text-lg text-accent">{project.tagline}</p>

          <p className="mt-5 max-w-[54ch] leading-relaxed text-secondary">
            {project.summary}
          </p>

          <ul className="mt-6 space-y-2">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm text-secondary">
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-5 text-sm">
            {/* When a gallery took over the cover click, surface the live link here. */}
            {hasGallery && project.status === "Live" && project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-accent"
              >
                {project.live_url_label || "Visit Website"}
                <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            )}

            {project.status === "Local Development" && (
              <span className="inline-flex items-center gap-1.5 font-medium text-muted cursor-not-allowed select-none">
                Running locally
              </span>
            )}

            {project.status === "Coming Soon" && (
              <span className="inline-flex items-center gap-1.5 font-medium text-muted cursor-not-allowed select-none">
                Coming Soon
              </span>
            )}

            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
              >
                <GithubIcon size={16} aria-hidden="true" />
                Source
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
