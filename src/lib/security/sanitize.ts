/** HTML / ID / href sanitizers for CMS settings fields. */

const DANGEROUS_TAGS =
  /<\/?(?:script|iframe|object|embed|link|meta|style|form|input|textarea|svg|math|video|audio|source|base|frame|frameset|applet|template)(?:\s[^>]*)?>/gi;

const EVENT_ATTR = /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

const JS_URL =
  /(?:href|src|xlink:href)\s*=\s*(?:(["'])\s*(?:javascript|data|vbscript):[\s\S]*?\1|(?:javascript|data|vbscript):[^\s>]*)/gi;

export function sanitizeEditableHtml(raw: string): string {
  let s = String(raw ?? "");
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(DANGEROUS_TAGS, "");
  s = s.replace(EVENT_ATTR, "");
  s = s.replace(JS_URL, 'href="#"');
  return s.slice(0, 20_000);
}

export function stripTags(raw: string): string {
  return String(raw ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .slice(0, 8000);
}

export function sanitizeHref(href: string): string {
  const h = String(href || "").trim();
  if (!h) return "";
  if (h.startsWith("/") && !h.startsWith("//") && !h.includes("\\")) {
    if (/[<>"`]/.test(h) || h.toLowerCase().includes("javascript:")) return "";
    return h.slice(0, 300);
  }
  try {
    const u = new URL(h);
    if (u.protocol !== "https:") return "";
    return u.toString().slice(0, 500);
  } catch {
    return "";
  }
}

export function isValidGa4Id(id: string): boolean {
  return /^G-[A-Z0-9]{4,20}$/i.test(id.trim());
}

export function isValidPixelId(id: string): boolean {
  return /^\d{5,20}$/.test(id.trim());
}

export function isValidVerificationToken(value: string): boolean {
  return /^[A-Za-z0-9_-]{0,200}$/.test(value.trim());
}

