import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

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

function localStats() {
  const db = readDb();
  const recent = [...db.messages]
    .sort((a, b) => +new Date(b.data) - +new Date(a.data))
    .slice(0, 5);
  return {
    totalProjects: db.projects.length,
    unreadMessages: db.messages.filter((m) => !m.read).length,
    totalImages: db.projects.reduce((n, p) => n + (p.images?.length ?? 0), 0),
    lastUpdated: db.projects[0]?.updatedAt ?? null,
    recentMessages: recent,
    source: "local",
  };
}

export async function GET() {
  try {
    const [
      { count: totalProjects, error: projectsError },
      { count: unreadMessages, error: unreadError },
      { data: recentMessages, error: recentError },
    ] = await Promise.all([
      supabaseAdmin
        .from("projects")
        .select("id", { count: "exact", head: true }),
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

    if (projectsError || unreadError || recentError) {
      console.warn("Stats supabase fallback:", projectsError || unreadError || recentError);
      return NextResponse.json(localStats());
    }

    return NextResponse.json({
      totalProjects: totalProjects ?? 0,
      unreadMessages: unreadMessages ?? 0,
      totalImages: 0,
      lastUpdated: null,
      recentMessages: (recentMessages ?? []).map((row) =>
        mapMessage(row as DbMessage)
      ),
      source: "supabase",
    });
  } catch (error) {
    console.warn("Stats fetch failed, using local db:", error);
    return NextResponse.json(localStats());
  }
}
