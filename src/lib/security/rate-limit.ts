/**
 * Simple in-memory sliding window rate limiter.
 * Good for single-instance / edge; on multi-instance Vercel each isolate
 * has its own map (still blocks burst abuse per instance).
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const MAX_KEYS = 5000;

function prune(now: number) {
  if (buckets.size < MAX_KEYS) return;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size >= MAX_KEYS) {
    // Drop oldest half
    const keys = [...buckets.keys()].slice(0, Math.floor(MAX_KEYS / 2));
    for (const k of keys) buckets.delete(k);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  prune(now);
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  existing.count += 1;
  return { ok: true };
}

export function clientIp(request: Request): string {
  const headers = (request as { headers: Headers }).headers;
  const xf = headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
