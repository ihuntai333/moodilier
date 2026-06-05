"use client";

/**
 * CinematicLoader v5
 * • Start curat din negru
 * • Logo ține mai mult (2s cu logo înainte de imagini)
 * • Imagini se mișcă (drift vertical lent)
 * • Fără glitch — gsap.set() explicit pentru initial state
 */

import { useEffect, useState } from "react";

const GRID_IMGS = [
  { src: "/images-scraped/apptown_exec_28.jpg",                          tall: true  },
  { src: "/images-scraped/Black_Pearl_01.jpg",                           tall: false },
  { src: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", tall: true  },
  { src: "/images-scraped/cameraA_03_.jpg",                              tall: false },
  { src: "/images-scraped/Mogosoaia_01.jpg",                             tall: false },
  { src: "/images-scraped/living_01_.jpg",                               tall: true  },
  { src: "/images-scraped/Olimp_03.jpg",                                 tall: false },
  { src: "/images-scraped/Black_Pearl_03.jpg",                           tall: false },
  { src: "/images-scraped/executie_sediu-office15.jpg",                  tall: true  },
  { src: "/images-scraped/buc_giurgiu_1.jpg",                            tall: false },
  { src: "/images-scraped/living_06_.jpg",                               tall: false },
  { src: "/images-scraped/montaj.jpg",                                   tall: false },
];

const HERO_IMG = "/images-scraped/vila_corbeanca_exec_living_4.jpg";

const CSS = `
/* ── Root ── */
.cl-root {
  position: fixed; inset: 0; z-index: 9999;
  background: #080706;
  overflow: hidden;
}

/* ── Hero image în spate ── */
.cl-hero-bg {
  position: absolute; inset: 0; z-index: 1;
  opacity: 0;
}
.cl-hero-bg img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center 40%;
  filter: brightness(.72);
  display: block;
}

/* ── Grid ── */
.cl-grid {
  position: absolute; inset: 6px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: calc((100vh - 24px) / 3.6);
  gap: 6px;
  z-index: 2;
}

/* ── Celule ── */
.cl-cell {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  /* initial state setat prin gsap.set — nu prin CSS */
  filter: saturate(.2) brightness(.8);
}
.cl-cell.tall { grid-row: span 2; }
.cl-cell img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  display: block;
  /* Mișcarea imagine = pe img, nu pe container */
  transform: scale(1.15) translateY(0px);
  will-change: transform;
}

/* ── Logo ── */
.cl-logo {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
  pointer-events: none;
}
.cl-logo-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 300;
  letter-spacing: .38em;
  text-transform: uppercase;
  color: #e8e0d5;
  padding-right: .38em;
  display: block;
}
.cl-logo-line {
  height: 1px;
  margin: .85rem auto .7rem;
  display: block;
  background: linear-gradient(to right, transparent, #c9a984, transparent);
}
.cl-logo-sub {
  font-family: 'Inter', sans-serif;
  font-size: clamp(.3rem, .75vw, .42rem);
  letter-spacing: .52em;
  text-transform: uppercase;
  color: #c9a984;
  padding-right: .52em;
  display: block;
}

/* ── Bare letterbox ── */
.cl-bar {
  position: absolute; left: 0; right: 0;
  background: #080706;
  z-index: 6;
  will-change: transform;
}
.cl-bar-top    { top: 0;    height: 18%; }
.cl-bar-bottom { bottom: 0; height: 18%; }
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

      /* ── Set stări inițiale explicit (fără CSS) → zero glitch ── */
      gsap.set(".cl-logo-name", { opacity: 0, y: 18 });
      gsap.set(".cl-logo-line", { width: 0 });
      gsap.set(".cl-logo-sub",  { opacity: 0 });
      gsap.set(".cl-cell",      { opacity: 0, y: 30 });
      gsap.set(".cl-hero-bg",   { opacity: 0 });
      gsap.set(".cl-bar-top",   { y: "0%" });
      gsap.set(".cl-bar-bottom",{ y: "0%" });

      tl = gsap.timeline();

      /* ── Faza 1: LOGO apare (0 – 2s) ── */
      tl
        .to(".cl-logo-name", {
          opacity: 1, y: 0,
          duration: 1.0, ease: "power3.out",
        }, 0.2)
        .to(".cl-logo-line", {
          width: "clamp(80px,11vw,130px)",
          duration: .75, ease: "power2.inOut",
        }, 0.85)
        .to(".cl-logo-sub", {
          opacity: .7,
          duration: .6,
        }, 1.15);

      /* ── Pauză cu logo ── */
      // Logo rămâne vizibil 1s extra înainte de a apărea imaginile

      /* ── Faza 2: Imagini apar cu stagger + mișcare ── */
      tl.to(".cl-cell", {
        opacity: 1,
        y: 0,
        duration: .65,
        ease: "power3.out",
        stagger: { amount: .7, from: "random" },
      }, 2.3);

      /* Mișcare continuă a imaginilor (drift vertical pe img interior) */
      tl.to(".cl-cell img", {
        translateY: "-8px",
        scale: 1.15,          // menține scale existent
        duration: 2.5,
        ease: "sine.inOut",
        stagger: { amount: .4, from: "random" },
        repeat: -1,
        yoyo: true,
      }, 2.5);

      /* ── Faza 3: Logo dispare ── */
      tl.to(".cl-logo", {
        opacity: 0, y: -10,
        duration: .45, ease: "power2.in",
      }, 3.8);

      /* ── Faza 4: Imagini dispar cu stagger ── */
      tl.to(".cl-cell", {
        opacity: 0,
        y: -20,
        duration: .5,
        ease: "power2.in",
        stagger: { amount: .35, from: "random" },
      }, 3.9);

      /* ── Faza 5: Hero image apare ── */
      tl.to(".cl-hero-bg", {
        opacity: 1,
        duration: .55, ease: "power2.out",
      }, 4.4);

      /* ── Faza 6: Bare se deschid ── */
      tl
        .to(".cl-bar-top",    { y: "-100%", duration: .8, ease: "power2.inOut" }, 4.75)
        .to(".cl-bar-bottom", { y:  "100%", duration: .8, ease: "power2.inOut" }, 4.75);

      /* ── Faza 7: Fade-out ── */
      tl.to(".cl-root", {
        opacity: 0,
        duration: .6, ease: "power2.in",
        onComplete: () => {
          sessionStorage.setItem("cl-shown", "1");
          setVisible(false);
        },
      }, 5.45);
    };

    run();
    return () => { tl?.kill(); };
  }, []);

  if (!mounted || !visible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cl-root" aria-hidden="true">

        {/* Hero image în fundal */}
        <div className="cl-hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMG} alt="" loading="eager" />
        </div>

        {/* Bare letterbox */}
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
