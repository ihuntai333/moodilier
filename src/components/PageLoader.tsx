"use client";

/**
 * CinematicLoader v4 — inspirat din referinta
 * 1. Grid masonry de imagini (colțuri rotunjite, scale+opacity stagger)
 * 2. Toate imaginile dispar simultan
 * 3. Imaginea hero se dezvăluie (aceeași ca prima din slideshow)
 * 4. Bare negre sus/jos se deschid în afară (letterbox reveal)
 * 5. Loader fade-out → pagina apare
 */

import { useEffect, useState } from "react";

/* ─── Imagini grid masonry ─────────────────────────────── */
const GRID_IMGS = [
  { src:"/images-scraped/apptown_exec_28.jpg",           tall: true  },
  { src:"/images-scraped/Black_Pearl_01.jpg",            tall: false },
  { src:"/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", tall: true },
  { src:"/images-scraped/cameraA_03_.jpg",               tall: false },
  { src:"/images-scraped/Mogosoaia_01.jpg",              tall: false },
  { src:"/images-scraped/living_01_.jpg",                tall: true  },
  { src:"/images-scraped/Olimp_03.jpg",                  tall: false },
  { src:"/images-scraped/Black_Pearl_03.jpg",            tall: false },
  { src:"/images-scraped/executie_sediu-office15.jpg",   tall: true  },
  { src:"/images-scraped/buc_giurgiu_1.jpg",             tall: false },
  { src:"/images-scraped/living_06_.jpg",                tall: false },
  { src:"/images-scraped/montaj.jpg",                    tall: false },
];

/* Aceeași imagine ca prima din HeroSlider în FrontPageV6 */
const HERO_IMG = "/images-scraped/vila_corbeanca_exec_living_4.jpg";

/* ─── CSS ──────────────────────────────────────────────── */
const CSS = `
.cl-root {
  position: fixed; inset: 0; z-index: 9999;
  background: #080706; overflow: hidden;
}

/* Hero image ascunsă inițial în spatele grilei */
.cl-hero-bg {
  position: absolute; inset: 0; z-index: 1;
  opacity: 0;
}
.cl-hero-bg img {
  width: 100%; height: 100%; object-fit: cover;
  object-position: center 40%;
  filter: brightness(.72);
}

/* Grid masonry 4 coloane */
.cl-grid {
  position: absolute; inset: 6px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: calc((100vh - 24px) / 3.6);
  gap: 6px;
  z-index: 2;
}
.cl-cell {
  border-radius: 10px; overflow: hidden;
  position: relative;
  opacity: 0; transform: scale(.88);
  will-change: opacity, transform;
  filter: saturate(.25) brightness(.85);
}
.cl-cell.tall { grid-row: span 2; }
.cl-cell img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  display: block;
}

/* Logo centrat */
.cl-logo {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; text-align: center; pointer-events: none;
  mix-blend-mode: difference;
}
.cl-logo-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.8rem); font-weight: 300;
  letter-spacing: .38em; text-transform: uppercase;
  color: #ffffff; padding-right: .38em; display: block;
  opacity: 0; transform: translateY(14px);
}
.cl-logo-line {
  width: 0; height: 1px; margin: .85rem auto .7rem; display: block;
  background: linear-gradient(to right, transparent, #c9a984, transparent);
}
.cl-logo-sub {
  font-family: 'Inter', sans-serif;
  font-size: clamp(.3rem, .75vw, .42rem);
  letter-spacing: .52em; text-transform: uppercase;
  color: #c9a984; padding-right: .52em; display: block; opacity: 0;
}

/* Bare negre letterbox */
.cl-bar {
  position: absolute; left: 0; right: 0;
  background: #080706; z-index: 5;
  will-change: transform;
}
.cl-bar-top    { top: 0;    height: 18%; transform-origin: top; }
.cl-bar-bottom { bottom: 0; height: 18%; transform-origin: bottom; }
`;

export default function CinematicLoader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("cl-shown")) { setVisible(false); return; }

    let tl: any;
    const run = async () => {
      const { gsap } = await import("gsap");
      tl = gsap.timeline();

      /* ── 1. Logo apare ── */
      tl
        .to(".cl-logo-name", { opacity: 1, y: 0, duration: .8, ease: "power3.out" }, 0.1)
        .to(".cl-logo-line", { width: "clamp(70px,10vw,120px)", duration: .6, ease: "power2.inOut" }, 0.65)
        .to(".cl-logo-sub",  { opacity: .7, duration: .5 }, 0.95);

      /* ── 2. Grid imagini apar cu stagger ── */
      tl.to(".cl-cell", {
        opacity: 1,
        scale: 1,
        duration: .55,
        ease: "power2.out",
        stagger: { amount: .65, from: "random" },
      }, 1.1);

      /* ── 3. Logo dispare, grid dispare ── */
      tl
        .to(".cl-logo",  { opacity: 0, duration: .4, ease: "power2.in" }, 2.6)
        .to(".cl-cell",  { opacity: 0, scale: .92, duration: .55, stagger: { amount: .3, from: "random" }, ease: "power2.in" }, 2.65);

      /* ── 4. Hero image apare în spatele ── */
      tl.to(".cl-hero-bg", { opacity: 1, duration: .5, ease: "power2.out" }, 3.0);

      /* ── 5. Bare se deschid în afară (letterbox reveal) ── */
      tl
        .to(".cl-bar-top",    { y: "-100%", duration: .75, ease: "power2.inOut" }, 3.35)
        .to(".cl-bar-bottom", { y: "100%",  duration: .75, ease: "power2.inOut" }, 3.35);

      /* ── 6. Fade-out → pagina ── */
      tl.to(".cl-root", {
        opacity: 0, duration: .55, ease: "power2.in",
        onComplete: () => {
          sessionStorage.setItem("cl-shown", "1");
          setVisible(false);
        },
      }, 4.0);
    };

    run();
    return () => { tl?.kill(); };
  }, []);

  if (!mounted || !visible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cl-root" aria-hidden="true">

        {/* Hero image în fundal (se dezvăluie după ce grila dispare) */}
        <div className="cl-hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMG} alt="" loading="eager" />
        </div>

        {/* Bare negre letterbox */}
        <div className="cl-bar cl-bar-top"    aria-hidden />
        <div className="cl-bar cl-bar-bottom" aria-hidden />

        {/* Grid masonry */}
        <div className="cl-grid">
          {GRID_IMGS.map((img, i) => (
            <div key={i} className={`cl-cell${img.tall ? " tall" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt="" loading="eager" />
            </div>
          ))}
        </div>

        {/* Logo */}
        <div className="cl-logo">
          <span className="cl-logo-name">Moodilier</span>
          <span className="cl-logo-line" />
          <span className="cl-logo-sub">✦ Signature ✦</span>
        </div>

      </div>
    </>
  );
}
