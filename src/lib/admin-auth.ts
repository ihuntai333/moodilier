import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

export {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE,
  createAdminSessionToken,
  verifyAdminSessionToken,
  hasAdminSessionSecret,
} from "@/lib/admin-session";

export const EDITOR_COOKIE = "ihuntev_logged_in";

export async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

/** Returns 401 JSON if not authenticated; otherwise null. */
export async function requireAdminApi(
  request: NextRequest
): Promise<NextResponse | null> {
  if (await isAdminRequest(request)) return null;
  return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
}

export async function setAdminSessionCookies() {
  const token = await createAdminSessionToken();
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  // UI-only flag for editor.js — never trusted for API authorization
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
