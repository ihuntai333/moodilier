"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { killSmoothScroll } from "@/lib/smooth-scroll";

type Props = {
  title: string;
  category: string;
  image: string;
  href: string;
  video?: string | null;
  className?: string;
  style?: CSSProperties;
};

/**
 * Native <a> hard navigation — instant click feedback, no soft-nav queue.
 */
export default function AwardsProjectCard({
  title,
  category,
  image,
  href,
  video,
  className = "",
  style,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const hasVideo = Boolean(video);
  const target = href?.startsWith("/") ? href : "/proiecte";

  const onEnter = () => {
    setHovered(true);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  };

  const onLeave = () => {
    setHovered(false);
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
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
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <div className="aw-project-media" aria-hidden>
        <Image
          src={image || "/projects/villa-06/01.cover.webp"}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 33vw"
          className={`aw-project-img${hovered && hasVideo ? " is-dim" : ""}`}
          style={{ objectFit: "cover" }}
        />
        {hasVideo ? (
          <video
            ref={videoRef}
            className={`aw-project-video${hovered ? " is-on" : ""}`}
            src={video!}
            muted
            playsInline
            loop
            preload="none"
            aria-hidden
          />
        ) : null}
        <span className="aw-project-shade" />
        <span className="aw-project-frame" />
      </div>
      <div className="aw-project-meta">
        <span className="aw-project-cat">{category}</span>
        <h3 className="aw-project-title">{title}</h3>
        <span className="aw-project-cta">Vezi proiect →</span>
      </div>
    </a>
  );
}
