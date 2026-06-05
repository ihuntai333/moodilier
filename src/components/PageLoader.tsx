"use client";

/**
 * CinematicLoader v7 — fără flash, ieșire cu hero + bare
 *
 * FLASH FIX:
 *   • Toate elementele din loader au opacity:0 în CSS ÎNAINTE ca GSAP să fie încărcat
 *   • Astfel nu există niciun moment în care conținutul e vizibil fără animație
 *
 * IEȘIRE:
 *   • Grila dispare → hero image (aceeași ca slide 1 din homepage) apare
 *   • Bare negre sus/jos (letterbox) → se expandează în afară
 *   • Fade-out → pagina reală (cu aceeași imagine în hero)
 */

import { useEffect, useRef, useState } from "react";

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

/* Aceeași imagine ca slide[0] din HeroSlider în FrontPageV6 */
const HERO_IMG = "/images-scraped/vila_corbeanca_exec_living_4.jpg";

const CSS = `
/* ── Root ────────────────────────────────────────────────── */
.cl-root {
  position: fixed; inset: 0; z-index: 9999;
  background: #080706; overflow: hidden;
}

/* ── Grid masonry ─────────────────────────────────────────── */
.cl-grid {
  position: absolute; inset: 6px; z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: calc((100vh - 24px) / 3.6);
  gap: 6px;
}

/* STARE INIȚIALĂ VIA CSS — previne flash-ul înainte de GSAP */
.cl-cell {
  border-radius: 10px; overflow: hidden; position: relative;
  filter: saturate(.2) brightness(.8);
  opacity: 0;                  /* ← ascuns din start */
  transform: translateY(28px); /* ← poziție inițială */
  will-change: opacity, transform;
}
.cl-cell.tall { grid-row: span 2; }
.cl-cell img {
  width: 100%; height: 100%; object-fit: cover;
  object-position: center; display: block;
  will-change: transform;
}

/* ── Logo ─────────────────────────────────────────────────── */
.cl-logo {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; text-align: center; pointer-events: none;
}
/* STARE INIȚIALĂ VIA CSS */
.cl-logo-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 300;
  letter-spacing: .38em; text-transform: uppercase;
  color: #e8e0d5; padding-right: .38em; display: block;
  opacity: 0;                  /* ← ascuns din start */
  transform: translateY(18px); /* ← poziție inițială */
}
.cl-logo-line {
  height: 1px; margin: .85rem auto .7rem; display: block;
  background: linear-gradient(to right, transparent, #c9a984, transparent);
  width: 0;                    /* ← ascuns din start */
}
.cl-logo-sub {
  font-family: 'Inter', sans-serif;
  font-size: clamp(.3rem, .75vw, .42rem);
  letter-spacing: .52em; text-transform: uppercase;
  color: #c9a984; padding-right: .52em; display: block;
  opacity: 0;                  /* ← ascuns din start */
}

/* ── Hero background (ieșire) ─────────────────────────────── */
.cl-hero-bg {
  position: absolute; inset: 0; z-index: 1; opacity: 0;
}
.cl-hero-bg img {
  width: 100%; height: 100%; object-fit: cover;
  object-position: center 40%; display: block;
  filter: brightness(.72);
}

/* ── Bare letterbox ───────────────────────────────────────── */
.cl-bar {
  position: absolute; left: 0; right: 0;
  background: #080706; z-index: 8;
  will-change: transform;
}
.cl-bar-top    { top: 0;    height: 18%; }
.cl-bar-bottom { bottom: 0; height: 18%; }
`;

type Phase = "ssr" | "animating" | "done";

export default function CinematicLoader() {
  const [phase, setPhase] = useState<Phase>("ssr");
  const tlRef = useRef<any>(null);

  useEffect(() => {
    if (sessionStorage.getItem("cl-shown")) {
      setPhase("done");
      return;
    }
    // Blochează scroll pe mobil în timp ce loaderul rulează
    document.body.style.overflow = "hidden";
    setPhase("animating");

    const run = async () => {
      const { gsap } = await import("gsap");

      /* GSAP nu mai trebuie să seteze starea inițială — CSS o face.
         Setăm explicit doar barele (nu au CSS initial definit sus). */
      gsap.set(".cl-bar-top",    { y: "0%" });
      gsap.set(".cl-bar-bottom", { y: "0%" });

      const tl = gsap.timeline();
      tlRef.current = tl;

      /* ── 1. Logo (0.2 – 2s) ── */
      tl
        .to(".cl-logo-name", { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }, 0.2)
        .to(".cl-logo-line", { width: "clamp(80px,11vw,130px)", duration: .75, ease: "power2.inOut" }, 0.9)
        .to(".cl-logo-sub",  { opacity: .7, duration: .6 }, 1.2);

      /* ── 2. Grid apare cu stagger (2.1s+) ── */
      tl.to(".cl-cell", {
        opacity: 1, y: 0,
        duration: .65, ease: "power3.out",
        stagger: { amount: .75, from: "random" },
      }, 2.1);

      /* Drift continuu pe imagini — efect viu */
      tl.to(".cl-cell img", {
        y: "-10px", duration: 2.4, ease: "sine.inOut",
        stagger: { amount: .6, from: "random" },
        repeat: -1, yoyo: true,
      }, 2.3);

      /* ── 3. Logo dispare (3.5s) ── */
      tl.to(".cl-logo", {
        opacity: 0, y: -10,
        duration: .5, ease: "power2.inOut",
      }, 3.5);

      /* ── 4. Grid dispare (3.6s) ── */
      tl.to(".cl-cell", {
        opacity: 0,
        duration: .65, ease: "power2.inOut",
        stagger: { amount: .25, from: "random" },
      }, 3.6);

      /* ── 5. Hero image apare (4.1s) ── */
      tl.to(".cl-hero-bg", {
        opacity: 1, duration: .6, ease: "power2.out",
      }, 4.1);

      /* ── 6. Bare se deschid în afară — letterbox reveal (4.5s) ── */
      tl
        .to(".cl-bar-top",    { y: "-100%", duration: .9, ease: "expo.inOut" }, 4.5)
        .to(".cl-bar-bottom", { y:  "100%", duration: .9, ease: "expo.inOut" }, 4.5);

      /* ── 7. Fade-out (5.3s) ── */
      tl.to(".cl-root", {
        opacity: 0, duration: .55, ease: "power2.in",
        onComplete: () => {
          document.body.style.overflow = "";
          window.scrollTo({ top: 0, behavior: "instant" });
          sessionStorage.setItem("cl-shown", "1");
          setPhase("done");
        },
      }, 5.3);
    };

    run();
    return () => { tlRef.current?.kill(); };
  }, []);

  /* SSR / before hydration → div negru simplu (conținut adăugat la animating) */
  if (phase === "ssr") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="cl-root" aria-hidden="true" />
      </>
    );
  }

  if (phase === "done") return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cl-root" aria-hidden="true">

        {/* Hero image — apare la ieșire */}
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
