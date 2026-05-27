import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body as { password: string };

    const correctPassword =
      process.env.ADMIN_PASSWORD || "moodilier2024";

    if (password !== correctPassword) {
      return NextResponse.json(
        { error: "Parolă incorectă." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Eroare internă." },
      { status: 500 }
    );
  }
}
