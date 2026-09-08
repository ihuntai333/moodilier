import nodemailer from "nodemailer";
import { escapeHtml } from "@/lib/security/request";

export type ContactMailPayload = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
  to: string;
  subjectPrefix?: string;
};

export function isSmtpConfigured(): boolean {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
}

export async function sendContactNotification(
  data: ContactMailPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSmtpConfigured()) {
    return { ok: false, error: "SMTP neconfigurat (SMTP_HOST / PORT / USER / PASS)." };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST!,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER!, pass: SMTP_PASS! },
  });

  const from = process.env.SMTP_FROM ?? SMTP_USER!;
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone ?? "—");
  const safeMessage = escapeHtml(data.message);

  try {
    await transporter.sendMail({
      from: `"Moodilier Website" <${from}>`,
      to: data.to,
      replyTo: data.email,
      subject: `${data.subjectPrefix || "[Moodilier]"} Mesaj nou de la ${data.name.slice(0, 80)}`,
      html: `
<!DOCTYPE html>
<html lang="ro"><body style="font-family:Arial,sans-serif;background:#0a0a0a;color:#d4d4d4;padding:24px">
  <div style="max-width:600px;margin:0 auto">
    <div style="font-size:20px;color:#b8972e;letter-spacing:.08em;margin-bottom:16px">MOODILIER</div>
    <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#b8972e">Mesaj nou de contact</p>
    <p><strong>Nume:</strong> ${safeName}</p>
    <p><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#b8972e">${safeEmail}</a></p>
    <p><strong>Telefon:</strong> ${safePhone}</p>
    <div style="background:#111;border-left:2px solid #b8972e;padding:16px;white-space:pre-wrap;line-height:1.7">${safeMessage}</div>
    <p style="margin-top:20px;font-size:12px;color:#888">${escapeHtml(
      new Date(data.createdAt).toLocaleString("ro-RO", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Bucharest",
      })
    )}</p>
  </div>
</body></html>`,
      text: [
        `Mesaj nou — Moodilier`,
        `Nume: ${data.name}`,
        `Email: ${data.email}`,
        `Telefon: ${data.phone ?? "—"}`,
        ``,
        data.message,
        ``,
        data.createdAt,
      ].join("\n"),
    });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Trimitere eșuată";
    return { ok: false, error: msg };
  }
}

export async function sendSmtpTest(
  to: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  return sendContactNotification({
    name: "Test Moodilier Admin",
    email: to,
    phone: null,
    message:
      "Acesta este un email de test din panoul Admin → Setări. Dacă îl primești, SMTP și formularul de contact sunt configurate corect.",
    createdAt: new Date().toISOString(),
    to,
  });
}
