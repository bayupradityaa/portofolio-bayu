import { useEffect, useRef, useState, useCallback } from "react";
import { sequenceConfig } from "@/lib/sequence-config";

type Status = "loading" | "ready" | "unavailable";

/**
 * Canvas image-sequence engine optimized for 90+ Google Lighthouse performance scores.
 * Uses progressive keyframe preloading, current-frame tracking, and theme-filtered DOM observers
 * to ensure the background NEVER resets back to frame 0 during scroll or scroll-pause.
 */
export function useHeroSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastIndexRef = useRef<number>(-1);
  const currentFrameIndexRef = useRef<number>(0);
  // Mobile-only rAF coalescing: many scrub ticks per frame collapse into a
  // single paint. Desktop paints synchronously (unchanged) for exact fidelity.
  const rafRef = useRef<number | null>(null);
  const pendingIndexRef = useRef<number | null>(null);

  const drawFrame = useCallback((rawIndex: number) => {
    const images = imagesRef.current;
    if (images.length === 0) return;

    // Safely clamp frame index to current active sequence length
    const index = Math.min(Math.max(0, rawIndex), images.length - 1);
    currentFrameIndexRef.current = index;

    // Avoid re-rendering the exact same frame index
    if (lastIndexRef.current === index) return;

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // Find requested target frame, or nearest available loaded frame (never snap back to 0)
    let img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Look backwards for nearest loaded frame
      for (let i = index - 1; i >= 0; i--) {
        if (images[i] && images[i].complete && images[i].naturalWidth > 0) {
          img = images[i];
          break;
        }
      }
      // Look forwards if backwards has none
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = index + 1; i < images.length; i++) {
          if (images[i] && images[i].complete && images[i].naturalWidth > 0) {
            img = images[i];
            break;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    lastIndexRef.current = index;

    const cw = canvas.width;
    const ch = canvas.height;
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

    // Detect theme dynamically (Dark mode vs Light mode)
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    const bgColor = isDark ? "#09090b" : "#ffffff";
    const shadowRgb = isDark ? "9, 9, 11" : "255, 255, 255";

    if (isDesktop) {
      // Desktop: Dynamic theme adaptive rendering
      const scaleFactor = 1.01;
      const scale = (ch / img.naturalHeight) * scaleFactor;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const y = (ch - dh) / 2;
      const x = cw - dw;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      if (x > 0) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, x + 1, ch);
      }

      ctx.drawImage(img, x, y, dw, dh);

      if (x > 0) {
        const blendWidth = 300;
        const grad = ctx.createLinearGradient(x, 0, x + blendWidth, 0);
        grad.addColorStop(0, bgColor);
        grad.addColorStop(1, `rgba(${shadowRgb}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(x - 1, 0, blendWidth + 1, ch);
      }
      return;
    }

    // Mobile: Render dedicated mobile portrait sequence (/sequence-mobile/)
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const y = (ch - dh) / 2;
    const x = (cw - dw) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";

    ctx.drawImage(img, x, y, dw, dh);
  }, []);

  /**
   * Public entry called by the timeline on every scrub tick.
   * Desktop: paint immediately (byte-identical to prior behavior).
   * Mobile (<1024px): coalesce rapid ticks into one rAF-scheduled paint so we
   * never draw more than once per animation frame — cuts long tasks on scroll.
   */
  const renderFrame = useCallback(
    (rawIndex: number) => {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
      if (isDesktop) {
        drawFrame(rawIndex);
        return;
      }
      pendingIndexRef.current = rawIndex;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (pendingIndexRef.current !== null) drawFrame(pendingIndexRef.current);
      });
    },
    [drawFrame],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctxRef.current = ctx;

    const isDesktop = window.innerWidth >= 1024;
    const activeConfig = isDesktop ? sequenceConfig.desktop : sequenceConfig.mobile;
    const { frameCount, path } = activeConfig;
    const step = "step" in activeConfig ? activeConfig.step : 1;

    const images: HTMLImageElement[] = new Array(frameCount);
    let isCancelled = false;

    const sizeCanvas = () => {
      const rect = wrap.getBoundingClientRect();
      const desktopCheck = window.innerWidth >= 1024;
      const dpr = desktopCheck ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      lastIndexRef.current = -1;
    };

    const loadAndDecodeFrame = (fNum: number, index: number) => {
      if (images[index]) return;
      const img = new Image();
      img.src = path(fNum);
      img.onload = () => {
        if (isCancelled) return;
        images[index] = img;
        if ("decode" in img) {
          img.decode().catch(() => {});
        }
      };
    };

    const connection = typeof navigator !== "undefined" ? (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection : null;
    const isSaveData = connection?.saveData === true;
    const isSlowConnection = connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g";
    const isReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isPosterOnly = isSaveData || isSlowConnection || isReducedMotion;

    let intersectionObserver: IntersectionObserver | null = null;
    let cleanupMobileListeners: (() => void) | null = null;

    if (isReducedMotion) {
      // Reduced motion: load the final frame pose (facing camera) once; 1 request total
      const finalImg = new Image();
      finalImg.onload = () => {
        if (isCancelled) return;
        images[frameCount - 1] = finalImg;
        imagesRef.current = images;
        if ("decode" in finalImg) {
          finalImg.decode().catch(() => {});
        }
        sizeCanvas();
        renderFrame(frameCount - 1);
        setStatus("ready");
      };
      finalImg.onerror = () => {
        if (!isCancelled) setStatus("unavailable");
      };
      finalImg.src = path(frameCount);
      images[frameCount - 1] = finalImg;
      imagesRef.current = images;
    } else if (isPosterOnly) {
      // Save-Data / 2G: load only frame 1 for an instant static paint; 1 request total
      const frame1 = new Image();
      frame1.onload = () => {
        if (isCancelled) return;
        images[0] = frame1;
        imagesRef.current = images;
        if ("decode" in frame1) {
          frame1.decode().catch(() => {});
        }
        sizeCanvas();
        renderFrame(0);
        setStatus("ready");
      };
      frame1.onerror = () => {
        if (!isCancelled) setStatus("unavailable");
      };
      frame1.src = path(1);
      images[0] = frame1;
      imagesRef.current = images;
    } else {
      // Phase 1: Load Frame 1 FIRST for instant sub-second LCP paint
      const frame1 = new Image();
      frame1.onload = () => {
        if (isCancelled) return;
        images[0] = frame1;
        imagesRef.current = images;
        if ("decode" in frame1) {
          frame1.decode().catch(() => {});
        }
        sizeCanvas();
        renderFrame(0);
        setStatus("ready");

        const startSequenceBatch = () => {
          if (isCancelled) return;
          // Build the list of 1-based frame numbers this device actually decodes.
          // Desktop (step 1) → every frame (unchanged). Mobile (step 3) → every 3rd
          // frame; the drawFrame nearest-loaded-frame fallback paints the gaps, so
          // the scrub stays continuous while decode work drops ~65%.
          const framesToLoad: number[] = [];
          for (let f = 1 + step; f <= frameCount; f += step) {
            framesToLoad.push(f);
          }
          // Always include the true last frame so the end-of-scroll pose is exact.
          if (framesToLoad[framesToLoad.length - 1] !== frameCount) {
            framesToLoad.push(frameCount);
          }

          // Phase 2: Fast-track keyframes across the range for instant scroll coverage.
          const strideEvery = Math.max(1, Math.round(framesToLoad.length / 12));
          framesToLoad
            .filter((_, i) => i % strideEvery === 0)
            .forEach((fNum) => {
              loadAndDecodeFrame(fNum, fNum - 1);
            });

          // Phase 3: Fill the rest in non-blocking idle batches (no TBT spike).
          let cursor = 0;

          const loadBatch = () => {
            if (isCancelled || cursor >= framesToLoad.length) return;
            const batchSize = 8;
            const end = Math.min(framesToLoad.length, cursor + batchSize);

            for (let i = cursor; i < end; i++) {
              const fNum = framesToLoad[i];
              loadAndDecodeFrame(fNum, fNum - 1);
            }

            cursor = end;
            if (cursor < framesToLoad.length && !isCancelled) {
              if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                window.requestIdleCallback(loadBatch, { timeout: 600 });
              } else {
                setTimeout(loadBatch, 20);
              }
            }
          };

          if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(loadBatch, { timeout: 300 });
          } else {
            setTimeout(loadBatch, 30);
          }
        };

        if (isDesktop) {
          // Desktop: cinematic preloading via IntersectionObserver
          if (typeof IntersectionObserver !== "undefined") {
            intersectionObserver = new IntersectionObserver(
              (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                  if (intersectionObserver) {
                    intersectionObserver.disconnect();
                    intersectionObserver = null;
                  }
                  startSequenceBatch();
                }
              },
              { rootMargin: "200px" }
            );
            intersectionObserver.observe(wrap);
          } else {
            startSequenceBatch();
          }
        } else {
          // Mobile (<1024px): Frame 1 is already rendered for instant LCP.
          // Defer decoding the remaining frames until the user actually starts scrolling
          // or touching the screen. This slashes mobile TBT (Total Blocking Time) to near 0ms
          // in Lighthouse audits without compromising interactive scroll smoothness.
          let batchTriggered = false;
          const triggerMobileBatch = () => {
            if (batchTriggered || isCancelled) return;
            batchTriggered = true;
            window.removeEventListener("scroll", triggerMobileBatch);
            window.removeEventListener("touchstart", triggerMobileBatch);
            startSequenceBatch();
          };

          window.addEventListener("scroll", triggerMobileBatch, { passive: true, once: true });
          window.addEventListener("touchstart", triggerMobileBatch, { passive: true, once: true });

          // Safety fallback: load after 4.5s idle if user remains stationary
          const fallbackTimer = setTimeout(triggerMobileBatch, 4500);

          cleanupMobileListeners = () => {
            clearTimeout(fallbackTimer);
            window.removeEventListener("scroll", triggerMobileBatch);
            window.removeEventListener("touchstart", triggerMobileBatch);
          };
        }
      };

      frame1.onerror = () => {
        if (!isCancelled) setStatus("unavailable");
      };

      frame1.src = path(1);
      images[0] = frame1;
      imagesRef.current = images;
    }

    // `sizeCanvas()` assigns canvas.width, which CLEARS the bitmap; with
    // {alpha:false} a cleared bitmap is opaque black. A resize must therefore
    // either repaint afterwards or leave the bitmap alone — never one without
    // the other.
    let lastW = Math.round(wrap.getBoundingClientRect().width);
    let lastH = Math.round(wrap.getBoundingClientRect().height);
    let resizeRaf: number | null = null;

    const onResize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      // iOS Safari fires `resize` on every URL-bar collapse or expand: width is
      // unchanged and height moves by roughly a toolbar. Stretching the existing
      // bitmap over that is invisible; discarding and re-decoding it is not.
      if (w === lastW && Math.abs(h - lastH) < 80) return;
      lastW = w;
      lastH = h;

      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        sizeCanvas();                                 // clears the bitmap…
        renderFrame(currentFrameIndexRef.current);     // …so repaint is mandatory
      });
    };
    window.addEventListener("resize", onResize);

    let lastThemeIsDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

    const observer = new MutationObserver(() => {
      const currentThemeIsDark = document.documentElement.classList.contains("dark");
      if (currentThemeIsDark !== lastThemeIsDark) {
        lastThemeIsDark = currentThemeIsDark;
        const activeFrameIndex = currentFrameIndexRef.current;
        lastIndexRef.current = -1;
        renderFrame(activeFrameIndex);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      isCancelled = true;
      if (cleanupMobileListeners) {
        cleanupMobileListeners();
        cleanupMobileListeners = null;
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
        intersectionObserver = null;
      }
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      if (resizeRaf !== null) {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = null;
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pendingIndexRef.current = null;
      images.forEach((img) => {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      });
    };
  }, [renderFrame]);

  return { canvasRef, wrapRef, renderFrame, status };
}
