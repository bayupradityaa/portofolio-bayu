import { useEffect, useRef, useState, useCallback } from "react";
import { sequenceConfig } from "@/lib/sequence-config";

type Status = "loading" | "ready" | "unavailable";

/**
 * Canvas image-sequence engine. Handles preloading, sizing, and frame
 * rendering. Returns a stable renderFrame function the timeline can call.
 * Zero GSAP — purely a canvas renderer.
 */
export function useHeroSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const renderFrame = useCallback((index: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!ctx || !canvas) return;

    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    
    let scale: number;
    let dw: number;
    let dh: number;
    let x: number;
    let y: number;

    if (isDesktop) {
      // On desktop: scale based on height to prevent cropping hair & hands vertically.
      // Scale factor 1.01 ensures the image fully covers the vertical canvas without any gaps at the top/bottom.
      const scaleFactor = 1.01;
      scale = (ch / img.naturalHeight) * scaleFactor;
      dw = img.naturalWidth * scale;
      dh = img.naturalHeight * scale;

      // Center vertically on the canvas
      y = (ch - dh) / 2;

      // Align to the right side of the canvas
      x = cw - dw;
    } else {
      // On mobile: keep standard cover scaling
      const scaleFactor = 1.12;
      scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * scaleFactor;
      dw = img.naturalWidth * scale;
      dh = img.naturalHeight * scale;

      const baseOffset = (ch - dh) / 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const shiftDown = 85 * dpr;

      y = Math.min(0, Math.max(ch - dh, baseOffset + shiftDown));
      x = (cw - dw) / 2;
    }

    // Force high-quality image smoothing (resets on canvas resize)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // 1. If we are on desktop and have a gap on the left (x > 0),
    // fill the gap with the background color (#09090b) to prevent canvas edge glitches.
    if (isDesktop && x > 0) {
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, x + 1, ch);
    }

    // 2. Draw the main image
    ctx.drawImage(img, x, y, dw, dh);

    // 3. Smoothly blend the left edge of the image with the background color
    // using an overlay linear gradient to match the dark text background.
    if (isDesktop && x > 0) {
      const blendWidth = 300; // Width of the smooth transition zone in pixels
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    // Probe the first frame; if it 404s we treat the sequence as absent.
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
