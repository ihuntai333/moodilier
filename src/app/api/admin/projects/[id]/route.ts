/*
 * Run in Supabase SQL editor before using new fields:
 *
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS status text DEFAULT 'published';
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS year text;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS surface text;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_title text;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_description text;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS video text;
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  decodeProjectParam,
  ensureProjectInCms,
  getAdminProjectById,
  normalizeAdminImages,
  parseProjectId,
  adminProjectFromRow,
  updateProjectRow,
} from "@/lib/admin-projects";
import { bustProjectCaches } from "@/lib/project-cache";
import { sanitizeGallery, sanitizeMediaUrl, extractMediaUrl } from "@/lib/media-url";
import { requireAdminApi, requireAdminMutation } from "@/lib/admin-auth";
import { timeoutSignal } from "@/lib/with-timeout";
import fs from "fs";
import path from "path";

function isCatalogOrSlugId(id: string): boolean {
  return parseProjectId(id).kind !== "uuid";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;
  try {
    const { id: rawId } = await params;
    const id = decodeProjectParam(rawId);

    // Load only — do not require CMS insert on open (Supabase blips caused "fetch failed")
    const project = await getAdminProjectById(id);
    if (project) {
      return NextResponse.json(project);
    }

    return NextResponse.json(
      { error: "Proiectul nu a fost găsit." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json(
      {
        error:
          "Nu am putut încărca proiectul (serviciu temporar indisponibil).",
      },
      { status: 503 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminMutation(request);
  if (denied) return denied;

  try {
    const { id: rawId } = await params;
    const body = await request.json();

    let cmsId = decodeProjectParam(rawId);

    // Catalog / slug IDs must become real CMS UUIDs before update
    if (isCatalogOrSlugId(cmsId)) {
      const ensured = await ensureProjectInCms(cmsId);
      if (!ensured.project || String(ensured.project.id).startsWith("catalog:")) {
        return NextResponse.json(
          { error: ensured.error || "Proiectul nu a fost găsit." },
          { status: 503 }
        );
      }
      cmsId = ensured.project.id;
    }

    const updatePayload: Record<string, unknown> = {};
    if (body.title !== undefined) updatePayload.title = body.title;
    if (body.slug !== undefined) updatePayload.slug = body.slug;
    if (body.category !== undefined) updatePayload.category = body.category;
    if (body.location !== undefined) updatePayload.location = body.location;
    if (body.description !== undefined) updatePayload.description = body.description;

    const requestedCover =
      sanitizeMediaUrl(body.coverImage) || sanitizeMediaUrl(body.cover_image);

    if (body.images !== undefined) {
      const urls = normalizeAdminImages(
        body.images,
        typeof body.title === "string" ? body.title : ""
      )
        .map((img) => extractMediaUrl(img.url) || sanitizeMediaUrl(img.url))
        .filter(Boolean);
      const cover = requestedCover || urls[0] || "";
      // WordPress featured image: cover_image is the card on homepage + /proiecte.
      updatePayload.cover_image = cover;
      updatePayload.images = cover
        ? [cover, ...urls.filter((u) => u !== cover)]
        : urls;
    } else if (body.coverImage !== undefined || body.cover_image !== undefined) {
      updatePayload.cover_image = requestedCover;
    }

    if (body.gallery !== undefined) {
      const gallery = sanitizeGallery(body.gallery);
      const cover =
        (typeof updatePayload.cover_image === "string" &&
          updatePayload.cover_image) ||
        requestedCover;
      updatePayload.gallery = cover
        ? [
            ...gallery.filter((g) => g.url === cover),
            ...gallery.filter((g) => g.url !== cover),
          ]
        : gallery;
    }
    if (body.rooms !== undefined) updatePayload.rooms = body.rooms;
    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.year !== undefined) updatePayload.year = body.year || null;
    if (body.surface !== undefined) updatePayload.surface = body.surface || null;
    if (body.seoTitle !== undefined) updatePayload.seo_title = body.seoTitle || null;
    if (body.seo_title !== undefined) updatePayload.seo_title = body.seo_title || null;
    if (body.seoDescription !== undefined)
      updatePayload.seo_description = body.seoDescription || null;
    if (body.seo_description !== undefined)
      updatePayload.seo_description = body.seo_description || null;
    if (body.isFeatured !== undefined) updatePayload.is_featured = body.isFeatured;
    if (body.is_featured !== undefined) updatePayload.is_featured = body.is_featured;
    if (body.video !== undefined) updatePayload.video = body.video || null;
    updatePayload.updated_at = new Date().toISOString();

    const written = await updateProjectRow(cmsId, updatePayload);
    if (!written.data) {
      const message = written.error || "Eroare la salvare.";
      if (/nu a fost găsit|PGRST116/i.test(message)) {
        return NextResponse.json(
          { error: "Proiectul nu a fost găsit." },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const saved = written.data;
    const savedSlug = typeof saved.slug === "string" ? saved.slug : "";
    if (savedSlug && updatePayload.cover_image) {
      const dup: Record<string, unknown> = {
        cover_image: updatePayload.cover_image,
        updated_at: updatePayload.updated_at,
      };
      if (updatePayload.images !== undefined) dup.images = updatePayload.images;
      if (updatePayload.gallery !== undefined) dup.gallery = updatePayload.gallery;
      try {
        await supabaseAdmin
          .from("projects")
          .update(dup)
          .eq("slug", savedSlug)
          .neq("id", cmsId)
          .abortSignal(timeoutSignal(4000));
      } catch {
        /* duplicate rows are best-effort */
      }
    }

    bustProjectCaches();
    return NextResponse.json(adminProjectFromRow(saved));
  } catch (error) {
    console.error("Project PATCH error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminMutation(request);
  if (denied) return denied;

  try {
    const { id: rawId } = await params;
    const decoded = decodeProjectParam(rawId);

    if (decoded.startsWith("catalog:")) {
      return NextResponse.json(
        {
          error:
            "Proiectele din catalog nu pot fi șterse (doar ascunse din CMS).",
        },
        { status: 400 }
      );
    }

    const { data: project, error: fetchError } = await supabaseAdmin
      .from("projects")
      .select("slug")
      .eq("id", decoded)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Proiectul nu a fost găsit." },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", decoded);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (project?.slug) {
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        project.slug
      );
      try {
        if (fs.existsSync(uploadDir)) {
          fs.rmSync(uploadDir, { recursive: true, force: true });
        }
      } catch (fsError) {
        console.warn("Could not remove upload directory:", fsError);
      }
    }

    bustProjectCaches();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Project DELETE error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
