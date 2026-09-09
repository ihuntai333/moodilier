import { projects as catalogProjects } from "@/data/projects-aug";
import { hasSupabaseConfig, supabaseAdmin } from "@/lib/supabase";

export type AdminProjectImage = { url: string; alt?: string };

export type AdminProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location?: string;
  description?: string;
  images: AdminProjectImage[];
  cover_image?: string;
  coverImage?: string;
  video?: string | null;
  status?: string;
  year?: string | null;
  surface?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  is_featured?: boolean;
  isFeatured?: boolean;
  updated_at?: string;
  updatedAt?: string;
  created_at?: string;
  source?: "cms" | "catalog";
  rooms?: string[];
  gallery?: { url: string; room: string }[];
};

/** Normalize images from string[] or {url}[] (CMS / form / catalog). */
export function normalizeAdminImages(
  raw: unknown,
  fallbackAlt = ""
): AdminProjectImage[] {
  if (!Array.isArray(raw)) return [];
  const out: AdminProjectImage[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const url = item.trim();
      if (url) out.push({ url, ...(fallbackAlt ? { alt: fallbackAlt } : {}) });
      continue;
    }
    if (item && typeof item === "object" && "url" in item) {
      const url = String((item as { url: unknown }).url || "").trim();
      if (!url) continue;
      const alt =
        typeof (item as { alt?: unknown }).alt === "string"
          ? (item as { alt: string }).alt
          : fallbackAlt || undefined;
      out.push(alt ? { url, alt } : { url });
    }
  }
  return out;
}

function catalogToAdmin(p: (typeof catalogProjects)[number]): AdminProjectRow {
  const images = normalizeAdminImages(p.images || [], p.title);
  return {
    id: `catalog:${p.slug}`,
    slug: p.slug,
    title: p.title,
    category: p.category || "Rezidențial",
    location: p.location || "",
    description: p.description || "",
    images,
    cover_image: p.coverImage || images[0]?.url || "",
    coverImage: p.coverImage || images[0]?.url || "",
    video: null,
    status: "published",
    is_featured: false,
    isFeatured: false,
    seo_title: null,
    seo_description: null,
    seoTitle: "",
    seoDescription: "",
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: "catalog",
    rooms: p.rooms || [],
    gallery: p.gallery || [],
  };
}

function asText(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return "";
}

function normalizeDbRow(row: Record<string, unknown>): AdminProjectRow {
  const title = asText(row.title);
  let images = normalizeAdminImages(row.images, title);

  const gallery = Array.isArray(row.gallery)
    ? (row.gallery as { url?: unknown; room?: unknown }[])
        .map((g) => {
          const url = asText(g?.url).trim();
          if (!url) return null;
          return { url, room: asText(g?.room).trim() || "Altele" };
        })
        .filter((g): g is { url: string; room: string } => Boolean(g))
    : [];

  // Backfill images from gallery / cover when CMS media array is empty
  if (!images.length && gallery.length) {
    images = normalizeAdminImages(
      gallery.map((g) => g.url),
      title
    );
  }

  const coverRaw =
    asText(row.cover_image).trim() || asText(row.coverImage).trim();
  if (!images.length && coverRaw) {
    images = normalizeAdminImages([coverRaw], title);
  }

  const cover = coverRaw || images[0]?.url || "";

  const seoTitle =
    asText(row.seo_title).trim() || asText(row.seoTitle).trim();
  const seoDescription =
    asText(row.seo_description).trim() || asText(row.seoDescription).trim();

  const year = asText(row.year).trim() || null;
  const surface = asText(row.surface).trim() || null;
  const video = asText(row.video).trim() || null;

  return {
    id: String(row.id),
    slug: asText(row.slug),
    title,
    category: asText(row.category) || "Rezidențial",
    location: asText(row.location),
    description: asText(row.description),
    images,
    cover_image: cover,
    coverImage: cover,
    video,
    status: asText(row.status) || "published",
    year,
    surface,
    seo_title: seoTitle || null,
    seo_description: seoDescription || null,
    seoTitle,
    seoDescription,
    is_featured: Boolean(row.is_featured ?? row.isFeatured),
    isFeatured: Boolean(row.is_featured ?? row.isFeatured),
    updated_at:
      typeof row.updated_at === "string"
        ? row.updated_at
        : new Date().toISOString(),
    updatedAt:
      typeof row.updated_at === "string"
        ? row.updated_at
        : new Date().toISOString(),
    created_at: typeof row.created_at === "string" ? row.created_at : undefined,
    source: "cms",
    rooms: Array.isArray(row.rooms)
      ? (row.rooms as unknown[]).map((r) => asText(r)).filter(Boolean)
      : [],
    gallery,
  };
}

function mergeWithCatalog(
  cms: AdminProjectRow,
  catalog?: AdminProjectRow | null
): AdminProjectRow {
  if (!catalog) return cms;
  return {
    ...cms,
    title: cms.title || catalog.title,
    category: cms.category || catalog.category,
    location: cms.location || catalog.location,
    description: cms.description || catalog.description,
    images: cms.images?.length ? cms.images : catalog.images,
    cover_image: cms.cover_image || catalog.cover_image,
    coverImage: cms.coverImage || catalog.coverImage,
    gallery: cms.gallery?.length ? cms.gallery : catalog.gallery,
    rooms: cms.rooms?.length ? cms.rooms : catalog.rooms,
    // Never wipe a CMS video with empty catalog video
    video: cms.video?.trim() || catalog.video || null,
    source: "cms",
  };
}

export function getCatalogBySlug(slug: string): AdminProjectRow | null {
  const found = getCatalogProjects().find((p) => p.slug === slug);
  return found || null;
}

/** Decode path/query ids that may be encoded once or twice (`catalog%3A…`). */
export function decodeProjectParam(raw: string): string {
  let s = String(raw || "").trim();
  for (let i = 0; i < 3; i++) {
    try {
      const next = decodeURIComponent(s);
      if (next === s) break;
      s = next;
    } catch {
      break;
    }
  }
  return s.trim();
}

function parseProjectId(
  id: string
): { kind: "uuid" | "catalog" | "slug"; value: string } {
  const decoded = decodeProjectParam(id);
  if (decoded.startsWith("catalog:")) {
    return { kind: "catalog", value: decoded.slice("catalog:".length) };
  }
  // UUID (v1–v5 classic, or loose 8-4-4-4-12)
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      decoded
    )
  ) {
    return { kind: "uuid", value: decoded };
  }
  return { kind: "slug", value: decoded };
}

/**
 * Resolve a project for admin edit by UUID, `catalog:slug`, or plain slug.
 * CMS rows with empty media/text are filled from the static catalog.
 */
export async function getAdminProjectById(
  id: string
): Promise<AdminProjectRow | null> {
  const parsed = parseProjectId(id);

  if (parsed.kind === "catalog" || parsed.kind === "slug") {
    const catalog = getCatalogBySlug(parsed.value);
    if (hasSupabaseConfig) {
      const { data } = await supabaseAdmin
        .from("projects")
        .select("*")
        .eq("slug", parsed.value)
        .maybeSingle();
      if (data) {
        return mergeWithCatalog(
          normalizeDbRow(data as Record<string, unknown>),
          catalog
        );
      }
    }
    return catalog;
  }

  // UUID
  if (!hasSupabaseConfig) return null;
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", parsed.value)
    .maybeSingle();

  if (!error && data) {
    const row = normalizeDbRow(data as Record<string, unknown>);
    return mergeWithCatalog(row, getCatalogBySlug(row.slug));
  }

  // Fallback: treat opaque id as slug (bad links / non-uuid cms ids)
  const asSlug = getCatalogBySlug(parsed.value);
  if (asSlug) return asSlug;
  if (hasSupabaseConfig) {
    const { data: bySlug } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("slug", parsed.value)
      .maybeSingle();
    if (bySlug) {
      return mergeWithCatalog(
        normalizeDbRow(bySlug as Record<string, unknown>),
        getCatalogBySlug(String(bySlug.slug || ""))
      );
    }
  }
  return null;
}

async function insertCmsProject(
  payload: Record<string, unknown>
): Promise<{ data: Record<string, unknown> | null; error?: string }> {
  const attempt = async (body: Record<string, unknown>) => {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert(body)
      .select("*")
      .single();
    return { data: data as Record<string, unknown> | null, error };
  };

  let { data, error } = await attempt(payload);
  if (!error && data) return { data };

  // Schema drift: retry without optional columns that may be missing in older DBs
  const minimal: Record<string, unknown> = {
    title: payload.title,
    slug: payload.slug,
    category: payload.category,
    location: payload.location || "",
    description: payload.description || "",
    cover_image: payload.cover_image || "",
    images: payload.images || [],
  };
  ({ data, error } = await attempt(minimal));
  if (!error && data) return { data };

  return { data: null, error: error?.message || "Insert eșuat" };
}

/**
 * Ensure a catalog (or slug) project exists in CMS so PATCH/edit can persist.
 * Returns the CMS row with a real UUID.
 */
export async function ensureProjectInCms(
  idOrSlug: string
): Promise<{ project: AdminProjectRow | null; error?: string }> {
  const existing = await getAdminProjectById(idOrSlug);
  if (!existing) {
    return { project: null, error: "Proiectul nu a fost găsit." };
  }

  // Already in CMS
  if (existing.source === "cms" && !String(existing.id).startsWith("catalog:")) {
    return { project: existing };
  }

  if (!hasSupabaseConfig) {
    return { project: existing, error: "Supabase neconfigurat" };
  }

  const catalog = getCatalogBySlug(existing.slug) || existing;
  const insertPayload: Record<string, unknown> = {
    title: catalog.title,
    slug: catalog.slug,
    category: catalog.category,
    location: catalog.location || "",
    description: catalog.description || "",
    cover_image: catalog.cover_image || catalog.coverImage || "",
    images: catalog.images,
    gallery: catalog.gallery || [],
    rooms: catalog.rooms || [],
    video: catalog.video || null,
    status: catalog.status || "published",
    is_featured: false,
  };

  const inserted = await insertCmsProject(insertPayload);
  if (inserted.data) {
    return {
      project: mergeWithCatalog(
        normalizeDbRow(inserted.data),
        catalog
      ),
    };
  }

  // Race / duplicate slug: load existing row
  const { data: again } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("slug", catalog.slug)
    .maybeSingle();

  if (again) {
    return {
      project: mergeWithCatalog(
        normalizeDbRow(again as Record<string, unknown>),
        catalog
      ),
    };
  }

  return {
    project: null,
    error: inserted.error || "Nu s-a putut crea proiectul în CMS.",
  };
}

export function getCatalogProjects(): AdminProjectRow[] {
  return catalogProjects
    .filter((p) => !/showroom/i.test(p.slug) && !/showroom/i.test(p.title))
    .map(catalogToAdmin);
}

/** Insert missing catalog projects; optionally backfill empty media on CMS rows. */
export async function syncCatalogToSupabase(opts?: {
  backfill?: boolean;
}): Promise<{
  inserted: number;
  updated: number;
  total: number;
  error?: string;
}> {
  const backfill = opts?.backfill === true;
  const catalog = getCatalogProjects();
  if (!hasSupabaseConfig) {
    return {
      inserted: 0,
      updated: 0,
      total: catalog.length,
      error: "Supabase neconfigurat",
    };
  }

  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from("projects")
    .select("id, slug, title, description, cover_image, images, gallery, rooms");

  if (fetchErr) {
    // Older schemas may lack gallery/rooms — retry slim select
    const slim = await supabaseAdmin
      .from("projects")
      .select("id, slug, title, description, cover_image, images");
    if (slim.error) {
      return {
        inserted: 0,
        updated: 0,
        total: catalog.length,
        error: slim.error.message,
      };
    }
    return syncWithExistingRows(catalog, slim.data || [], backfill);
  }

  return syncWithExistingRows(catalog, existing || [], backfill);
}

async function syncWithExistingRows(
  catalog: AdminProjectRow[],
  existing: Record<string, unknown>[],
  backfill: boolean
): Promise<{
  inserted: number;
  updated: number;
  total: number;
  error?: string;
}> {
  const bySlug = new Map(
    existing.map((r) => [String(r.slug), r as Record<string, unknown>])
  );
  const missing = catalog.filter((p) => p.slug && !bySlug.has(p.slug));

  let inserted = 0;
  let updated = 0;

  // Insert missing one-by-one with schema fallback (avoids one bad column aborting all)
  for (const p of missing) {
    const result = await insertCmsProject({
      title: p.title,
      slug: p.slug,
      category: p.category,
      location: p.location || "",
      description: p.description || "",
      cover_image: p.cover_image || "",
      images: p.images,
      gallery: p.gallery || [],
      rooms: p.rooms || [],
      video: null,
      status: "published",
      is_featured: false,
    });
    if (result.data) {
      inserted += 1;
      bySlug.set(p.slug, result.data);
    }
  }

  if (!backfill) {
    return { inserted, updated, total: catalog.length };
  }

  for (const c of catalog) {
    const row = bySlug.get(c.slug);
    if (!row) continue;
    const images = normalizeAdminImages(row.images, c.title);
    const cover =
      (typeof row.cover_image === "string" && row.cover_image) || "";
    const description =
      (typeof row.description === "string" && row.description) || "";
    const title = (typeof row.title === "string" && row.title) || "";
    const gallery = Array.isArray(row.gallery) ? row.gallery : [];
    const rooms = Array.isArray(row.rooms) ? row.rooms : [];

    const patch: Record<string, unknown> = {};
    if (!images.length && c.images.length) patch.images = c.images;
    if (!cover && c.cover_image) patch.cover_image = c.cover_image;
    if (!description && c.description) patch.description = c.description;
    if (!title && c.title) patch.title = c.title;
    if (!gallery.length && c.gallery?.length) patch.gallery = c.gallery;
    if (!rooms.length && c.rooms?.length) patch.rooms = c.rooms;

    if (!Object.keys(patch).length) continue;

    const { error: updErr } = await supabaseAdmin
      .from("projects")
      .update(patch)
      .eq("id", String(row.id));
    if (!updErr) updated += 1;
  }

  return { inserted, updated, total: catalog.length };
}

/** CMS + catalog (site portfolio). CMS wins on slug overlap. */
export async function getAdminProjectsMerged(): Promise<{
  projects: AdminProjectRow[];
  catalogCount: number;
  cmsCount: number;
}> {
  const catalog = getCatalogProjects();
  let cms: AdminProjectRow[] = [];

  if (hasSupabaseConfig) {
    try {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data?.length) {
        cms = data.map((row) => normalizeDbRow(row as Record<string, unknown>));
      }
    } catch {
      /* ignore */
    }
  }

  const cmsBySlug = new Map(cms.map((p) => [p.slug, p]));
  const merged: AdminProjectRow[] = [];

  for (const c of catalog) {
    const fromCms = cmsBySlug.get(c.slug);
    if (fromCms) {
      merged.push(mergeWithCatalog(fromCms, c));
      cmsBySlug.delete(c.slug);
    } else {
      merged.push(c);
    }
  }

  for (const extra of cmsBySlug.values()) {
    merged.push(extra);
  }

  return {
    projects: merged,
    catalogCount: catalog.length,
    cmsCount: cms.length,
  };
}
