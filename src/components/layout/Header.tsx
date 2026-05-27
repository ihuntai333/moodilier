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
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
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
              src="/images-scraped/Moodelier-L-WS-White.png"
              alt="Moodilier"
              width={200}
              height={50}
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
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

          {/* Hamburger button — only visible on mobile via CSS */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none", // overridden by .mobile-toggle CSS
              background: "none",
              border: "none",
              color: "var(--color-fg)",
              cursor: "pointer",
              padding: "0.5rem",
              zIndex: 1001,
              position: "relative",
            }}
            className="mobile-toggle"
            aria-label={mobileOpen ? "Închide meniu" : "Deschide meniu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop — click closes menu */}
          <div
            onClick={closeMobile}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 998,
              background: "transparent",
            }}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Meniu navigare"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              background: "rgba(31,29,26,0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "2rem",
            }}
          >
            {/* Close button */}
            <button
              onClick={closeMobile}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "none",
                border: "none",
                color: "var(--color-fg)",
                cursor: "pointer",
                padding: "0.5rem",
              }}
              aria-label="Închide meniu"
            >
              <X size={28} />
            </button>

            {/* Logo in overlay */}
            <div
              style={{
                position: "absolute",
                top: "1.5rem",
                left: "1.5rem",
              }}
            >
              <Image
                src="/images-scraped/Moodelier-L-WS-White.png"
                alt="Moodilier"
                width={150}
                height={38}
                style={{ height: "32px", width: "auto", objectFit: "contain", opacity: 0.7 }}
                unoptimized
              />
            </div>

            {/* Nav links */}
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 7vw, 2.75rem)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color:
                      currentPath === link.href
                        ? "var(--color-gold)"
                        : "var(--color-fg)",
                    letterSpacing: "0.05em",
                    transition: "color 0.3s",
                    padding: "0.4rem 0",
                    display: "block",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      currentPath === link.href
                        ? "var(--color-gold)"
                        : "var(--color-fg)")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA button */}
            <div style={{ marginTop: "2rem" }}>
              <Link
                href="/contact"
                className="btn btn-primary"
                onClick={closeMobile}
                style={{ fontSize: "0.65rem" }}
              >
                Solicită o ofertă
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Decorative bottom info */}
            <div
              style={{
                position: "absolute",
                bottom: "2rem",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
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
              <span style={{ color: "var(--color-border)", fontSize: "0.65rem" }}>
                |
              </span>
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
        </>
      )}

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
