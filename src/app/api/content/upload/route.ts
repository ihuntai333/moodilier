import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import { writeFile } from "fs/promises";
import {
  ensureEditorDb,
  isEditorWriteAuthorized,
} from "@/lib/visual-editor/store";
import { formatBytes, optimizeImageBuffer } from "@/lib/optimize-image";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    if (!isEditorWriteAuthorized(cookieStore)) {
      return NextResponse.json(
        { error: "Neautentificat. Autentifică-te în admin." },
        { status: 401 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Lipsește fișierul." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Doar imagini sunt permise." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length > 40 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fișierul depășește 40MB." },
        { status: 400 }
      );
    }

    const optimized = await optimizeImageBuffer(bytes, file.type, {
      preset: "gallery",
    });
    const safeBase = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBase}.${optimized.extension}`;

    const db = await ensureEditorDb();
    const dir = db.getUploadsDir();
    const diskPath = path.join(dir, filename);
    await writeFile(diskPath, optimized.buffer);

    const url = `/uploads/${filename}`;
    const row = db.insertMedia({
      filename,
      originalName: file.name,
      mimeType: optimized.contentType,
      size: optimized.optimizedBytes,
      relPath: `uploads/${filename}`,
      url,
    });

    return NextResponse.json({
      ok: true,
      url: row.url,
      media: row,
      optimize: {
        from: formatBytes(optimized.originalBytes),
        to: formatBytes(optimized.optimizedBytes),
        width: optimized.width,
        height: optimized.height,
        skipped: optimized.skipped,
      },
    });
  } catch (error) {
    console.error("POST /api/content/upload", error);
    return NextResponse.json(
      { error: "Eroare la salvarea media." },
      { status: 500 }
    );
  }
}
