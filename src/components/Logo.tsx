import Link from "next/link";

interface LogoProps {
  /** "light" = text alb (pe fundal întunecat), "dark" = text negru (pe fundal deschis) */
  variant?: "light" | "dark";
  /** Clasa CSS suplimentară */
  className?: string;
  /** href implicit "/" */
  href?: string;
  onClick?: () => void;
}

export default function Logo({
  variant = "light",
  className = "",
  href = "/",
  onClick,
}: LogoProps) {
  return (
    <>
      <style>{`
        .moodilier-logo {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          gap: 0;
          line-height: 1;
          user-select: none;
          color: var(--color-fg);
        }
        .moodilier-logo-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          font-style: normal;
          letter-spacing: 0.22em;
          line-height: 1;
          text-transform: uppercase;
          font-size: clamp(1.1rem, 2.8vw, 1.5rem);
        }
        .moodilier-logo-tag {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 400;
          font-style: normal;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          line-height: 1;
          opacity: 0.72;
          font-size: clamp(0.42rem, 1vw, 0.55rem);
          margin-top: 0.28em;
        }
        /* Mobile: bigger logo */
        @media (max-width: 768px) {
          .moodilier-logo-name { font-size: 1.4rem; }
          .moodilier-logo-tag  { font-size: 0.52rem; }
        }
      `}</style>
      <Link
        href={href}
        onClick={onClick}
        className={`moodilier-logo ${className}`}
        aria-label="Moodilier — Mobilier premium la comandă"
      >
        <span className="moodilier-logo-name">Moodilier</span>
        <span className="moodilier-logo-tag">✦ Signature ✦</span>
      </Link>
    </>
  );
}
