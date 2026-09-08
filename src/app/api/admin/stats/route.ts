import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdminProjectsMerged } from "@/lib/admin-projects";

type DbMessage = {
  id: string;
  name?: string;
  nume?: string;
  email?: string;
  phone?: string;
  telefon?: string;
  message?: string;
  mesaj?: string;
  is_read?: boolean;
  read?: boolean;
  created_at?: string;
  data?: string;
};

function mapMessage(row: DbMessage) {
  return {
    id: row.id,
    nume: row.nume ?? row.name ?? "",
    email: row.email ?? "",
    telefon: row.telefon ?? row.phone ?? "",
    mesaj: row.mesaj ?? row.message ?? "",
    data: row.data ?? row.created_at ?? new Date().toISOString(),
    read: Boolean(row.read ?? row.is_read),
  };
}

export async function GET() {
  try {
    const { projects, catalogCount, cmsCount } = await getAdminProjectsMerged();
    const totalImages = projects.reduce(
      (n, p) => n + (p.images?.length ?? 0),
      0
    );
    const lastUpdated =
      projects
        .map((p) => p.updated_at || p.updatedAt)
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;

    let unreadMessages = 0;
    let recentMessages: ReturnType<typeof mapMessage>[] = [];

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
          mapMessage(row as DbMessage)
        );
      } else {
        throw unreadError || recentError;
      }
    } catch {
      const db = readDb();
      unreadMessages = db.messages.filter((m) => !m.read).length;
      recentMessages = [...db.messages]
        .sort((a, b) => +new Date(b.data) - +new Date(a.data))
        .slice(0, 5)
        .map((m) =>
          mapMessage({
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

    return NextResponse.json({
      totalProjects: projects.length,
      catalogCount,
      cmsCount,
      totalImages,
      lastUpdated,
      unreadMessages,
      recentMessages,
      source: "merged",
    });
  } catch (error) {
    console.warn("Stats fetch failed:", error);
    const db = readDb();
    return NextResponse.json({
      totalProjects: db.projects.length,
      unreadMessages: db.messages.filter((m) => !m.read).length,
      totalImages: db.projects.reduce((n, p) => n + (p.images?.length ?? 0), 0),
      lastUpdated: db.projects[0]?.updatedAt ?? null,
      recentMessages: [...db.messages]
        .sort((a, b) => +new Date(b.data) - +new Date(a.data))
        .slice(0, 5)
        .map((m) =>
          mapMessage({
            id: m.id,
            nume: m.nume,
            email: m.email,
            telefon: m.telefon,
            mesaj: m.mesaj,
            data: m.data,
            read: m.read,
          })
        ),
      source: "local",
    });
  }
}
