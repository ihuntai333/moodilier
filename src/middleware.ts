import { NextRequest, NextResponse } from "next/server";
import {
  SITE_LOCK_COOKIE,
  SITE_LOCK_PATH,
  isSiteLockEnabled,
  isValidSiteLockCookie,
} from "@/lib/site-lock";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";

function withPathname(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return requestHeaders;
}

function isPublicWhenLocked(pathname: string): boolean {
  if (pathname === SITE_LOCK_PATH) return true;
  if (pathname.startsWith("/api/preview/")) return true;
  if (pathname === "/api/content" || pathname.startsWith("/api/content/")) return true;
  if (pathname === "/api/media") return true;
  if (pathname === "/editor.js") return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/robots.txt") return true;
  return false;
}

const ADMIN_API_PUBLIC = new Set([
  "/api/admin/auth",
  "/api/admin/session",
  "/api/admin/logout",
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = withPathname(request);

  // ── Site lock (optional private preview) ────────────────────────────────
  if (isSiteLockEnabled() && !isPublicWhenLocked(pathname)) {
    const cookie = request.cookies.get(SITE_LOCK_COOKIE)?.value;
    const unlocked = await isValidSiteLockCookie(cookie);
    if (!unlocked) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Site locked. Unlock at /acces first." },
          { status: 401 }
        );
      }
      const unlock = new URL(SITE_LOCK_PATH, request.url);
      unlock.searchParams.set("from", pathname);
      return NextResponse.redirect(unlock);
    }
  }

  // ── Protect visual-editor APIs (defense in depth) ───────────────────────
  if (
    pathname === "/api/content" ||
    pathname.startsWith("/api/content/") ||
    pathname === "/api/media"
  ) {
    if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS") {
      const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      if (!(await verifyAdminSessionToken(token))) {
        return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
      }
    } else if (pathname === "/api/media") {
      const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      if (!(await verifyAdminSessionToken(token))) {
        return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
      }
    }
  }

  // ── Protect /api/admin/* except auth helpers ────────────────────────────
  if (pathname.startsWith("/api/admin/") && !ADMIN_API_PUBLIC.has(pathname)) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifyAdminSessionToken(token))) {
      return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
    }
  }

  // ── Rate-limit admin login attempts ─────────────────────────────────────
  if (pathname === "/api/admin/auth" && request.method === "POST") {
    const ip = clientIp(request);
    const limited = rateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Prea multe încercări. Încearcă din nou mai târziu." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        }
      );
    }
  }

  // ── Admin UI pages ──────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifyAdminSessionToken(session))) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads|videos|brand|projects|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
