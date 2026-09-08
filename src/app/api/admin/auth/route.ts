import { NextRequest, NextResponse } from "next/server";
import {
  hasAdminSessionSecret,
  setAdminSessionCookies,
} from "@/lib/admin-auth";
import { timingSafeEqual } from "crypto";
import { assertSameOrigin } from "@/lib/security/request";

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
  try {
    const originFail = assertSameOrigin(request);
    if (originFail) return originFail;

    const body = await request.json();
    const { password } = body as { password: string };

    const correctPassword = process.env.ADMIN_PASSWORD?.trim();
    if (!correctPassword) {
      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === "production"
              ? "Admin neconfigurat (ADMIN_PASSWORD lipsește)."
              : "Setează ADMIN_PASSWORD în .env.local.",
        },
        { status: 503 }
      );
    }

    if (!hasAdminSessionSecret()) {
      return NextResponse.json(
        {
          error:
            "ADMIN_SESSION_SECRET lipsește — obligatoriu pe production/Vercel.",
        },
        { status: 503 }
      );
    }

    if (typeof password !== "string" || !safeEqual(password, correctPassword)) {
      return NextResponse.json({ error: "Parolă incorectă." }, { status: 401 });
    }

    await setAdminSessionCookies();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
