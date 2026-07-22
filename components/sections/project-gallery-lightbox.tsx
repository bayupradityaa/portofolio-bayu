"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export type GallerySlide = {
  url: string;
  alt: string;
  caption?: string | null;
};

type ProjectGalleryLightboxProps = {
  projectName: string;
  slides: GallerySlide[];
  /** Cover shown as the clickable trigger. */
  coverImage: string;
  coverAlt: string;
  priority?: boolean;
};

export function ProjectGalleryLightbox({
  projectName,
  slides,
  coverImage,
  coverAlt,
  priority = false,
}: ProjectGalleryLightboxProps) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const isOpen = openAt !== null;

  useEffect(() => setMounted(true), []);

  const open = useCallback((index = 0) => setOpenAt(index), []);
  const close = useCallback(() => setOpenAt(null), []);

  const go = useCallback(
    (dir: number) => {
      setOpenAt((current) => {
        if (current === null) return current;
        const next = (current + dir + slides.length) % slides.length;
        return next;
      });
    },
    [slides.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, go]);

  const active = openAt !== null ? slides[openAt] : null;

  return (
    <>
      <button
        type="button"
        onClick={() => open(0)}
        className="group/image relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface focus-visible:outline-2 focus-visible:outline-accent"
        aria-label={`View ${slides.length} images for ${projectName}`}
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={coverAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.03] group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-secondary">
            <ImageOff size={28} strokeWidth={1.5} aria-hidden="true" />
          </span>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/image:opacity-100 backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-background/90 px-3.5 py-1.5 font-mono text-xs font-semibold text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]">
            <Images size={14} strokeWidth={2} aria-hidden="true" />
            View gallery ({slides.length})
          </span>
        </div>
      </button>

      {mounted && isOpen && active && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectName} gallery`}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>

          <div
            className="relative flex h-full w-full max-w-6xl items-center justify-center px-4 py-16"
            onClick={(e) => e.stopPropagation()}
          >
            {slides.length > 1 && (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-4"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <figure className="flex max-h-full flex-col items-center">
              <div className="relative max-h-[75vh] w-full">
                <Image
                  key={active.url}
                  src={active.url}
                  alt={active.alt || `${projectName} screenshot`}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  className="max-h-[75vh] w-auto rounded-lg object-contain"
                />
              </div>
              {active.caption && (
                <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/70">
                  {active.caption}
                </figcaption>
              )}
            </figure>

            {slides.length > 1 && (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-4"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          {slides.length > 1 && (
            <div className="absolute bottom-6 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {slides.map((s, i) => (
                <button
                  key={s.url}
                  type="button"
                  onClick={() => setOpenAt(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    i === openAt ? "bg-white" : "bg-white/40 hover:bg-white/60",
                  )}
                />
              ))}
            </div>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
