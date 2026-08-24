import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";
import { isSmtpConfigured } from "@/lib/contact-mail";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  const authenticated = verifyAdminSessionToken(session?.value);
  return NextResponse.json({
    authenticated,
    smtpConfigured: isSmtpConfigured(),
  });
}
