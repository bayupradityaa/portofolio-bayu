import { useEffect, useRef, useState, useCallback } from "react";
import { sequenceConfig } from "@/lib/sequence-config";

type Status = "loading" | "ready" | "unavailable";

/**
 * Canvas image-sequence engine optimized for 60fps across desktop & mobile.
 * Loads dedicated sequence sets: /sequence-desktop/ (113 frames) for Desktop
 * and /sequence-mobile/ (124 frames) for Mobile.
 * Dynamically detects active theme (Dark vs Light) for seamless background & gradient blending.
 */
export function useHeroSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastIndexRef = useRef<number>(-1);

  const renderFrame = useCallback((rawIndex: number) => {
    const images = imagesRef.current;
    if (images.length === 0) return;

    // Safely clamp frame index to current active sequence length
    const index = Math.min(Math.max(0, rawIndex), images.length - 1);

    // Avoid re-rendering the exact same frame index
    if (lastIndexRef.current === index) return;

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const img = images[index];
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

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cw, ch);

    ctx.drawImage(img, x, y, dw, dh);

    // Left gradient blend automatically adapting to Light vs Dark theme
    const blendWidth = Math.min(120, cw * 0.10);
    const leftGrad = ctx.createLinearGradient(0, 0, blendWidth, 0);
    leftGrad.addColorStop(0, `rgba(${shadowRgb}, 0.70)`);
    leftGrad.addColorStop(0.5, `rgba(${shadowRgb}, 0.30)`);
    leftGrad.addColorStop(1, `rgba(${shadowRgb}, 0)`);

    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, blendWidth, ch);
  }, []);

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

    const images: HTMLImageElement[] = [];
    let loaded = 0;
    let failed = false;

    const sizeCanvas = () => {
      const rect = wrap.getBoundingClientRect();
      const desktopCheck = window.innerWidth >= 1024;
      // Cap DPR to 1 on mobile screens to reduce pixel count by 4x-9x for buttery smooth 60fps
      const dpr = desktopCheck ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      lastIndexRef.current = -1;
    };

    const probe = new Image();
    probe.onload = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = path(i);
        img.onload = () => {
          loaded++;
          if (loaded === 1) {
            sizeCanvas();
            renderFrame(0);
            setStatus("ready");
          }
        };
        img.onerror = () => {
          if (!failed) {
            failed = true;
            setStatus("unavailable");
          }
        };
        images.push(img);
      }
    };
    probe.onerror = () => setStatus("unavailable");
    probe.src = path(1);

    imagesRef.current = images;

    const onResize = () => {
      sizeCanvas();
    };
    window.addEventListener("resize", onResize);

    // Listen for theme mutations on documentElement class to re-render frame dynamically
    const observer = new MutationObserver(() => {
      lastIndexRef.current = -1;
      renderFrame(0);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [renderFrame]);

  return { canvasRef, wrapRef, renderFrame, status };
}
