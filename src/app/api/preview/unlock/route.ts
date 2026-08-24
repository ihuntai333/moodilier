import { NextRequest, NextResponse } from "next/server";
import {
  SITE_LOCK_COOKIE,
  getSiteLockPassword,
  isSiteLockEnabled,
  siteLockToken,
} from "@/lib/site-lock";

export async function POST(request: NextRequest) {
  if (!isSiteLockEnabled()) {
    return NextResponse.json({ ok: true, locked: false });
  }

  try {
    const body = (await request.json()) as { password?: string };
    const password = String(body.password ?? "");
    const expected = getSiteLockPassword();

    if (!password || password !== expected) {
      return NextResponse.json({ error: "Parolă incorectă." }, { status: 401 });
    }

    const token = await siteLockToken(expected);
    const res = NextResponse.json({ ok: true, locked: true });
    res.cookies.set(SITE_LOCK_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SITE_LOCK_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
