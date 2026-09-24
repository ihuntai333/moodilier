import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { SETTINGS_STRING_DEFAULTS } from "@/lib/site-settings";
import { requireAdminApi, requireAdminMutation } from "@/lib/admin-auth";
import {
  isValidGa4Id,
  isValidPixelId,
  isValidVerificationToken,
} from "@/lib/security/sanitize";

const SETTINGS_KEYS = new Set(Object.keys(SETTINGS_STRING_DEFAULTS));

function sanitizeSettingsBody(
  body: Record<string, unknown>
): { ok: true; values: Record<string, string> } | { ok: false; error: string } {
  const values: Record<string, string> = {};
  for (const [key, raw] of Object.entries(body)) {
    if (!SETTINGS_KEYS.has(key)) continue;
    const value = String(raw ?? "");
    if (key === "ga4Id" && value.trim() && !isValidGa4Id(value)) {
      return { ok: false, error: "GA4 ID invalid. Format: G-XXXXXXXX." };
    }
    if (key === "pixelId" && value.trim() && !isValidPixelId(value)) {
      return {
        ok: false,
        error: "Facebook Pixel ID invalid. Folosiți doar cifre.",
      };
    }
    if (
      (key === "googleSiteVerification" ||
        key === "facebookDomainVerification") &&
      value.trim() &&
      !isValidVerificationToken(value)
    ) {
      return { ok: false, error: "Token de verificare invalid." };
    }
    if (key === "pixelEnabled") {
      values[key] = value === "0" ? "0" : "1";
      continue;
    }
    values[key] = value;
  }
  return { ok: true, values };
}

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
    const body: Record<string, unknown> = await request.json();
    const sanitized = sanitizeSettingsBody(body);
    if (!sanitized.ok) {
      return NextResponse.json({ error: sanitized.error }, { status: 400 });
    }

    const upserts = Object.entries(sanitized.values).map(([key, value]) =>
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
