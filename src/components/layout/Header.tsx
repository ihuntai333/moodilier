"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "/proiecte", label: "Proiecte" },
  { href: "/servicii", label: "Servicii" },
  { href: "/despre-noi", label: "Despre noi" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/moodilier/",
    label: "Instagram",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@moodilier",
    label: "TikTok",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@moodilier",
    label: "YouTube",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* ─── Keyframes & responsive helpers ──────────────────── */}
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-nav-item {
          opacity: 0;
          animation: slideInLeft 0.45s ease forwards;
        }
        .mobile-nav-item:nth-child(1) { animation-delay: 0.05s; }
        .mobile-nav-item:nth-child(2) { animation-delay: 0.12s; }
        .mobile-nav-item:nth-child(3) { animation-delay: 0.19s; }
        .mobile-nav-item:nth-child(4) { animation-delay: 0.26s; }
        .mobile-nav-item:nth-child(5) { animation-delay: 0.33s; }

        .mobile-cta-fade {
          opacity: 0;
          animation: fadeInUp 0.4s ease 0.45s forwards;
        }
        .mobile-social-fade {
          opacity: 0;
          animation: fadeInUp 0.4s ease 0.55s forwards;
        }
        .mobile-bottom-fade {
          opacity: 0;
          animation: fadeInUp 0.4s ease 0.6s forwards;
        }

        .mobile-nav-link {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 7vw, 2.75rem);
          font-weight: 400;
          font-style: italic;
          color: var(--color-fg);
          letter-spacing: 0.04em;
          padding: 0.5rem 0;
          display: block;
          position: relative;
          transition: color 0.3s ease;
        }
        .mobile-nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--color-gold);
          transition: width 0.35s ease;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: var(--color-gold);
        }
        .mobile-nav-link:hover::after,
        .mobile-nav-link.active::after {
          width: 100%;
        }

        .mobile-social-link {
          width: 2.75rem;
          height: 2.75rem;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-fg-subtle);
          transition: color 0.3s, border-color 0.3s;
        }
        .mobile-social-link:hover {
          color: var(--color-gold);
          border-color: var(--color-gold);
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>

      {/* ─── Header bar — always on top (z: 201) ─────────────── */}
      <nav
        className={`nav ${scrolled ? "scrolled" : ""}`}
        style={{ zIndex: 201 }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="nav-logo"
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            onClick={closeMobile}
          >
            <Image
              src="/brand/logo-white.png"
              alt="Moodilier Signature"
              width={220}
              height={60}
              style={{
                height: "clamp(36px, 5vw, 52px)",
                width: "auto",
                objectFit: "contain",
              }}
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Nav */}
          <div
            className="hide-mobile"
            style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${currentPath === link.href ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="btn btn-primary"
              style={{ padding: "0.65rem 1.5rem", fontSize: "0.65rem" }}
            >
              Solicită ofertă
            </Link>
          </div>

          {/* Hamburger — mobile only via CSS */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none", // overridden by .mobile-toggle CSS
              background: "none",
              border: "none",
              color: "var(--color-fg)",
              cursor: "pointer",
              padding: "0.5rem",
              zIndex: 202,
              position: "relative",
            }}
            className="mobile-toggle"
            aria-label={mobileOpen ? "Închide meniu" : "Deschide meniu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* ─── Mobile Menu Overlay (full-screen, z: 200) ───────── */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Meniu navigare"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#0f0e0d",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* Inner scroll wrapper — padded below fixed header */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "6rem 2.5rem 2.5rem",
              minHeight: "100dvh",
            }}
          >
            {/* ── Nav Links ── */}
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                flex: 1,
                justifyContent: "center",
              }}
            >
              {navLinks.map((link) => (
                <div key={link.href} className="mobile-nav-item">
                  <Link
                    href={link.href}
                    onClick={closeMobile}
                    className={`mobile-nav-link ${currentPath === link.href ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* ── CTA ── */}
            <div className="mobile-cta-fade" style={{ marginTop: "2.5rem" }}>
              <Link
                href="/contact"
                className="btn btn-primary"
                onClick={closeMobile}
                style={{ fontSize: "0.65rem", width: "100%", justifyContent: "center" }}
              >
                Solicită o ofertă
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* ── Social Icons ── */}
            <div
              className="mobile-social-fade"
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "0.75rem",
              }}
            >
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="mobile-social-link"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* ── Bottom contact strip ── */}
            <div
              className="mobile-bottom-fade"
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #2a2724",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "space-between",
              }}
            >
              <a
                href="tel:+40729555431"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "var(--color-fg-subtle)",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-gold)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-fg-subtle)")
                }
              >
                (+40) 729 555 431
              </a>
              <a
                href="mailto:ofertare@moodilier.com"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: "var(--color-fg-subtle)",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-gold)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-fg-subtle)")
                }
              >
                ofertare@moodilier.com
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
