"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ImageOff } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Project cover with a GSAP-driven parallax layer (the outer ref) and a
 * Framer Motion hover lift (scale 1.03 + softer shadow). Keeping hover in
 * Framer and parallax in GSAP matches the brief's split of responsibilities.
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
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn(
        "group/image relative aspect-[16/10] w-full overflow-hidden rounded-2xl",
        "border border-border bg-surface shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]",
        "transition-shadow duration-500 hover:shadow-[0_40px_90px_-40px_rgba(34,197,94,0.28)]",
        className,
      )}
    >
      {/* Inner layer carries the parallax/scale from GSAP so hover stays isolated. */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 scale-[1.08]"
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
          <div className="flex h-full w-full items-center justify-center text-secondary">
            <ImageOff size={28} strokeWidth={1.5} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Soft top-down scrim keeps overlaid text legible on bright covers. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
    </motion.div>
  );
});
