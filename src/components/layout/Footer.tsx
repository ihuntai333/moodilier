"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Acasă" },
  { href: "/proiecte", label: "Proiecte" },
  { href: "/servicii", label: "Servicii" },
  { href: "/despre-noi", label: "Despre noi" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/termeni-si-conditii", label: "Termeni și condiții" },
  { href: "/politica-de-confidentialitate", label: "Politică confidențialitate" },
  { href: "/politica-cookies", label: "Politică cookies" },
  { href: "/nota-legala", label: "Notă legală" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/moodilier/",
    label: "Instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/moodilier",
    label: "Facebook",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@moodilier",
    label: "TikTok",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@moodilier",
    label: "YouTube",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        /* Footer social button */
        .social-btn {
          color: var(--color-fg-subtle);
          border-color: var(--color-border) !important;
          transition: color 0.3s, border-color 0.3s, background 0.3s;
        }
        .social-btn:hover {
          color: var(--color-gold);
          border-color: var(--color-gold) !important;
        }

        /* 2-column social+nav row */
        .footer-social-nav {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }
        @media (max-width: 639px) {
          .footer-social-nav {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .footer-social-nav .social-icons-row {
            justify-content: center;
          }
          .footer-social-nav .footer-links {
            align-items: center;
          }
        }

        /* Contact section centering */
        .footer-contact-centered {
          text-align: center;
        }
        .footer-contact-centered .footer-heading {
          text-align: center;
        }
        .footer-contact-row {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          justify-content: center;
        }

        /* Bottom bar */
        .footer-bottom-bar {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .footer-bottom-legal {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: flex-end;
        }
        @media (max-width: 639px) {
          .footer-bottom-bar {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .footer-bottom-legal {
            justify-content: center;
          }
        }

        /* Furnizori logos */
        .partner-logo {
          height: 60px;
          width: auto;
          object-fit: contain;
          opacity: 0.6;
          transition: opacity 0.3s;
          filter: grayscale(100%);
        }
        .partner-logo:hover {
          opacity: 1;
          filter: grayscale(0%);
        }
        @media (max-width: 639px) {
          .partner-logo {
            height: 80px;
            min-height: 80px;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="container">

          {/* ── Brand + tagline ───────────────────────────────── */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="footer-logo" style={{ marginBottom: "0.75rem" }}>
              <Image
                src="/brand/logo-white.png"
                alt="Moodilier Signature"
                width={240}
                height={70}
                style={{
                  height: "clamp(44px, 6vw, 64px)",
                  width: "auto",
                  objectFit: "contain",
                  margin: "0 auto",
                  display: "block",
                }}
                unoptimized
              />
            </div>
            <p
              className="footer-desc"
              style={{
                margin: "0 auto",
                textAlign: "center",
                maxWidth: "42ch",
              }}
            >
              Atelier de mobilier premium la comandă din București. Design
              contemporan, materiale atent selecționate şi execuție impecabilă.
            </p>
          </div>

          {/* ── Social + Navigation — 2 equal columns ─────────── */}
          <div className="footer-social-nav">
            {/* Left: Social media */}
            <div>
              <p className="footer-heading">Social</p>
              <div
                className="social-icons-row"
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
              >
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="social-btn"
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      border: "1px solid",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--color-fg-subtle)",
                  marginTop: "1.25rem",
                  lineHeight: 1.7,
                  maxWidth: "28ch",
                }}
              >
                Urmărește-ne pentru inspirație, proiecte noi și coulisele
                atelierului Moodilier.
              </p>
            </div>

            {/* Right: Navigation */}
            <div>
              <p className="footer-heading">Navigare</p>
              <nav className="footer-links">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* ── Divider ──────────────────────────────────────────── */}
          <div
            style={{
              height: "1px",
              background: "var(--color-border)",
              margin: "3rem 0",
            }}
          />

          {/* ── Contact — centered ────────────────────────────────── */}
          <div className="footer-contact-centered">
            <p className="footer-heading">Contact</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                alignItems: "center",
              }}
            >
              <div className="footer-contact-row">
                <MapPin
                  size={14}
                  style={{ color: "var(--color-gold)", marginTop: "0.2rem", flexShrink: 0 }}
                />
                <span className="footer-link" style={{ cursor: "default" }}>
                  Blv. Basarabia 256, incinta FAUR, Sector 3, București
                </span>
              </div>
              <div className="footer-contact-row">
                <Phone size={14} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                <a href="tel:+40729555431" className="footer-link">
                  (+40) 729 555 431
                </a>
              </div>
              <div className="footer-contact-row">
                <Mail size={14} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                <a href="mailto:ofertare@moodilier.com" className="footer-link">
                  ofertare@moodilier.com
                </a>
              </div>
              <div className="footer-contact-row">
                <Clock size={14} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                <span className="footer-link" style={{ cursor: "default" }}>
                  Luni–Vineri: 09:00–18:00
                </span>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ───────────────────────────────────────── */}
          <div className="footer-bottom-bar">
            <p className="footer-copy">
              © {new Date().getFullYear()} Moodilier. Toate drepturile rezervate.
            </p>
            <nav className="footer-bottom-legal">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="footer-copy footer-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
