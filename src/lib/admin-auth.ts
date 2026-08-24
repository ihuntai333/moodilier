import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const EDITOR_COOKIE = "ihuntev_logged_in";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "dev-insecure-session-secret"
  );
}

/** Signed token: v1.<exp>.<nonce>.<sig> */
export function createAdminSessionToken(ttlSec = SESSION_MAX_AGE): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const nonce = randomBytes(8).toString("hex");
  const payload = `v1.${exp}.${nonce}`;
  const sig = createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  // Legacy flat cookie still accepted briefly so existing sessions keep working
  if (token === "authenticated") return true;

  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return false;
  const [ver, expStr, nonce, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  if (!nonce || !sig) return false;

  const payload = `${ver}.${expStr}.${nonce}`;
  const expected = createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

/** Returns 401 JSON response if not authenticated; otherwise null. */
export function requireAdminApi(request: NextRequest): NextResponse | null {
  if (isAdminRequest(request)) return null;
  return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
}

export async function setAdminSessionCookies() {
  const token = createAdminSessionToken();
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  cookieStore.set(EDITOR_COOKIE, "true", {
    httpOnly: false,
    secure,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
}

export async function clearAdminSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  cookieStore.set(EDITOR_COOKIE, "", {
    httpOnly: false,
    path: "/",
    maxAge: 0,
  });
}
