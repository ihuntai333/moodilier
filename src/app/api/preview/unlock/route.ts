import { NextRequest, NextResponse } from "next/server";
import {
  SITE_LOCK_COOKIE,
  getSiteLockPassword,
  isSiteLockEnabled,
  siteLockToken,
} from "@/lib/site-lock";
import { assertSameOrigin } from "@/lib/security/request";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { timingSafeEqual } from "crypto";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  if (!isSiteLockEnabled()) {
    return NextResponse.json({ ok: true, locked: false });
  }

  const originFail = assertSameOrigin(request);
  if (originFail) return originFail;

  const ip = clientIp(request);
  const limited = rateLimit(`preview-unlock:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Prea multe încercări. Încearcă din nou mai târziu." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  try {
    const body = (await request.json()) as { password?: string };
    const password = String(body.password ?? "");
    const expected = getSiteLockPassword();

    if (!password || !safeEqual(password, expected)) {
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
