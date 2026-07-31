import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  speed?: number;
}

/**
 * Reusable Hardware-Accelerated Infinite Marquee Component.
 * Supports direction ("left" | "right"), speed customization, and pauseOnHover.
 */
export function Marquee({
  children,
  pauseOnHover = true,
  direction = "left",
  speed = 30,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden z-10 select-none",
        className
      )}
      {...props}
    >
      <div className="relative flex w-full overflow-hidden py-2">
        <div
          className={cn(
            "flex w-max gap-2 md:gap-3 animate-marquee transform-gpu will-change-transform",
            pauseOnHover && "hover:[animation-play-state:paused]",
            direction === "right" && "animate-marquee-reverse"
          )}
          style={{ "--duration": `${speed}s` } as React.CSSProperties}
        >
          {children}
          {children}
        </div>
      </div>
    </div>
  );
}
