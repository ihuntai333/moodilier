/*
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS status text DEFAULT 'published';
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS year text;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS surface text;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_title text;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_description text;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS video text;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery jsonb;
 * ALTER TABLE projects ADD COLUMN IF NOT EXISTS rooms jsonb;
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  getAdminProjectsMerged,
  normalizeAdminImages,
  syncCatalogToSupabase,
} from "@/lib/admin-projects";
import { bustProjectCaches } from "@/lib/project-cache";
import { requireAdminApi, requireAdminMutation } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const sync = request.nextUrl.searchParams.get("sync") === "1";
    let syncResult: { inserted: number; total: number; error?: string } | null =
      null;

    if (sync) {
      // Fast path: insert missing only. Heavy media backfill is ?sync=1&backfill=1
      const backfill =
        request.nextUrl.searchParams.get("backfill") === "1";
      syncResult = await syncCatalogToSupabase({ backfill });
      bustProjectCaches();
    }

    const { projects, catalogCount, cmsCount } = await getAdminProjectsMerged();

    return NextResponse.json({
      projects,
      meta: {
        total: projects.length,
        catalogCount,
        cmsCount,
        sync: syncResult,
      },
    });
  } catch (error) {
    console.error("Admin projects GET:", error);
    return NextResponse.json(
      { projects: [], meta: { total: 0, catalogCount: 0, cmsCount: 0 } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminMutation(request);
  if (denied) return denied;

  try {
    const body = await request.json();

    if (body?.action === "sync-catalog") {
      const result = await syncCatalogToSupabase({
        backfill: body?.backfill !== false,
      });
      bustProjectCaches();
      const { projects, catalogCount, cmsCount } = await getAdminProjectsMerged();
      return NextResponse.json({
        ...result,
        projects,
        meta: { total: projects.length, catalogCount, cmsCount },
      });
    }

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        title: body.title || "",
        slug: body.slug || slugify(body.title || "proiect") + "-" + Date.now(),
        category: body.category || "Rezidențial",
        location: body.location || "",
        description: body.description || "",
        cover_image: body.coverImage || body.cover_image || "",
        images: normalizeAdminImages(body.images || [], body.title || ""),
        gallery: body.gallery || [],
        rooms: body.rooms || [],
        video: body.video || null,
        status: body.status || "published",
        year: body.year || null,
        surface: body.surface || null,
        seo_title: body.seoTitle || body.seo_title || null,
        seo_description: body.seoDescription || body.seo_description || null,
        is_featured: body.isFeatured ?? body.is_featured ?? false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    bustProjectCaches();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
