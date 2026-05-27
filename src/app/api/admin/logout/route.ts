import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Eroare la deconectare." },
      { status: 500 }
    );
  }
}
