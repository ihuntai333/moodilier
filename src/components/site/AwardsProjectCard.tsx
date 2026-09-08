"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { killSmoothScroll } from "@/lib/smooth-scroll";
import { projectImageAlt } from "@/lib/site-seo";

type Props = {
  title: string;
  category: string;
  tags?: string[];
  activeTag?: string | null;
  image: string;
  href: string;
  video?: string | null;
  className?: string;
  style?: CSSProperties;
};

/**
 * Project card — image by default; muted video preview on hover/focus when `video` is set.
 */
export default function AwardsProjectCard({
  title,
  category,
  tags = [],
  activeTag = null,
  image,
  href,
  video,
  className = "",
  style,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [armed, setArmed] = useState(false);
  const videoSrc = video?.trim() || "";
  const hasVideo = Boolean(videoSrc);
  const target = href?.startsWith("/") ? href : "/proiecte";
  const alt = projectImageAlt(title, category);

  const playPreview = () => {
    if (!hasVideo) return;
    setHovered(true);
    const v = videoRef.current;
    if (!v) return;
    if (!armed) setArmed(true);
    try {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      if (v.readyState >= 2) {
        v.currentTime = 0;
        void v.play().catch(() => {});
      } else {
        const start = () => {
          v.currentTime = 0;
          void v.play().catch(() => {});
        };
        v.addEventListener("canplay", start, { once: true });
        v.load();
      }
    } catch {
      /* ignore autoplay blocks */
    }
  };

  const stopPreview = () => {
    setHovered(false);
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    try {
      v.currentTime = 0;
    } catch {
      /* ignore */
    }
  };

  const go = () => {
    killSmoothScroll();
    document.documentElement.classList.add("aw-navigating");
  };

  return (
    <a
      href={target}
      className={`aw-project${hovered ? " is-hovered" : ""}${hasVideo ? " has-video" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      onClick={go}
      onMouseEnter={playPreview}
      onMouseLeave={stopPreview}
      onFocus={playPreview}
      onBlur={stopPreview}
      onTouchStart={() => {
        // First touch arms video so iOS can play after gesture
        if (hasVideo && !armed) setArmed(true);
      }}
    >
      <div className="aw-project-media">
        <Image
          src={image || "/projects/villa-06/01.cover.webp"}
          alt={alt}
          fill
          sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
          quality={70}
          loading="lazy"
          className={`aw-project-img${hovered && hasVideo ? " is-dim" : ""}`}
          style={{ objectFit: "cover" }}
        />
        {hasVideo ? (
          <video
            ref={videoRef}
            className={`aw-project-video${hovered ? " is-on" : ""}`}
            src={armed || hovered ? videoSrc : undefined}
            muted
            playsInline
            loop
            preload={armed || hovered ? "metadata" : "none"}
            aria-label={alt}
          />
        ) : null}
        {hasVideo ? <span className="aw-project-video-cue" aria-hidden /> : null}
        <span className="aw-project-shade" />
        <span className="aw-project-frame" />
      </div>
      <div className="aw-project-meta">
        {tags.length > 0 ? (
          <div className="aw-project-tags">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`aw-project-tag${activeTag === tag ? " is-active" : ""}`}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="aw-project-cat">{category}</span>
        )}
        <h3 className="aw-project-title">{title}</h3>
        <span className="aw-project-cta">Vezi proiect →</span>
      </div>
    </a>
  );
}
