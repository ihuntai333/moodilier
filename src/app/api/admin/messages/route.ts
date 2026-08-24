import { NextResponse } from "next/server";
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

export async function GET() {
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

    return NextResponse.json((data ?? []).map((row) => mapMessage(row as DbMessage)));
  } catch (error) {
    console.warn("Messages fetch failed, using local db:", error);
    const { readDb } = await import("@/lib/db");
    return NextResponse.json(readDb().messages);
  }
}
