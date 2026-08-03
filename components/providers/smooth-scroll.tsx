"use client";

import { useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll, expoOut } from "@/lib/hooks/use-smooth-scroll";
import type Lenis from "lenis";

/** Subscribe to the current Lenis instance from anywhere in the tree. */
const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * `SmoothScroll` — root-level provider that wires up Lenis smooth scroll
 * and provides global anchor-link smoothing for the whole page.
 *
 * The actual Lenis ↔ ScrollTrigger wiring lives in `useSmoothScroll`; this
 * component just adds the site-specific extras: anchor-click interception,
 * URL-hash handling on first load, and the `/dev` route exclusion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  // Skip Lenis on /dev (the playground page has its own scroll handling) and
  // when the user prefers reduced motion.
  const lenisRef = useSmoothScroll({
    disabled: reduce || !!pathname?.startsWith("/dev"),
  });

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // Global anchor click handler — smooth scroll for same-page hash links.
    // Off-topic links (different route) are left to the browser.
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const hash = href.slice(hashIndex);
      const path = href.slice(0, hashIndex);

      // Only intercept links targeting the current route.
      if (path && path !== "/" && path !== window.location.pathname) return;

      const targetEl = document.querySelector(hash);
      if (!targetEl) return;

      e.preventDefault();
      lenis.scrollTo(targetEl as HTMLElement, {
        duration: 1.4,
        easing: expoOut,
      });

      if (window.history.pushState) {
        window.history.pushState(null, "", hash);
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Smooth scroll on initial load if URL contains a hash (e.g. #work).
    if (window.location.hash) {
      const targetEl = document.querySelector(window.location.hash);
      if (targetEl) {
        window.setTimeout(() => {
          lenis.scrollTo(targetEl as HTMLElement, {
            duration: 1.4,
            easing: expoOut,
          });
        }, 300);
      }
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [lenisRef, pathname]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
