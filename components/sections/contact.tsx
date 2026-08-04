import { getProfileSettings } from "@/lib/actions/settings";
import { ContactClient } from "./contact-client";

export async function Contact() {
  const settings = await getProfileSettings();

  // Build socials array from settings — only those the admin has filled in.
  const socials = [
    settings?.github ? { label: "GitHub", href: settings.github } : null,
    settings?.linkedin ? { label: "LinkedIn", href: settings.linkedin } : null,
    settings?.instagram ? { label: "Instagram", href: settings.instagram } : null,
    settings?.email ? { label: "Email", href: `mailto:${settings.email}` } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return <ContactClient settings={settings} socials={socials} />;
}
