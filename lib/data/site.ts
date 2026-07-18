export const siteConfig = {
  title: "Bayu Praditya — Full Stack Software Engineer",
  description:
    "Portfolio of Bayu Praditya, a full stack software engineer working across AI, backend engineering, and modern frontend. Built for craft, performance, and detail.",
  url: "https://bayupraditya.dev", // TODO: real production URL
  ogImage: "/og.png", // TODO: add OG image to /public
};

export const navItems = [
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "github", label: "GitHub" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;
