"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  ArrowUpRight,
  CheckCircle2,
  User,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { TechIcon } from "@/components/ui/tech-icons";
import { useLenis } from "@/components/providers/smooth-scroll";
import type { ProjectWithRelations } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface ProjectDetailModalProps {
  project: ProjectWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Control body scroll & Lenis smooth scroll state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      setActiveImageIndex(0);
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, lenis, onClose]);

  if (!mounted || !isOpen || !project) return null;

  const stackNames = project.technologies.map((t) => t.name);
  const highlights = project.highlights.map((h) => h.text);

  const coverAlt = project.cover_alt || `${project.name} — ${project.tagline}`;
  
  // Combine cover image and additional images into gallery list
  const galleryUrls = new Set(project.images.map((img) => img.image_url));
  const imagesList = [
    ...(project.cover_image && !galleryUrls.has(project.cover_image)
      ? [{ url: project.cover_image, alt: coverAlt, caption: null }]
      : []),
    ...project.images.map((img) => ({
      url: img.image_url,
      alt: img.alt || coverAlt,
      caption: img.caption,
    })),
  ];

  const currentImage = imagesList[activeImageIndex] || (project.cover_image ? { url: project.cover_image, alt: coverAlt } : null);

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        className="relative flex flex-col w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] overflow-hidden rounded-3xl border border-border/80 bg-surface/95 text-foreground shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail modal"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground transition-all duration-200 hover:bg-background hover:scale-105 shadow-md cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container with Mouse Wheel Support & Lenis Prevention */}
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="overflow-y-auto overscroll-contain p-6 md:p-8 scrollbar-thin flex-1"
        >
          {/* Header Image Gallery */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 bg-card">
            {currentImage?.url ? (
              <Image
                src={currentImage.url}
                alt={currentImage.alt || project.name}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted">
                <ImageOff size={36} strokeWidth={1.5} />
              </div>
            )}

            {/* Gallery Navigation Arrows */}
            {imagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-transform active:scale-95 cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-transform active:scale-95 cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {imagesList.length > 1 && (
            <div className="mt-3 flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {imagesList.map((img, idx) => (
                <button
                  key={img.url + idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all cursor-pointer",
                    activeImageIndex === idx
                      ? "border-accent ring-2 ring-accent/30 opacity-100 scale-105"
                      : "border-border/60 opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Project Header Info */}
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                id="project-modal-title"
                className="text-2xl font-bold tracking-tight text-foreground md:text-4xl font-sans"
              >
                {project.name}
              </h2>
            </div>

            <p className="text-base font-semibold text-accent md:text-lg font-sans">
              {project.tagline}
            </p>

            {/* Quick Metadata */}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-muted border-b border-border/50 pb-4">
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-accent" />
                <span className="uppercase">{project.role}</span>
              </div>
              {project.category && (
                <div className="rounded-md bg-card border border-border/60 px-2 py-0.5 text-[11px] text-secondary">
                  {project.category}
                </div>
              )}
            </div>
          </div>

          {/* Project Summary / Description */}
          <div className="mt-5">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted mb-2">
              About Project
            </h3>
            <p className="font-sans text-sm md:text-base leading-relaxed text-secondary whitespace-pre-line">
              {project.summary}
            </p>
          </div>

          {/* Key Highlights */}
          {highlights.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border/60 bg-surface/60 p-4 md:p-5">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-accent mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Key Highlights & Deliverables
              </h3>
              <ul className="space-y-2.5">
                {highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs md:text-sm font-sans text-secondary"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          {stackNames.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted mb-3">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {stackNames.map((tech) => (
                  <div
                    key={tech}
                    className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/80 px-3 py-1.5 font-mono text-xs font-medium text-foreground shadow-sm"
                  >
                    <TechIcon name={tech} className="h-4 w-4 text-accent shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
            {project.status === "Live" && project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-sans text-xs font-semibold text-accent-contrast shadow-[0_0_20px_rgba(34,197,94,0.25)] transition-all duration-300 hover:bg-accent-hover hover:scale-[1.02] cursor-pointer"
              >
                <span>{project.live_url_label || "Visit Live Website"}</span>
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </a>
            )}

            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 font-sans text-xs font-medium text-foreground transition-all duration-300 hover:border-accent/40 hover:text-accent hover:bg-surface cursor-pointer"
              >
                <GithubIcon size={15} />
                <span>View Source Code</span>
                <ExternalLink size={13} className="text-muted" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="ml-auto inline-flex items-center gap-1 rounded-xl border border-border/60 px-4 py-2.5 font-sans text-xs font-medium text-secondary hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
