/**
 * Portrait image-sequence config.
 *
 * Drop your exported frames into: public/sequence/
 * Named sequentially with zero-padding, e.g. frame-0001.webp ... frame-0120.webp
 *
 * The portrait should start rotated ~35deg to the left on frame 1 and finish
 * facing the camera on the last frame. Scroll scrubs frame 1 -> frameCount.
 *
 * A static poster (public/sequence/poster.webp) is shown while frames load and
 * as the reduced-motion / load-failure fallback. Until you add real frames the
 * hero renders a tasteful placeholder instead of breaking.
 */
export const sequenceConfig = {
  frameCount: 120,
  path: (i: number) => `/sequence/frame-${String(i).padStart(4, "0")}.jpg`,
  poster: "/sequence/poster.jpg",
  // Intrinsic frame size — used to reserve space and avoid layout shift.
  // Real frames are 1920x1080 (16:9 landscape), extracted from video.
  width: 1920,
  height: 1080,
};
