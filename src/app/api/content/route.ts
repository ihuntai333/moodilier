import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ensureEditorDb,
  isEditorWriteAuthorized,
} from "@/lib/visual-editor/store";
import { assertSameOrigin } from "@/lib/security/request";

export const runtime = "nodejs";

/** Public — visitors apply saved content */
export async function GET() {
  try {
    const db = await ensureEditorDb();
    return NextResponse.json(db.getContentMap());
  } catch (error) {
    console.error("GET /api/content", error);
    return NextResponse.json(
      { error: "Eroare la citirea conținutului." },
      { status: 500 }
    );
  }
}

/** Auth — bulk upsert { key, value, type }[] — verified admin_session only */
export async function POST(request: NextRequest) {
  try {
    const originFail = assertSameOrigin(request);
    if (originFail) return originFail;

    const cookieStore = await cookies();
    if (!(await isEditorWriteAuthorized(cookieStore))) {
      return NextResponse.json(
        { error: "Neautentificat. Autentifică-te în admin." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const items = Array.isArray(body) ? body : body?.items;
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Body trebuie să fie un array { key, value, type }[]." },
        { status: 400 }
      );
    }

    const db = await ensureEditorDb();
    const result = db.upsertContentBulk(items);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("POST /api/content", error);
    return NextResponse.json({ error: "Eroare la salvare." }, { status: 500 });
  }
}
