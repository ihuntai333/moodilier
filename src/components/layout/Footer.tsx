"use client";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

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

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <>
      <style>{`
        .social-btn { color: var(--color-fg-subtle); border-color: var(--color-border) !important; transition: color 0.3s, border-color 0.3s; }
        .social-btn:hover { color: var(--color-gold); border-color: var(--color-gold) !important; }
      `}</style>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div className="footer-logo">Mood<span>ilier</span></div>
              <p className="footer-desc" style={{ marginBottom: "1.5rem" }}>
                Atelier de mobilier premium la comandă din București. Design contemporan,
                materiale atent selecționate și execuție impecabilă.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a
                  href="https://www.instagram.com/moodilier/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="social-btn"
                  style={{
                    width: "2.5rem", height: "2.5rem",
                    border: "1px solid",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.facebook.com/moodilier"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="social-btn"
                  style={{
                    width: "2.5rem", height: "2.5rem",
                    border: "1px solid",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>

            {/* Quick Links */}
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

            {/* Contact */}
            <div>
              <p className="footer-heading">Contact</p>
              <div className="footer-links">
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <MapPin size={14} style={{ color: "var(--color-gold)", marginTop: "0.2rem", flexShrink: 0 }} />
                  <span className="footer-link" style={{ cursor: "default" }}>
                    Blv. Basarabia 256, incinta FAUR<br />Sector 3, București
                  </span>
                </div>
                <a href="tel:+40729555431" className="footer-link" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <Phone size={14} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  (+40) 729 555 431
                </a>
                <a href="mailto:ofertare@moodilier.com" className="footer-link" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <Mail size={14} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  ofertare@moodilier.com
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="footer-copy">
              © {new Date().getFullYear()} Moodilier. Toate drepturile rezervate.
            </p>
            <nav style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="footer-copy footer-link">
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
