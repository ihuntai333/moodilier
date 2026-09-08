/**
 * Client preview lock — OPTIONAL private preview only.
 *
 * Public by default. To re-enable a password gate for private demos, set BOTH:
 *   SITE_LOCK_FORCE=1
 *   SITE_LOCK_PASSWORD=...
 * on Vercel Preview (not Production).
 *
 * Prefer SITE_LOCK_SECRET for cookie hashing (falls back to ADMIN_SESSION_SECRET).
 */

export const SITE_LOCK_COOKIE = "moodilier_preview";
export const SITE_LOCK_PATH = "/acces";

export function isSiteLockEnabled(): boolean {
  if (process.env.SITE_LOCK_FORCE !== "1") return false;
  return Boolean(process.env.SITE_LOCK_PASSWORD?.trim());
}

export function getSiteLockPassword(): string {
  return process.env.SITE_LOCK_PASSWORD?.trim() || "";
}

function lockHashSecret(): string {
  return (
    process.env.SITE_LOCK_SECRET?.trim() ||
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    ""
  );
}

/** Stable token derived from password — stored in httpOnly cookie (not the raw password). */
export async function siteLockToken(password: string): Promise<string> {
  const secret = lockHashSecret();
  if (!secret) {
    throw new Error(
      "SITE_LOCK_SECRET or ADMIN_SESSION_SECRET required when site lock is enabled"
    );
  }
  const data = new TextEncoder().encode(`preview:${password}:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidSiteLockCookie(
  cookieValue: string | undefined
): Promise<boolean> {
  const password = getSiteLockPassword();
  if (!password || !cookieValue) return false;
  if (!lockHashSecret()) return false;
  const expected = await siteLockToken(password);
  if (cookieValue.length !== expected.length) return false;
  let ok = 0;
  for (let i = 0; i < cookieValue.length; i++) {
    ok |= cookieValue.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return ok === 0;
}
