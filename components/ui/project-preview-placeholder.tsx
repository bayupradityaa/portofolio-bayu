import { ImageOff, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectPreviewPlaceholderProps {
  title?: string;
  category?: string | null;
  status?: string;
  className?: string;
}

export function ProjectPreviewPlaceholder({
  title,
  category,
  status = "Coming Soon",
  className,
}: ProjectPreviewPlaceholderProps) {
  const displayStatus = status === "Coming Soon" ? "Coming Soon" : status || "In Development";

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-surface/90 p-6 sm:p-8 text-center shadow-lg select-none font-jakarta",
        className,
      )}
    >
      {/* Subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.03)_0%,transparent_65%)]"
      />

      {/* Crossed-out Image Icon Badge */}
      <div className="relative z-10 mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-card/80 text-muted shadow-sm backdrop-blur-sm">
        <ImageOff className="h-5 w-5 text-secondary/70" strokeWidth={1.5} />
      </div>

      {/* Main Title / Coming Soon */}
      <h4 className="relative z-10 font-jakarta text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground/95">
        {displayStatus}
      </h4>

      {/* Subtitle / Description */}
      <p className="relative z-10 mt-2 max-w-[32ch] font-jakarta text-xs sm:text-sm font-medium leading-relaxed text-secondary/80">
        {title ? `Preview for ${title} is currently in development.` : "Full case study and live preview releasing soon."}
      </p>

      {/* Footer Category Tag */}
      {category && (
        <div className="relative z-10 mt-4 flex items-center gap-1.5 rounded-md border border-border/50 bg-card/60 px-2.5 py-1 font-jakarta text-[11px] font-semibold text-muted">
          <Layers className="h-3 w-3 text-secondary/70" />
          <span>{category}</span>
        </div>
      )}
    </div>
  );
}
