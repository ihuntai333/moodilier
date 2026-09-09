import { NextRequest, NextResponse } from "next/server";
import { clearAdminSessionCookies } from "@/lib/admin-auth";
import { assertSameOrigin } from "@/lib/security/request";

export async function DELETE(request: NextRequest) {
  const originFail = assertSameOrigin(request);
  if (originFail) return originFail;

  try {
    await clearAdminSessionCookies();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Eroare la deconectare." },
      { status: 500 }
    );
  }
}
