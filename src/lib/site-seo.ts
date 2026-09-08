import type { Metadata } from "next";

/** Public production origin — never vercel.app in SEO surfaces. */
export const SITE_URL = "https://moodilier.ro";

const DEFAULT_OG_IMAGE = "/projects/villa-06/01.living.cover.webp";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

type PageMetaInput = {
  /** Pathname starting with `/`, or `/` for home */
  path: string;
  /**
   * Full document title. If it already contains "Moodilier", it is used as
   * `absolute` so the root `%s | Moodilier` template does not double the brand.
   * Otherwise it is used as a segment for the template.
   */
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
};

/**
 * Canonical + Open Graph + Twitter for a public page on moodilier.ro.
 */
export function pageMetadata({
  path,
  title,
  description,
  image,
  type = "website",
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image?.trim() || DEFAULT_OG_IMAGE;
  const hasBrand = /moodilier/i.test(title);
  const titleField: Metadata["title"] = hasBrand
    ? { absolute: title }
    : title;

  return {
    title: titleField,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "ro_RO",
      url,
      siteName: "Moodilier",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}

/** Descriptive ALT for portfolio / project imagery. */
export function projectImageAlt(
  projectTitle: string,
  categoryOrRoom?: string | null
): string {
  const space = (categoryOrRoom || "").trim();
  const roomBit = space
    ? ` mobilier ${space.toLowerCase()} la comandă`
    : " mobilier la comandă";
  return `${projectTitle} —${roomBit}, proiect Moodilier`;
}

/** Brand name from supplier logo filename, or null if unknown. */
export function supplierNameFromSrc(src: string): string | null {
  const base = src.split("/").pop()?.toLowerCase() || "";
  if (base.includes("egger")) return "Egger";
  if (base.includes("blum")) return "Blum";
  if (base.includes("himacs") || base.includes("hi-macs")) return "HI-MACS";
  if (base.includes("kronospan")) return "Kronospan";
  if (base.includes("hafele") || base.includes("häfele")) return "Häfele";
  if (base.includes("corian")) return "Corian";
  return null;
}

export const CANONICAL_ADDRESS =
  "Bd. Basarabia 256, incinta FAUR, București";
