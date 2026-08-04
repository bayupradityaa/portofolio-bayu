"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Logo } from "@/components/ui/logo";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { Mail, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Register GSAP Plugins safely for SSR
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

const navItems = [
  { id: "about", number: "01", label: "About Us", href: "/#about", shape: "1" },
  { id: "stack", number: "02", label: "Tech Stack", href: "/#stack", shape: "2" },
  { id: "work", number: "03", label: "Selected Works", href: "/#work", shape: "3" },
  { id: "journey", number: "04", label: "Journey Path", href: "/#journey", shape: "4" },
  { id: "contact", number: "05", label: "Contact Us", href: "/#contact", shape: "5" },
];

export function Nav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasOpenedRef = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Initial Setup & Hover Effects
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
        gsap.defaults({ ease: "main", duration: 0.7 });
      }
    } catch (e) {
      console.warn("CustomEase failed to load, falling back to default.", e);
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".ambient-background-shapes");

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;

        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          if (shapesContainer) {
            shapesContainer.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
          }
          shape.classList.add("active");

          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              overwrite: "auto",
            }
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);

        (item as any)._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (containerRef.current) {
        const items = containerRef.current.querySelectorAll(".menu-list-item[data-shape]");
        items.forEach((item: any) => item._cleanup && item._cleanup());
      }
    };
  }, []);

  // Menu Open/Close Animation Effect
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current!.querySelector<HTMLElement>(".nav-overlay-wrapper");
      const menu = containerRef.current!.querySelector<HTMLElement>(".menu-content");
      const overlay = containerRef.current!.querySelector<HTMLElement>(".overlay");
      const bgPanels = containerRef.current!.querySelectorAll<HTMLElement>(".backdrop-layer");
      const menuLinks = containerRef.current!.querySelectorAll<HTMLElement>(".nav-link");
      const fadeTargets = containerRef.current!.querySelectorAll<HTMLElement>("[data-menu-fade]");

      const menuButtonTexts = containerRef.current!.querySelectorAll<HTMLParagraphElement>(".nav-close-btn p");
      const menuButtonIcon = containerRef.current!.querySelector<SVGElement>(".menu-button-icon");

      if (isMenuOpen) {
        hasOpenedRef.current = true;

        // LOCK BODY SCROLL
        document.body.style.overflow = "hidden";

        if (navWrap) navWrap.setAttribute("data-nav", "open");

        const tl = gsap.timeline();

        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 });

        if (menuButtonTexts && menuButtonTexts.length > 0) {
          tl.fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, duration: 0.4, stagger: 0.1, ease: "power2.out" }, 0);
        }

        if (menuButtonIcon) {
          tl.fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315, duration: 0.45, ease: "back.out(1.7)" }, 0);
        }

        tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0)
          .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.08, duration: 0.525, ease: "power3.out" }, 0)
          .fromTo(menuLinks, { yPercent: 140, rotate: 6 }, { yPercent: 0, rotate: 0, stagger: 0.04, duration: 0.5, ease: "power3.out" }, 0.2);

        if (fadeTargets.length) {
          tl.fromTo(fadeTargets, { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, stagger: 0.03, duration: 0.4, ease: "power2.out" }, 0.25);
        }
      } else if (hasOpenedRef.current) {
        // SMOOTH CLOSE ANIMATION
        const tl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = "";
            if (navWrap) {
              navWrap.setAttribute("data-nav", "closed");
              gsap.set(navWrap, { display: "none" });
            }
          },
        });

        if (menuButtonTexts && menuButtonTexts.length > 0) {
          tl.to(menuButtonTexts, { yPercent: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }, 0);
        }

        if (menuButtonIcon) {
          tl.to(menuButtonIcon, { rotate: 0, duration: 0.4, ease: "power2.out" }, 0);
        }

        if (fadeTargets.length) {
          tl.to(fadeTargets, { autoAlpha: 0, yPercent: 20, stagger: 0.02, duration: 0.25, ease: "power2.in" }, 0);
        }

        tl.to(menuLinks, { yPercent: 100, rotate: -2, stagger: 0.03, duration: 0.35, ease: "power2.in" }, 0)
          .to(bgPanels, { xPercent: 101, stagger: 0.06, duration: 0.45, ease: "power3.in" }, 0.05)
          .to(overlay, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }, 0.1);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  // keydown Escape handling
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef}>
      <div className="site-header-wrapper">
        <header className="header">
          <div className="container is--full">
            <nav className="nav-row">
              <Link href="/" aria-label="home" className="nav-logo-row focus-visible:outline-accent pointer-events-auto">
                <Logo />
              </Link>
              <div className="nav-row__right">
                {/* Restored Menu Button */}
                <button
                  role="button"
                  className="nav-close-btn"
                  onClick={toggleMenu}
                  aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                >
                  <div className="menu-button-text">
                    <p className="p-large">Menu</p>
                    <p className="p-large">Close</p>
                  </div>
                  <div className="icon-wrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="menu-button-icon"
                    >
                      <path
                        d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          {/* Backdrop Overlay Click Mask */}
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content">
            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>

              {/* Ambient Warm Gold (#FFD177) Background Shapes */}
              <div className="ambient-background-shapes">
                {/* Shape 1: Floating circles */}
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(255, 209, 119, 0.18)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(245, 158, 11, 0.15)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(255, 209, 119, 0.12)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(255, 209, 119, 0.18)" />
                </svg>

                {/* Shape 2: Wave pattern */}
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M0 200 Q100 100, 200 200 T 400 200"
                    stroke="rgba(255, 209, 119, 0.25)"
                    strokeWidth="60"
                    fill="none"
                  />
                  <path
                    className="shape-element"
                    d="M0 280 Q100 180, 200 280 T 400 280"
                    stroke="rgba(245, 158, 11, 0.18)"
                    strokeWidth="40"
                    fill="none"
                  />
                </svg>

                {/* Shape 3: Grid dots */}
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(255, 209, 119, 0.35)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(245, 158, 11, 0.3)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(255, 209, 119, 0.35)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(245, 158, 11, 0.3)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(255, 209, 119, 0.25)" />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(245, 158, 11, 0.25)" />
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(255, 209, 119, 0.25)" />
                  <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(255, 209, 119, 0.3)" />
                  <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(245, 158, 11, 0.3)" />
                  <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(255, 209, 119, 0.3)" />
                  <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(245, 158, 11, 0.3)" />
                </svg>

                {/* Shape 4: Organic blobs */}
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                    fill="rgba(255, 209, 119, 0.16)"
                  />
                  <path
                    className="shape-element"
                    d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
                    fill="rgba(245, 158, 11, 0.14)"
                  />
                </svg>

                {/* Shape 5: Diagonal lines */}
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(255, 209, 119, 0.2)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(245, 158, 11, 0.16)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(255, 209, 119, 0.14)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              {/* Header Label inside Drawer */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#FFD177]">
                  EXPLORE PORTFOLIO
                </span>
                <span className="font-mono text-[11px] text-white/50">
                  BAYU PRADITYA
                </span>
              </div>

              {/* Main Navigation Links */}
              <ul className="menu-list">
                {navItems.map((item) => {
                  const targetHref = isHomePage ? `#${item.id}` : `/#${item.id}`;

                  return (
                    <li key={item.id} className="menu-list-item" data-shape={item.shape}>
                      <a
                        href={targetHref}
                        className="nav-link w-inline-block"
                        onClick={closeMenu}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#FFD177]/70">
                            {item.number}
                          </span>
                          <p className="nav-link-text">{item.label}</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 md:w-7 md:h-7 text-white/30 group-hover:text-[#FFD177] transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Drawer Footer with Mail & Social Links */}
              <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-5 text-white/80">
                  <a
                    href="mailto:bayuupraditya@gmail.com"
                    className="hover:text-[#FFD177] transition-colors"
                    aria-label="Email Bayu Praditya"
                    title="Email me (bayuupraditya@gmail.com)"
                  >
                    <Mail size={18} />
                  </a>
                  <a
                    href="https://github.com/bayupradityaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FFD177] transition-colors"
                    aria-label="GitHub"
                  >
                    <GithubIcon size={18} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FFD177] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FFD177] transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon size={18} />
                  </a>
                </div>

                <Link
                  href="/#contact"
                  className="font-mono text-[11px] font-bold uppercase tracking-widest text-black bg-[#FFD177] px-4 py-2 rounded-full hover:bg-white transition-all shadow-md"
                  onClick={closeMenu}
                >
                  GET IN TOUCH ↗
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
