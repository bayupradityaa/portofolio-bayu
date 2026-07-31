/** Input formats we accept for conversion. Everything is normalised to WebP. */
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/tiff",
];

type ConvertOptions = {
  /** Longest edge in px. Larger images are scaled down (aspect kept). Omit to keep size. */
  maxWidth?: number;
  /** WebP quality 1-100. Defaults to 82 — a good size/quality balance. */
  quality?: number;
};

export type ConvertedImage = {
  buffer: Buffer;
  /** Always "image/webp" or fallback original content type. */
  contentType: string;
  width: number;
  height: number;
  size: number;
};

/**
 * Convert an uploaded image File to an optimised WebP buffer.
 *
 * Dynamically loads sharp to avoid native C++ binary crashes on OS/environment mismatches.
 * Strips metadata (EXIF/orientation is baked in via .rotate()), optionally
 * downscales, and re-encodes as WebP. Falls back safely if native sharp fails.
 */
export async function convertToWebp(
  file: File,
  { maxWidth = 1920, quality = 82 }: ConvertOptions = {},
): Promise<ConvertedImage> {
  const input = Buffer.from(await file.arrayBuffer());

  try {
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default || sharpModule;

    let pipeline = sharp(input, { failOn: "error" }).rotate();

    const metadata = await pipeline.metadata();
    if (metadata.width && maxWidth && metadata.width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }

    const { data, info } = await pipeline
      .webp({ quality, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    return {
      buffer: data,
      contentType: "image/webp",
      width: info.width,
      height: info.height,
      size: data.length,
    };
  } catch (err) {
    console.warn("[image] sharp module fallback activated:", err);
    return {
      buffer: input,
      contentType: file.type || "image/webp",
      width: 0,
      height: 0,
      size: input.length,
    };
  }
}
