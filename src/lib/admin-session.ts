/**
 * Edge-safe admin session tokens (Web Crypto only — no Node `crypto`).
 * Used by middleware + Node API routes.
 *
 * Format: v1.<exp>.<nonce>.<sigBase64Url>
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1"
  );
}

/**
 * Dynamic `process.env[name]` — Next may inline `process.env.FOO` at build time.
 * Vercel Sensitive secrets are absent during build, so a static read becomes "".
 */
function envTrim(name: string): string {
  return String(process.env[name] ?? "").trim();
}

/** Dedicated secret only in production; password/dev fallback local only. */
function sessionSecret(): string | null {
  const dedicated = envTrim("ADMIN_SESSION_SECRET");
  if (dedicated) return dedicated;
  if (isProductionRuntime()) return null;
  return envTrim("ADMIN_PASSWORD") || "dev-insecure-session-secret";
}

export function hasAdminSessionSecret(): boolean {
  return Boolean(sessionSecret());
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

async function hmacBase64Url(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return bytesToBase64Url(new Uint8Array(sig));
}

export async function createAdminSessionToken(
  ttlSec = SESSION_MAX_AGE
): Promise<string> {
  const secret = sessionSecret();
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET lipsă — obligatoriu în production/Vercel."
    );
  }
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const nonceBytes = new Uint8Array(8);
  crypto.getRandomValues(nonceBytes);
  const nonce = Array.from(nonceBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const payload = `v1.${exp}.${nonce}`;
  const sig = await hmacBase64Url(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  // Legacy flat cookie removed — never accept "authenticated"

  const secret = sessionSecret();
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return false;
  const [ver, expStr, nonce, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  if (!nonce || !sig) return false;

  const payload = `${ver}.${expStr}.${nonce}`;
  const expected = await hmacBase64Url(payload, secret);
  return timingSafeEqualStr(sig, expected);
}
