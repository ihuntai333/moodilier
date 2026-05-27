import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import nodemailer from "nodemailer";

interface ContactFormData {
  nume: string;
  email: string;
  telefon?: string;
  mesaj: string;
}

/**
 * Sends an email notification to ofertare@moodilier.com.
 * Requires SMTP env vars to be set; silently skips if they are absent.
 *
 * Env vars needed:
 *   SMTP_HOST     — e.g. smtp.gmail.com
 *   SMTP_PORT     — e.g. 587
 *   SMTP_USER     — sender account
 *   SMTP_PASS     — sender password / app-password
 *   SMTP_FROM     — "From" display (defaults to SMTP_USER)
 */
async function sendEmailNotification(data: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
}): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    // SMTP not configured — skip silently so the route still works.
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const from = process.env.SMTP_FROM ?? SMTP_USER;

  const htmlBody = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #0a0a0a; color: #d4d4d4; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .header { border-bottom: 1px solid #2a2a2a; padding-bottom: 20px; margin-bottom: 28px; }
    .brand { font-size: 22px; font-weight: 600; color: #b8972e; letter-spacing: 0.08em; }
    .badge { display: inline-block; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
             color: #b8972e; border: 1px solid #b8972e; padding: 3px 10px; margin-top: 8px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin-bottom: 4px; }
    .value { font-size: 14px; color: #f0f0f0; }
    .message-box { background: #111; border-left: 2px solid #b8972e; padding: 16px 20px;
                   font-size: 14px; color: #d4d4d4; white-space: pre-wrap; line-height: 1.7; }
    .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #2a2a2a;
              font-size: 11px; color: #555; }
    a { color: #b8972e; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand">MOODILIER</div>
      <div class="badge">Mesaj nou de contact</div>
    </div>

    <div class="field">
      <div class="label">Nume</div>
      <div class="value">${data.name}</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
    </div>
    <div class="field">
      <div class="label">Telefon</div>
      <div class="value">${data.phone ?? "—"}</div>
    </div>
    <div class="field">
      <div class="label">Mesaj</div>
      <div class="message-box">${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    </div>
    <div class="field">
      <div class="label">Data trimiterii</div>
      <div class="value">${new Date(data.createdAt).toLocaleString("ro-RO", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Bucharest",
      })}</div>
    </div>

    <div class="footer">
      SC Moodilier SRL · Bulevardul Basarabia 256, incinta FAUR, Sector 3, București<br />
      <a href="https://moodilier.ro">moodilier.ro</a> · (+40) 729 555 431
    </div>
  </div>
</body>
</html>
`;

  await transporter.sendMail({
    from: `"Moodilier Website" <${from}>`,
    to: "ofertare@moodilier.com",
    replyTo: data.email,
    subject: `[Moodilier] Mesaj nou de la ${data.name}`,
    html: htmlBody,
    text: [
      `Mesaj nou de contact — Moodilier`,
      ``,
      `Nume:    ${data.name}`,
      `Email:   ${data.email}`,
      `Telefon: ${data.phone ?? "—"}`,
      ``,
      `Mesaj:`,
      data.message,
      ``,
      `Data: ${data.createdAt}`,
      ``,
      `SC Moodilier SRL · Bulevardul Basarabia 256, incinta FAUR, Sector 3, București`,
    ].join("\n"),
  });
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

    // Send email notification (conditional on SMTP env vars being set)
    try {
      await sendEmailNotification({
        name: body.nume.trim(),
        email: body.email.trim(),
        phone: body.telefon?.trim() || null,
        message: body.mesaj.trim(),
        createdAt: data.created_at,
      });
    } catch (emailError) {
      // Email failure is non-fatal — the message is already saved in Supabase.
      console.error("Email notification failed (non-fatal):", emailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "A apărut o eroare internă. Vă rugăm încercați din nou." },
      { status: 500 }
    );
  }
}
