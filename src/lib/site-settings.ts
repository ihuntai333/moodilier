import { cache } from "react";
import { unstable_cache } from "next/cache";
import { hasSupabaseConfig, supabaseAdmin } from "@/lib/supabase";
import { timeoutSignal } from "@/lib/with-timeout";

const SUPABASE_MS = 1800;

export type NavLink = { label: string; href: string };

export type HeroSlide = {
  id: string;
  type: "video" | "image";
  src: string;
  poster?: string;
  durationSec: number;
};

export type IntroConfig = {
  enabled: boolean;
  logoUrl: string;
  brandName: string;
  eyebrow: string;
  tagline: string;
  images: string[];
};

export type SiteChrome = {
  brandName: string;
  logoUrl: string;
  headerMenu: NavLink[];
  ctaLabel: string;
  ctaHref: string;
  footerBrand: string;
  footerTagline: string;
  footerMenu: NavLink[];
  footerLegal: NavLink[];
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
  siteTitle: string;
  metaDescription: string;
  ga4Id: string;
  pixelId: string;
  googleSiteVerification: string;
  facebookDomainVerification: string;
  intro: IntroConfig;
  heroSlides: HeroSlide[];
  heroDefaultDurationSec: number;
};

export const DEFAULT_HEADER_MENU: NavLink[] = [
  { href: "/", label: "Acasă" },
  { href: "/proiecte", label: "Proiecte" },
  { href: "/servicii", label: "Servicii" },
  { href: "/despre-noi", label: "Despre noi" },
  { href: "/contact", label: "Contact" },
];

export const DEFAULT_FOOTER_MENU: NavLink[] = [
  { href: "/proiecte", label: "Proiecte" },
  { href: "/servicii", label: "Servicii" },
  { href: "/despre-noi", label: "Despre noi" },
  { href: "/contact", label: "Contact" },
];

export const DEFAULT_FOOTER_LEGAL: NavLink[] = [
  { href: "/termeni-si-conditii", label: "Termeni" },
  { href: "/politica-de-confidentialitate", label: "Confidențialitate" },
  { href: "/politica-cookies", label: "Cookies" },
  { href: "/nota-legala", label: "Notă legală" },
];

export const DEFAULT_INTRO_IMAGES = [
  "/projects/villa-06/01.living.cover.webp",
  "/projects/villa-05/01.living.cover.webp",
  "/projects/villa-04/01.altele.cover.webp",
  "/projects/apartment-01/01.altele.cover.webp",
  "/projects/apartment-15/01.living.cover.webp",
  "/projects/villa-03/01.living.cover.webp",
  "/projects/apartment-08/01.dormitoare.cover.webp",
  "/projects/showroom-15/01.altele.cover.webp",
];

export const DEFAULT_INTRO: IntroConfig = {
  enabled: true,
  logoUrl: "/brand/logo-white.png",
  brandName: "Moodilier",
  eyebrow: "",
  tagline: "The Art of Custom Furniture",
  images: DEFAULT_INTRO_IMAGES,
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "vid-1",
    type: "video",
    src: "/videos/moodilier-vid-1.mp4",
    poster: "/projects/villa-06/01.living.cover.webp",
    durationSec: 8,
  },
  {
    id: "vid-2",
    type: "video",
    src: "/videos/moodilier-vid-2.mp4",
    poster: "/projects/villa-05/01.living.cover.webp",
    durationSec: 8,
  },
  {
    id: "img-villa-06",
    type: "image",
    src: "/projects/villa-06/01.living.cover.webp",
    durationSec: 5,
  },
  {
    id: "img-villa-04",
    type: "image",
    src: "/projects/villa-04/01.altele.cover.webp",
    durationSec: 5,
  },
];

export const SITE_CHROME_DEFAULTS: SiteChrome = {
  brandName: "Moodilier",
  logoUrl: "/brand/logo-white.png",
  headerMenu: DEFAULT_HEADER_MENU,
  ctaLabel: "Solicită ofertă",
  ctaHref: "/contact",
  footerBrand: "Moodilier",
  footerTagline: "",
  footerMenu: DEFAULT_FOOTER_MENU,
  footerLegal: DEFAULT_FOOTER_LEGAL,
  phone: "(+40) 729 555 431",
  email: "ofertare@moodilier.com",
  address: "Blv. Basarabia 256, FAUR, București",
  instagram: "https://www.instagram.com/moodilier/",
  facebook: "https://www.facebook.com/moodilier",
  tiktok: "https://www.tiktok.com/@moodilier",
  whatsapp: "40729555431",
  siteTitle: "Moodilier — Mobilier La Comandă Premium",
  metaDescription: "Mobilier premium la comandă din București",
  ga4Id: "",
  pixelId: "",
  googleSiteVerification: "",
  facebookDomainVerification: "",
  intro: DEFAULT_INTRO,
  heroSlides: DEFAULT_HERO_SLIDES,
  heroDefaultDurationSec: 6,
};

export const SETTINGS_STRING_DEFAULTS: Record<string, string> = {
  ga4Id: "",
  pixelId: "",
  googleSiteVerification: "",
  facebookDomainVerification: "",
  phone: SITE_CHROME_DEFAULTS.phone,
  email: SITE_CHROME_DEFAULTS.email,
  address: SITE_CHROME_DEFAULTS.address,
  instagram: SITE_CHROME_DEFAULTS.instagram,
  facebook: SITE_CHROME_DEFAULTS.facebook,
  tiktok: SITE_CHROME_DEFAULTS.tiktok,
  whatsapp: SITE_CHROME_DEFAULTS.whatsapp,
  siteTitle: SITE_CHROME_DEFAULTS.siteTitle,
  metaDescription: SITE_CHROME_DEFAULTS.metaDescription,
  brandName: SITE_CHROME_DEFAULTS.brandName,
  logoUrl: "/brand/logo-white.png",
  ctaLabel: SITE_CHROME_DEFAULTS.ctaLabel,
  ctaHref: SITE_CHROME_DEFAULTS.ctaHref,
  footerBrand: SITE_CHROME_DEFAULTS.footerBrand,
  footerTagline: "",
  headerMenu: JSON.stringify(DEFAULT_HEADER_MENU),
  footerMenu: JSON.stringify(DEFAULT_FOOTER_MENU),
  footerLegal: JSON.stringify(DEFAULT_FOOTER_LEGAL),
  introEnabled: "1",
  introLogoUrl: "/brand/logo-white.png",
  introBrandName: "",
  introEyebrow: "",
  introTagline: DEFAULT_INTRO.tagline,
  introImages: JSON.stringify(DEFAULT_INTRO_IMAGES),
  heroSlides: JSON.stringify(DEFAULT_HERO_SLIDES),
  heroDefaultDurationSec: "6",
  contactFormEnabled: "1",
  contactNotifyEmail: "ofertare@moodilier.com",
  contactSuccessMessage:
    "Vă mulțumim. Vă vom contacta în cel mult 24 de ore lucrătoare.",
  contactHours: "Luni — Vineri\n09:00 — 18:00",
  contactMapEmbedUrl: "",
  contactRequirePhone: "0",
};

function parseMenu(raw: string | undefined, fallback: NavLink[]): NavLink[] {
  if (!raw?.trim()) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallback;
    const links = parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const label = String((item as { label?: unknown }).label ?? "").trim();
        const href = String((item as { href?: unknown }).href ?? "").trim();
        if (!label || !href) return null;
        return { label, href };
      })
      .filter((l): l is NavLink => Boolean(l));
    return links.length ? links : fallback;
  } catch {
    return fallback;
  }
}

function parseImages(raw: string | undefined): string[] {
  if (!raw?.trim()) return [...DEFAULT_INTRO_IMAGES];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT_INTRO_IMAGES];
    const urls = parsed
      .map((u) => (typeof u === "string" ? u.trim() : ""))
      .filter(Boolean)
      .slice(0, 8);
    return urls.length ? urls : [...DEFAULT_INTRO_IMAGES];
  } catch {
    return [...DEFAULT_INTRO_IMAGES];
  }
}

function parseHeroSlides(raw: string | undefined): HeroSlide[] {
  if (!raw?.trim()) return DEFAULT_HERO_SLIDES.map((s) => ({ ...s }));
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || !parsed.length) {
      return DEFAULT_HERO_SLIDES.map((s) => ({ ...s }));
    }
    const slides: HeroSlide[] = [];
    parsed.forEach((item, i) => {
      if (!item || typeof item !== "object") return;
      const row = item as Record<string, unknown>;
      const src = String(row.src ?? "").trim();
      if (!src) return;
      const type = row.type === "video" ? "video" : "image";
      const durationSec = Number(row.durationSec);
      const poster = String(row.poster ?? "").trim();
      slides.push({
        id: String(row.id ?? `slide-${i}`),
        type,
        src,
        ...(poster ? { poster } : {}),
        durationSec:
          Number.isFinite(durationSec) && durationSec > 0
            ? durationSec
            : type === "video"
              ? 8
              : 5,
      });
    });
    return slides.length ? slides : DEFAULT_HERO_SLIDES.map((s) => ({ ...s }));
  } catch {
    return DEFAULT_HERO_SLIDES.map((s) => ({ ...s }));
  }
}

export function chromeFromFlat(flat: Record<string, string>): SiteChrome {
  return {
    brandName: flat.brandName?.trim() || SITE_CHROME_DEFAULTS.brandName,
    logoUrl: flat.logoUrl?.trim() || SITE_CHROME_DEFAULTS.logoUrl,
    headerMenu: parseMenu(flat.headerMenu, DEFAULT_HEADER_MENU),
    ctaLabel: flat.ctaLabel?.trim() || SITE_CHROME_DEFAULTS.ctaLabel,
    ctaHref: flat.ctaHref?.trim() || SITE_CHROME_DEFAULTS.ctaHref,
    footerBrand: flat.footerBrand?.trim() || SITE_CHROME_DEFAULTS.footerBrand,
    footerTagline: flat.footerTagline?.trim() || "",
    footerMenu: parseMenu(flat.footerMenu, DEFAULT_FOOTER_MENU),
    footerLegal: parseMenu(flat.footerLegal, DEFAULT_FOOTER_LEGAL),
    phone: flat.phone?.trim() || SITE_CHROME_DEFAULTS.phone,
    email: flat.email?.trim() || SITE_CHROME_DEFAULTS.email,
    address: flat.address?.trim() || SITE_CHROME_DEFAULTS.address,
    instagram: flat.instagram?.trim() || SITE_CHROME_DEFAULTS.instagram,
    facebook: flat.facebook?.trim() || SITE_CHROME_DEFAULTS.facebook,
    tiktok: flat.tiktok?.trim() || SITE_CHROME_DEFAULTS.tiktok,
    whatsapp: flat.whatsapp?.trim() || SITE_CHROME_DEFAULTS.whatsapp,
    siteTitle: flat.siteTitle?.trim() || SITE_CHROME_DEFAULTS.siteTitle,
    metaDescription:
      flat.metaDescription?.trim() || SITE_CHROME_DEFAULTS.metaDescription,
    ga4Id: flat.ga4Id?.trim() || "",
    pixelId: flat.pixelId?.trim() || "",
    googleSiteVerification: flat.googleSiteVerification?.trim() || "",
    facebookDomainVerification: flat.facebookDomainVerification?.trim() || "",
    intro: {
      enabled: flat.introEnabled !== "0",
      logoUrl:
        flat.introLogoUrl?.trim() ||
        flat.logoUrl?.trim() ||
        DEFAULT_INTRO.logoUrl,
      brandName: flat.introBrandName?.trim() || "",
      eyebrow: flat.introEyebrow?.trim() || "",
      tagline: flat.introTagline?.trim() || DEFAULT_INTRO.tagline,
      images: parseImages(flat.introImages),
    },
    heroSlides: parseHeroSlides(flat.heroSlides),
    heroDefaultDurationSec: Math.max(
      2,
      Number(flat.heroDefaultDurationSec) ||
        SITE_CHROME_DEFAULTS.heroDefaultDurationSec
    ),
  };
}

async function loadSiteChrome(): Promise<SiteChrome> {
  const fallback = {
    ...SITE_CHROME_DEFAULTS,
    intro: { ...DEFAULT_INTRO, images: [...DEFAULT_INTRO_IMAGES] },
    heroSlides: DEFAULT_HERO_SLIDES.map((s) => ({ ...s })),
  };
  if (!hasSupabaseConfig) return fallback;

  try {
    const { data, error } = await supabaseAdmin
      .from("settings")
      .select("*")
      .abortSignal(timeoutSignal(SUPABASE_MS));
    if (error || !data) return fallback;

    const flat: Record<string, string> = { ...SETTINGS_STRING_DEFAULTS };
    for (const row of data) {
      if (row?.key) flat[row.key] = row.value ?? "";
    }
    return chromeFromFlat(flat);
  } catch {
    return fallback;
  }
}

const cachedSiteChrome = unstable_cache(loadSiteChrome, ["site-chrome-v4-hero"], {
  revalidate: 60,
  tags: ["site-chrome"],
});

export const getSiteChrome = cache(cachedSiteChrome);
