import { NextRequest, NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/admin-auth";
import { sendContactNotification, isSmtpConfigured } from "@/lib/contact-mail";
import { resolveContactInbox } from "@/lib/contact-topic";
import { getContactFormSettings } from "@/lib/contact-settings";

/** Admin: send test emails to both department inboxes. */
export async function POST(request: NextRequest) {
  const denied = await requireAdminMutation(request);
  if (denied) return denied;

  try {
    if (!isSmtpConfigured()) {
      return NextResponse.json(
        { error: "SMTP neconfigurat (SMTP_HOST / PORT / USER / PASS)." },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      to?: string;
      topic?: string;
    };
    const settings = await getContactFormSettings();
    const topic = body.topic === "draperii" ? "draperii" : "mobilier";
    const to =
      (body.to || "").trim() ||
      (topic === "draperii"
        ? resolveContactInbox("draperii")
        : settings.notifyEmail?.trim() || resolveContactInbox("mobilier"));

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return NextResponse.json(
        { error: "Adresă de notificare invalidă. Seteaz-o în Setări." },
        { status: 400 }
      );
    }

    const result = await sendContactNotification({
      name: "Test Moodilier Admin",
      email: to,
      phone: null,
      message:
        topic === "draperii"
          ? "Email de test — Perdele și draperii. Dacă îl primești, formularul de draperii e configurat."
          : "Email de test — Mobilier. Dacă îl primești, formularul de contact e configurat.",
      createdAt: new Date().toISOString(),
      topic,
      to,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }
    return NextResponse.json({ ok: true, to, topic });
  } catch (err) {
    console.error("contact-test:", err);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
