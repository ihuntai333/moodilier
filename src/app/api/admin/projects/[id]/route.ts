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
import { revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import {
  ensureProjectInCms,
  getAdminProjectById,
  normalizeAdminImages,
} from "@/lib/admin-projects";
import fs from "fs";
import path from "path";

function bustProjectsCache() {
  try {
    revalidateTag("projects", "max");
  } catch {
    /* ignore */
  }
}

function isCatalogOrSlugId(id: string): boolean {
  const decoded = decodeURIComponent(id || "");
  return (
    decoded.startsWith("catalog:") ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      decoded
    )
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Catalog / slug: materialize into CMS so edit saves against a real UUID
    if (isCatalogOrSlugId(id)) {
      const { project, error } = await ensureProjectInCms(id);
      if (error && !project) {
        return NextResponse.json({ error }, { status: 404 });
      }
      if (!project) {
        return NextResponse.json(
          { error: "Proiectul nu a fost găsit." },
          { status: 404 }
        );
      }
      return NextResponse.json(project);
    }

    const project = await getAdminProjectById(id);
    if (!project) {
      return NextResponse.json(
        { error: "Proiectul nu a fost găsit." },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    let cmsId = decodeURIComponent(id);

    // Catalog / slug IDs must become real CMS UUIDs before update
    if (isCatalogOrSlugId(cmsId)) {
      const { project, error } = await ensureProjectInCms(cmsId);
      if (!project || String(project.id).startsWith("catalog:")) {
        return NextResponse.json(
          { error: error || "Proiectul nu a fost găsit." },
          { status: 404 }
        );
      }
      cmsId = project.id;
    }

    const updatePayload: Record<string, unknown> = {};
    if (body.title !== undefined) updatePayload.title = body.title;
    if (body.slug !== undefined) updatePayload.slug = body.slug;
    if (body.category !== undefined) updatePayload.category = body.category;
    if (body.location !== undefined) updatePayload.location = body.location;
    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.coverImage !== undefined) updatePayload.cover_image = body.coverImage;
    if (body.cover_image !== undefined) updatePayload.cover_image = body.cover_image;
    if (body.images !== undefined) {
      updatePayload.images = normalizeAdminImages(
        body.images,
        typeof body.title === "string" ? body.title : ""
      );
    }
    if (body.gallery !== undefined) updatePayload.gallery = body.gallery;
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

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update(updatePayload)
      .eq("id", cmsId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Proiectul nu a fost găsit." },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    bustProjectsCache();
    const normalized = await getAdminProjectById(String(data.id));
    return NextResponse.json(normalized || data);
  } catch (error) {
    console.error("Project PATCH error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decoded = decodeURIComponent(id);

    if (decoded.startsWith("catalog:")) {
      return NextResponse.json(
        { error: "Proiectele din catalog nu pot fi șterse (doar ascunse din CMS)." },
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

    bustProjectsCache();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Project DELETE error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
