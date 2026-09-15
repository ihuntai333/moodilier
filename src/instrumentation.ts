/**
 * Node prefers IPv6. Vercel → Supabase often fails with TypeError: fetch failed
 * when the AAAA route is broken. Force IPv4 first for all server fetches.
 */
export function register() {
  try {
    // Dynamic require so webpack does not try to bundle the Node builtin.
    const dns = require("dns") as { setDefaultResultOrder: (order: string) => void };
    dns.setDefaultResultOrder("ipv4first");
  } catch {
    /* ignore */
  }
}
