"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ProjectPreviewPlaceholder } from "@/components/ui/project-preview-placeholder";

/**
 * Project cover.
 *
 * The outer element is a hard-edged frame — no radius, no lift-on-hover. The
 * inner element is the parallax layer driven by GSAP (`ref`), and is
 * deliberately over-scaled so the vertical drift never exposes an edge:
 * IMAGE_PARALLAX travels ±28px, and 1.16 scale on a 16/10 box clears that
 * with margin to spare. Hover is a thin accent frame instead of a scale,
 * which would fight the parallax transform.
 */
export const ProjectImage = forwardRef<
  HTMLDivElement,
  {
    src: string | null;
    alt: string;
    priority?: boolean;
    className?: string;
  }
>(function ProjectImage({ src, alt, priority = false, className }, parallaxRef) {
  return (
    <div
      className={cn(
        "group/image relative aspect-16/10 w-full overflow-hidden",
        "border border-border bg-surface",
        "transition-colors duration-300 hover:border-accent",
        className,
      )}
    >
      {/* Parallax layer — over-scaled to cover the drift range. */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 scale-[1.16]"
        style={{ willChange: "transform" }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority={priority}
            className="object-cover"
          />
        ) : (
          <ProjectPreviewPlaceholder title={alt} />
        )}
      </div>
    </div>
  );
});
