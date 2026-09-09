"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface SitePageHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  bgImage: string;
  bgVideo?: string | null;
  /** 0–1, default 0.42 */
  overlayOpacity?: number;
  /** Visual-editor key. Omit on project pages (covers come from CMS). */
  imageKey?: string;
}

/**
 * Inner-page hero — poster first (LCP), then project video when available.
 */
export default function SitePageHero({
  label,
  title,
  subtitle,
  bgImage,
  bgVideo,
  overlayOpacity = 0.42,
  imageKey,
}: SitePageHeroProps) {
  const hasVideo = Boolean(bgVideo?.trim());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!hasVideo) return;
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;

    const tryPlay = () => {
      void v.play().then(() => setVideoReady(true)).catch(() => {});
    };

    if (v.readyState >= 2) tryPlay();
    else {
      const onReady = () => tryPlay();
      v.addEventListener("canplay", onReady, { once: true });
      v.addEventListener("loadeddata", onReady, { once: true });
      return () => {
        v.removeEventListener("canplay", onReady);
        v.removeEventListener("loadeddata", onReady);
      };
    }
  }, [hasVideo, bgVideo]);

  return (
    <section className="aw-page-hero" aria-labelledby="aw-page-hero-title">
      <div
        className="aw-page-hero-bg"
        data-key={imageKey || undefined}
        data-editable={imageKey ? "image" : undefined}
      >
        <Image
          src={bgImage}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          className={`aw-page-hero-poster${videoReady ? " is-dim" : ""}`}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {hasVideo ? (
          <video
            ref={videoRef}
            className={`aw-page-hero-video${videoReady ? " is-on" : ""}`}
            src={bgVideo!}
            poster={bgImage}
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
            aria-hidden
          />
        ) : null}
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
