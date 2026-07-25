"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { User, Cpu, Briefcase, Compass, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { LinkButton } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "github", label: "GitHub" },
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
  journey: {
    icon: <Compass className="h-4 w-4" />,
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

const MENU_SLIDE_ANIMATION = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const } },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
  },
};

/** Animated SVG Menu Toggle Button */
function MenuToggleIcon({
  open,
  className,
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2.5,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  duration = 500,
  ...props
}: {
  open: boolean;
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "round" | "butt" | "square";
  strokeLinejoin?: "round" | "miter" | "bevel";
  duration?: number;
}) {
  return (
    <svg
      strokeWidth={strokeWidth}
      fill={fill}
      stroke={stroke}
      viewBox="0 0 32 32"
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      className={cn("transition-transform ease-in-out", open && "-rotate-45", className)}
      style={{ transitionDuration: `${duration}ms` }}
      {...props}
    >
      <path
        className={cn(
          "transition-all ease-in-out",
          open
            ? "[stroke-dasharray:20_300] [stroke-dashoffset:-32.42px]"
            : "[stroke-dasharray:12_63]",
        )}
        style={{ transitionDuration: `${duration}ms` }}
        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
      />
      <path d="M7 16 27 16" />
    </svg>
  );
}

/** SVG Curve side edge for smooth drawer slide */
function Curve() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(window.innerHeight);
    const onResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!height) return null;

  const initialPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q-100 ${height / 2} 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q100 ${height / 2} 100 0`;

  const curve = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  return (
    <svg className="absolute top-0 -left-[99px] h-full w-[100px] stroke-none fill-background border-none pointer-events-none">
      <motion.path variants={curve} initial="initial" animate="enter" exit="exit" />
    </svg>
  );
}

/** Individual Mobile Nav Link with letter-stagger hover & index number */
function CurvedNavLink({
  item,
  index,
  isActive,
  onClick,
  targetHref,
}: {
  item: (typeof navItems)[number];
  index: number;
  isActive: boolean;
  onClick: () => void;
  targetHref: string;
}) {
  const config = navItemConfig[item.id];

  return (
    <motion.div
      onClick={onClick}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b border-border/40 py-3.5"
    >
      <a href={targetHref} className="w-full">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-sans text-2xl font-thin text-muted/60 transition-colors group-hover:text-accent">
              0{index}.
            </span>
            <div className="flex flex-row gap-2">
              <motion.span
                variants={{
                  initial: { x: 0 },
                  whileHover: { x: -6 },
                }}
                transition={{
                  type: "spring",
                  staggerChildren: 0.03,
                  delayChildren: 0.05,
                }}
                className={cn(
                  "relative z-10 block text-2xl font-light uppercase tracking-wide transition-colors duration-300",
                  isActive ? "text-accent font-medium" : "text-foreground group-hover:text-accent",
                )}
              >
                {item.label.split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      initial: { x: 0 },
                      whileHover: { x: 6 },
                    }}
                    transition={{ type: "spring" }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
            </div>
          </div>

          <span
            className={cn(
              "text-lg transition-colors",
              isActive ? "text-accent" : "text-muted group-hover:text-accent",
            )}
          >
            {config.icon}
          </span>
        </div>
      </a>
    </motion.div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);

  useEffect(() => {
    if (!isHomePage) return;
    const onHeroScroll = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.progress === "number") {
        setHeroProgress(detail.progress);
      }
    };
    window.addEventListener("hero-scroll", onHeroScroll);
    return () => window.removeEventListener("hero-scroll", onHeroScroll);
  }, [isHomePage]);

  useEffect(() => {
    if (!isHomePage) {
      if (pathname?.startsWith("/projects")) {
        setActive("work");
      }
      return;
    }

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
  }, [isHomePage, pathname]);

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const scrolled = !isHomePage || heroProgress > 0.6;
  const logoOpacity = !isHomePage ? 1 : Math.min(1, Math.max(0.3, (heroProgress - 0.5) / 0.2));

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
          href={isHomePage ? "#hero" : "/"}
          className="rounded-sm text-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          style={{
            opacity: logoOpacity,
            transition: "opacity 0.4s ease",
          }}
        >
          <Logo />
        </a>

        {/* Center Interactive Navigation Dock (Desktop) */}
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
            const targetHref = isHomePage ? `#${item.id}` : `/#${item.id}`;

            return (
              <motion.a
                key={item.id}
                href={targetHref}
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
                      isActive ? "text-accent" : "text-secondary group-hover:text-foreground",
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
                      isActive ? "text-accent" : "text-secondary group-hover:text-foreground",
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

        {/* Right Action CTA Button & Theme Toggle (Desktop) */}
        <div
          className="hidden md:flex items-center gap-2.5"
          style={{
            opacity: logoOpacity,
            transition: "opacity 0.4s ease",
          }}
        >
          <ThemeToggle />
          <LinkButton href={isHomePage ? "#contact" : "/#contact"} size="sm">
            Get in touch
          </LinkButton>
        </div>

        {/* Mobile Morphing Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg p-2 text-foreground cursor-pointer hover:bg-surface transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuToggleIcon open={open} className="h-6 w-6 text-foreground" />
          </button>
        </div>
      </div>

      {/* Curved Mobile Drawer Menu with AnimatePresence */}
      <AnimatePresence mode="wait">
        {open && (
          <>
            {/* Dark Backdrop Overlay — tap anywhere outside to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Curved Mobile Drawer Panel */}
            <motion.div
              variants={MENU_SLIDE_ANIMATION}
              initial="initial"
              animate="enter"
              exit="exit"
              className="fixed right-0 top-0 z-50 h-[100dvh] w-full max-w-xs sm:max-w-sm border-l border-border bg-background shadow-2xl md:hidden"
            >
              <div className="flex h-full flex-col justify-between px-6 pt-5 pb-8">
                <div className="flex flex-col gap-3">
                  {/* Drawer Top Bar — NAVIGATION Label & Explicit Close Button */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-muted">
                      Navigation
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-accent hover:text-accent-contrast cursor-pointer"
                      aria-label="Close menu"
                    >
                      <span>Close</span>
                      <MenuToggleIcon open={true} className="h-4 w-4" />
                    </button>
                  </div>

                  <nav className="mt-1 flex flex-col gap-0.5" aria-label="Mobile">
                    {navItems.map((item, index) => {
                      const isActive = active === item.id;
                      const targetHref = isHomePage ? `#${item.id}` : `/#${item.id}`;

                      return (
                        <CurvedNavLink
                          key={item.id}
                          item={item}
                          index={index + 1}
                          isActive={isActive}
                          onClick={() => setOpen(false)}
                          targetHref={targetHref}
                        />
                      );
                    })}
                  </nav>
                </div>

                {/* Mobile Drawer Footer with Social Icons & CTA */}
                <div className="flex flex-col gap-5 border-t border-border/40 pt-5">
                  <div className="flex items-center justify-around text-muted">
                    <a
                      href="https://github.com/bayupradityaa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                      aria-label="GitHub"
                    >
                      <GithubIcon size={20} />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon size={20} />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                      aria-label="Instagram"
                    >
                      <InstagramIcon size={20} />
                    </a>
                    <a
                      href="mailto:contact@example.com"
                      className="transition-colors hover:text-accent"
                      aria-label="Email"
                    >
                      <Mail size={20} />
                    </a>
                  </div>

                  <LinkButton
                    href={isHomePage ? "#contact" : "/#contact"}
                    size="md"
                    className="w-full justify-center"
                    onClick={() => setOpen(false)}
                  >
                    Get in touch
                  </LinkButton>
                </div>
              </div>

              {/* Curved SVG Side Edge */}
              <Curve />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
