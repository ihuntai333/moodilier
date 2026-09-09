import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";
import {
  resolveContactInbox,
  sendContactNotification,
} from "@/lib/contact-mail";
import { getContactFormSettings } from "@/lib/contact-settings";
import { assertSameOrigin } from "@/lib/security/request";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { appendLocalMessage } from "@/lib/contact-store";
import { validateContactInput } from "@/lib/contact-validate";

function isServerlessProd(): boolean {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

async function saveLead(row: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
}): Promise<boolean> {
  if (hasSupabaseConfig) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { error } = await supabaseAdmin.from("messages").insert({
        name: row.name,
        email: row.email,
        phone: row.phone,
        message: row.message,
        is_read: false,
      });
      if (!error) return true;
      console.error("Contact insert error:", error);
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    }
  }

  if (isServerlessProd()) return false;

  await appendLocalMessage({
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    createdAt: row.createdAt,
  });
  return true;
}

export async function POST(request: NextRequest) {
  const originFail = assertSameOrigin(request);
  if (originFail) return originFail;

  const ip = clientIp(request);
  const limited = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Prea multe mesaje. Încearcă din nou peste câteva minute." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  try {
    const settings = await getContactFormSettings();
    if (!settings.enabled) {
      return NextResponse.json(
        { error: "Formularul de contact este temporar dezactivat." },
        { status: 503 }
      );
    }

    if (isServerlessProd() && !hasSupabaseConfig) {
      console.error("Contact: Supabase required in production");
      return NextResponse.json(
        { error: "Serviciul de mesaje nu este configurat." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = validateContactInput(body, {
      requirePhone: settings.requirePhone,
    });

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    if (parsed.spam) {
      return NextResponse.json({ ok: true });
    }

    const { nume, email, telefon, mesaj, topic } = parsed;
    const createdAt = new Date().toISOString();
    const topicTag =
      topic === "draperii"
        ? "[Perdele și draperii]"
        : "[Mobilier la comandă]";
    const messageBody = `${topicTag}\n\n${mesaj}`;

    const saved = await saveLead({
      name: nume,
      email,
      phone: telefon || null,
      message: messageBody,
      createdAt,
    });

    if (!saved) {
      return NextResponse.json(
        { error: "Nu am putut salva mesajul. Încercați din nou." },
        { status: 503 }
      );
    }

    const notifyTo =
      topic === "draperii"
        ? resolveContactInbox("draperii")
        : settings.notifyEmail?.trim() ||
          settings.email?.trim() ||
          resolveContactInbox("mobilier");

    const mail = await sendContactNotification({
      name: nume,
      email,
      phone: telefon || null,
      message: mesaj,
      createdAt,
      topic,
      to: notifyTo,
    });
    if (!mail.ok) {
      console.error("Contact email not sent (lead is saved):", mail.error);
    }

    return NextResponse.json({
      ok: true,
      message: settings.successMessage,
      notified: mail.ok,
      saved: true,
      topic,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "A apărut o eroare internă. Vă rugăm încercați din nou." },
      { status: 500 }
    );
  }
}
