import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const slug = (formData.get("slug") as string) || "general";
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Niciun fișier primit." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", slug);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedPaths: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const allowedExts = ["jpg", "jpeg", "png", "webp", "gif"];
      if (!allowedExts.includes(ext)) {
        continue;
      }

      const fileName = `${randomUUID()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      savedPaths.push(`/uploads/${slug}/${fileName}`);
    }

    return NextResponse.json({ paths: savedPaths });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Eroare la încărcare." },
      { status: 500 }
    );
  }
}
