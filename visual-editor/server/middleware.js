/**
 * Cookie auth for visual editor mutating endpoints (local Express twin).
 * Requires a cryptographically signed admin_session (same format as Next.js).
 * Never trusts ihuntev_logged_in alone.
 */
const crypto = require("crypto");

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    try {
      out[k] = decodeURIComponent(v);
    } catch {
      out[k] = v;
    }
  }
  return out;
}

function sessionSecret() {
  const dedicated = (process.env.ADMIN_SESSION_SECRET || "").trim();
  if (dedicated) return dedicated;
  if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
    return null;
  }
  return (process.env.ADMIN_PASSWORD || "").trim() || "dev-insecure-session-secret";
}

function verifyAdminSessionToken(token) {
  if (!token) return false;
  const secret = sessionSecret();
  if (!secret) return false;
  const parts = String(token).split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return false;
  const [ver, expStr, nonce, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  if (!nonce || !sig) return false;
  const payload = `${ver}.${expStr}.${nonce}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  if (expected.length !== sig.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}

function isEditorAuthenticated(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  return verifyAdminSessionToken(cookies.admin_session);
}

function requireEditorAuth(req, res, next) {
  if (!isEditorAuthenticated(req)) {
    return res
      .status(401)
      .json({ error: "Neautentificat. Autentifică-te în admin." });
  }
  return next();
}

module.exports = { parseCookies, isEditorAuthenticated, requireEditorAuth };
