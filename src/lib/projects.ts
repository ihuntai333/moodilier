import { cache } from "react";
import { unstable_cache } from "next/cache";
import { hasSupabaseConfig, supabaseAdmin } from "@/lib/supabase";
import {
  projects as staticProjects,
  ROOM_FILTERS,
  type ProjectImage,
} from "@/data/projects-aug";
import { timeoutSignal } from "@/lib/with-timeout";

/** Don't block page navigations on a slow Supabase. */
const SUPABASE_MS = 1800;

export { ROOM_FILTERS };
export type { ProjectImage };

export type SiteProject = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  images: string[];
  gallery: ProjectImage[];
  rooms: string[];
  location?: string;
  video?: string | null;
  isFeatured?: boolean;
  year?: string | null;
  surface?: string | null;
  status?: string;
};

type RawRow = Record<string, unknown>;

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function normalizeImages(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && "url" in item) {
        return asString((item as { url?: unknown }).url).trim();
      }
      return "";
    })
    .filter(Boolean);
}

function normalizeRow(row: RawRow): SiteProject | null {
  const slug = asString(row.slug).trim();
  const title = asString(row.title).trim();
  if (!slug || !title) return null;

  const images = normalizeImages(row.images);
  const cover =
    asString(row.cover_image || row.coverImage).trim() || images[0] || "";
  const gallery = normalizeGallery(row.gallery, images);
  const rooms = normalizeRooms(row.rooms, gallery);

  return {
    id: asString(row.id) || undefined,
    slug,
    title,
    category: asString(row.category, "Rezidențial") || "Rezidențial",
    description: asString(row.description),
    coverImage: cover,
    images,
    gallery,
    rooms,
    location: asString(row.location) || undefined,
    video: asString(row.video).trim() || null,
    isFeatured: Boolean(row.is_featured ?? row.isFeatured),
    year: asString(row.year) || null,
    surface: asString(row.surface) || null,
    status: asString(row.status, "published") || "published",
  };
}

function normalizeGallery(raw: unknown, fallbackImages: string[]): ProjectImage[] {
  if (Array.isArray(raw) && raw.length) {
    return raw
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const url = asString((item as { url?: unknown }).url).trim();
        if (!url) return null;
        const room =
          asString((item as { room?: unknown }).room).trim() || "Altele";
        return { url, room };
      })
      .filter((g): g is ProjectImage => Boolean(g));
  }
  return fallbackImages.map((url) => ({
    url,
    room: roomFromImageUrl(url),
  }));
}

function roomFromImageUrl(url: string): string {
  const base = url.split("/").pop() || "";
  const m = base.match(/^\d+\.([a-z0-9-]+)\./i);
  if (!m) return "Altele";
  const slug = m[1];
  const map: Record<string, string> = {
    bucatarii: "Bucătării",
    living: "Living",
    dressing: "Dressing",
    dormitoare: "Dormitoare",
    bai: "Băi",
    hol: "Hol",
  };
  return map[slug] || "Altele";
}

function normalizeRooms(raw: unknown, gallery: ProjectImage[]): string[] {
  if (Array.isArray(raw) && raw.length) {
    return [
      ...new Set(
        raw
          .map((r) => asString(r).trim())
          .filter((r) => r && r !== "Altele")
      ),
    ];
  }
  return [
    ...new Set(gallery.map((g) => g.room).filter((r) => r && r !== "Altele")),
  ];
}

function staticAsSite(): SiteProject[] {
  return staticProjects
    .filter((p) => !/showroom/i.test(p.slug) && !/showroom/i.test(p.title))
    .map((p) => {
    const gallery =
      p.gallery?.length
        ? p.gallery
        : (p.images || []).map((url) => ({
            url,
            room: roomFromImageUrl(url),
          }));
    const rooms =
      p.rooms?.length
        ? p.rooms
        : [
            ...new Set(
              gallery.map((g) => g.room).filter((r) => r && r !== "Altele")
            ),
          ];
    return {
      slug: p.slug,
      title: p.title,
      category: p.category,
      description: p.description || "",
      coverImage: p.coverImage || p.images[0] || "",
      images: p.images || [],
      gallery,
      rooms,
      location: p.location,
      video: null,
      isFeatured: false,
      status: "published",
    };
  });
}

async function fetchFromSupabase(): Promise<SiteProject[] | null> {
  if (!hasSupabaseConfig) return null;
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .abortSignal(timeoutSignal(SUPABASE_MS));

    if (error || !data?.length) return null;

    const list = data
      .map((row) => normalizeRow(row as RawRow))
      .filter((p): p is SiteProject => Boolean(p))
      .filter((p) => (p.status || "published") !== "draft");

    return list.length ? list : null;
  } catch {
    return null;
  }
}

async function loadPublishedProjects(): Promise<SiteProject[]> {
  // Canonical catalog = DOWNLOAD AUG import (projects-aug).
  // Supabase can enrich later; until then site shows only these projects/names.
  const staticList = staticAsSite();
  const remote = await fetchFromSupabase();
  if (!remote?.length) return staticList;

  const staticBySlug = new Map(staticList.map((p) => [p.slug, p]));
  // Only keep remote rows that match AUG slugs (CMS overrides of the same project)
  const enriched = staticList.map((p) => {
    const r = remote.find((x) => x.slug === p.slug);
    if (!r) return p;
    return {
      ...p,
      ...r,
      images: r.images?.length ? r.images : p.images,
      coverImage: r.coverImage || p.coverImage,
      gallery: r.gallery?.length ? r.gallery : p.gallery,
      rooms: r.rooms?.length ? r.rooms : p.rooms,
    };
  });
  // Drop any remote-only legacy scraped projects
  void staticBySlug;
  return enriched;
}

const cachedPublishedProjects = unstable_cache(
  loadPublishedProjects,
  ["published-projects-v5-no-showroom"],
  { revalidate: 60, tags: ["projects"] }
);

/** Published projects for the live site (Supabase → static fallback). */
export const getPublishedProjects = cache(cachedPublishedProjects);

/** Featured cards for homepage — featured first, then newest. */
export const getFeaturedProjects = cache(async (limit = 6): Promise<SiteProject[]> => {
  const all = await getPublishedProjects();
  const featured = all.filter((p) => p.isFeatured);
  const pool = featured.length ? featured : all;
  return pool.slice(0, limit);
});

export const getProjectBySlug = cache(async (slug: string): Promise<SiteProject | null> => {
  if (!slug) return null;
  // Always use the cached published list — no extra per-slug Supabase roundtrip.
  const all = await getPublishedProjects();
  return all.find((p) => p.slug === slug) ?? null;
});

export const getProjectSlugs = cache(async (): Promise<string[]> => {
  const all = await getPublishedProjects();
  return all.map((p) => p.slug);
});
