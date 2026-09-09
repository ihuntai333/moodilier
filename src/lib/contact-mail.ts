import nodemailer from "nodemailer";
import { escapeHtml } from "@/lib/security/request";

/** Form / department topics for routing + branded mail. */
export type ContactTopic = "mobilier" | "draperii";

export const CONTACT_INBOX = {
  mobilier: "ofertare@moodilier.com",
  draperii: "draperii@moodilier.com",
} as const;

export type ContactMailPayload = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
  topic?: ContactTopic | string | null;
  /** Override inbox — otherwise resolved from topic */
  to?: string;
};

export function resolveContactTopic(
  raw: string | null | undefined
): ContactTopic {
  const t = String(raw || "")
    .trim()
    .toLowerCase();
  if (
    t === "draperii" ||
    t === "fabrics" ||
    t === "perdele" ||
    t === "perdele-draperii"
  ) {
    return "draperii";
  }
  return "mobilier";
}

export function resolveContactInbox(topic: ContactTopic): string {
  if (topic === "draperii") {
    return (
      process.env.CONTACT_DRAPERII_EMAIL?.trim() || CONTACT_INBOX.draperii
    );
  }
  return (
    process.env.CONTACT_MOBILIER_EMAIL?.trim() ||
    process.env.CONTACT_NOTIFY_EMAIL?.trim() ||
    CONTACT_INBOX.mobilier
  );
}

export function isSmtpConfigured(): boolean {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
}

function topicCopy(topic: ContactTopic) {
  if (topic === "draperii") {
    return {
      brandLine: "PERDELE ȘI DRAPERII",
      inboxLabel: "Cerere ofertă — perdele & draperii",
      subject: (name: string) =>
        `[Perdele & draperii] Cerere ofertă de la ${name.slice(0, 80)}`,
      fromName: "Moodilier — Perdele și draperii",
      staffIntro:
        "Ai primit o cerere de ofertă pentru perdele, draperii sau sisteme de umbrire.",
      autoReplySubject: "Am primit cererea ta — Perdele și draperii | Moodilier",
      autoReplyBody:
        "Mulțumim pentru mesaj. Echipa Moodilier — Perdele și draperii — te va contacta în curând pe email sau telefon, legat de solicitarea ta.",
    };
  }
  return {
    brandLine: "MOODILIER",
    inboxLabel: "Cerere ofertă — mobilier la comandă",
    subject: (name: string) =>
      `[Mobilier] Cerere ofertă de la ${name.slice(0, 80)}`,
    fromName: "Moodilier — Ofertare",
    staffIntro:
      "Ai primit o cerere de ofertă pentru mobilier premium la comandă.",
    autoReplySubject: "Am primit mesajul tău — Moodilier",
    autoReplyBody:
      "Mulțumim pentru mesaj. Echipa Moodilier te va contacta în cel mult 24 de ore lucrătoare legat de proiectul tău de mobilier.",
  };
}

function buildStaffHtml(data: {
  topic: ContactTopic;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}) {
  const copy = topicCopy(data.topic);
  const accent = data.topic === "draperii" ? "#c9a984" : "#b8972e";
  return `<!DOCTYPE html>
<html lang="ro"><body style="margin:0;padding:0;background:#0a0a0a;color:#d4d4d4;font-family:Georgia,'Times New Roman',serif">
  <div style="max-width:600px;margin:0 auto;padding:28px 20px">
    <div style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${accent};margin-bottom:10px">${escapeHtml(copy.brandLine)}</div>
    <div style="height:1px;background:linear-gradient(90deg,${accent},transparent);margin-bottom:22px"></div>
    <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${accent};margin:0 0 12px">${escapeHtml(copy.inboxLabel)}</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#cfcfcf;margin:0 0 20px">${escapeHtml(copy.staffIntro)}</p>
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;margin-bottom:18px">
      <tr><td style="padding:8px 0;color:#888;width:88px">Nume</td><td style="padding:8px 0;color:#eee">${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(data.email)}" style="color:${accent}">${escapeHtml(data.email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#888">Telefon</td><td style="padding:8px 0;color:#eee">${escapeHtml(data.phone)}</td></tr>
    </table>
    <div style="background:#111;border-left:2px solid ${accent};padding:16px 18px;white-space:pre-wrap;line-height:1.7;font-family:Arial,sans-serif;font-size:14px;color:#ddd">${escapeHtml(data.message)}</div>
    <p style="margin-top:22px;font-family:Arial,sans-serif;font-size:12px;color:#777">${escapeHtml(
      new Date(data.createdAt).toLocaleString("ro-RO", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Bucharest",
      })
    )}</p>
  </div>
</body></html>`;
}

function buildAutoReplyHtml(data: {
  topic: ContactTopic;
  name: string;
}) {
  const copy = topicCopy(data.topic);
  const accent = data.topic === "draperii" ? "#c9a984" : "#b8972e";
  const first = data.name.split(/\s+/)[0] || data.name;
  return `<!DOCTYPE html>
<html lang="ro"><body style="margin:0;padding:0;background:#f7f5f2;color:#222;font-family:Georgia,'Times New Roman',serif">
  <div style="max-width:560px;margin:0 auto;padding:32px 22px">
    <div style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${accent};margin-bottom:10px">${escapeHtml(copy.brandLine)}</div>
    <div style="height:1px;background:linear-gradient(90deg,${accent},transparent);margin-bottom:22px"></div>
    <p style="font-size:22px;margin:0 0 14px;line-height:1.25">Salut, ${escapeHtml(first)}.</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#444;margin:0 0 18px">${escapeHtml(copy.autoReplyBody)}</p>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#777;margin:0">Cu drag,<br/>Echipa Moodilier</p>
  </div>
</body></html>`;
}

async function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  return nodemailer.createTransport({
    host: SMTP_HOST!,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER!, pass: SMTP_PASS! },
  });
}

/**
 * Sends staff notification (+ optional customer auto-reply) with topic routing.
 */
export async function sendContactNotification(
  data: ContactMailPayload
): Promise<{ ok: true; to: string } | { ok: false; error: string }> {
  if (!isSmtpConfigured()) {
    return { ok: false, error: "SMTP neconfigurat (SMTP_HOST / PORT / USER / PASS)." };
  }

  const topic = resolveContactTopic(data.topic);
  const copy = topicCopy(topic);
  const to = data.to?.trim() || resolveContactInbox(topic);
  const fromAddr = process.env.SMTP_FROM ?? process.env.SMTP_USER!;
  const phone = data.phone?.trim() || "—";

  try {
    const transporter = await getTransporter();

    await transporter.sendMail({
      from: `"${copy.fromName}" <${fromAddr}>`,
      to,
      replyTo: data.email,
      subject: copy.subject(data.name),
      html: buildStaffHtml({
        topic,
        name: data.name,
        email: data.email,
        phone,
        message: data.message,
        createdAt: data.createdAt,
      }),
      text: [
        copy.inboxLabel,
        ``,
        `Nume: ${data.name}`,
        `Email: ${data.email}`,
        `Telefon: ${phone}`,
        ``,
        data.message,
        ``,
        data.createdAt,
      ].join("\n"),
    });

    // Personalized confirmation to the visitor (best-effort)
    if (process.env.CONTACT_AUTO_REPLY !== "0") {
      try {
        await transporter.sendMail({
          from: `"${copy.fromName}" <${fromAddr}>`,
          to: data.email,
          replyTo: to,
          subject: copy.autoReplySubject,
          html: buildAutoReplyHtml({ topic, name: data.name }),
          text: [
            `Salut, ${data.name.split(/\s+/)[0] || data.name}.`,
            ``,
            copy.autoReplyBody,
            ``,
            `Echipa Moodilier`,
          ].join("\n"),
        });
      } catch (err) {
        console.error("Contact auto-reply failed:", err);
      }
    }

    return { ok: true, to };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Trimitere eșuată";
    return { ok: false, error: msg };
  }
}

export async function sendSmtpTest(
  to: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await sendContactNotification({
    name: "Test Moodilier Admin",
    email: to,
    phone: null,
    message:
      "Acesta este un email de test din panoul Admin → Setări. Dacă îl primești, SMTP și formularul de contact sunt configurate corect.",
    createdAt: new Date().toISOString(),
    topic: "mobilier",
    to,
  });
  if (!result.ok) return result;
  return { ok: true };
}
