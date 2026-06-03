"use client";

import { useRef, useEffect, useState } from "react";
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

/**
 * Smooth cubic Bézier wave path — much rounder than linear sine approximation.
 * Uses cubic bezier control points at ±1/3 of wave period for smooth S-curves.
 */
function smoothWave(y: number, amp: number, waveW: number, count: number): string {
  // waveW = full wavelength in px, count = number of full waves to draw
  const totalW = waveW * count;
  const start = -waveW; // start one wave left so loop is seamless
  const cp = waveW / 2;  // control point x offset = half wavelength

  let d = `M${start},${y}`;
  for (let i = 0; i < count + 2; i++) {
    const x0 = start + i * waveW;
    const x1 = x0 + cp;
    const x2 = x0 + cp;
    const x3 = x0 + waveW;
    const yPeak = y - amp;   // first control = up
    const yTrough = y + amp; // second control = down
    d += ` C${x1},${yPeak} ${x2},${yPeak} ${x3},${y}`;
    // second half — trough
    d += ` C${x3 + cp / 2},${yPeak} ${x3 + cp},${yTrough} ${x3 + waveW / 2},${yTrough}`;
  }
  // Simpler: alternate peaks and troughs with C commands
  return buildWave(y, amp, waveW, count);
}

/** Proper cubic Bézier sinusoid — C command for smooth curves */
function buildWave(y: number, amp: number, wl: number, reps: number): string {
  const startX = -wl * 1.5;
  const total = reps + 3;
  // Each full wave = 2 half-arcs (up then down)
  // Control points at 1/2 wl horizontally, amp vertically
  const hw = wl / 2; // half wavelength
  const cp = hw * 0.55; // bezier control point distance (approx circle = 0.552)

  let d = `M${startX},${y}`;
  for (let i = 0; i < total; i++) {
    const x = startX + i * wl;
    // First half: rise to peak
    d += ` C${x + cp},${y - amp} ${x + hw - cp},${y - amp} ${x + hw},${y}`;
    // Second half: fall to trough
    d += ` C${x + hw + cp},${y + amp} ${x + wl - cp},${y + amp} ${x + wl},${y}`;
  }
  return d;
}

/* ── Wave configuration: rounder, more prominent ── */
const WAVES = [
  // y-center, amplitude, wavelength, duration, direction, strokeWidth, opacity
  { y: 40,  amp: 22, wl: 200, dur: "11s",  dir:  1, sw: 0.6, op: 0.28 },
  { y: 95,  amp: 16, wl: 260, dur: "16s",  dir: -1, sw: 0.4, op: 0.18 },
  { y: 148, amp: 28, wl: 180, dur: "13s",  dir:  1, sw: 0.8, op: 0.35 }, // hero wave
  { y: 200, amp: 18, wl: 240, dur: "15s",  dir: -1, sw: 0.5, op: 0.22 },
  { y: 252, amp: 24, wl: 190, dur: "12s",  dir:  1, sw: 0.7, op: 0.30 },
  { y: 300, amp: 14, wl: 280, dur: "18s",  dir: -1, sw: 0.4, op: 0.16 },
  { y: 345, amp: 20, wl: 210, dur: "14s",  dir:  1, sw: 0.5, op: 0.24 },
];

/* ── Shimmer: the brightest, fastest wave ── */
const SHIMMER = { y: 148, amp: 28, wl: 180, dur: "7s", sw: 0.8 };

export default function GatsbyProjectCard({
  title,
  category,
  image,
  href,
  index = 0,
  imageCount,
  description,
  className = "",
  style,
}: GatsbyProjectCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [noAnim, setNoAnim] = useState(false);

  /* ── Entrance reveal ── */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setNoAnim(true);
      const t = setTimeout(() => setRevealed(true), 80);
      return () => clearTimeout(t);
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.06, rootMargin: "0px 0px -20px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delay = noAnim ? 0 : (index % 3) * 0.12;

  return (
    <Link href={href} className={`gatsby-card-link ${className}`} style={style}>
      <div
        ref={wrapRef}
        className={`gatsby-card${revealed ? " gatsby-revealed" : ""}${noAnim ? " gatsby-no-anim" : ""}`}
        style={{ animationDelay: `${delay}s` }}
      >
        {/* ── Image ── */}
        <div className="gatsby-img-wrap">
          {image ? (
            <Image
              src={image} alt={title} fill unoptimized
              loading={index < 4 ? "eager" : "lazy"}
              priority={index < 2}
              style={{ objectFit: "cover" }}
              className="gatsby-img"
            />
          ) : (
            <div className="gatsby-no-img"><span>Fără imagine</span></div>
          )}

          {/* ── Gold Bézier wave overlay ── */}
          <svg
            className="gatsby-waves"
            viewBox="0 0 500 390"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              {/* Gradient that fades at edges — gives floating shimmer feel */}
              <linearGradient id={`sg-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="rgba(201,169,132,0)" />
                <stop offset="20%"  stopColor="rgba(230,200,160,1)" />
                <stop offset="50%"  stopColor="rgba(201,169,132,1)" />
                <stop offset="80%"  stopColor="rgba(230,200,160,1)" />
                <stop offset="100%" stopColor="rgba(201,169,132,0)" />
              </linearGradient>
              {/* Mask to clip waves inside the card */}
              <clipPath id={`cp-${index}`}>
                <rect x="0" y="0" width="500" height="390" />
              </clipPath>
            </defs>

            <g clipPath={`url(#cp-${index})`}>
              {/* Base waves — cubic Bézier, smooth S-curves */}
              {WAVES.map((w, i) => (
                <path
                  key={i}
                  d={buildWave(w.y, w.amp, w.wl, 4)}
                  stroke={`rgba(201,169,132,${w.op})`}
                  strokeWidth={w.sw}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from={w.dir > 0 ? "0 0" : `${w.wl} 0`}
                    to={w.dir > 0 ? `${w.wl} 0` : "0 0"}
                    dur={w.dur}
                    repeatCount="indefinite"
                  />
                </path>
              ))}

              {/* Shimmer hero wave — gradient stroke, boldest */}
              <path
                d={buildWave(SHIMMER.y, SHIMMER.amp, SHIMMER.wl, 4)}
                stroke={`url(#sg-${index})`}
                strokeWidth={SHIMMER.sw}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 0"
                  to={`${SHIMMER.wl} 0`}
                  dur={SHIMMER.dur}
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </svg>
        </div>

        {/* ── SVG laser border ── */}
        <svg className="gatsby-svg" viewBox="0 0 1000 750" preserveAspectRatio="none" aria-hidden>
          <rect className="gatsby-svg-border" x="4" y="4" width="992" height="742" vectorEffect="non-scaling-stroke" />
          <rect className="gatsby-svg-inner"  x="14" y="14" width="972" height="722" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* ── Gold L-corners ── */}
        <div className="gatsby-corners" aria-hidden />

        {/* ── Content overlay ── */}
        <div className="gatsby-overlay">
          <div className="gatsby-overlay-inner">
            <span className="gatsby-cat">{category}</span>
            <h3 className="gatsby-title">
              {title.replace(/\W+moodilier\s*$/i, "").trim()}
            </h3>
            {description && <p className="gatsby-desc">{description}</p>}
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
