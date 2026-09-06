"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ProjectsCTA() {
  return (
    <section
      className="relative w-full py-28 md:py-40 overflow-hidden"
      aria-label="Closing Call to Action"
    >
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-12 text-center flex flex-col items-center justify-center">
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-accent">
          <span>COLLABORATION // OPPORTUNITIES</span>
        </div>

        {/* Confident Headline (Optimized for Mobile) */}
        <div className="space-y-2 mb-8">
          <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
            Have a project in mind?
          </h2>
          <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
            Let&apos;s build <span className="text-accent">something useful.</span>
          </h2>
        </div>

        {/* Short, Confident Subtitle */}
        <p className="max-w-xl text-base sm:text-lg text-secondary font-normal leading-relaxed mb-12">
          Available for software engineering roles, high-concurrency systems, and technical product development. Let&apos;s build software worth shipping.
        </p>

        {/* Large Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-black font-sans text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black shadow-xl"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full border border-white/20 bg-white/5 text-foreground font-sans text-xs sm:text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:border-white/40 hover:bg-white/10"
          >
            <span>RETURN HOME</span>
            <span>→</span>
          </Link>
        </div>

        {/* Technical Footer Detail */}
        <div className="mt-16 pt-8 border-t border-white/10 w-full max-w-sm flex items-center justify-between font-sans text-[11px] text-muted uppercase tracking-wider">
          <span>OPEN FOR ROLES</span>
          <span>RESPONSE &lt; 24H</span>
        </div>
      </div>
    </section>
  );
}
