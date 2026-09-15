import { projects as catalogProjects } from "@/data/projects-aug";
import { hasSupabaseConfig, supabaseAdmin } from "@/lib/supabase";
import { timeoutSignal } from "@/lib/with-timeout";
import { extractMediaUrl } from "@/lib/media-url";

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
  if (!Array.isArray(raw)) {
    const url = extractMediaUrl(raw);
    return url ? [{ url, ...(fallbackAlt ? { alt: fallbackAlt } : {}) }] : [];
  }
  const out: AdminProjectImage[] = [];
  for (const item of raw) {
    const url = extractMediaUrl(item);
    if (!url) continue;
    const alt =
      item && typeof item === "object" && typeof (item as { alt?: unknown }).alt === "string"
        ? (item as { alt: string }).alt
        : fallbackAlt || undefined;
    out.push(alt ? { url, alt } : { url });
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

  let gallery = Array.isArray(row.gallery)
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

  // Persist cover as first image so public site + admin thumbnails match
  if (cover) {
    images = [
      ...normalizeAdminImages([cover], title),
      ...images.filter((img) => img.url !== cover),
    ];
    const coverHits = gallery.filter((g) => g.url === cover);
    const restGal = gallery.filter((g) => g.url !== cover);
    gallery = coverHits.length
      ? [...coverHits, ...restGal]
      : [{ url: cover, room: "Altele" }, ...restGal];
  }

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
    cover_image:
      cms.cover_image || cms.images?.[0]?.url || catalog.cover_image,
    coverImage:
      cms.coverImage || cms.images?.[0]?.url || catalog.coverImage,
    gallery: cms.gallery?.length ? cms.gallery : catalog.gallery,
    rooms: cms.rooms?.length ? cms.rooms : catalog.rooms,
    // Never wipe a CMS video with empty catalog video
    video: cms.video?.trim() || catalog.video || null,
    source: "cms",
  };
}

export function adminProjectFromRow(row: Record<string, unknown>): AdminProjectRow {
  const cms = normalizeDbRow(row);
  return mergeWithCatalog(cms, getCatalogBySlug(cms.slug));
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

export function parseProjectId(
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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** PostgREST PGRST204 — older Moodilier DBs lack video/gallery/rooms. */
export function missingProjectsColumn(
  error: { message?: string } | null | undefined
): string | null {
  const msg = error?.message || "";
  const m = msg.match(/Could not find the '([^']+)' column of 'projects'/i);
  return m?.[1] || null;
}

async function writeProjectIgnoringUnknownColumns(
  kind: "insert" | "update",
  payload: Record<string, unknown>,
  id?: string
): Promise<{ data: Record<string, unknown> | null; error?: string }> {
  const body = { ...payload };
  for (let i = 0; i < 10; i++) {
    try {
      const q =
        kind === "insert"
          ? supabaseAdmin.from("projects").insert(body)
          : supabaseAdmin.from("projects").update(body).eq("id", id || "");
      const { data, error } = await q
        .abortSignal(timeoutSignal(8000))
        .select("*")
        .single();
      if (!error && data) {
        return { data: data as Record<string, unknown> };
      }
      const col = missingProjectsColumn(error);
      if (col && col in body) {
        delete body[col];
        continue;
      }
      return { data: null, error: error?.message || "Scriere eșuată" };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Conexiune Supabase eșuată";
      const col = missingProjectsColumn({ message });
      if (col && col in body) {
        delete body[col];
        continue;
      }
      return { data: null, error: message };
    }
  }
  return { data: null, error: "Scriere eșuată" };
}

export async function updateProjectRow(
  id: string,
  payload: Record<string, unknown>
): Promise<{ data: Record<string, unknown> | null; error?: string }> {
  return writeProjectIgnoringUnknownColumns("update", payload, id);
}

export async function insertProjectRow(
  payload: Record<string, unknown>
): Promise<{ data: Record<string, unknown> | null; error?: string }> {
  return writeProjectIgnoringUnknownColumns("insert", payload);
}

/** Latest CMS row for a slug — never uses maybeSingle (duplicates would 406). */
async function fetchCmsRowBySlug(
  slug: string
): Promise<Record<string, unknown> | null> {
  if (!hasSupabaseConfig || !slug) return null;

  const run = async (orderCol: "updated_at" | "created_at" | null) => {
    let q = supabaseAdmin.from("projects").select("*").eq("slug", slug);
    if (orderCol) q = q.order(orderCol, { ascending: false });
    const { data, error } = await q.limit(1).abortSignal(timeoutSignal(6000));
    if (error) return { error, row: null as Record<string, unknown> | null };
    const row = Array.isArray(data) ? data[0] : data;
    return {
      error: null,
      row: (row as Record<string, unknown> | undefined) || null,
    };
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      let result = await run("updated_at");
      if (result.error) result = await run("created_at");
      if (result.error) result = await run(null);
      if (result.row) return result.row;
      if (!result.error) return null;
    } catch (err) {
      console.warn("fetchCmsRowBySlug:", err);
    }
    await sleep(250 * (attempt + 1));
  }
  return null;
}

/**
 * Resolve a project for admin edit by UUID, `catalog:slug`, or plain slug.
 * CMS rows with empty media/text are filled from the static catalog.
 * Supabase failures fall back to catalog — never throw "fetch failed" to the UI.
 */
export async function getAdminProjectById(
  id: string
): Promise<AdminProjectRow | null> {
  const parsed = parseProjectId(id);

  if (parsed.kind === "catalog" || parsed.kind === "slug") {
    const catalog = getCatalogBySlug(parsed.value);
    const row = await fetchCmsRowBySlug(parsed.value);
    if (row) {
      return mergeWithCatalog(normalizeDbRow(row), catalog);
    }
    return catalog;
  }

  // UUID
  if (hasSupabaseConfig) {
    try {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .select("*")
        .eq("id", parsed.value)
        .maybeSingle();

      if (!error && data) {
        const row = normalizeDbRow(data as Record<string, unknown>);
        return mergeWithCatalog(row, getCatalogBySlug(row.slug));
      }
    } catch (err) {
      console.warn("getAdminProjectById uuid lookup failed:", err);
    }
  }

  const asSlug = getCatalogBySlug(parsed.value);
  const bySlug = await fetchCmsRowBySlug(parsed.value);
  if (bySlug) {
    return mergeWithCatalog(
      normalizeDbRow(bySlug),
      asSlug || getCatalogBySlug(String(bySlug.slug || ""))
    );
  }
  return asSlug;
}

async function insertCmsProject(
  payload: Record<string, unknown>
): Promise<{ data: Record<string, unknown> | null; error?: string }> {
  const first = await writeProjectIgnoringUnknownColumns("insert", payload);
  if (first.data) return first;

  const minimal: Record<string, unknown> = {
    title: payload.title,
    slug: payload.slug,
    category: payload.category,
    location: payload.location || "",
    description: payload.description || "",
    cover_image: payload.cover_image || "",
    images: payload.images || [],
  };
  return writeProjectIgnoringUnknownColumns("insert", minimal);
}

/**
 * Ensure a catalog (or slug) project exists in CMS so PATCH/edit can persist.
 * Returns the CMS row with a real UUID when possible; otherwise catalog row.
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
    return { project: existing };
  }

  const catalog = getCatalogBySlug(existing.slug) || existing;
  const insertPayload: Record<string, unknown> = {
    title: catalog.title,
    slug: catalog.slug,
    category: catalog.category,
    location: catalog.location || "",
    description: catalog.description || "",
    cover_image: catalog.cover_image || catalog.coverImage || "",
    images: (catalog.images || []).map((img) => img.url).filter(Boolean),
    gallery: catalog.gallery || [],
    rooms: catalog.rooms || [],
    video: catalog.video || null,
    status: catalog.status || "published",
    is_featured: false,
  };

  const inserted = await insertCmsProject(insertPayload);
  if (inserted.data) {
    return {
      project: mergeWithCatalog(normalizeDbRow(inserted.data), catalog),
    };
  }

  // Duplicate slug / race: use the row that already exists
  const again = await fetchCmsRowBySlug(catalog.slug);
  if (again) {
    return {
      project: mergeWithCatalog(normalizeDbRow(again), catalog),
    };
  }

  return {
    project: catalog,
    error:
      inserted.error ||
      "CMS temporar indisponibil — poți vedea proiectul; salvarea poate eșua.",
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

  const cmsBySlug = new Map<string, AdminProjectRow>();
  for (const row of cms) {
    const key = row.slug.trim().toLowerCase();
    const prev = cmsBySlug.get(key);
    if (!prev) {
      cmsBySlug.set(key, row);
      continue;
    }
    const prevTs = Date.parse(prev.updated_at || prev.updatedAt || "") || 0;
    const nextTs = Date.parse(row.updated_at || row.updatedAt || "") || 0;
    if (nextTs >= prevTs) cmsBySlug.set(key, row);
  }
  const merged: AdminProjectRow[] = [];

  for (const c of catalog) {
    const fromCms = cmsBySlug.get(c.slug.trim().toLowerCase());
    if (fromCms) {
      merged.push(mergeWithCatalog(fromCms, c));
      cmsBySlug.delete(c.slug.trim().toLowerCase());
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
