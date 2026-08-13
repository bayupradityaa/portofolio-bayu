"use client";

import React, { useState, lazy, Suspense } from "react";
import Image from "next/image";
import { ArrowLeft, MessageSquare, ArrowUpRight, Sparkles, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { ContactForm } from "./contact-form";
import { cn } from "@/lib/utils";
import type { ProfileSettings } from "@/lib/types/database";
import { motion, AnimatePresence } from "motion/react";

const ConversationBubble = lazy(() =>
  import("@/components/ui/conversation-bubble").then((m) => ({ default: m.ConversationBubble })),
);

interface ContactClientProps {
  settings: ProfileSettings | null;
  socials: { label: string; href: string }[];
}

export function ContactClient({ settings, socials }: ContactClientProps) {
  const [showForm, setShowForm] = useState(false);

  const avatarSrc = settings?.avatar_url || "/fotobulat.webp";
  const name = settings?.name || "Bayu Praditya";

  return (
    <div
      id="contact"
      className="relative w-full bg-background text-foreground pt-8 sm:pt-12 lg:pt-16 pb-16 lg:pb-24 overflow-hidden select-none"
    >
      {/* Editorial hairline separating journey from contact */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border/40" />

      {/* Ambient accent glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/3 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto w-full max-w-6xl px-6 lg:px-12 relative z-10 pt-4 sm:pt-6">
        <AnimatePresence mode="wait">
          {!showForm ? (
            /* ── OVERVIEW / SHOWCASE STATE (MATCHING AWWWARDS REFERENCE) ── */
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start space-y-8"
            >
              {/* Giant Awwwards Headline with Cinematic Masked Line Reveal Animation */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.18,
                      delayChildren: 0.15,
                    },
                  },
                }}
                className="flex flex-col text-left font-sans font-extrabold tracking-tighter leading-[0.92] max-w-full"
              >
                {[
                  { text: "Transform Your", color: "text-foreground" },
                  { text: "Digital Vision", color: "text-foreground" },
                  { text: "Into Real Experience", color: "text-accent" },
                ].map((line, idx) => (
                  <div key={idx} className="overflow-hidden py-1.5 -my-1.5 max-w-full">
                    <motion.h2
                      variants={{
                        hidden: { y: "120%", rotate: 3.5, filter: "blur(8px)", opacity: 0 },
                        visible: {
                          y: "0%",
                          rotate: 0,
                          filter: "blur(0px)",
                          opacity: 1,
                          transition: {
                            duration: 1.25,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                      className={cn(
                        "text-3xl sm:text-5xl md:text-7xl lg:text-[88px] transform-gpu origin-left will-change-transform sm:whitespace-nowrap break-words",
                        line.color
                      )}
                    >
                      {line.text}
                    </motion.h2>
                  </div>
                ))}
              </motion.div>

              {/* Portfolio Copywriting */}
              <p className="text-base sm:text-xl text-secondary leading-relaxed max-w-2xl font-normal pt-2">
                Every great digital product starts with an ambitious vision. As a full-stack
                developer and designer, I turn complex ideas into high-performance web applications
                and interactive digital experiences built to scale.
              </p>

              {/* Conversational Animated UI with GSAP 11-step sequence */}
              <Suspense fallback={null}>
                <ConversationBubble
                  avatarSrc={avatarSrc}
                  name={name}
                  messageText="Have something in mind?"
                  ctaText="Let's Talk"
                  onCtaClick={() => setShowForm(true)}
                />
              </Suspense>
            </motion.div>
          ) : (
            /* ── FORM STATE (TOGGLED SMOOTHLY VIA LET'S TALK) ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl mx-auto bg-black text-white rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl border border-black/30 relative"
            >
              {/* Back to Overview Button */}
              <button
                onClick={() => setShowForm(false)}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FFD177] hover:text-white transition-colors mb-6 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Overview</span>
              </button>

              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/15">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD177] text-black font-extrabold shadow-md">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="flex flex-col text-left">
                  <h3 className="font-sans font-extrabold text-2xl text-white tracking-tight">
                    Let&apos;s Build Something Great
                  </h3>
                  <span className="font-mono text-xs text-[#FFD177]">
                    Fill in the details below and I&apos;ll respond within 24 hours.
                  </span>
                </div>
              </div>

              <ContactForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
