import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { getProfileSettings } from "@/lib/actions/settings";
import { TabTitleAnimator } from "@/components/shell/tab-title-animator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getProfileSettings();
  const title = settings?.seo_title || "Bayu Praditya — Web Developer";
  const description = settings?.seo_description || "Portfolio of Bayu Praditya, a web developer working across modern frontend, backend engineering, and digital products.";
  const url = settings?.site_url || "https://bayupraditya.dev";
  const ogImage = settings?.og_image || "/og-image.jpg";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href="/sequence-mobile/ezgif-frame-001.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
          media="(max-width: 1023px)"
        />
        <link
          rel="preload"
          href="/sequence-desktop/ezgif-frame-001.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
          media="(min-width: 1024px)"
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TabTitleAnimator />
          <a
            href="#work"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:outline-2 focus:outline-accent"
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
