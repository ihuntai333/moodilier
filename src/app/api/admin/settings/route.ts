import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// The canonical list of settings keys with their defaults
const SETTINGS_DEFAULTS: Record<string, string> = {
  ga4Id: "",
  phone: "",
  email: "",
  address: "",
  instagram: "",
  facebook: "",
  whatsapp: "",
  siteTitle: "Moodilier",
  metaDescription: "",
};

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("settings")
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform [{key, value}, ...] → { ga4Id: '', phone: '', ... }
    const settings: Record<string, string> = { ...SETTINGS_DEFAULTS };
    for (const row of data ?? []) {
      settings[row.key] = row.value ?? "";
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: Record<string, string> = await request.json();

    // Upsert each key-value pair into the settings table
    const upserts = Object.entries(body).map(([key, value]) =>
      supabaseAdmin
        .from("settings")
        .upsert({ key, value: String(value ?? "") }, { onConflict: "key" })
    );

    const results = await Promise.all(upserts);
    for (const { error } of results) {
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Re-fetch and return the full settings object
    const { data, error: fetchError } = await supabaseAdmin
      .from("settings")
      .select("*");

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const settings: Record<string, string> = { ...SETTINGS_DEFAULTS };
    for (const row of data ?? []) {
      settings[row.key] = row.value ?? "";
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings PATCH error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
