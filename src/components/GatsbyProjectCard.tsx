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

/* Sine wave path generator — horizontal sinusoid */
function wavePath(y: number, amp: number, freq: number) {
  const pts: string[] = [];
  // spans -400 to 800 so the looping translate never shows a gap
  for (let x = -400; x <= 900; x += 60) {
    const wy = y + Math.sin((x / freq) * Math.PI) * amp;
    pts.push(`${pts.length === 0 ? "M" : "L"}${x} ${wy}`);
  }
  return pts.join(" ");
}

const WAVES = [
  { y: 30,  amp: 14, freq: 80,  dur: "5s",   dir: 1,  op: 0.18 },
  { y: 80,  amp: 10, freq: 100, dur: "7s",   dir: -1, op: 0.12 },
  { y: 130, amp: 18, freq: 70,  dur: "6s",   dir: 1,  op: 0.15 },
  { y: 180, amp: 12, freq: 90,  dur: "8.5s", dir: -1, op: 0.11 },
  { y: 230, amp: 16, freq: 75,  dur: "6.5s", dir: 1,  op: 0.14 },
  { y: 280, amp: 9,  freq: 110, dur: "7.5s", dir: -1, op: 0.10 },
];

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

  /* Entrance reveal via IntersectionObserver */
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -20px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delay = noAnim ? 0 : (index % 3) * 0.1;

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
            <div className="gatsby-no-img"><span>Fără imagine</span></div>
          )}

          {/* ── Gold wave overlay ── */}
          <svg
            className="gatsby-waves"
            viewBox="0 0 500 310"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {WAVES.map((w, i) => (
              <path
                key={i}
                d={wavePath(w.y, w.amp, w.freq)}
                stroke={`rgba(201,169,132,${w.op})`}
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from={w.dir > 0 ? "0 0" : "400 0"}
                  to={w.dir > 0 ? "400 0" : "0 0"}
                  dur={w.dur}
                  repeatCount="indefinite"
                />
              </path>
            ))}
          </svg>
        </div>

        {/* ── SVG laser border ── */}
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

        {/* ── Gold L-corners ── */}
        <div className="gatsby-corners" aria-hidden />

        {/* ── Content overlay ── */}
        <div className="gatsby-overlay">
          <div className="gatsby-overlay-inner">
            <span className="gatsby-cat">{category}</span>
            <h3 className="gatsby-title">{title}</h3>
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
