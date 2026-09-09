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
} from "@/lib/admin-projects";
import { bustProjectCaches } from "@/lib/project-cache";
import { sanitizeGallery, sanitizeMediaUrl } from "@/lib/media-url";
import { requireAdminApi, requireAdminMutation } from "@/lib/admin-auth";
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
    if (body.coverImage !== undefined)
      updatePayload.cover_image = sanitizeMediaUrl(body.coverImage);
    if (body.cover_image !== undefined)
      updatePayload.cover_image = sanitizeMediaUrl(body.cover_image);
    if (body.images !== undefined) {
      updatePayload.images = normalizeAdminImages(
        body.images,
        typeof body.title === "string" ? body.title : ""
      ).filter((img) => sanitizeMediaUrl(img.url));
    }
    if (body.gallery !== undefined) updatePayload.gallery = sanitizeGallery(body.gallery);
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

    let { data, error } = await supabaseAdmin
      .from("projects")
      .update(updatePayload)
      .eq("id", cmsId)
      .select()
      .single();

    if (error && error.code !== "PGRST116") {
      const core: Record<string, unknown> = {};
      for (const key of [
        "title",
        "slug",
        "category",
        "location",
        "description",
        "cover_image",
        "images",
        "video",
      ]) {
        if (updatePayload[key] !== undefined) core[key] = updatePayload[key];
      }
      const retry = await supabaseAdmin
        .from("projects")
        .update(core)
        .eq("id", cmsId)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Proiectul nu a fost găsit." },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    bustProjectCaches();
    const normalized = await getAdminProjectById(String(data.id));
    return NextResponse.json(normalized || data);
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
