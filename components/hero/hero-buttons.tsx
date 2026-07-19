"use client";

import { useCallback, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";

interface HeroButtonsProps {
  button1Ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * CTA buttons with magnetic hover. Exposes wrapper refs directly as props.
 */
export function HeroButtons({ button1Ref }: HeroButtonsProps) {
  return (
    <div className="mt-9 flex flex-wrap items-center gap-3">
      <div ref={button1Ref} style={{ opacity: 0 }}>
        <MagneticLink href="#work" className={`${btnBase} ${btnPrimary}`}>
          View Projects
          <ArrowUpRight size={18} strokeWidth={2} />
        </MagneticLink>
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const btnBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg " +
  "font-medium h-12 px-6 text-base cursor-pointer " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const btnPrimary =
  "bg-accent text-accent-contrast hover:bg-accent-hover font-semibold";

const btnSecondary =
  "border border-border bg-card text-foreground hover:border-secondary/60 hover:bg-surface";

/* ── Magnetic Link (input-layer only, zero GSAP) ────────────────── */

function MagneticLink({
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = linkRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transition =
        "transform 0.25s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out, color 0.2s ease-out";
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    },
    [],
  );

  const onMouseLeave = useCallback(() => {
    const el = linkRef.current;
    if (!el) return;
    el.style.transition =
      "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease-out, border-color 0.2s ease-out, color 0.2s ease-out";
    el.style.transform = "translate(0, 0)";
  }, []);

  return (
    <a
      ref={linkRef}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ willChange: "transform" }}
      {...props}
    >
      {children}
    </a>
  );
}
