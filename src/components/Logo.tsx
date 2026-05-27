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
  const color = variant === "light" ? "#ffffff" : "#1a1814";

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
        }
        .moodilier-logo-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          font-style: normal;
          letter-spacing: 0.22em;
          line-height: 1;
          text-transform: uppercase;
        }
        .moodilier-logo-tag {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 400;
          font-style: normal;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          line-height: 1;
          opacity: 0.72;
        }
      `}</style>
      <Link
        href={href}
        onClick={onClick}
        className={`moodilier-logo ${className}`}
        aria-label="Moodilier — Mobilier premium la comandă"
        style={{ color }}
      >
        <span
          className="moodilier-logo-name"
          style={{
            fontSize: "clamp(1.1rem, 2.8vw, 1.5rem)",
            color,
          }}
        >
          Moodilier
        </span>
        <span
          className="moodilier-logo-tag"
          style={{
            fontSize: "clamp(0.42rem, 1vw, 0.55rem)",
            marginTop: "0.28em",
            color,
          }}
        >
          ✦ Signature ✦
        </span>
      </Link>
    </>
  );
}
