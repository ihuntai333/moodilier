"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface GatsbyProjectCardProps {
  title: string;
  category: string;
  image: string;
  href: string;
  index?: number;
  imageCount?: number;
  description?: string;
  featured?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function GatsbyProjectCard({
  title,
  category,
  image,
  href,
  index = 0,
  imageCount,
  description,
  featured = false,
  className = "",
  style,
}: GatsbyProjectCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [noAnim, setNoAnim] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // ── Detect touch device ────────────────────────────────────────────
  useEffect(() => {
    setIsTouch(
      window.matchMedia("(hover: none)").matches ||
        navigator.maxTouchPoints > 0
    );
  }, []);

  // ── Entrance via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      // Already in viewport: skip blur/scale entrance but still play SVG draw
      setNoAnim(true);
      // Small delay so browser paints initial dashoffset:5000 before animating
      const t = setTimeout(() => setRevealed(true), 80);
      return () => clearTimeout(t);
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── 3D magnetic tilt + gold spotlight (desktop only) ──────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouch) return;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // 3D tilt
      el.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) scale(1.025) translateZ(0)`;
      el.style.boxShadow = `${-x * 24}px ${y * 24 + 16}px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,132,0.15)`;

      // Gold spotlight follows cursor
      if (spotRef.current) {
        const px = (x + 0.5) * 100;
        const py = (y + 0.5) * 100;
        spotRef.current.style.background = `radial-gradient(ellipse 50% 45% at ${px}% ${py}%, rgba(201,169,132,0.22) 0%, rgba(201,169,132,0.06) 55%, transparent 80%)`;
        spotRef.current.style.opacity = "1";
      }
    },
    [isTouch]
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouch) return;
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
    if (spotRef.current) spotRef.current.style.opacity = "0";
  }, [isTouch]);

  // ── Touch press feedback (mobile) ─────────────────────────────────
  const handleTouchStart = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform = "scale(0.97)";
    el.style.transition = "transform 0.15s ease";
  }, []);

  const handleTouchEnd = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.transition = "transform 0.3s ease";
    setTimeout(() => {
      if (wrapRef.current) wrapRef.current.style.transition = "";
    }, 300);
  }, []);

  // Stagger: column-aware (0, 0.1, 0.2s per row on 3-col grid)
  const entranceDelay = noAnim ? 0 : (index % 3) * 0.1;

  return (
    <Link href={href} className={`gatsby-card-link ${className}`} style={style}>
      <div
        ref={wrapRef}
        className={`gatsby-card${revealed ? " gatsby-revealed" : ""}${noAnim ? " gatsby-no-anim" : ""}${isTouch ? " gatsby-touch" : ""}`}
        style={{
          animationDelay: `${entranceDelay}s`,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Image ───────────────────────────────────────────── */}
        <div className="gatsby-img-wrap">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              unoptimized
              loading={index < 4 ? "eager" : "lazy"}
              priority={index < 2}
              style={{ objectFit: "cover" }}
              className="gatsby-img"
            />
          ) : (
            <div className="gatsby-no-img">
              <span>Fără imagine</span>
            </div>
          )}

          {/* Gold mouse spotlight (desktop only) */}
          {!isTouch && <div ref={spotRef} className="gatsby-spotlight" />}
        </div>

        {/* ── SVG laser-trace border ───────────────────────────── */}
        <svg
          className="gatsby-svg"
          viewBox="0 0 1000 750"
          preserveAspectRatio="none"
          aria-hidden
        >
          <rect
            className="gatsby-svg-border"
            x="4" y="4" width="992" height="742"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            className="gatsby-svg-inner"
            x="14" y="14" width="972" height="722"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* ── Gold L-corners ─────────────────────────────────── */}
        <div className="gatsby-corners" aria-hidden />

        {/* ── Content overlay ─────────────────────────────────── */}
        <div className="gatsby-overlay">
          <div className="gatsby-overlay-inner">
            <span className="gatsby-cat">{category}</span>
            <h3 className="gatsby-title">{title}</h3>
            {description && (
              <p className="gatsby-desc">{description}</p>
            )}
            <div className="gatsby-meta">
              {imageCount != null && imageCount > 0 && (
                <span className="gatsby-count">⬡ {imageCount} fotografii</span>
              )}
              <span className="gatsby-cta">Vezi proiect →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
