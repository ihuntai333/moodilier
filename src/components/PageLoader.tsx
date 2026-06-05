"use client";

/**
 * CinematicLoader — Intro animat la prima vizită:
 * 1. Logo Moodilier apare (fade + slide)
 * 2. Grid de imagini mici apare cu stagger (clip-path reveal)
 * 3. Imaginile derivă ușor (drift float)
 * 4. Imaginea hero face zoom la full-screen
 * 5. Tot fade-out → pagina se dezvăluie
 *
 * Rulează O SINGURĂ DATĂ per sesiune (sessionStorage).
 */

import { useEffect, useState } from "react";

/* ── Imaginile din galerie (11 miniaturi + 1 hero ce face zoom) ── */
const THUMB_IMAGES = [
  "/images-scraped/apptown_exec_28.jpg",
  "/images-scraped/Black_Pearl_01.jpg",
  "/images-scraped/buc_giurgiu_1.jpg",
  "/images-scraped/cameraA_03_.jpg",
  "/images-scraped/Mogosoaia_01.jpg",
  "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg",
  "/images-scraped/living_01_.jpg",
  "/images-scraped/Olimp_03.jpg",
  "/images-scraped/executie_sediu-office15.jpg",
  "/images-scraped/Black_Pearl_03.jpg",
  "/images-scraped/living_06_.jpg",
];

/* Imaginea care face zoom → este prima din hero slideshow */
const HERO_IMG = "/images-scraped/vila_corbeanca_exec_living_4.jpg";

/* ── CSS ── */
const CSS = `
.cl-root {
  position: fixed; inset: 0; z-index: 9999;
  background: #080706;
  overflow: hidden;
}

/* Logo centrat absolut pe overlay */
.cl-logo {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; text-align: center;
  pointer-events: none;
}
.cl-logo-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 300; letter-spacing: .38em;
  text-transform: uppercase; color: #e8e0d5;
  padding-right: .38em; display: block;
  opacity: 0; transform: translateY(14px);
}
.cl-logo-line {
  width: 0; height: 1px; margin: .9rem auto .7rem;
  background: linear-gradient(to right, transparent, #c9a984, transparent);
  display: block;
}
.cl-logo-sub {
  font-family: 'Inter', sans-serif;
  font-size: clamp(.3rem, .75vw, .42rem);
  letter-spacing: .52em; text-transform: uppercase;
  color: #c9a984; padding-right: .52em;
  opacity: 0; display: block;
}

/* Grid 4×3 care acoperă ecranul */
.cl-grid {
  position: absolute; inset: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 3px;
  z-index: 1;
}

.cl-cell {
  overflow: hidden; position: relative;
  clip-path: inset(0 0 100% 0); /* ascunse inițial */
  will-change: clip-path, transform;
}
.cl-cell img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  display: block;
  transform: scale(1.08); /* ușor oversized */
  transition: transform 0s;
}

/* Hero cell — pe rândul 2, coloana 2 */
.cl-hero {
  grid-column: 2; grid-row: 2;
  z-index: 3;
  transform-origin: center center;
}

/* Overlay negru peste grid care apare înainte de zoom */
.cl-ov {
  position: absolute; inset: 0; z-index: 2;
  background: #080706; opacity: 0;
  pointer-events: none;
}

/* Fade-out final al întregului loader */
.cl-root.cl-exit {
  opacity: 0;
  transition: opacity 0.65s cubic-bezier(.4,0,.2,1);
}
`;

export default function CinematicLoader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    /* Arată doar o dată per sesiune */
    if (sessionStorage.getItem("cl-shown")) {
      setVisible(false);
      return;
    }

    let tl: any;

    const run = async () => {
      const { gsap } = await import("gsap");
      tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* ── Faza 1: Logo apare ── */
      tl
        .to(".cl-logo-name", { opacity: 1, y: 0, duration: 0.85 }, 0.15)
        .to(".cl-logo-line", { width: "clamp(70px, 10vw, 120px)", duration: 0.65, ease: "power2.inOut" }, 0.75)
        .to(".cl-logo-sub",  { opacity: 0.7, duration: 0.55 }, 1.05);

      /* ── Faza 2: Imaginile mici apar cu stagger ── */
      tl.to(".cl-cell", {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.45,
        ease: "power2.out",
        stagger: { amount: 0.6, from: "random" },
      }, 1.4);

      /* ── Faza 3: Imagini derivă ușor (float) ── */
      tl.to(".cl-cell:not(.cl-hero)", {
        y: (i: number) => (i % 2 === 0 ? -10 : 10),
        x: (i: number) => (i % 3 === 0 ? -6 : 6),
        duration: 1.0,
        ease: "power1.inOut",
        stagger: 0.03,
      }, 2.0);

      /* ── Faza 4: Logo dispare, celelalte imagini dispar ── */
      tl
        .to(".cl-logo",           { opacity: 0, duration: 0.4, ease: "power2.in" }, 2.7)
        .to(".cl-cell:not(.cl-hero)", { opacity: 0, duration: 0.5, stagger: 0.02 }, 2.75);

      /* ── Faza 5: Hero face zoom la full-screen ── */
      tl.to(".cl-hero", {
        scale: 5,
        duration: 1.0,
        ease: "power2.inOut",
      }, 3.0);

      /* ── Faza 6: Fade-out complet ── */
      tl.to(".cl-root", {
        opacity: 0,
        duration: 0.65,
        ease: "power2.in",
        onComplete: () => {
          sessionStorage.setItem("cl-shown", "1");
          setVisible(false);
        },
      }, 3.7);
    };

    run();

    return () => { tl?.kill(); };
  }, []);

  /* Redă skeleton în SSR, nu afișa nimic dacă sesiunea e veche */
  if (!mounted || !visible) return null;

  /* Build grid: 11 thumbs + hero la poziția 5 (row2/col2) */
  const cells: { src: string; isHero: boolean }[] = [];
  let t = 0;
  for (let i = 0; i < 12; i++) {
    const isHero = i === 5; // a 6-a celulă = row2/col2
    cells.push({ src: isHero ? HERO_IMG : THUMB_IMAGES[t++], isHero });
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cl-root" aria-hidden="true">

        {/* Logo */}
        <div className="cl-logo">
          <span className="cl-logo-name">Moodilier</span>
          <span className="cl-logo-line" />
          <span className="cl-logo-sub">✦ Signature ✦</span>
        </div>

        {/* Grid imagini */}
        <div className="cl-grid">
          {cells.map((c, i) => (
            <div
              key={i}
              className={`cl-cell${c.isHero ? " cl-hero" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt="" loading="eager" />
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
