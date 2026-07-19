import type { SocialLink, Stat } from "./types";

/**
 * PLACEHOLDER CONTENT — swap the copy below for Bayu's real details.
 * Everything here is safe to edit; nothing else depends on the exact strings.
 */
export const profile = {
  name: "Bayu Praditya",
  firstName: "Bayu",
  role: "Full Stack Software Engineer",
  focus: ["AI", "Backend Engineering", "Modern Frontend"],
  location: "Bogor, Indonesia",
  githubUser: "bayupradityaa",
  email: "bayuupraditya@gmail.com",
  resumeUrl: "/resume.pdf",
  // One-liner for the hero. <= 20 words, reads in a glance.
  intro:
    "Informatics student building AI-driven, backend-solid, front-of-mind web products. I care about how software feels, not just what it does.",
  // Longer bio for the About section (kept to a comfortable reading width).
  bio: [
    "Saya adalah mahasiswa Teknik Informatika di Universitas Gunadarma yang memiliki ketertarikan pada Full-Stack Development, Machine Learning, dan Graphic Design. Bagi saya, teknologi bukan hanya tentang menulis baris kode, tetapi tentang bagaimana desain, pengalaman pengguna, dan sistem backend dapat bekerja selaras untuk menciptakan produk digital yang bermanfaat. Saya menikmati proses mengubah ide menjadi solusi nyata melalui eksplorasi, eksperimen, dan pengembangan yang berkelanjutan.",
    "Di luar dunia akademik, sejak tahun 2023 saya membangun dan mengelola CLT.Store, sebuah bisnis digital di bidang top-up dan joki game berbasis Instagram. Pengalaman tersebut membentuk cara saya memandang pengembangan perangkat lunak—tidak hanya dari sisi teknis, tetapi juga dari sudut pandang pengguna, operasional, dan pertumbuhan produk. Saya percaya bahwa software yang baik bukan hanya berjalan dengan benar, tetapi juga mampu memberikan pengalaman yang sederhana, efisien, dan bernilai bagi penggunanya.",
  ],
};

export const stats: Stat[] = [
  { label: "Business active since", value: 2023, suffix: "" },
  { label: "Happy Gamers / Orders", value: 5000, suffix: "+" },
  { label: "Technologies in rotation", value: 10, suffix: "+" },
  { label: "Design assets crafted", value: 30, suffix: "+" },
];

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/bayupradityaa", handle: "@bayupradityaa" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/bayupradityaa/", handle: "bayupradityaa" },
  { label: "Instagram", href: "https://www.instagram.com/bayuupradityaa", handle: "@bayuupradityaa" },
  { label: "Email", href: "mailto:bayuupraditya@gmail.com", handle: "bayuupraditya@gmail.com" },
];
