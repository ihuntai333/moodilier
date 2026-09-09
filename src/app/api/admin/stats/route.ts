import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { supabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";
import { getCatalogProjects } from "@/lib/admin-projects";
import { requireAdminApi } from "@/lib/admin-auth";
import { mapAdminMessage, type AdminMessage, type DbMessage } from "@/lib/admin-messages";

function localRecentMessages(): AdminMessage[] {
  const db = readDb();
  return [...db.messages]
    .sort((a, b) => +new Date(b.data) - +new Date(a.data))
    .slice(0, 5)
    .map((m) =>
      mapAdminMessage({
        id: m.id,
        nume: m.nume,
        email: m.email,
        telefon: m.telefon,
        mesaj: m.mesaj,
        data: m.data,
        read: m.read,
      })
    );
}

export async function GET(request: NextRequest) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const catalogCount = getCatalogProjects().length;
    let cmsCount = 0;
    let totalImages = 0;
    let lastUpdated: string | null = null;

    if (hasSupabaseConfig) {
      const [{ count }, { data: recentProjects }] = await Promise.all([
        supabaseAdmin
          .from("projects")
          .select("id", { count: "exact", head: true }),
        supabaseAdmin
          .from("projects")
          .select("updated_at, images, cover_image")
          .order("updated_at", { ascending: false })
          .limit(40),
      ]);
      cmsCount = count ?? 0;
      for (const row of recentProjects || []) {
        const imgs = Array.isArray(row.images) ? row.images.length : 0;
        totalImages += imgs || (row.cover_image ? 1 : 0);
        if (!lastUpdated && row.updated_at) lastUpdated = String(row.updated_at);
      }
    }

    const totalProjects = Math.max(catalogCount, cmsCount);

    let unreadMessages = 0;
    let recentMessages: AdminMessage[] = [];

    try {
      const [
        { count: unread, error: unreadError },
        { data: recent, error: recentError },
      ] = await Promise.all([
        supabaseAdmin
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("is_read", false),
        supabaseAdmin
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (!unreadError && !recentError) {
        unreadMessages = unread ?? 0;
        recentMessages = (recent ?? []).map((row) =>
          mapAdminMessage(row as DbMessage)
        );
      } else {
        throw unreadError || recentError;
      }
    } catch {
      const db = readDb();
      unreadMessages = db.messages.filter((m) => !m.read).length;
      recentMessages = localRecentMessages();
    }

    return NextResponse.json({
      totalProjects,
      catalogCount,
      cmsCount,
      totalImages,
      lastUpdated,
      unreadMessages,
      recentMessages,
      source: "light",
    });
  } catch (error) {
    console.warn("Stats fetch failed:", error);
    const db = readDb();
    return NextResponse.json({
      totalProjects: db.projects.length,
      unreadMessages: db.messages.filter((m) => !m.read).length,
      totalImages: db.projects.reduce((n, p) => n + (p.images?.length ?? 0), 0),
      lastUpdated: db.projects[0]?.updatedAt ?? null,
      recentMessages: localRecentMessages(),
      source: "local",
    });
  }
}
