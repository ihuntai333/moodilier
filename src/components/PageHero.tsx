import Image from "next/image";

interface PageHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  bgImage: string;
  /** 0–1, default 0.65 */
  overlayOpacity?: number;
  /** "left" | "center" | "right", default "center" */
  align?: "left" | "center" | "right";
}

export default function PageHero({
  label,
  title,
  subtitle,
  bgImage,
  overlayOpacity = 0.65,
  align = "center",
}: PageHeroProps) {
  const textAlign = align;
  const alignItems =
    align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
  const marginAuto =
    align === "center" ? "0 auto" : align === "right" ? "0 0 0 auto" : "0";

  return (
    <section className="page-hero-full">
      {/* Background image */}
      <div className="page-hero-bg">
        <Image
          src={bgImage}
          alt={title}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          unoptimized
        />
        <div
          className="page-hero-overlay"
          style={{ background: `rgba(0,0,0,${overlayOpacity})` }}
        />
        {/* Gradient bottom fade into bg */}
        <div className="page-hero-gradient" />
      </div>

      {/* Content */}
      <div className="container page-hero-content" style={{ textAlign, alignItems }}>
        {label && (
          <p className="label page-hero-label" style={{ margin: marginAuto }}>
            {label}
          </p>
        )}
        <h1 className="page-hero-title">{title}</h1>
        <div
          className="page-hero-line"
          style={{ margin: align === "center" ? "1.5rem auto" : "1.5rem 0" }}
        />
        {subtitle && (
          <p
            className="page-hero-subtitle"
            style={{ margin: marginAuto, textAlign }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
