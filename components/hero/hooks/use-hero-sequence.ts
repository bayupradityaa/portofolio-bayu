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

  const renderFrame = useCallback((rawIndex: number) => {
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

    const images: HTMLImageElement[] = new Array(frameCount);
    let isCancelled = false;

    const sizeCanvas = () => {
      const rect = wrap.getBoundingClientRect();
      const desktopCheck = window.innerWidth >= 1024;
      const dpr = desktopCheck ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      lastIndexRef.current = -1;
    };

    // Phase 1: Load Frame 1 FIRST for instant sub-second LCP paint
    const frame1 = new Image();
    frame1.onload = () => {
      if (isCancelled) return;
      images[0] = frame1;
      imagesRef.current = images;
      sizeCanvas();
      renderFrame(0);
      setStatus("ready");

      // Phase 2: Fast-track Keyframes (every 10th frame) for instant scroll coverage
      const keyframeIndices: number[] = [];
      for (let k = 10; k < frameCount; k += 10) {
        keyframeIndices.push(k);
      }
      keyframeIndices.push(frameCount);

      keyframeIndices.forEach((fNum) => {
        const kImg = new Image();
        kImg.src = path(fNum);
        const idx = fNum - 1;
        kImg.onload = () => {
          if (!isCancelled) images[idx] = kImg;
        };
      });

      // Phase 3: Fill remaining in-between frames in non-blocking background idle batches (0ms TBT spike)
      let currentFrameIndex = 2;

      const loadBatch = () => {
        if (isCancelled || currentFrameIndex > frameCount) return;
        const batchSize = 8;
        const end = Math.min(frameCount, currentFrameIndex + batchSize);

        for (let i = currentFrameIndex; i <= end; i++) {
          const index = i - 1;
          if (!images[index]) {
            const img = new Image();
            img.src = path(i);
            img.onload = () => {
              if (!isCancelled) images[index] = img;
            };
          }
        }

        currentFrameIndex = end + 1;
        if (currentFrameIndex <= frameCount && !isCancelled) {
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

    frame1.onerror = () => {
      if (!isCancelled) setStatus("unavailable");
    };

    frame1.src = path(1);
    images[0] = frame1;
    imagesRef.current = images;

    const onResize = () => {
      sizeCanvas();
    };
    window.addEventListener("resize", onResize);

    // Listen for theme mutations ONLY (ignore scroll class mutations to prevent unwanted frame resets)
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
      observer.disconnect();
      window.removeEventListener("resize", onResize);
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
