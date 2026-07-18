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
    // Scale up (1.12x) to provide enough padding for a larger vertical shift without blank gaps
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * 1.12;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;

    const baseOffset = (ch - dh) / 2;
    const dpr = window.devicePixelRatio || 1;
    // Shift down by 85px to clear the top navigation pill fully
    const shiftDown = 85 * dpr;

    // Clamp vertical offset between maximum bottom boundary (ch - dh) and top boundary (0)
    const y = Math.min(0, Math.max(ch - dh, baseOffset + shiftDown));
    const x = (cw - dw) / 2;

    ctx.drawImage(img, x, y, dw, dh);
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
