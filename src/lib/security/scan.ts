import { hasAdminSessionSecret } from "@/lib/admin-session";
import { isSmtpConfigured } from "@/lib/contact-mail";
import { PRESETS } from "@/lib/optimize-image";
import { isSiteLockEnabled } from "@/lib/site-lock";
import { hasSupabaseConfig } from "@/lib/supabase";

export type ScanSeverity = "pass" | "warn" | "fail";

export type ScanCheck = {
  id: string;
  area: string;
  title: string;
  status: ScanSeverity;
  detail: string;
};

export type SecurityScan = {
  generatedAt: string;
  summary: { pass: number; warn: number; fail: number };
  checks: ScanCheck[];
  publishReady: boolean;
};

function envSet(name: string): boolean {
  return Boolean(String(process.env[name] ?? "").trim());
}

export function runSecurityScan(): SecurityScan {
  const lockOn = isSiteLockEnabled();

  const checks: ScanCheck[] = [
    {
      id: "admin-password",
      area: "Auth",
      title: "ADMIN_PASSWORD setat",
      status: envSet("ADMIN_PASSWORD") ? "pass" : "fail",
      detail: envSet("ADMIN_PASSWORD")
        ? "Parola admin există în env (valoarea nu este afișată)."
        : "Fără ADMIN_PASSWORD login-ul admin nu pornește în producție.",
    },
    {
      id: "session-secret",
      area: "Auth",
      title: "ADMIN_SESSION_SECRET setat",
      status: hasAdminSessionSecret() ? "pass" : "fail",
      detail: hasAdminSessionSecret()
        ? "Sesiunile HMAC pot fi semnate."
        : "Obligatoriu pe Vercel — fără secret, cookie-ul de admin nu e valid.",
    },
    {
      id: "supabase",
      area: "Date",
      title: "Supabase (CMS + mesaje)",
      status: hasSupabaseConfig ? "pass" : "fail",
      detail: hasSupabaseConfig
        ? "URL + anon + service role sunt prezente."
        : "Fără Supabase, mesajele de contact și cover-urile CMS nu persistă pe Vercel.",
    },
    {
      id: "smtp",
      area: "Contact",
      title: "SMTP notificări",
      status: isSmtpConfigured() ? "pass" : "warn",
      detail: isSmtpConfigured()
        ? "Email-urile de lead pot fi trimise."
        : "Lead-urile se salvează în CMS, dar emailul de notificare nu pleacă până nu setezi SMTP_*.",
    },
    {
      id: "site-lock",
      area: "Publicare",
      title: "Site lock (preview)",
      status: lockOn ? "warn" : "pass",
      detail: lockOn
        ? "SITE_LOCK_FORCE=1 — site-ul e privat (/acces). Oprește-l pentru lansare publică."
        : "Lock-ul e oprit. Site-ul e indexabil (robots allow).",
    },
    {
      id: "image-optimize",
      area: "Media",
      title: "Optimizare imagini (Sharp)",
      status: "pass",
      detail: `Upload admin: Sharp WebP, cover ${PRESETS.cover.maxEdge}px q${PRESETS.cover.quality}, gallery ${PRESETS.gallery.maxEdge}px q${PRESETS.gallery.quality}. Next/Image: qualities 75 și 90.`,
    },
    {
      id: "headers",
      area: "HTTP",
      title: "Security headers",
      status: "pass",
      detail:
        "CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy și Permissions-Policy sunt în next.config.ts.",
    },
    {
      id: "csrf",
      area: "HTTP",
      title: "CSRF same-origin",
      status: "pass",
      detail:
        "POST/PATCH/DELETE pe admin, contact și unlock cer Origin/Referer pe host-ul curent.",
    },
    {
      id: "rate-limit",
      area: "Auth",
      title: "Rate limit login + contact",
      status: "warn",
      detail:
        "8 încercări / 15 min (login) și 5 mesaje / 15 min (contact), per instanță Vercel. Nu e un store global — tot blochează burst-uri.",
    },
    {
      id: "html-xss",
      area: "XSS",
      title: "Sanitizare IDs analytics",
      status: "pass",
      detail:
        "GA4 trebuie G-…, Pixel doar cifre. Nu se injectează în script dacă formatul e invalid.",
    },
    {
      id: "uploads",
      area: "Media",
      title: "Upload hardening",
      status: "pass",
      detail:
        "MIME allowlist, max 40MB, SVG interzis, re-encode Sharp, nume UUID în Storage.",
    },
    {
      id: "pixel-env",
      area: "Analytics",
      title: "Meta Pixel (opțional)",
      status: "pass",
      detail:
        "Pixel-ul se activează din Admin → Setări (checkbox + ID numeric). Gol sau oprit = nu se încarcă. După consimțământ marketing.",
    },
    {
      id: "robots",
      area: "Publicare",
      title: "robots.txt / indexare",
      status: lockOn ? "warn" : "pass",
      detail: lockOn
        ? "Lock activ → robots disallow /."
        : "Allow / ; disallow /admin, /api, /acces. Sitemap https://moodilier.ro/sitemap.xml",
    },
  ];

  const summary = {
    pass: checks.filter((c) => c.status === "pass").length,
    warn: checks.filter((c) => c.status === "warn").length,
    fail: checks.filter((c) => c.status === "fail").length,
  };

  return {
    generatedAt: new Date().toISOString(),
    summary,
    checks,
    publishReady: summary.fail === 0 && !lockOn,
  };
}

export function scanToMarkdown(scan: SecurityScan): string {
  const lines = [
    `# Moodilier — raport securitate`,
    ``,
    `Generat: ${scan.generatedAt}`,
    `Rezumat: ${scan.summary.pass} OK · ${scan.summary.warn} atenții · ${scan.summary.fail} eșuate`,
    `Gata de publicare: ${scan.publishReady ? "da" : "nu"}`,
    ``,
  ];
  for (const c of scan.checks) {
    const mark =
      c.status === "pass" ? "PASS" : c.status === "warn" ? "WARN" : "FAIL";
    lines.push(`## [${mark}] ${c.title}`);
    lines.push(`Zonă: ${c.area}`);
    lines.push(c.detail);
    lines.push("");
  }
  return lines.join("\n");
}
