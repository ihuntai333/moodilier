import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ensureEditorDb,
  isEditorWriteAuthorized,
} from "@/lib/visual-editor/store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cookieStore = await cookies();
    if (!(await isEditorWriteAuthorized(cookieStore))) {
      return NextResponse.json(
        { error: "Neautentificat. Autentifică-te în admin." },
        { status: 401 }
      );
    }

    const db = await ensureEditorDb();
    return NextResponse.json(db.listMedia());
  } catch (error) {
    console.error("GET /api/media", error);
    return NextResponse.json(
      { error: "Eroare la listarea media." },
      { status: 500 }
    );
  }
}
