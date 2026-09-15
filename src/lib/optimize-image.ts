/**
 * Image reduction module for Moodilier project media.
 * Used by upload APIs and the DOWNLOAD AUG import script.
 */
import sharp from "sharp";

export type ImagePreset = "cover" | "gallery" | "thumb" | "logo";

export type OptimizeImageOptions = {
  /** Longest edge max (px). */
  maxEdge?: number;
  /** WebP / JPEG quality 1–100. */
  quality?: number;
  /** Named preset overrides maxEdge/quality. */
  preset?: ImagePreset;
};

export type OptimizedImage = {
  buffer: Buffer;
  contentType: "image/webp" | "image/jpeg" | "image/png" | "image/gif" | "image/svg+xml";
  extension: "webp" | "jpg" | "png" | "gif" | "svg";
  width: number;
  height: number;
  originalBytes: number;
  optimizedBytes: number;
  skipped: boolean;
  preset: ImagePreset | "custom";
};

const PRESETS: Record<ImagePreset, { maxEdge: number; quality: number }> = {
  /** Listing cards + heroes — sharp on retina */
  cover: { maxEdge: 1920, quality: 86 },
  /** Project gallery full-bleed */
  gallery: { maxEdge: 1920, quality: 84 },
  /** Tiny previews / lightbox thumbs */
  thumb: { maxEdge: 640, quality: 78 },
  /** Brand marks — keep crisp edges */
  logo: { maxEdge: 1200, quality: 90 },
};

const DEFAULT_MAX_EDGE = 1920;
const DEFAULT_QUALITY = 84;

function resolveLimits(options: OptimizeImageOptions) {
  if (options.preset && PRESETS[options.preset]) {
    return {
      maxEdge: options.maxEdge ?? PRESETS[options.preset].maxEdge,
      quality: options.quality ?? PRESETS[options.preset].quality,
      preset: options.preset,
    };
  }
  return {
    maxEdge: options.maxEdge ?? DEFAULT_MAX_EDGE,
    quality: options.quality ?? DEFAULT_QUALITY,
    preset: "custom" as const,
  };
}

/**
 * Resize + convert to WebP for web delivery.
 * SVG left as-is. Animated GIF left as-is.
 */
export async function optimizeImageBuffer(
  input: Buffer,
  mimeType: string,
  options: OptimizeImageOptions = {}
): Promise<OptimizedImage> {
  const originalBytes = input.length;
  const { maxEdge, quality, preset } = resolveLimits(options);

  if (mimeType === "image/svg+xml" || mimeType === "image/svg") {
    throw new Error("SVG uploads are not allowed");
  }

  if (mimeType === "image/gif") {
    const meta = await sharp(input, { animated: true, failOn: "none" }).metadata();
    if ((meta.pages ?? 1) > 1) {
      return {
        buffer: input,
        contentType: "image/gif",
        extension: "gif",
        width: meta.width ?? 0,
        height: meta.height ?? 0,
        originalBytes,
        optimizedBytes: originalBytes,
        skipped: true,
        preset,
      };
    }
  }

  // PNG logos with transparency → keep PNG if webp loses alpha badly; otherwise WebP
  const isLogoPng =
    preset === "logo" && (mimeType === "image/png" || mimeType === "image/webp");

  const base = sharp(input, { failOn: "none" }).rotate();
  const meta = await base.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  let pipeline = sharp(input, { failOn: "none" }).rotate();
  if (width > maxEdge || height > maxEdge) {
    pipeline = pipeline.resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (isLogoPng && meta.hasAlpha) {
    const png = await pipeline
      .png({ compressionLevel: 9, palette: false })
      .toBuffer();
    const outMeta = await sharp(png).metadata();
    return {
      buffer: png,
      contentType: "image/png",
      extension: "png",
      width: outMeta.width ?? width,
      height: outMeta.height ?? height,
      originalBytes,
      optimizedBytes: png.length,
      skipped: false,
      preset,
    };
  }

  const webp = await pipeline
    .webp({
      quality,
      effort: 5,
      smartSubsample: true,
    })
    .toBuffer();

  // Prefer smaller payload: if WebP isn't smaller than a good JPEG, use mozjpeg
  if (webp.length >= originalBytes * 0.95) {
    const jpeg = await sharp(input, { failOn: "none" })
      .rotate()
      .resize({
        width: maxEdge,
        height: maxEdge,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    if (jpeg.length < webp.length) {
      const jpegMeta = await sharp(jpeg).metadata();
      return {
        buffer: jpeg,
        contentType: "image/jpeg",
        extension: "jpg",
        width: jpegMeta.width ?? width,
        height: jpegMeta.height ?? height,
        originalBytes,
        optimizedBytes: jpeg.length,
        skipped: false,
        preset,
      };
    }
  }

  const outMeta = await sharp(webp).metadata();
  return {
    buffer: webp,
    contentType: "image/webp",
    extension: "webp",
    width: outMeta.width ?? width,
    height: outMeta.height ?? height,
    originalBytes,
    optimizedBytes: webp.length,
    skipped: false,
    preset,
  };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function mimeFromExt(ext: string): string {
  const e = ext.toLowerCase().replace(/^\./, "");
  if (e === "jpg" || e === "jpeg") return "image/jpeg";
  if (e === "png") return "image/png";
  if (e === "webp") return "image/webp";
  if (e === "gif") return "image/gif";
  if (e === "svg") return "image/svg+xml";
  return "application/octet-stream";
}

export { PRESETS };
