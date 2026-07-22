import { useEffect, useRef, useState, useCallback } from "react";
import { sequenceConfig } from "@/lib/sequence-config";

type Status = "loading" | "ready" | "unavailable";

/**
 * Canvas image-sequence engine optimized for 60fps across desktop & mobile.
 * Uses DPR capping on mobile, frame index memoization, and lightweight smoothing.
 */
export function useHeroSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastIndexRef = useRef<number>(-1);

  const renderFrame = useCallback((index: number) => {
    // Avoid re-rendering the exact same frame index
    if (lastIndexRef.current === index) return;

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!ctx || !canvas) return;

    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    lastIndexRef.current = index;

    const cw = canvas.width;
    const ch = canvas.height;
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    
    let scale: number;
    let dw: number;
    let dh: number;
    let x: number;
    let y: number;

    if (isDesktop) {
      // Desktop: Scale to cover vertical height cleanly
      const scaleFactor = 1.01;
      scale = (ch / img.naturalHeight) * scaleFactor;
      dw = img.naturalWidth * scale;
      dh = img.naturalHeight * scale;

      y = (ch - dh) / 2;
      x = cw - dw;
    } else {
      // Mobile: Lightweight cover scaling with fixed DPR to prevent GPU bottleneck
      const scaleFactor = 1.12;
      scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * scaleFactor;
      dw = img.naturalWidth * scale;
      dh = img.naturalHeight * scale;

      const baseOffset = (ch - dh) / 2;
      const shiftDown = 85;

      y = Math.min(0, Math.max(ch - dh, baseOffset + shiftDown));
      x = (cw - dw) / 2;
    }

    // High quality smoothing on desktop, lightweight rendering on mobile for maximum FPS
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isDesktop ? "high" : "medium";

    if (isDesktop && x > 0) {
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, x + 1, ch);
    }

    ctx.drawImage(img, x, y, dw, dh);

    if (isDesktop && x > 0) {
      const blendWidth = 300;
      const grad = ctx.createLinearGradient(x, 0, x + blendWidth, 0);
      grad.addColorStop(0, "#09090b");
      grad.addColorStop(1, "rgba(9, 9, 11, 0)");

      ctx.fillStyle = grad;
      ctx.fillRect(x - 1, 0, blendWidth + 1, ch);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctxRef.current = ctx;

    const { frameCount, path } = sequenceConfig;
    const images: HTMLImageElement[] = [];
    let loaded = 0;
    let failed = false;

    const sizeCanvas = () => {
      const rect = wrap.getBoundingClientRect();
      const isDesktop = window.innerWidth >= 1024;
      // Cap DPR to 1 on mobile screens to reduce pixel count by 4x-9x for buttery smooth 60fps
      const dpr = isDesktop ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      // Reset frame index on resize so it re-draws cleanly
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

    return () => {
      window.removeEventListener("resize", onResize);
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [renderFrame]);

  return { canvasRef, wrapRef, renderFrame, status };
}
