"use client";

import Image from "next/image";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ProjectPreviewPlaceholder } from "@/components/ui/project-preview-placeholder";

export const ProjectImage = forwardRef<
  HTMLDivElement,
  {
    src: string | null;
    alt: string;
    priority?: boolean;
    className?: string;
  }
>(function ProjectImage({ src, alt, priority = false, className }, parallaxRef) {
  const [hasError, setHasError] = useState(false);

  const isValidSrc = src && !hasError;

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
        {isValidSrc ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority={priority}
            onError={() => setHasError(true)}
            className="object-cover"
          />
        ) : (
          <ProjectPreviewPlaceholder title={alt} />
        )}
      </div>
    </div>
  );
});
