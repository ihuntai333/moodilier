import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { sendSmtpTest } from "@/lib/contact-mail";
import { assertSameOrigin } from "@/lib/security/request";
import { getContactFormSettings } from "@/lib/contact-settings";

/** Admin: send a test email to verify SMTP + notify address. */
export async function POST(request: NextRequest) {
  const denied = requireAdminApi(request);
  if (denied) return denied;
  const originFail = assertSameOrigin(request);
  if (originFail) return originFail;

  try {
    const body = (await request.json().catch(() => ({}))) as { to?: string };
    const settings = await getContactFormSettings();
    const to = (body.to || settings.notifyEmail || "").trim();
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return NextResponse.json(
        { error: "Adresă de notificare invalidă. Seteaz-o în Setări." },
        { status: 400 }
      );
    }

    const result = await sendSmtpTest(to);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }
    return NextResponse.json({ ok: true, to });
  } catch (err) {
    console.error("contact-test:", err);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
