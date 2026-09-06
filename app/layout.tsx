import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#000000",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};
// Ships `.lenis-stopped { overflow: clip }` and `overscroll-behavior: contain`
// for [data-lenis-prevent]. Without it lenis.stop() does not actually stop
// native scrolling, and modals scroll-chain into the page behind them.
import "lenis/dist/lenis.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { getProfileSettings } from "@/lib/actions/settings";
import { TabTitleAnimator } from "@/components/shell/tab-title-animator";

/**
 * Plus Jakarta Sans — modern geometric grotesque optimized for high readability,
 * clean editorial presentation, and crisp digital typography across all viewports.
 */
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

/** Meta voice: code tags and secondary indices */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getProfileSettings();
  const title = settings?.seo_title || "Bayu Praditya — Web Developer";
  const description = settings?.seo_description || "Portfolio of Bayu Praditya, a web developer working across modern frontend, backend engineering, and digital products.";
  const url = settings?.site_url || "https://bayupraditya.dev";
  const ogImage = settings?.og_image || "/og-image.png";
  const keywords = settings?.seo_keywords && settings.seo_keywords.length > 0 ? settings.seo_keywords : ["Bayu Praditya", "software engineer", "web developer", "AI engineer", "portfolio"];

  return {
    metadataBase: new URL(url),
    title: {
      default: title,
      template: `%s — ${settings?.name || "Bayu Praditya"}`,
    },
    description,
    keywords,
    icons: {
      icon: [{ url: "/fotobulat.webp", type: "image/webp" }],
      shortcut: [{ url: "/fotobulat.webp", type: "image/webp" }],
      apple: [{ url: "/fotobulat.webp", type: "image/webp" }],
    },
    authors: [{ name: settings?.name || "Bayu Praditya" }],
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

import { ThemeProvider } from "@/components/providers/theme-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getProfileSettings();
  const sameAsSocials = [
    settings?.github,
    settings?.linkedin,
    settings?.instagram,
  ].filter(Boolean) as string[];

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* ── Preload LCP hero poster ─────────────────────────────── */}
        <link rel="preload" href="/sequence-desktop/ezgif-frame-113.webp" as="image" type="image/webp" media="(min-width: 1024px)" fetchPriority="high" />
        <link rel="preload" href="/sequence-mobile/ezgif-frame-001.webp" as="image" type="image/webp" media="(max-width: 1023px)" fetchPriority="high" />

        {/* ── Preconnect to third-party origins ───────────────────── */}
        <link rel="preconnect" href="https://trxsutzqybrkeporwmcx.supabase.co" />
        <link rel="dns-prefetch" href="https://trxsutzqybrkeporwmcx.supabase.co" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: settings?.name || "Bayu Praditya",
              url: settings?.site_url || "https://bayupraditya.dev",
              jobTitle: settings?.headline || "Web Developer & AI Engineer",
              sameAs: sameAsSocials.length > 0 ? sameAsSocials : [
                "https://github.com/bayupradityaa",
                "https://linkedin.com/in/bayupraditya",
                "https://instagram.com/bayupraditya",
              ],
            }),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <TabTitleAnimator />
          <a
            href="#work"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-110 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:outline-2 focus:outline-accent"
          >
            Skip to content
          </a>
          <SmoothScroll>{children}</SmoothScroll>
          <div className="grain" aria-hidden />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
