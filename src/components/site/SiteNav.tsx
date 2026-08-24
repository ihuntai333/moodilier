"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { NavLink } from "@/lib/site-settings";
import { killSmoothScroll } from "@/lib/smooth-scroll";

type Props = {
  brandName?: string;
  logoUrl?: string;
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
};

function linkIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Mark navigating immediately so clicks feel responsive while the page loads. */
function markNavigating() {
  killSmoothScroll();
  document.documentElement.classList.add("aw-navigating");
}

export default function SiteNav({
  brandName = "Moodilier",
  logoUrl = "",
  links = [],
  ctaLabel = "Solicită ofertă",
  ctaHref = "/contact",
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    document.documentElement.classList.remove("aw-navigating");
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function onNavClick() {
    markNavigating();
    setOpen(false);
  }

  const headerClass = [
    "aw-nav",
    scrolled ? "is-scrolled" : "",
    overHero ? "is-over-hero" : "",
    open ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const brandLogoWhite = "/brand/logo-white.png?v=20260824b";
  const brandLogoDark = "/brand/logo-dark.png?v=20260824b";
  const displayLogo =
    logoUrl && !logoUrl.includes("/brand/")
      ? logoUrl
      : overHero
        ? brandLogoWhite
        : brandLogoDark;

  return (
    <header className={headerClass}>
      <div className="aw-container aw-nav-inner">
        {/* Native <a> — hard navigation, no soft-nav queue */}
        <a href="/" className="aw-logo" onClick={onNavClick}>
          {displayLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayLogo} alt={brandName} className="aw-logo-img" />
          ) : (
            brandName
          )}
        </a>

        <nav className="aw-nav-links" aria-label="Navigare principală">
          {links.map((link) => (
            <a
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={linkIsActive(pathname, link.href) ? "is-active" : undefined}
              aria-current={linkIsActive(pathname, link.href) ? "page" : undefined}
              onClick={onNavClick}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="aw-nav-actions">
          <a href={ctaHref} className="aw-btn aw-btn-primary aw-btn-fill" onClick={onNavClick}>
            {ctaLabel}
          </a>
          <button
            type="button"
            className="aw-nav-toggle"
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={open}
            aria-controls="aw-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X size={22} strokeWidth={1.4} className="aw-icon-close" />
            ) : (
              <Menu size={22} strokeWidth={1.4} className="aw-icon-menu" />
            )}
          </button>
        </div>
      </div>

      <div className="aw-container aw-nav-mobile" id="aw-mobile-nav">
        {links.map((link) => (
          <a
            key={`m-${link.href}-${link.label}`}
            href={link.href}
            className={linkIsActive(pathname, link.href) ? "is-active" : undefined}
            aria-current={linkIsActive(pathname, link.href) ? "page" : undefined}
            onClick={onNavClick}
          >
            {link.label}
          </a>
        ))}
        <a
          href={ctaHref}
          className="aw-btn aw-btn-primary"
          style={{ width: "fit-content" }}
          onClick={onNavClick}
        >
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
