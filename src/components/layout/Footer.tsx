"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useCallback } from "react";

const legalLinks = [
  { href: "/termeni-si-conditii", label: "Termeni" },
  { href: "/politica-de-confidentialitate", label: "Confidențialitate" },
  { href: "/politica-cookies", label: "Cookies" },
  { href: "/nota-legala", label: "Notă legală" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/moodilier/",
    label: "Instagram",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://wa.me/40729555431",
    label: "WhatsApp",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@moodilier",
    label: "TikTok",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
];

export default function Footer() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className="footer-slim">
      <style>{`
        .footer-slim {
          background: var(--color-bg-alt);
          border-top: 1px solid var(--color-border);
          padding: 3rem 0 0;
        }

        .footer-slim .f-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          text-align: center;
        }

        /* Brand */
        .footer-slim .f-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }
        .footer-slim .f-tagline {
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-fg-subtle);
        }

        /* Gold separator */
        .footer-slim .f-gold-sep {
          width: 40px;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--color-gold), transparent);
          margin-bottom: 1.75rem;
        }

        /* Social icons */
        .footer-slim .f-socials {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 2.25rem;
        }
        .footer-slim .f-social-btn {
          width: 2.2rem;
          height: 2.2rem;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-fg-subtle);
          transition: color 0.25s, border-color 0.25s, background 0.25s;
          text-decoration: none;
        }
        .footer-slim .f-social-btn:hover {
          color: var(--color-gold);
          border-color: rgba(201,169,132,0.5);
          background: rgba(201,169,132,0.06);
        }

        /* Contact strip */
        .footer-slim .f-contact {
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 2.25rem;
        }
        .footer-slim .f-contact a,
        .footer-slim .f-contact span {
          font-size: 0.75rem;
          color: var(--color-fg-subtle);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .footer-slim .f-contact a:hover { color: var(--color-gold); }
        .footer-slim .f-contact-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--color-border);
        }

        /* Bottom bar */
        .footer-slim .f-bottom {
          width: 100%;
          border-top: 1px solid var(--color-border);
          padding: 1.1rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .footer-slim .f-copy {
          font-size: 0.68rem;
          color: var(--color-fg-subtle);
          letter-spacing: 0.05em;
        }

        .footer-slim .f-legal {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .footer-slim .f-legal a {
          font-size: 0.65rem;
          color: var(--color-fg-subtle);
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .footer-slim .f-legal a:hover { color: var(--color-gold); }

        /* Go to top button */
        .footer-slim .f-top-btn {
          width: 2rem;
          height: 2rem;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-fg-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.75rem;
          transition: color 0.25s, border-color 0.25s, transform 0.25s;
          flex-shrink: 0;
        }
        .footer-slim .f-top-btn:hover {
          color: var(--color-gold);
          border-color: rgba(201,169,132,0.5);
          transform: translateY(-2px);
        }

        @media (max-width: 639px) {
          .footer-slim .f-bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .footer-slim .f-legal { justify-content: center; }
          .footer-slim .f-contact { gap: 1rem; }
          .footer-slim .f-contact-dot { display: none; }
        }
      `}</style>

      <div className="f-inner">

        {/* Brand */}
        <div className="f-brand">
          <Logo variant="light" href="/" />
          <span className="f-tagline">Mobilier premium la comandă · București</span>
        </div>

        {/* Gold separator */}
        <div className="f-gold-sep" />

        {/* Social icons */}
        <div className="f-socials">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="f-social-btn"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Contact strip */}
        <div className="f-contact">
          <a href="tel:+40729555431">(+40) 729 555 431</a>
          <div className="f-contact-dot" />
          <a href="mailto:ofertare@moodilier.com">ofertare@moodilier.com</a>
          <div className="f-contact-dot" />
          <span>Luni–Vineri 09:00–18:00</span>
        </div>

        {/* Bottom bar */}
        <div className="f-bottom">
          <p className="f-copy">
            © {new Date().getFullYear()} SC Moodilier SRL · Toate drepturile rezervate
          </p>

          <nav className="f-legal">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>

          <button
            className="f-top-btn"
            onClick={scrollToTop}
            aria-label="Înapoi sus"
            title="Înapoi sus"
          >
            ↑
          </button>
        </div>

      </div>
    </footer>
  );
}
