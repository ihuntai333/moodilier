import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { SETTINGS_STRING_DEFAULTS } from "@/lib/site-settings";
import { requireAdminApi, requireAdminMutation } from "@/lib/admin-auth";

function rowsToSettings(
  data: { key?: string; value?: string | null }[] | null
): Record<string, string> {
  const settings: Record<string, string> = { ...SETTINGS_STRING_DEFAULTS };
  for (const row of data ?? []) {
    if (row.key) settings[row.key] = row.value ?? "";
  }
  return settings;
}

export async function GET(request: NextRequest) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const { data, error } = await supabaseAdmin.from("settings").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(rowsToSettings(data));
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const denied = await requireAdminMutation(request);
  if (denied) return denied;

  try {
    const body: Record<string, string> = await request.json();

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

    try {
      revalidateTag("site-chrome", "max");
      revalidateTag("contact-settings", "max");
    } catch {
      /* older signature fallback ignored */
    }

    const { data, error: fetchError } = await supabaseAdmin
      .from("settings")
      .select("*");

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json(rowsToSettings(data));
  } catch (error) {
    console.error("Settings PATCH error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
