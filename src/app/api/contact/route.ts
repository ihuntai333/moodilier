import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

interface ContactFormData {
  nume: string;
  email: string;
  telefon?: string;
  mesaj: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Basic server-side validation
    if (!body.nume || body.nume.trim().length < 2) {
      return NextResponse.json(
        { error: "Câmpul 'Nume' este obligatoriu." },
        { status: 400 }
      );
    }
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Adresa de email nu este validă." },
        { status: 400 }
      );
    }
    if (!body.mesaj || body.mesaj.trim().length < 10) {
      return NextResponse.json(
        { error: "Câmpul 'Mesaj' este obligatoriu (min. 10 caractere)." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("messages")
      .insert({
        name: body.nume.trim(),
        email: body.email.trim(),
        phone: body.telefon?.trim() || null,
        message: body.mesaj.trim(),
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Contact insert error:", error);
      return NextResponse.json(
        { error: "A apărut o eroare internă. Vă rugăm încercați din nou." },
        { status: 500 }
      );
    }

    console.log("=== Moodilier — Mesaj nou de contact ===");
    console.log(`Nume:    ${body.nume}`);
    console.log(`Email:   ${body.email}`);
    console.log(`Telefon: ${body.telefon || "—"}`);
    console.log(`Mesaj:\n${body.mesaj}`);
    console.log(`Trimis:  ${data.created_at}`);
    console.log("=========================================");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "A apărut o eroare internă. Vă rugăm încercați din nou." },
      { status: 500 }
    );
  }
}
