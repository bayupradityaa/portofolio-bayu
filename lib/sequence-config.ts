export const sequenceConfig = {
  desktop: {
    frameCount: 113,
    path: (i: number) => `/sequence-desktop/ezgif-frame-${String(i).padStart(3, "0")}.webp`,
    poster: "/sequence-desktop/ezgif-frame-113.webp",
  },
  mobile: {
    frameCount: 124,
    path: (i: number) => `/sequence-mobile/ezgif-frame-${String(i).padStart(3, "0")}.webp`,
    poster: "/sequence-mobile/ezgif-frame-124.webp",
  },
  // Default fallback reference (desktop)
  frameCount: 113,
  path: (i: number) => `/sequence-desktop/ezgif-frame-${String(i).padStart(3, "0")}.webp`,
  poster: "/sequence-desktop/ezgif-frame-113.webp",

  width: 1698,
  height: 1080,
};
