"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroSlide } from "@/lib/site-settings";

type Props = {
  slides: HeroSlide[];
  defaultDurationSec?: number;
  label?: string;
  titleHtml?: string;
  body?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

/**
 * Full-bleed homepage hero — video + image slides, copy over media.
 */
export default function HomeHeroSlider({
  slides,
  defaultDurationSec = 6,
  label = "Tailored ✦ Furniture",
  titleHtml = "The Art of<br />Custom Furniture",
  body = "Mobilier premium pe comandă, executat impecabil.",
  ctaPrimaryLabel = "Descoperă proiectele",
  ctaPrimaryHref = "/proiecte",
  ctaSecondaryLabel = "Solicită o ofertă",
  ctaSecondaryHref = "/contact",
}: Props) {
  const list = slides.length
    ? slides
    : [
        {
          id: "fallback",
          type: "image" as const,
          src: "/projects/villa-06/01.cover.webp",
          durationSec: defaultDurationSec,
        },
      ];

  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const active = list[index % list.length];

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    const ms = Math.max(2, active.durationSec || defaultDurationSec) * 1000;
    const goNext = () => setIndex((i) => (i + 1) % list.length);

    if (active.type === "video") {
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        void v.play().catch(() => {});
      }
      // Advance by duration setting (not only video end) so admin control works
      timerRef.current = window.setTimeout(goNext, ms);
    } else {
      timerRef.current = window.setTimeout(goNext, ms);
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [active, defaultDurationSec, list.length]);

  return (
    <section
      className="aw-hero aw-hero-full"
      aria-labelledby="aw-hero-title"
      data-section-id="hero"
      data-section-name="Hero"
    >
      <div className="aw-hero-slides" aria-hidden>
        {list.map((slide, i) => {
          const on = i === index % list.length;
          return (
            <div
              key={slide.id || `${slide.src}-${i}`}
              className={`aw-hero-slide${on ? " is-on" : ""}`}
            >
              {slide.type === "video" ? (
                <video
                  ref={on ? videoRef : undefined}
                  className="aw-hero-video"
                  src={slide.src}
                  muted
                  playsInline
                  loop
                  preload={on ? "auto" : "metadata"}
                  poster={slide.poster || "/projects/villa-06/01.cover.webp"}
                />
              ) : (
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              )}
            </div>
          );
        })}
        <div className="aw-hero-scrim" />
      </div>

      <div className="aw-hero-overlay">
        <div className="aw-hero-copy">
          <p className="aw-label aw-reveal" data-key="home.hero.label" data-editable="text">
            {label}
          </p>
          <h1
            id="aw-hero-title"
            className="aw-h1 aw-reveal"
            data-split-lines
            data-key="home.hero.title"
            data-editable="html"
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
          <p className="aw-body aw-reveal" data-key="home.hero.body" data-editable="text">
            {body}
          </p>
          <div className="aw-hero-ctas aw-reveal">
            <Link
              href={ctaPrimaryHref}
              className="aw-btn aw-btn-primary aw-btn-fill"
              data-key="home.hero.cta_primary"
              data-editable="link"
            >
              <span data-key="home.hero.cta_primary_label" data-editable="text">
                {ctaPrimaryLabel}
              </span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href={ctaSecondaryHref}
              className="aw-btn-ghost aw-link-slide"
              data-key="home.hero.cta_secondary"
              data-editable="link"
            >
              <span data-key="home.hero.cta_secondary_label" data-editable="text">
                {ctaSecondaryLabel}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {list.length > 1 ? (
        <div className="aw-hero-dots" role="tablist" aria-label="Slide-uri hero">
          {list.map((slide, i) => (
            <button
              key={slide.id || i}
              type="button"
              role="tab"
              aria-selected={i === index % list.length}
              className={i === index % list.length ? "is-on" : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
