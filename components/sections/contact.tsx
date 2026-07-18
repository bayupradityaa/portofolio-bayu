import { Mail } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "./contact-form";
import { socials } from "@/lib/data/profile";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";

export function Contact() {
  return (
    <Section id="contact">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
        <div>
          <p className="font-mono text-sm text-accent">Contact</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Let us build
            <br />
            something good.
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-secondary">
            Open to internships, freelance work, and collaborations. Send a note
            and I will reply within a day or two.
          </p>

          {/* Social Icons row (No Text handles) */}
          <div className="mt-8 flex flex-wrap gap-3.5">
            {socials.map((s) => {
              let icon = null;
              if (s.label === "GitHub") icon = <GithubIcon size={20} />;
              else if (s.label === "LinkedIn") icon = <LinkedinIcon size={20} />;
              else if (s.label === "Instagram") icon = <InstagramIcon size={20} />;
              else if (s.label === "Email") icon = <Mail size={20} />;

              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-secondary transition-all duration-300 hover:border-accent hover:bg-surface hover:text-accent hover:scale-105"
                >
                  {icon}
                </a>
              );
            })}
          </div>
        </div>

        <Reveal as="div">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
