/** Allowed media URLs for project covers / galleries (blocks javascript: and off-site hosts). */
export function isAllowedMediaUrl(raw: string): boolean {
  const url = String(raw || "").trim();
  if (!url || url.length > 2000) return false;
  if (url.startsWith("/projects/") || url.startsWith("/uploads/")) return true;
  if (url.startsWith("/brand/")) return true;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (host.endsWith(".supabase.co")) return true;
    if (host === "moodilier.ro" || host.endsWith(".moodilier.ro")) return true;
    if (host === "moodilier.vercel.app" || /^moodilier[-.].*\.vercel\.app$/.test(host))
      return true;
    return false;
  } catch {
    return false;
  }
}

export function sanitizeMediaUrl(raw: unknown): string {
  return extractMediaUrl(raw);
}

/** Featured image / gallery URL from CMS (string, {url}, or JSON string). */
export function extractMediaUrl(raw: unknown): string {
  if (raw == null) return "";
  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return "";
    if (s.startsWith("{") || s.startsWith("[")) {
      try {
        return extractMediaUrl(JSON.parse(s));
      } catch {
        /* not JSON */
      }
    }
    return isAllowedMediaUrl(s) ? s : "";
  }
  if (typeof raw === "object" && "url" in raw) {
    return extractMediaUrl((raw as { url?: unknown }).url);
  }
  return "";
}

/** Next/Image rejects local srcs with `?v=` (400 INVALID_IMAGE_OPTIMIZE_REQUEST). */
export function versionedMediaUrl(
  url: string,
  _version?: string | null
): string {
  return String(url || "").trim();
}

export function sanitizeGallery(
  raw: unknown
): { url: string; room: string }[] {
  if (!Array.isArray(raw)) return [];
  const out: { url: string; room: string }[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const url = sanitizeMediaUrl((item as { url?: unknown }).url);
    if (!url) continue;
    const room = String((item as { room?: unknown }).room || "Altele")
      .trim()
      .slice(0, 80);
    out.push({ url, room: room || "Altele" });
  }
  return out;
}
