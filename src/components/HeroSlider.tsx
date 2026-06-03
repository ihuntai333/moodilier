"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  pos?: string;
}

interface HeroSliderProps {
  slides: Slide[];
  intervalMs?: number;
  className?: string;
}

/**
 * HeroSlider — crossfade slideshow for hero backgrounds.
 * Stacks all images, transitions opacity between them.
 * Used on v6 and main page hero sections.
 */
export default function HeroSlider({ slides, intervalMs = 5000, className = "" }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [slides.length, intervalMs]);

  return (
    <>
      {slides.map((slide, i) => (
        <div
          key={i}
          className={className}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.6s cubic-bezier(.4,0,.2,1)",
            zIndex: i === current ? 1 : 0,
          }}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            quality={85}
            style={{
              objectFit: "cover",
              objectPosition: slide.pos ?? "center 35%",
            }}
            unoptimized
          />
        </div>
      ))}
      {/* Dot indicators */}
      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "1.4rem",
            right: "5vw",
            zIndex: 10,
            display: "flex",
            gap: "0.45rem",
            alignItems: "center",
          }}
          aria-hidden="true"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? "1.8rem" : "0.35rem",
                height: "0.35rem",
                borderRadius: "4px",
                background: i === current ? "#c9a984" : "rgba(201,169,132,0.35)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.4s ease, background 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
