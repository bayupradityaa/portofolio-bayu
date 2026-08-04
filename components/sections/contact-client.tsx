"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, MessageSquare, ArrowUpRight, Sparkles, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { ConversationBubble } from "@/components/ui/conversation-bubble";
import { ContactForm } from "./contact-form";
import { SectionRule } from "@/components/ui/section-rule";
import type { ProfileSettings } from "@/lib/types/database";
import { motion, AnimatePresence } from "motion/react";

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
      className="relative w-full bg-[#FFD177] text-black py-16 lg:py-24 overflow-hidden select-none"
    >
      {/* Ambient Lighting Overlays */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto w-full max-w-6xl px-6 lg:px-12 relative z-10">
        {/* Section Divider inside Gold Contact Stage */}
        <SectionRule label="Contact" className="px-0 py-0 pb-10 sm:pb-14 text-black" />
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
              {/* Giant Awwwards Headline with Contrast Text Layers */}
              <div className="flex flex-col text-left font-sans font-extrabold tracking-tighter leading-[0.92]">
                <h2 className="text-5xl sm:text-7xl lg:text-[92px] text-black">
                  Transform Your
                </h2>
                <h2 className="text-5xl sm:text-7xl lg:text-[92px] text-black">
                  Digital Vision
                </h2>
                <h2 className="text-5xl sm:text-7xl lg:text-[92px] text-white drop-shadow-md">
                  Into Real
                </h2>
                <h2 className="text-5xl sm:text-7xl lg:text-[92px] text-white drop-shadow-md">
                  Experience
                </h2>
              </div>

              {/* Portfolio Copywriting */}
              <p className="text-base sm:text-xl text-black/85 leading-relaxed max-w-2xl font-normal pt-2">
                Every great digital product starts with an ambitious vision. As a full-stack
                developer and designer, I turn complex ideas into high-performance web applications
                and interactive digital experiences built to scale.
              </p>

              {/* Conversational Animated UI with GSAP 11-step sequence */}
              <ConversationBubble
                avatarSrc={avatarSrc}
                name={name}
                messageText="Have something in mind?"
                ctaText="Let's Talk"
                onCtaClick={() => setShowForm(true)}
              />
            </motion.div>
          ) : (
            /* ── FORM STATE (TOGGLED SMOOTHLY VIA LET'S TALK) ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl mx-auto bg-black text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-black/30 relative"
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
