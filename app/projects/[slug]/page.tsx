import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, User, Tag, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Nav } from "@/components/shell/nav";
import { Footer } from "@/components/shell/footer";
import { Reveal } from "@/components/motion/reveal";
import { getProjectBySlug, getPublicProjects } from "@/lib/actions/projects";
import { getProfileSettings } from "@/lib/actions/settings";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublicProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project case study could not be found.",
    };
  }

  const title = `${project.name} — Case Study`;
  const description =
    project.summary ||
    project.tagline ||
    `Detailed case study and architecture overview of ${project.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.cover_image ? [project.cover_image] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getProfileSettings(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main id="main" className="flex-1 w-full min-h-screen pt-28 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs md:text-sm font-semibold uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Projects</span>
          </Link>
        </div>

        {/* Hero / Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-border bg-card/60 text-accent">
              {project.category || "Case Study"}
            </span>
            {project.status && (
              <span className="font-mono text-xs font-medium px-3 py-1 rounded-full bg-foreground/10 text-foreground/80">
                {project.status}
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground font-sans">
            {project.name}
          </h1>

          {project.tagline && (
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/75 font-normal leading-relaxed max-w-3xl">
              {project.tagline}
            </p>
          )}

          {/* Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-y border-border/60 py-6 font-mono text-xs">
            {project.year && (
              <div className="space-y-1">
                <span className="text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Year
                </span>
                <p className="text-foreground font-semibold">{project.year}</p>
              </div>
            )}

            {project.role && (
              <div className="space-y-1">
                <span className="text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Role
                </span>
                <p className="text-foreground font-semibold">{project.role}</p>
              </div>
            )}

            {project.category && (
              <div className="space-y-1">
                <span className="text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Category
                </span>
                <p className="text-foreground font-semibold">{project.category}</p>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-foreground/50 uppercase tracking-widest">Links</span>
              <div className="flex flex-wrap items-center gap-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
                  >
                    <span>{project.live_url_label || "Live"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground hover:underline font-semibold"
                  >
                    <GithubIcon size={12} />
                    <span>Source</span>
                  </a>
                )}
                {!project.live_url && !project.repo_url && (
                  <span className="text-foreground/40">—</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {project.cover_image && (
          <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden border border-border/60 bg-card/40 my-10 shadow-2xl">
            <Image
              src={project.cover_image}
              alt={project.cover_alt || project.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-top"
            />
          </div>
        )}

        {/* Case Study Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-12">
          {/* Main Editorial Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview / Summary */}
            {project.summary && (
              <Reveal as="section" className="space-y-4">
                <h2 className="font-mono text-xs md:text-sm uppercase tracking-widest text-accent font-semibold">
                  // Overview & Architecture
                </h2>
                <div className="text-base md:text-lg leading-relaxed text-foreground/85 font-normal whitespace-pre-line">
                  {project.summary}
                </div>
              </Reveal>
            )}

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <Reveal as="section" className="space-y-4 pt-6 border-t border-border/50">
                <h2 className="font-mono text-xs md:text-sm uppercase tracking-widest text-accent font-semibold">
                  // Key Highlights & Features
                </h2>
                <ul className="space-y-3">
                  {project.highlights.map((h) => (
                    <li key={h.id} className="flex items-start gap-3 text-sm md:text-base text-foreground/80">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{h.text}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* The Challenge & Problem */}
            {project.problem && (
              <Reveal as="section" className="space-y-4 pt-6 border-t border-border/50">
                <h2 className="font-mono text-xs md:text-sm uppercase tracking-widest text-accent font-semibold">
                  // The Challenge & Context
                </h2>
                <div className="text-base md:text-lg leading-relaxed text-foreground/85 font-normal whitespace-pre-line">
                  {project.problem}
                </div>
              </Reveal>
            )}

            {/* Process & Engineering Decisions */}
            {project.process && (
              <Reveal as="section" className="space-y-4 pt-6 border-t border-border/50">
                <h2 className="font-mono text-xs md:text-sm uppercase tracking-widest text-accent font-semibold">
                  // Engineering Process & Architecture
                </h2>
                <div className="text-base md:text-lg leading-relaxed text-foreground/85 font-normal whitespace-pre-line">
                  {project.process}
                </div>
              </Reveal>
            )}

            {/* Outcome & Impact */}
            {project.outcome && (
              <Reveal as="section" className="space-y-4 pt-6 border-t border-border/50">
                <h2 className="font-mono text-xs md:text-sm uppercase tracking-widest text-accent font-semibold">
                  // Outcome & Real-World Impact
                </h2>
                <div className="text-base md:text-lg leading-relaxed text-foreground/85 font-normal whitespace-pre-line">
                  {project.outcome}
                </div>
              </Reveal>
            )}

            {/* Key Metrics */}
            {project.metrics && (
              <Reveal as="section" className="space-y-4 pt-6 border-t border-border/50">
                <h2 className="font-mono text-xs md:text-sm uppercase tracking-widest text-accent font-semibold">
                  // Key Metrics & Results
                </h2>
                <div className="text-base md:text-lg leading-relaxed text-foreground/85 font-normal whitespace-pre-line font-mono bg-card/40 p-5 rounded-xl border border-border/60">
                  {project.metrics}
                </div>
              </Reveal>
            )}

            {/* Gallery Images */}
            {project.images && project.images.length > 0 && (
              <Reveal as="section" className="space-y-6 pt-6 border-t border-border/50">
                <h2 className="font-mono text-xs md:text-sm uppercase tracking-widest text-accent font-semibold">
                  // Project Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.images.map((img) => (
                    <figure key={img.id} className="space-y-2">
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-border/60 bg-card/30">
                        <Image
                          src={img.image_url}
                          alt={img.alt || project.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      {img.caption && (
                        <figcaption className="font-mono text-xs text-foreground/60 px-1">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Tech Stack */}
            {project.technologies && project.technologies.length > 0 && (
              <Reveal as="div" className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-4">
                <h3 className="font-mono text-xs md:text-sm uppercase tracking-widest text-accent font-semibold">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t.id}
                      className="font-mono text-xs px-3 py-1.5 rounded-lg border border-border/80 bg-background/80 text-foreground/90"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Project Quick Links */}
            {(project.live_url || project.repo_url) && (
              <Reveal as="div" className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-4">
                <h3 className="font-mono text-xs md:text-sm uppercase tracking-widest text-accent font-semibold">
                  Project Access
                </h3>
                <div className="space-y-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      <span>{project.live_url_label || "Open Live Demo"}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-background/80 text-foreground font-mono text-xs font-semibold uppercase tracking-wider hover:bg-card transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <GithubIcon size={16} />
                        <span>Source Code</span>
                      </span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              </Reveal>
            )}
          </aside>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-12 border-t border-border/60 flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs md:text-sm font-semibold uppercase tracking-wider text-foreground/70 hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>All Projects</span>
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 font-mono text-xs md:text-sm font-semibold uppercase tracking-wider text-accent hover:underline"
          >
            <span>Discuss This Project →</span>
          </Link>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
