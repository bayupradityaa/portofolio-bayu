"use client";

import { Sparkles, Code2, Layers, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectPreviewPlaceholderProps {
  title?: string;
  category?: string | null;
  status?: string;
  className?: string;
}

export function ProjectPreviewPlaceholder({
  title,
  category,
  status = "Coming Soon",
  className,
}: ProjectPreviewPlaceholderProps) {
  const isComingSoon = !status || status.toLowerCase().includes("coming") || status.toLowerCase().includes("dev");

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#090a0f] p-6 text-center select-none font-sans",
        className,
      )}
    >
      {/* Dynamic Ambient Background Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/2 -right-1/2 h-full w-full bg-gradient-to-tl from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl"
      />

      {/* Futuristic Cyber Grid Pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      {/* Top Status Pill Badge */}
      <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="tracking-wider uppercase text-[11px] font-mono font-bold">
          {isComingSoon ? "COMING SOON" : status}
        </span>
      </div>

      {/* Center Icon Graphic & Watermark */}
      <div className="relative z-10 my-2 flex flex-col items-center justify-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white/90 shadow-2xl backdrop-blur-xl group-hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50" />
          <Cpu className="h-7 w-7 text-emerald-400/90" strokeWidth={1.5} />
        </div>

        {/* Project Title Placeholder */}
        {title && (
          <h4 className="mt-4 font-mono text-lg sm:text-xl font-bold tracking-tight text-white/90 max-w-[20ch] line-clamp-1">
            {title}
          </h4>
        )}

        <p className="mt-1.5 font-sans text-xs text-white/50 max-w-[30ch] leading-relaxed">
          Project preview &amp; interactive case study currently in production.
        </p>
      </div>

      {/* Footer Meta Badge */}
      <div className="relative z-10 mt-4 flex items-center gap-3 font-mono text-[10px] text-white/40 tracking-widest uppercase border-t border-white/10 pt-3 w-full max-w-[220px] justify-center">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-emerald-400/70" />
          {category || "IN DEVELOPMENT"}
        </span>
      </div>
    </div>
  );
}
