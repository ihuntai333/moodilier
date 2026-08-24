import Link from "next/link";
import type { NavLink, SiteChrome } from "@/lib/site-settings";

type Props = {
  chrome: SiteChrome;
};

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

function SocialIcon({ label }: { label: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (label) {
    case "Instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...common}>
          <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13V9c0-.6.4-1 1-1z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg {...common}>
          <path d="M20 11.5a8 8 0 0 1-12.1 6.9L4 20l1.7-3.7A8 8 0 1 1 20 11.5z" />
          <path d="M9.5 9.2c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.1-.1.3 0 .5.3.5 1 1.3 1.7 1.8.4.3.7.3.9.2l.7-.3c.2-.1.4 0 .5.1l1.4 1c.2.1.3.3.2.5-.3.8-1.3 1.3-2.1 1.2-2.2-.2-4.7-2.4-5.5-4.4-.4-1-.4-1.9.1-2.7z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg {...common}>
          <path d="M14 4v10.2a3.2 3.2 0 1 1-2.4-3.1V8.2A5.8 5.8 0 0 0 9 8.5v2.2a3.4 3.4 0 0 1 1.2-.2v5.1A3.2 3.2 0 1 0 15.8 16V9.4A6.4 6.4 0 0 0 20 10V7.5A6.4 6.4 0 0 1 14 4z" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

export default function SiteFooter({ chrome }: Props) {
  const social: NavLink[] = [
    chrome.instagram ? { href: chrome.instagram, label: "Instagram" } : null,
    chrome.facebook ? { href: chrome.facebook, label: "Facebook" } : null,
    chrome.whatsapp
      ? { href: `https://wa.me/${chrome.whatsapp.replace(/\D/g, "")}`, label: "WhatsApp" }
      : null,
    chrome.tiktok ? { href: chrome.tiktok, label: "TikTok" } : null,
  ].filter((x): x is NavLink => Boolean(x));

  const phoneHref = telHref(chrome.phone);

  return (
    <footer className="aw-footer">
      <div className="aw-container aw-footer-inner" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <div className="aw-footer-grid">
          <div>
            <div className="aw-footer-brand-block">
              {chrome.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={
                    chrome.logoUrl.includes("logo-dark")
                      ? chrome.logoUrl.replace("logo-dark", "logo-white")
                      : chrome.logoUrl
                  }
                  alt={chrome.footerBrand}
                  className="aw-footer-logo"
                />
              ) : (
                <p className="aw-footer-brand">{chrome.footerBrand}</p>
              )}
              {chrome.footerTagline ? (
                <p className="aw-footer-tagline">{chrome.footerTagline}</p>
              ) : (
                <p className="aw-footer-tagline">
                  Mobilier premium la comandă, executat în atelierul din București.
                </p>
              )}
            </div>
            {social.length > 0 ? (
              <div className="aw-footer-social" style={{ marginTop: "1.1rem" }}>
                {social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <SocialIcon label={s.label} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {chrome.footerMenu.length > 0 ? (
            <div className="aw-footer-col">
              <p className="aw-footer-col-title">Navigare</p>
              <nav aria-label="Meniu footer">
                {chrome.footerMenu.map((link) => (
                  <Link key={`${link.href}-${link.label}`} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ) : null}

          <div className="aw-footer-col">
            <p className="aw-footer-col-title">Contact</p>
            <p className="aw-footer-contact-line">
              {phoneHref ? <a href={phoneHref}>{chrome.phone}</a> : chrome.phone}
            </p>
            <p className="aw-footer-contact-line">
              <a href={`mailto:${chrome.email}`}>{chrome.email}</a>
            </p>
            <p className="aw-footer-contact-line">{chrome.address}</p>
          </div>
        </div>

        <div className="aw-footer-bottom" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", width: "100%" }}>
          <p className="aw-footer-copy">
            © {new Date().getFullYear()} SC Moodilier SRL · Toate drepturile rezervate
          </p>
          <div className="aw-footer-links">
            {chrome.footerLegal.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
