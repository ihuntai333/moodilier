import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

    if (projectsError) {
      return NextResponse.json({ error: projectsError.message }, { status: 500 });
    }
    if (unreadError) {
      return NextResponse.json({ error: unreadError.message }, { status: 500 });
    }
    if (recentError) {
      return NextResponse.json({ error: recentError.message }, { status: 500 });
    }

    return NextResponse.json({
      totalProjects: totalProjects ?? 0,
      unreadMessages: unreadMessages ?? 0,
      recentMessages: recentMessages ?? [],
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
