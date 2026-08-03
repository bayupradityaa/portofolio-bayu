import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { getProfileSettings } from "@/lib/actions/settings";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";

/**
 * Editorial colophon.
 *
 * Reads like the back page of a printed book: hairline rule on top,
 * logo + colophon line on the left, social indices on the right, a single
 * mono caption underneath. No icons inside the brand mark — that line
 * already carries enough weight.
 */
export async function Footer() {
  const settings = await getProfileSettings();
  const year = new Date().getFullYear();

  const socials = [
    settings?.github ? { label: "GitHub", href: settings.github } : null,
    settings?.linkedin ? { label: "LinkedIn", href: settings.linkedin } : null,
    settings?.instagram ? { label: "Instagram", href: settings.instagram } : null,
    settings?.email ? { label: "Email", href: `mailto:${settings.email}` } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="w-full border-t border-border bg-ch-contact">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top row: logo + colophon + socials */}
        <div className="flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <a
              href="#hero"
              className="inline-block rounded-sm text-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Logo />
            </a>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {`Designed & built by ${settings?.name || "Bayu Praditya"} · ${year}`}
            </p>
          </div>

          {/* Social indices — mono caps, no icon clutter */}
          <nav aria-label="Social" className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {socials.map((s) => {
              let icon = null;
              if (s.label === "GitHub") icon = <GithubIcon size={16} />;
              else if (s.label === "LinkedIn") icon = <LinkedinIcon size={16} />;
              else if (s.label === "Instagram") icon = <InstagramIcon size={16} />;
              else if (s.label === "Email") icon = <Mail size={16} />;

              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-secondary transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="text-muted transition-colors group-hover:text-accent">
                    {icon}
                  </span>
                  <span className="link-underline">{s.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom rule + colophon meta */}
        <div className="flex flex-col items-start justify-between gap-2 border-t border-border py-5 sm:flex-row sm:items-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Portfolio · v1.0
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
}
