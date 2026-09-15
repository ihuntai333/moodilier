import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import { writeFile } from "fs/promises";
import {
  ensureEditorDb,
  isEditorWriteAuthorized,
} from "@/lib/visual-editor/store";
import { formatBytes, optimizeImageBuffer } from "@/lib/optimize-image";
import { assertSameOrigin } from "@/lib/security/request";

export const runtime = "nodejs";

const BLOCKED_MIME = new Set(["image/svg+xml", "image/svg"]);

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

    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Lipsește fișierul." }, { status: 400 });
    }

    if (!file.type.startsWith("image/") || BLOCKED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: "Doar imagini raster sunt permise (fără SVG)." },
        { status: 400 }
      );
    }

    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith(".svg") || lowerName.endsWith(".svgz")) {
      return NextResponse.json(
        { error: "SVG nu este permis." },
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

    const head = bytes.subarray(0, 256).toString("utf8").toLowerCase();
    if (head.includes("<svg") || head.includes("<!doctype svg")) {
      return NextResponse.json(
        { error: "SVG nu este permis." },
        { status: 400 }
      );
    }

    const optimized = await optimizeImageBuffer(bytes, file.type, {
      preset: "cover",
    });
    if (optimized.extension === "svg") {
      return NextResponse.json(
        { error: "SVG nu este permis." },
        { status: 400 }
      );
    }

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
