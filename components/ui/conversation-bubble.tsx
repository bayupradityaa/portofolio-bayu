"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

import { ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ConversationBubbleProps {
  avatarSrc?: string;
  name?: string;
  messageText?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function ConversationBubble({
  avatarSrc = "/fotobulat.webp",
  name = "Bayu Praditya",
  messageText = "Have something in mind?",
  ctaText = "Let's Talk",
  onCtaClick,
  className,
}: ConversationBubbleProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLSpanElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const idleTweenRef = useRef<gsap.core.Tween | null>(null);

  const [displayedText, setDisplayedText] = useState("");
  const [showDots, setShowDots] = useState(true);
  const [activeDotIndex, setActiveDotIndex] = useState(0);

  // 1. Three Dots Continuous Typing Animation Loop (Step 3)
  useEffect(() => {
    if (!showDots) return;

    const interval = setInterval(() => {
      setActiveDotIndex((prev) => (prev + 1) % 3);
    }, 350);

    return () => clearInterval(interval);
  }, [showDots]);

  // 2. Master GSAP Animation Timeline (Steps 1 to 8)
  useEffect(() => {
    const container = containerRef.current;
    const avatar = avatarRef.current;
    const bubble = bubbleRef.current;
    const cta = ctaRef.current;

    if (!container || !avatar || !bubble || !cta) return;

    // Initial setup with GSAP
    gsap.set(avatar, {
      opacity: 0,
      scale: 0.85,
      filter: "blur(8px)",
    });

    gsap.set(bubble, {
      opacity: 0,
      scale: 0.8,
      width: 72,
      height: 44,
      transformOrigin: "left center",
    });

    gsap.set(cta, {
      opacity: 0,
      y: 20,
      pointerEvents: "none",
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // STEP 1: Avatar Fades In (0.45s, power3.out)
      tl.to(avatar, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.45,
        ease: "power3.out",
      });

      // STEP 2: Small Typing Bubble Appears after 250ms
      tl.to(
        bubble,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.5)",
        },
        "+=0.25"
      );

      // STEP 3: Typing dots loop runs for ~1.4s so the user experiences the typing animation
      tl.to({}, { duration: 1.4 });

      // STEP 4: Morph Bubble Expansion (0.7s, smooth fluid ease)
      tl.call(() => {
        setShowDots(false);
      });

      tl.to(bubble, {
        width: "auto",
        height: "auto",
        duration: 0.7,
        ease: "power3.inOut",
      });

      // STEP 5 & 6: Character-by-character Typing Animation (65ms/char for deliberate human pace)
      tl.call(() => {
        let currentIdx = 0;
        const typeInterval = setInterval(() => {
          if (currentIdx <= messageText.length) {
            setDisplayedText(messageText.slice(0, currentIdx));
            currentIdx++;
          } else {
            clearInterval(typeInterval);

            // STEP 7: Reveal CTA Button with subtle delay
            gsap.to(cta, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              pointerEvents: "auto",
              delay: 0.2,
            });

            // STEP 8: Start Ultra-Gentle Floating Idle Animation (4.2s sine loop)
            idleTweenRef.current = gsap.to(container, {
              y: -4,
              duration: 4.2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }
        }, 65);
      });
    }, container);

    return () => {
      ctx.revert();
      if (idleTweenRef.current) idleTweenRef.current.kill();
    };
  }, [messageText]);

  // 3. Mouse Parallax Effect (Step 10: Max 8px Movement)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(containerRef.current, {
      x: relativeX * 12,
      y: relativeY * 8,
      duration: 0.6,
      ease: "power1.out",
    });
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("flex items-start gap-3.5 select-none", className)}
    >
      {/* Profile Avatar (Step 1 Animation) */}
      <div
        ref={avatarRef}
        className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden border-2 border-black/15 shadow-md shrink-0 bg-black/10 transition-transform duration-300 mt-0.5"
      >
        <Image
          src={avatarSrc}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Vertical Column: Speech Bubble + CTA Button 100% Perfectly Flush Aligned */}
      <div className="flex flex-col items-start gap-3">
        {/* Morphing Chat Bubble (Step 2 to 6, Step 9 Hover Glow & Scale 1.02) */}
        <div
          ref={bubbleRef}
          className="relative flex items-center justify-center min-h-[44px] bg-black/10 border border-black/15 text-black px-5 py-3 rounded-2xl font-sans text-sm sm:text-base md:text-lg font-medium shadow-md backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-black/30 group"
        >
          {showDots ? (
            /* STEP 2 & 3: Typing Indicator (● ○ ○ -> ○ ● ○ -> ○ ○ ●) */
            <div ref={dotsRef} className="flex items-center gap-1.5 px-1 py-0.5">
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-200",
                  activeDotIndex === 0 ? "bg-black scale-125" : "bg-black/35 scale-90"
                )}
              />
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-200",
                  activeDotIndex === 1 ? "bg-black scale-125" : "bg-black/35 scale-90"
                )}
              />
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-200",
                  activeDotIndex === 2 ? "bg-black scale-125" : "bg-black/35 scale-90"
                )}
              />
            </div>
          ) : (
            /* STEP 5 & 6: Typewriter Message Text */
            <span ref={textContainerRef} className="whitespace-nowrap leading-snug">
              {displayedText}
              {displayedText.length < messageText.length && (
                <span className="inline-block w-0.5 h-4 ml-0.5 bg-black animate-pulse align-middle" />
              )}
            </span>
          )}
        </div>

        {/* Bottom Row: CTA Button Reveal (Step 7) — 100% Flush Aligned */}
        <button
          ref={ctaRef}
          onClick={onCtaClick}
          className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-black px-7 py-3.5 text-sm sm:text-base font-extrabold text-[#FFD177] shadow-xl border border-black hover:bg-[#111111] hover:scale-105 hover:shadow-[0_12px_35px_rgba(0,0,0,0.4)] active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* Vertical Rolling Text Animation Container */}
          <div className="relative overflow-hidden h-5 flex flex-col items-center justify-center">
            {/* Primary Text */}
            <span className="block transform transition-transform duration-300 ease-out group-hover:-translate-y-full">
              {ctaText}
            </span>
            {/* Secondary Rolling Text */}
            <span className="absolute block transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 text-[#FFEE00]">
              {ctaText}
            </span>
          </div>

          {/* Sliding Arrow Icon */}
          <ArrowUpRight className="h-4 w-4 text-[#FFD177] group-hover:text-[#FFEE00] transform transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </div>
    </div>
  );
}
