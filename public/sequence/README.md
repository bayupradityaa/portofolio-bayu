# Portrait image sequence

The hero portrait animation scrubs through frames as the visitor scrolls.

## Add your frames

1. Export a short clip of yourself slowly turning from ~35° left to facing the
   camera (2–4 seconds is plenty).
2. Split it into individual frames and export as **WebP**.
3. Name them sequentially, zero-padded:

   ```
   frame-0001.webp
   frame-0002.webp
   ...
   frame-0120.webp
   ```

4. Add a `poster.webp` — a single representative frame used while the sequence
   loads and as the reduced-motion fallback.

## Tune the config

Open `lib/sequence-config.ts` and set:

- `frameCount` — how many frames you exported.
- `width` / `height` — the intrinsic pixel size of a frame (keeps layout stable).

Until real frames exist, the hero shows a tasteful placeholder instead of
breaking. Recommended: 1000×1250, transparent background, ~150–250 KB per frame.
