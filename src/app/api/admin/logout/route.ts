import { NextResponse } from "next/server";
import { clearAdminSessionCookies } from "@/lib/admin-auth";

export async function DELETE() {
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
