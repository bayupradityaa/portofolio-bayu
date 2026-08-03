import { Mail, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { ScrambleText } from "@/components/motion/editorial-interactions";
import { ContactForm } from "./contact-form";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { getProfileSettings } from "@/lib/actions/settings";

export async function Contact() {
  const settings = await getProfileSettings();

  // Build socials array from settings — only those the admin has filled in.
  const socials = [
    settings?.github ? { label: "GitHub", href: settings.github } : null,
    settings?.linkedin ? { label: "LinkedIn", href: settings.linkedin } : null,
    settings?.instagram ? { label: "Instagram", href: settings.instagram } : null,
    settings?.email ? { label: "Email", href: `mailto:${settings.email}` } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="relative w-full bg-ch-contact">
      <Section
        id="contact"
        hairline={false}
        className="relative z-10 pt-24 pb-24 md:pt-32 md:pb-36"
      >
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.05fr_1fr] md:gap-16">
          {/* Left: editorial statement */}
          <div className="flex flex-col justify-center">
            <span className="eyebrow">07 — Contact</span>

            <h2 className="text-display mt-6">
              <ScrambleText text="Let’s build" as="span" />
              <br />
              <span className="text-accent">
                <ScrambleText text="something good." as="span" />
              </span>
            </h2>

            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-secondary">
              Open to internships, freelance work, and collaborations. Send a note
              and I&rsquo;ll reply within a day or two.
            </p>

            {/* Social icons — editorial tiles, hairline border, no scale on hover. */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {socials.map((s) => {
                let icon = null;
                if (s.label === "GitHub") icon = <GithubIcon size={18} />;
                else if (s.label === "LinkedIn") icon = <LinkedinIcon size={18} />;
                else if (s.label === "Instagram") icon = <InstagramIcon size={18} />;
                else if (s.label === "Email") icon = <Mail size={18} />;

                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={s.label}
                    className="group inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-secondary transition-colors duration-200 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="transition-colors group-hover:text-accent">
                      {icon}
                    </span>
                    <span>{s.label}</span>
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2}
                      className="text-muted transition-colors group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: the form, framed with a hairline */}
          <Reveal as="div">
            <div className="border border-border bg-card p-6 md:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
