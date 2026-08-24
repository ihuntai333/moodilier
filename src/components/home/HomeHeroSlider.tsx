"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DEFAULT_HERO_SLIDES, type HeroSlide } from "@/lib/site-settings";

type Props = {
  slides?: HeroSlide[];
  defaultDurationSec?: number;
  label?: string;
  titleHtml?: string;
  body?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

/** Prefer local defaults with videos; ignore chaotic admin-only image lists. */
function resolveSlides(slides: HeroSlide[] | undefined): HeroSlide[] {
  const defaults = DEFAULT_HERO_SLIDES.map((s) => ({ ...s, durationSec: 10 }));
  if (!slides?.length) return defaults;

  const videos = slides.filter((s) => s.type === "video" && s.src?.includes("/videos/"));
  if (videos.length === 0) return defaults;

  const images = slides.filter((s) => s.type === "image" && s.src);
  return [
    ...videos.map((s) => ({ ...s, durationSec: Math.max(10, s.durationSec || 10) })),
    ...images.map((s) => ({ ...s, durationSec: Math.max(10, s.durationSec || 10) })),
  ];
}

/**
 * Full-bleed homepage hero — always starts with video, 10s slides, bottom white fade.
 */
export default function HomeHeroSlider({
  slides,
  defaultDurationSec = 10,
  label = "Tailored ✦ Furniture",
  titleHtml = "The Art of<br />Custom Furniture",
  body = "Mobilier premium pe comandă, executat impecabil.",
  ctaPrimaryLabel = "Descoperă proiectele",
  ctaPrimaryHref = "/proiecte",
  ctaSecondaryLabel = "Solicită o ofertă",
  ctaSecondaryHref = "/contact",
}: Props) {
  const list = resolveSlides(slides);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const timerRef = useRef<number | null>(null);
  const active = list[index % list.length];

  useEffect(() => {
    if (document.documentElement.classList.contains("aw-intro-done")) {
      setReady(true);
      return;
    }
    if (!document.querySelector(".aw-intro")) {
      setReady(true);
      return;
    }
    const onDone = () => setReady(true);
    window.addEventListener("aw-intro-done", onDone);
    const failsafe = window.setTimeout(onDone, 3500);
    return () => {
      window.removeEventListener("aw-intro-done", onDone);
      window.clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);

    const ms = Math.max(10, active.durationSec || defaultDurationSec) * 1000;
    const goNext = () => setIndex((i) => (i + 1) % list.length);

    if (active.type === "video") {
      const v = videoRefs.current.get(index % list.length);
      if (v) {
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;
        const play = () => {
          v.currentTime = 0;
          void v.play().catch(() => {});
        };
        if (v.readyState >= 2) play();
        else v.addEventListener("loadeddata", play, { once: true });
      }
    }

    timerRef.current = window.setTimeout(goNext, ms);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [active, defaultDurationSec, list.length, ready, index]);

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
                  ref={(el) => {
                    if (el) videoRefs.current.set(i, el);
                    else videoRefs.current.delete(i);
                  }}
                  className="aw-hero-video"
                  src={slide.src}
                  muted
                  playsInline
                  autoPlay={on && ready}
                  loop
                  preload={i <= 1 ? "auto" : "metadata"}
                  poster={slide.poster || "/projects/villa-06/01.living.cover.webp"}
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

      {/* Fade sits on section so it always paints above media */}
      <div className="aw-hero-fade" aria-hidden />

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
