import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { getProfileSettings } from "@/lib/actions/settings";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/brand-icons";

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
    <footer className="hairline-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <a href="#hero" className="text-lg">
            <Logo />
          </a>
          <p className="text-sm text-muted">
            {`Designed and built by ${settings?.name || "Bayu Praditya"}. ${year}.`}
          </p>
        </div>

        {/* Footer social icons navigation (No Text labels) */}
        <nav aria-label="Social" className="flex items-center gap-5">
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
                className="text-secondary transition-colors duration-200 hover:text-accent"
              >
                {icon}
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
