import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { formatBytes, optimizeImageBuffer } from "@/lib/optimize-image";

/**
 * POST /api/admin/upload
 * Uploads images or a single project video to Supabase Storage (bucket: "project-images").
 * Images are automatically resized (max 2400px) and converted to WebP before upload.
 *
 * Setup: in Supabase dashboard → Storage → New bucket:
 *   Name: project-images
 *   Public: ✅ YES
 *
 * Form fields:
 *   - slug: string
 *   - images: File[] (jpeg/png/webp/gif)
 *   - video: File (mp4/webm/quicktime) — optional, returns { videoUrl }
 */

export const runtime = "nodejs";

const BUCKET = "project-images";
const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_VIDEO_BYTES = 80 * 1024 * 1024; // 80MB
const MAX_IMAGE_BYTES = 40 * 1024 * 1024; // 40MB raw before optimize

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const slug = (formData.get("slug") as string) || "general";
    const files = formData.getAll("images") as File[];
    const videoFile = formData.get("video") as File | null;

    const savedPaths: string[] = [];
    const optimizeStats: Array<{
      name: string;
      from: string;
      to: string;
      width: number;
      height: number;
      skipped: boolean;
    }> = [];
    let videoUrl: string | null = null;

    for (const file of files) {
      if (!file || !IMAGE_TYPES.includes(file.type)) continue;
      if (file.size > MAX_IMAGE_BYTES) {
        console.warn(`Skip oversized image ${file.name} (${file.size} bytes)`);
        continue;
      }

      const raw = Buffer.from(await file.arrayBuffer());
      const optimized = await optimizeImageBuffer(raw, file.type, {
        preset: "gallery",
      });
      const fileName = `${slug}/${randomUUID()}.${optimized.extension}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(fileName, optimized.buffer, {
          contentType: optimized.contentType,
          upsert: false,
          cacheControl: "31536000",
        });

      if (uploadError) {
        console.error("Supabase Storage upload error:", uploadError);
        continue;
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        savedPaths.push(urlData.publicUrl);
        optimizeStats.push({
          name: file.name,
          from: formatBytes(optimized.originalBytes),
          to: formatBytes(optimized.optimizedBytes),
          width: optimized.width,
          height: optimized.height,
          skipped: optimized.skipped,
        });
      }
    }

    if (videoFile && videoFile.size > 0) {
      if (!VIDEO_TYPES.includes(videoFile.type)) {
        return NextResponse.json(
          { error: "Format video neacceptat. Folosiți MP4, WebM sau MOV." },
          { status: 400 }
        );
      }
      if (videoFile.size > MAX_VIDEO_BYTES) {
        return NextResponse.json(
          { error: "Video-ul depășește 80MB. Comprimați-l și încercați din nou." },
          { status: 400 }
        );
      }

      const ext =
        videoFile.name.split(".").pop()?.toLowerCase() ||
        (videoFile.type === "video/webm" ? "webm" : "mp4");
      const fileName = `${slug}/video-${randomUUID()}.${ext}`;
      const buffer = Buffer.from(await videoFile.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(fileName, buffer, {
          contentType: videoFile.type,
          upsert: false,
          cacheControl: "31536000",
        });

      if (uploadError) {
        console.error("Supabase video upload error:", uploadError);
        return NextResponse.json(
          {
            error:
              "Video-ul nu a putut fi încărcat. Verificați bucket-ul 'project-images' și limitele de fișiere.",
          },
          { status: 500 }
        );
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      videoUrl = urlData?.publicUrl || null;
    }

    if (savedPaths.length === 0 && !videoUrl) {
      return NextResponse.json(
        {
          error:
            "Niciun fișier nu a putut fi încărcat. Verificați că bucket-ul 'project-images' există și este public în Supabase Storage.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      paths: savedPaths,
      videoUrl,
      optimize: optimizeStats,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Eroare la încărcare." }, { status: 500 });
  }
}
