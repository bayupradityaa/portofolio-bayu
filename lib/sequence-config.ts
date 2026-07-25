export const sequenceConfig = {
  desktop: {
    frameCount: 113,
    // Desktop decodes every frame — full cinematic fidelity, untouched.
    step: 1,
    path: (i: number) => `/sequence-desktop/ezgif-frame-${String(i).padStart(3, "0")}.webp`,
    poster: "/sequence-desktop/ezgif-frame-113.webp",
  },
  mobile: {
    frameCount: 124,
    // Mobile samples every 3rd frame (~42 decodes instead of 124). The scrub
    // reads visually identical at mobile scroll speed but cuts WebP decode
    // cost — the single largest contributor to mobile TBT — by ~65%.
    step: 3,
    path: (i: number) => `/sequence-mobile/ezgif-frame-${String(i).padStart(3, "0")}.webp`,
    poster: "/sequence-mobile/ezgif-frame-001.webp",
  },
  // Default fallback reference (desktop)
  frameCount: 113,
  path: (i: number) => `/sequence-desktop/ezgif-frame-${String(i).padStart(3, "0")}.webp`,
  poster: "/sequence-desktop/ezgif-frame-113.webp",

  width: 1698,
  height: 1080,
};
