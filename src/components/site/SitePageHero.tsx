import Image from "next/image";

interface SitePageHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  bgImage: string;
  bgVideo?: string | null;
  /** 0–1, default 0.42 */
  overlayOpacity?: number;
}

/**
 * Inner-page hero — centered copy, full-bleed media, soft fade into page body.
 * No under-header CTA strip (filter bands live outside, e.g. proiecte).
 */
export default function SitePageHero({
  label,
  title,
  subtitle,
  bgImage,
  bgVideo,
  overlayOpacity = 0.42,
}: SitePageHeroProps) {
  const hasVideo = Boolean(bgVideo);

  return (
    <section className="aw-page-hero" aria-labelledby="aw-page-hero-title">
      <div className="aw-page-hero-bg">
        {hasVideo ? (
          <video
            src={bgVideo!}
            poster={bgImage}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : (
          <Image
            src={bgImage}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        )}
      </div>
      <div
        className="aw-page-hero-overlay"
        style={{ background: `rgba(0,0,0,${overlayOpacity})` }}
        aria-hidden
      />
      <div className="aw-page-hero-fade" aria-hidden />

      <div className="aw-container aw-page-hero-inner">
        <div className="aw-page-hero-content">
          {label ? <p className="aw-label">{label}</p> : null}
          <h1 id="aw-page-hero-title" className="aw-h1">
            {title}
          </h1>
          {subtitle ? <p className="aw-body">{subtitle}</p> : null}
        </div>
      </div>
    </section>
  );
}
