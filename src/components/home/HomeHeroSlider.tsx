"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
 * Full-bleed hero — single active media node (no parallel 100MB downloads).
 * Poster is LCP; video mounts only when ready / active.
 */
export default function HomeHeroSlider({
  slides,
  defaultDurationSec = 10,
  label = "",
  titleHtml = "The Art of<br />Custom Furniture",
  body = "",
  ctaPrimaryLabel = "Descoperă proiectele",
  ctaPrimaryHref = "/proiecte",
  ctaSecondaryLabel = "Solicită o ofertă",
  ctaSecondaryHref = "/contact",
}: Props) {
  const list = resolveSlides(slides);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const active = list[index % list.length];
  const poster =
    active.poster ||
    (active.type === "video"
      ? active.id === "vid-2"
        ? "/videos/poster-2.webp"
        : "/videos/poster-1.webp"
      : active.src) ||
    "/projects/villa-06/01.living.cover.webp";

  useEffect(() => {
    let settled = false;
    const go = () => {
      if (settled) return;
      settled = true;
      setReady(true);
    };

    if (document.documentElement.classList.contains("aw-intro-done")) {
      go();
      return;
    }

    window.addEventListener("aw-intro-done", go);
    // Head script marks pending on homepage; only start early if intro is disabled
    const poll = window.setTimeout(() => {
      if (document.documentElement.classList.contains("aw-intro-pending")) return;
      if (document.querySelector(".aw-intro")) return;
      if (document.documentElement.classList.contains("aw-intro-done")) {
        go();
        return;
      }
      // No intro expected — allow hero media
      go();
    }, 120);
    const failsafe = window.setTimeout(go, 2800);

    return () => {
      window.removeEventListener("aw-intro-done", go);
      window.clearTimeout(poll);
      window.clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    setMediaReady(active.type !== "video");
  }, [active]);

  useEffect(() => {
    if (!ready) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);

    if (active.type === "video") {
      const v = videoRef.current;
      if (v) {
        v.muted = true;
        v.defaultMuted = true;
        v.loop = true;
        const play = () => {
          void v.play().catch(() => {});
          setMediaReady(true);
        };
        if (v.readyState >= 2) play();
        else {
          v.addEventListener("canplay", play, { once: true });
        }
      }
    } else {
      setMediaReady(true);
    }

    // Single slide = continuous background (video loops); no carousel timer
    if (list.length <= 1) {
      return () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
    }

    const ms = Math.max(10, active.durationSec || defaultDurationSec) * 1000;
    const goNext = () => setIndex((i) => (i + 1) % list.length);
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
        {/* LCP poster — always painted first */}
        <div
          className={`aw-hero-slide aw-hero-poster${mediaReady && active.type === "video" ? " is-dim" : " is-on"}`}
          data-key="home.hero.poster"
          data-editable="image"
        >
          <Image
            src={poster}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={90}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {ready && active.type === "video" ? (
          <div className={`aw-hero-slide${mediaReady ? " is-on" : ""}`}>
            <video
              key={active.src}
              ref={videoRef}
              className="aw-hero-video"
              src={active.src}
              muted
              playsInline
              autoPlay
              loop
              preload="metadata"
              poster={poster}
              onCanPlay={() => setMediaReady(true)}
            />
          </div>
        ) : null}

        {ready && active.type === "image" ? (
          <div
            className="aw-hero-slide is-on"
            data-key="home.hero.image"
            data-editable="image"
          >
            <Image
              src={active.src}
              alt=""
              fill
              sizes="100vw"
              quality={90}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        ) : null}

        <div className="aw-hero-scrim" />
      </div>

      <div className="aw-hero-fade" aria-hidden />

      <div className="aw-hero-overlay">
        <div className="aw-hero-copy">
          {label ? (
            <p className="aw-label" data-key="home.hero.label" data-editable="text">
              {label}
            </p>
          ) : null}
          <h1
            id="aw-hero-title"
            className="aw-h1"
            data-key="home.hero.title"
            data-editable="html"
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
          {body ? (
            <p className="aw-body" data-key="home.hero.body" data-editable="text">
              {body}
            </p>
          ) : null}
          <div className="aw-hero-ctas">
            <a
              href={ctaPrimaryHref}
              className="aw-btn aw-btn-primary aw-btn-fill"
              data-key="home.hero.cta_primary"
              data-editable="link"
            >
              <span data-key="home.hero.cta_primary_label" data-editable="text">
                {ctaPrimaryLabel}
              </span>
              <ArrowRight size={14} />
            </a>
            <a
              href={ctaSecondaryHref}
              className="aw-btn-ghost aw-link-slide"
              data-key="home.hero.cta_secondary"
              data-editable="link"
            >
              <span data-key="home.hero.cta_secondary_label" data-editable="text">
                {ctaSecondaryLabel}
              </span>
            </a>
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
              aria-label={`Slide ${i + 1} din ${list.length}`}
              aria-selected={i === index % list.length}
              className={i === index % list.length ? "is-on" : undefined}
              onClick={() => {
                setMediaReady(false);
                setIndex(i);
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
