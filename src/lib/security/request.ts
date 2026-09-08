import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "moodilier.ro",
  "www.moodilier.ro",
  "localhost",
  "127.0.0.1",
]);

function hostAllowed(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/:\d+$/, "");
  if (ALLOWED_HOSTS.has(h)) return true;
  if (h.endsWith(".vercel.app")) return true;
  if (h.endsWith(".moodilier.ro")) return true;
  return false;
}

function sameSiteHosts(a: string, b: string): boolean {
  if (a === b) return true;
  const pair = new Set([a, b]);
  if (pair.has("moodilier.ro") && pair.has("www.moodilier.ro")) return true;
  return false;
}

/**
 * Reject cross-site POSTs (basic CSRF for cookie-bearing / public APIs).
 * Origin/Referer hostname must match the request Host (not any *.vercel.app).
 */
export function assertSameOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host") || "";

  if (!origin && !referer) {
    if (process.env.NODE_ENV === "development") return null;
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 403 });
  }

  try {
    const url = origin || referer || "";
    const parsed = new URL(url);
    const originHost = parsed.hostname.toLowerCase();
    if (!hostAllowed(originHost)) {
      return NextResponse.json({ error: "Origin nepermis." }, { status: 403 });
    }
    const reqHost = host.replace(/:\d+$/, "").toLowerCase();
    if (reqHost && !sameSiteHosts(originHost, reqHost)) {
      return NextResponse.json({ error: "Origin nepermis." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 403 });
  }
  return null;
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
