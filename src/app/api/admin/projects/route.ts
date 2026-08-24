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

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Projects supabase fallback:", error.message);
      const { readDb } = await import("@/lib/db");
      return NextResponse.json(readDb().projects);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.warn("Projects fetch failed, using local db:", error);
    const { readDb } = await import("@/lib/db");
    return NextResponse.json(readDb().projects);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        title: body.title || "",
        slug: body.slug || slugify(body.title || "proiect") + "-" + Date.now(),
        category: body.category || "Rezidențial",
        location: body.location || "",
        description: body.description || "",
        cover_image: body.coverImage || body.cover_image || "",
        images: body.images || [],
        video: body.video || null,
        // New fields
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

    try {
      revalidateTag("projects", "max");
    } catch {
      /* ignore */
    }

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
