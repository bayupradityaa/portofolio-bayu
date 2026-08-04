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
    <footer className="relative w-full bg-[#000000] text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Main row: logo + colophon + socials */}
        <div className="flex flex-col gap-4 py-4 sm:py-6 md:flex-row md:items-end md:justify-between">
          {/* Left Column: Logo + Copyright */}
          <div className="space-y-1 sm:space-y-1.5">
            <a
              href="#hero"
              className="inline-block rounded-sm text-base sm:text-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Logo />
            </a>
            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-muted">
              {`${year} · ALL RIGHTS RESERVED`}
            </p>
          </div>

          {/* Right Column: Let's Connect! + Social Indices */}
          <div className="flex flex-col items-start md:items-end gap-1.5 sm:gap-2">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#FFD177]">
              Let&apos;s Connect!
            </span>
            <nav aria-label="Social" className="flex flex-wrap items-center gap-x-3.5 sm:gap-x-6 gap-y-1.5">
              {socials.map((s) => {
                let icon = null;
                if (s.label === "GitHub") icon = <GithubIcon size={14} />;
                else if (s.label === "LinkedIn") icon = <LinkedinIcon size={14} />;
                else if (s.label === "Instagram") icon = <InstagramIcon size={14} />;
                else if (s.label === "Email") icon = <Mail size={14} />;

                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={s.label}
                    className="group inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-secondary transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
        </div>
      </div>
    </footer>
  );
}
