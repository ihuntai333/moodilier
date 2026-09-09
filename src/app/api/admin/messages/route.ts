import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi } from "@/lib/admin-auth";
import { mapAdminMessage, type DbMessage } from "@/lib/admin-messages";

export async function GET(request: NextRequest) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Messages supabase fallback:", error.message);
      const { readDb } = await import("@/lib/db");
      return NextResponse.json(readDb().messages);
    }

    return NextResponse.json(
      (data ?? []).map((row) => mapAdminMessage(row as DbMessage))
    );
  } catch (error) {
    console.warn("Messages fetch failed, using local db:", error);
    const { readDb } = await import("@/lib/db");
    return NextResponse.json(readDb().messages);
  }
}
