import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bayu Praditya — Creative Engineer & Full-Stack Developer",
    short_name: "Bayu Praditya",
    description:
      "Portfolio of Bayu Praditya — Creative engineer working across modern frontend, backend systems, and interactive digital experiences.",
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
