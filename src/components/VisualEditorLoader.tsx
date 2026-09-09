import Script from "next/script";
import { cookies } from "next/headers";
import {
  EDITOR_COOKIE,
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

/**
 * Loads the inline visual editor only when admin_session HMAC verifies.
 * The readable ihuntev_logged_in cookie is UI-only and never authorizes alone.
 */
export default async function VisualEditorLoader() {
  const jar = await cookies();
  const sessionToken = jar.get(ADMIN_SESSION_COOKIE)?.value;
  const sessionOk = await verifyAdminSessionToken(sessionToken);
  if (!sessionOk) return null;

  const editorCookie = jar.get(EDITOR_COOKIE)?.value === "true";

  return (
    <>
      {!editorCookie ? (
        <Script id="ve-restore-editor-cookie" strategy="beforeInteractive">
          {`try{document.cookie="${EDITOR_COOKIE}=true; path=/; max-age=604800; SameSite=Lax";}catch(e){}`}
        </Script>
      ) : null}
      <Script
        src="/editor.js?v=20260909img"
        strategy="afterInteractive"
        id="moodilier-visual-editor"
      />
    </>
  );
}
