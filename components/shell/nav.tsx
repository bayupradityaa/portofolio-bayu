"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "motion/react";
import { User, Cpu, Briefcase, Compass, Mail, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { LinkButton } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "github", label: "GitHub" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;

const navItemConfig: Record<
  string,
  { icon: React.ReactNode; gradient: string; iconColor: string }
> = {
  about: {
    icon: <User className="h-4 w-4" />,
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0) 100%)",
    iconColor: "group-hover:text-accent",
  },
  stack: {
    icon: <Cpu className="h-4 w-4" />,
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0) 100%)",
    iconColor: "group-hover:text-accent",
  },
  work: {
    icon: <Briefcase className="h-4 w-4" />,
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0) 100%)",
    iconColor: "group-hover:text-accent",
  },
  github: {
    icon: <GithubIcon className="h-4 w-4" />,
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0) 100%)",
    iconColor: "group-hover:text-accent",
  },
  journey: {
    icon: <Compass className="h-4 w-4" />,
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0) 100%)",
    iconColor: "group-hover:text-accent",
  },
  contact: {
    icon: <Mail className="h-4 w-4" />,
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, rgba(34,197,94,0) 100%)",
    iconColor: "group-hover:text-accent",
  },
};
const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 1.4,
    transition: {
      opacity: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.4, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
  duration: 0.4,
};

export function Nav() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);

  useEffect(() => {
    const onHeroScroll = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.progress === "number") {
        setHeroProgress(detail.progress);
      }
    };
    window.addEventListener("hero-scroll", onHeroScroll);
    return () => window.removeEventListener("hero-scroll", onHeroScroll);
  }, []);

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
    };
  }, []);

  // Close the mobile sheet on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const scrolled = heroProgress > 0.6;
  const logoOpacity = Math.min(1, Math.max(0.3, (heroProgress - 0.5) / 0.2));

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-50 transition-all duration-500",
        scrolled ? "top-4 px-4 md:px-0" : "top-0 px-0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 w-full items-center justify-between transition-all duration-500",
          scrolled
            ? "max-w-5xl rounded-full border border-border bg-background/80 backdrop-blur-xl shadow-lg px-8"
            : "max-w-6xl px-6 border-b border-transparent bg-transparent",
        )}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="rounded-sm text-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          style={{
            opacity: logoOpacity,
            transition: "opacity 0.4s ease",
          }}
        >
          <Logo />
        </a>

        {/* Center Interactive Navigation Dock (Shown only on Desktop) */}
        <nav
          className="hidden md:flex items-center gap-1.5 relative z-10"
          aria-label="Primary"
          style={{
            opacity: logoOpacity,
            transition: "opacity 0.4s ease",
          }}
        >
          {navItems.map((item) => {
            const config = navItemConfig[item.id];
            const isActive = active === item.id;

            return (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "relative block px-3 py-1.5 text-xs md:text-sm font-medium rounded-xl group select-none cursor-pointer overflow-visible",
                )}
                style={{ perspective: "600px" }}
                whileHover="hover"
                initial="initial"
              >
                {/* Active/Hover Glow Background */}
                <motion.div
                  className="absolute inset-0 z-0 pointer-events-none rounded-xl"
                  variants={glowVariants}
                  style={{
                    background: config.gradient,
                    opacity: isActive ? 0.6 : 0,
                    transform: isActive ? "scale(1.2)" : "scale(0.8)",
                  }}
                />

                {/* 3D Card Wrapper */}
                <motion.div
                  className="relative flex items-center justify-center"
                  style={{ transformStyle: "preserve-3d" }}
                  variants={{
                    initial: { rotateX: 0 },
                    hover: { rotateX: -90 },
                  }}
                  transition={sharedTransition}
                >
                  {/* Front-facing Face */}
                  <span
                    className={cn(
                      "flex items-center gap-1.5 relative z-10 transition-colors duration-200",
                      isActive
                        ? "text-accent"
                        : "text-secondary group-hover:text-foreground",
                    )}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateX(0deg) translateZ(8px)",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <span
                      className={cn(
                        "transition-colors duration-300",
                        isActive ? "text-accent" : config.iconColor,
                      )}
                    >
                      {config.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>

                  {/* Back-facing Face */}
                  <span
                    className={cn(
                      "flex items-center gap-1.5 absolute inset-0 z-10 transition-colors duration-200 justify-center",
                      isActive
                        ? "text-accent"
                        : "text-secondary group-hover:text-foreground",
                    )}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateX(90deg) translateZ(8px)",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <span
                      className={cn(
                        "transition-colors duration-300",
                        isActive ? "text-accent" : config.iconColor,
                      )}
                    >
                      {config.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                </motion.div>
              </motion.a>
            );
          })}
        </nav>

        {/* Right Action CTA Button (Shown on Desktop) */}
        <div
          className="hidden md:block"
          style={{
            opacity: logoOpacity,
            transition: "opacity 0.4s ease",
          }}
        >
          <LinkButton href="#contact" size="sm">
            Get in touch
          </LinkButton>
        </div>

        {/* Mobile Hamburger menu */}
        <button
          type="button"
          className="rounded-md p-2 text-foreground md:hidden cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X size={22} strokeWidth={1.5} />
          ) : (
            <Menu size={22} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      {open && (
        <div className="mx-4 mt-2 rounded-2xl border border-border bg-background/95 backdrop-blur-md md:hidden shadow-xl overflow-hidden">
          <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Mobile">
            {navItems.map((item) => {
              const config = navItemConfig[item.id];
              const isActive = active === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-secondary hover:bg-surface hover:text-foreground",
                  )}
                >
                  <span className={isActive ? "text-accent" : "text-muted"}>
                    {config.icon}
                  </span>
                  {item.label}
                </a>
              );
            })}
            <LinkButton
              href="#contact"
              size="md"
              className="mt-3 w-full"
              onClick={() => setOpen(false)}
            >
              Get in touch
            </LinkButton>
          </nav>
        </div>
      )}
    </header>
  );
}
