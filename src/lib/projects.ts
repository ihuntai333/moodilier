import { cache } from "react";
import { unstable_cache } from "next/cache";
import { hasSupabaseConfig, supabaseAdmin } from "@/lib/supabase";
import {
  projects as staticProjects,
  PROJECT_AUG_ORDER,
  ROOM_FILTERS,
  type ProjectImage,
} from "@/data/projects-aug";
import { PROJECT_DESCRIPTIONS_AUG } from "@/data/project-descriptions-aug";
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
  /** Optional CMS SEO title (absolute). Falls back to generated title. */
  seoTitle?: string | null;
  /** Optional short blurb for cards / meta. */
  shortDescription?: string | null;
  /** Same as category when set — e.g. Rezidențial / Comercial. */
  projectType?: string | null;
  /** Same as rooms when set — spaces present in the project. */
  spaces?: string[];
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
    seoTitle:
      asString(row.seo_title || row.seoTitle).trim() || null,
    shortDescription:
      asString(row.short_description || row.shortDescription).trim() || null,
    projectType:
      asString(row.project_type || row.projectType).trim() ||
      asString(row.category, "Rezidențial") ||
      null,
    spaces: rooms.length ? rooms : undefined,
    coverImage: cover,
    images,
    gallery,
    rooms,
    location: asString(row.location).trim() || undefined,
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
        const room = normalizeRoomLabel(
          asString((item as { room?: unknown }).room).trim() || "Altele"
        );
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

function normalizeRoomLabel(room: string): string {
  const key = room
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const map: Record<string, string> = {
    bucatarii: "Bucătării",
    bucatarie: "Bucătării",
    living: "Living",
    dressing: "Dressing",
    dressinguri: "Dressing",
    dormitoare: "Dormitoare",
    dormitor: "Dormitoare",
    bai: "Băi",
    baie: "Băi",
    hol: "Hol",
    altele: "Altele",
  };
  return map[key] || room.trim();
}

function normalizeRooms(raw: unknown, gallery: ProjectImage[]): string[] {
  if (Array.isArray(raw) && raw.length) {
    return [
      ...new Set(
        raw
          .map((r) => normalizeRoomLabel(asString(r).trim()))
          .filter((r) => r && r !== "Altele")
      ),
    ];
  }
  return [
    ...new Set(
      gallery
        .map((g) => normalizeRoomLabel(g.room))
        .filter((r) => r && r !== "Altele")
    ),
  ];
}

function isGenericDescription(text: string | null | undefined): boolean {
  const t = (text || "").trim();
  if (!t) return true;
  if (t.length < 120) return true;
  return /^Proiect Moodilier\s*[—–-]/i.test(t);
}

function resolveDescription(
  slug: string,
  primary?: string | null,
  fallback?: string | null
): string {
  const fromDoc = PROJECT_DESCRIPTIONS_AUG[slug]?.trim() || "";
  // DOWNLOAD AUG docx is the source of truth for project stories
  if (fromDoc) return fromDoc;
  const a = (primary || "").trim();
  const b = (fallback || "").trim();
  if (a && !isGenericDescription(a)) return a;
  if (b && !isGenericDescription(b)) return b;
  return a || b || "";
}

function firstParagraph(text: string, max = 220): string {
  const para = text.split(/\n\n+/)[0]?.trim() || text.trim();
  if (para.length <= max) return para;
  const cut = para.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
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
    const description = resolveDescription(p.slug, p.description);
    return {
      slug: p.slug,
      title: p.title,
      category: p.category,
      description,
      seoTitle: null,
      shortDescription: description ? firstParagraph(description, 180) : null,
      projectType: p.category || null,
      spaces: rooms.length ? rooms : undefined,
      coverImage: p.coverImage || p.images[0] || "",
      images: p.images || [],
      gallery,
      rooms,
      location: p.location?.trim() || undefined,
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

function sortByAugOrder(list: SiteProject[]): SiteProject[] {
  const rank = new Map(PROJECT_AUG_ORDER.map((slug, i) => [slug, i]));
  return [...list].sort((a, b) => {
    const ra = rank.has(a.slug) ? rank.get(a.slug)! : 10_000;
    const rb = rank.has(b.slug) ? rank.get(b.slug)! : 10_000;
    if (ra !== rb) return ra - rb;
    return a.title.localeCompare(b.title, "ro");
  });
}

async function loadPublishedProjects(): Promise<SiteProject[]> {
  // Canonical catalog = projects-aug; order = Villa 01→N, then Apartment 01→N.
  const staticList = staticAsSite();
  const remote = await fetchFromSupabase();
  if (!remote?.length) return sortByAugOrder(staticList);

  const staticBySlug = new Map(staticList.map((p) => [p.slug, p]));
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
      video: r.video?.trim() || p.video || null,
      description: resolveDescription(p.slug, r.description, p.description),
      shortDescription:
        r.shortDescription?.trim() ||
        firstParagraph(
          resolveDescription(p.slug, r.description, p.description),
          180
        ),
    };
  });
  const extras = remote.filter(
    (r) =>
      !staticBySlug.has(r.slug) && (r.status || "published") !== "draft"
  );
  return sortByAugOrder([...enriched, ...extras]);
}

const cachedPublishedProjects = unstable_cache(
  loadPublishedProjects,
  ["published-projects-v12-villa-then-apt"],
  { revalidate: 60, tags: ["projects"] }
);

/** Published projects for the live site (Supabase → static fallback). */
export const getPublishedProjects = cache(cachedPublishedProjects);

/** Homepage cards — first N in Villa 01→N then Apartment 01→N order. */
export const getFeaturedProjects = cache(async (limit = 6): Promise<SiteProject[]> => {
  const all = await getPublishedProjects();
  return all.slice(0, limit);
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
