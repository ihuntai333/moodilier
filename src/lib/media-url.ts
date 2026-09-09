/** Allowed media URLs for project covers / galleries (blocks javascript: and off-site hosts). */
export function isAllowedMediaUrl(raw: string): boolean {
  const url = String(raw || "").trim();
  if (!url || url.length > 2000) return false;
  if (url.startsWith("/projects/") || url.startsWith("/uploads/")) return true;
  if (url.startsWith("/images-scraped/") || url.startsWith("/brand/")) return true;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (host.endsWith(".supabase.co")) return true;
    if (host === "moodilier.ro" || host.endsWith(".moodilier.ro")) return true;
    return false;
  } catch {
    return false;
  }
}

export function sanitizeMediaUrl(raw: unknown): string {
  const url = typeof raw === "string" ? raw.trim() : "";
  return isAllowedMediaUrl(url) ? url : "";
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
