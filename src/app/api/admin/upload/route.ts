import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";

/**
 * POST /api/admin/upload
 * Uploads images to Supabase Storage (bucket: "project-images").
 * Returns public URLs that work anywhere — not tied to Vercel filesystem.
 *
 * Setup: in Supabase dashboard → Storage → New bucket:
 *   Name: project-images
 *   Public: ✅ YES
 */

const BUCKET = "project-images";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const slug = (formData.get("slug") as string) || "general";
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Niciun fișier primit." }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const savedPaths: string[] = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) continue;

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${slug}/${randomUUID()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase Storage upload error:", uploadError);
        // Continue with other files even if one fails
        continue;
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        savedPaths.push(urlData.publicUrl);
      }
    }

    if (savedPaths.length === 0) {
      return NextResponse.json(
        { error: "Niciun fișier nu a putut fi încărcat. Verificați că bucket-ul 'project-images' există și este public în Supabase Storage." },
        { status: 500 }
      );
    }

    return NextResponse.json({ paths: savedPaths });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Eroare la încărcare." }, { status: 500 });
  }
}
