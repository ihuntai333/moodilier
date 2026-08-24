import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";
import { sendContactNotification } from "@/lib/contact-mail";
import { getContactFormSettings } from "@/lib/contact-settings";
import { assertSameOrigin } from "@/lib/security/request";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { appendLocalMessage } from "@/lib/contact-store";

type ContactBody = {
  nume?: string;
  email?: string;
  telefon?: string;
  mesaj?: string;
  /** Honeypot — must stay empty */
  website?: string;
  company?: string;
  /** Client form open timestamp (ms) */
  _t?: number;
};

const MAX = {
  nume: 120,
  email: 200,
  telefon: 40,
  mesaj: 4000,
};

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

    const body = (await request.json()) as ContactBody;

    // Honeypot — bots fill hidden fields
    if ((body.website && body.website.trim()) || (body.company && body.company.trim())) {
      // Fake success so bots don't retry
      return NextResponse.json({ ok: true });
    }

    // Time trap — form must be open at least 2s (humans), max 2h
    const opened = Number(body._t);
    if (Number.isFinite(opened)) {
      const age = Date.now() - opened;
      if (age < 2000 || age > 2 * 60 * 60 * 1000) {
        return NextResponse.json({ ok: true }); // silent drop
      }
    }

    const nume = String(body.nume ?? "").trim().slice(0, MAX.nume);
    const email = String(body.email ?? "").trim().slice(0, MAX.email);
    const telefon = String(body.telefon ?? "").trim().slice(0, MAX.telefon);
    const mesaj = String(body.mesaj ?? "").trim().slice(0, MAX.mesaj);

    if (nume.length < 2) {
      return NextResponse.json(
        { error: "Câmpul 'Nume' este obligatoriu." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Adresa de email nu este validă." },
        { status: 400 }
      );
    }
    if (settings.requirePhone && telefon.length < 6) {
      return NextResponse.json(
        { error: "Telefonul este obligatoriu." },
        { status: 400 }
      );
    }
    if (mesaj.length < 10) {
      return NextResponse.json(
        { error: "Câmpul 'Mesaj' este obligatoriu (min. 10 caractere)." },
        { status: 400 }
      );
    }

    const createdAt = new Date().toISOString();
    let saved = false;

    if (hasSupabaseConfig) {
      const { error } = await supabaseAdmin.from("messages").insert({
        name: nume,
        email,
        phone: telefon || null,
        message: mesaj,
        is_read: false,
      });
      if (error) {
        console.error("Contact insert error:", error);
      } else {
        saved = true;
      }
    }

    if (!saved) {
      await appendLocalMessage({
        name: nume,
        email,
        phone: telefon || null,
        message: mesaj,
        createdAt,
      });
      saved = true;
    }

    const notifyTo = settings.notifyEmail || settings.email;
    try {
      await sendContactNotification({
        name: nume,
        email,
        phone: telefon || null,
        message: mesaj,
        createdAt,
        to: notifyTo,
      });
    } catch (emailError) {
      console.error("Email notification failed (non-fatal):", emailError);
    }

    return NextResponse.json({
      ok: true,
      message: settings.successMessage,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "A apărut o eroare internă. Vă rugăm încercați din nou." },
      { status: 500 }
    );
  }
}
