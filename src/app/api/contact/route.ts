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
  /** Client form open timestamp (ms) — required */
  _t?: number;
  /** Optional topic — fabrics routes to draperii mailbox */
  topic?: string;
};

const MAX = {
  nume: 120,
  email: 200,
  telefon: 40,
  mesaj: 4000,
};

function isServerlessProd(): boolean {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
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

    const body = (await request.json()) as ContactBody;

    // Honeypot — bots fill hidden fields
    if (
      (body.website && body.website.trim()) ||
      (body.company && body.company.trim())
    ) {
      return NextResponse.json({ ok: true });
    }

    // Time trap — required; form must be open 2s–2h
    const opened = Number(body._t);
    if (!Number.isFinite(opened)) {
      return NextResponse.json({ ok: true }); // silent drop bots without _t
    }
    const age = Date.now() - opened;
    if (age < 2000 || age > 2 * 60 * 60 * 1000) {
      return NextResponse.json({ ok: true });
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
    const topic = String(body.topic ?? "").trim().toLowerCase();
    const isFabrics = topic === "fabrics" || topic === "draperii";
    const messageBody = isFabrics
      ? `[Moodilier Fabrics — cerere ofertă draperii]\n\n${mesaj}`
      : mesaj;
    let saved = false;

    if (hasSupabaseConfig) {
      const { error } = await supabaseAdmin.from("messages").insert({
        name: nume,
        email,
        phone: telefon || null,
        message: messageBody,
        is_read: false,
      });
      if (error) {
        console.error("Contact insert error:", error);
      } else {
        saved = true;
      }
    }

    if (!saved) {
      if (isServerlessProd()) {
        return NextResponse.json(
          { error: "Nu am putut salva mesajul. Încercați din nou." },
          { status: 503 }
        );
      }
      await appendLocalMessage({
        name: nume,
        email,
        phone: telefon || null,
        message: messageBody,
        createdAt,
      });
      saved = true;
    }

    const notifyTo = isFabrics
      ? "draperii@moodilier.com"
      : settings.notifyEmail || settings.email;
    const mail = await sendContactNotification({
      name: nume,
      email,
      phone: telefon || null,
      message: messageBody,
      createdAt,
      to: notifyTo,
      subjectPrefix: isFabrics ? "[Moodilier Fabrics]" : "[Moodilier]",
    });
    if (!mail.ok) {
      console.error("Contact email not sent:", mail.error);
    }

    return NextResponse.json({
      ok: true,
      message: settings.successMessage,
      notified: mail.ok,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "A apărut o eroare internă. Vă rugăm încercați din nou." },
      { status: 500 }
    );
  }
}
