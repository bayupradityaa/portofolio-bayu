import type { MetadataRoute } from "next";
import { getProfileSettings } from "@/lib/actions/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getProfileSettings();

  return {
    name: settings?.seo_title || `${settings?.name || "Bayu Praditya"} — Web Developer`,
    short_name: settings?.name || "Bayu Praditya",
    description:
      settings?.seo_description ||
      "Portfolio of Bayu Praditya — Web developer working across modern frontend, backend systems, and interactive digital experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/fotobulat.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        src: "/fotobulat.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
  };
}
