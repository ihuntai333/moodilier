"use client";

/**
 * CinematicLoader v3
 * • Rând 1 → STÂNGA  |  Rând 2 → DREAPTA  |  Rând 3 → STÂNGA
 * • Hero (centru rând 2) → zoom + blur → full screen
 * • Bare negre sus/jos → se expandează în afară (letterbox open)
 * • Imagine = prima din hero slideshow → tranziție fără rupere
 */

import { useEffect, useState } from "react";

const ROW1 = [
  "/images-scraped/apptown_exec_28.jpg",
  "/images-scraped/Black_Pearl_01.jpg",
  "/images-scraped/living_01_.jpg",
  "/images-scraped/cameraA_03_.jpg",
];
const ROW2_LEFT  = ["/images-scraped/Mogosoaia_01.jpg", "/images-scraped/Black_Pearl_03.jpg"];
const HERO_IMG   = "/images-scraped/vila_corbeanca_exec_living_4.jpg"; // = prima din heroSlider
const ROW2_RIGHT = ["/images-scraped/living_06_.jpg",   "/images-scraped/Olimp_03.jpg"];
const ROW3 = [
  "/images-scraped/executie_sediu-office15.jpg",
  "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg",
  "/images-scraped/buc_giurgiu_1.jpg",
  "/images-scraped/montaj.jpg",
];

const CSS = `
.cl-root{
  position:fixed;inset:0;z-index:9999;background:#080706;overflow:hidden;
}

/* ── Logo ── */
.cl-logo{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  z-index:20;text-align:center;pointer-events:none;
}
.cl-logo-name{
  font-family:'Cormorant Garamond',Georgia,serif;
  font-size:clamp(2rem,5vw,3.8rem);font-weight:300;
  letter-spacing:.38em;text-transform:uppercase;
  color:#e8e0d5;padding-right:.38em;display:block;
  opacity:0;transform:translateY(14px);
}
.cl-logo-line{
  width:0;height:1px;margin:.85rem auto .7rem;display:block;
  background:linear-gradient(to right,transparent,#c9a984,transparent);
}
.cl-logo-sub{
  font-family:'Inter',sans-serif;font-size:clamp(.3rem,.75vw,.42rem);
  letter-spacing:.52em;text-transform:uppercase;
  color:#c9a984;padding-right:.52em;display:block;opacity:0;
}

/* ── Grid 3 rânduri ── */
.cl-rows{
  position:absolute;inset:0;display:flex;flex-direction:column;
  z-index:1;
}
.cl-row{
  flex:1;display:grid;grid-template-columns:repeat(4,1fr);
  gap:3px;overflow:hidden;will-change:transform;
}
.cl-cell{
  overflow:hidden;position:relative;
  clip-path:inset(0 0 100% 0);will-change:clip-path;
}
.cl-cell img{
  width:100%;height:100%;object-fit:cover;
  object-position:center;display:block;transform:scale(1.06);
}

/* ── Hero cell ── */
.cl-hero{
  z-index:3;overflow:visible;
  will-change:transform,filter;
  transform-origin:center center;
}

/* ── Bare negre letterbox — sus și jos ── */
/* Inițial acoperă 20% din ecran (sus/jos), z-index peste hero */
.cl-bar{
  position:absolute;left:0;right:0;
  height:20%;background:#080706;
  z-index:10;will-change:transform;
}
.cl-bar-top   { top:0;    transform-origin:top; }
.cl-bar-bottom{ bottom:0; transform-origin:bottom; }
`;

export default function CinematicLoader() {
  const [visible, setVisible]   = useState(true);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("cl-shown")) { setVisible(false); return; }

    let tl: any;
    const run = async () => {
      const { gsap } = await import("gsap");
      tl = gsap.timeline();

      /* ── 1. Logo ── */
      tl
        .to(".cl-logo-name", { opacity:1, y:0, duration:.85, ease:"power3.out" }, 0.15)
        .to(".cl-logo-line", { width:"clamp(70px,10vw,120px)", duration:.65, ease:"power2.inOut" }, 0.75)
        .to(".cl-logo-sub",  { opacity:.7, duration:.55 }, 1.05);

      /* ── 2. Rânduri intră din direcții opuse ── */
      tl
        .fromTo(".cl-row-1", { x:"8%", opacity:0 }, { x:"0%", opacity:1, duration:.7, ease:"power2.out" }, 1.35)
        .fromTo(".cl-row-2", { x:"-8%",opacity:0 }, { x:"0%", opacity:1, duration:.7, ease:"power2.out" }, 1.45)
        .fromTo(".cl-row-3", { x:"8%", opacity:0 }, { x:"0%", opacity:1, duration:.7, ease:"power2.out" }, 1.55);

      /* Celule apar cu clip-path stagger */
      tl.to(".cl-cell", {
        clipPath:"inset(0 0 0% 0)", duration:.45, ease:"power2.out",
        stagger:{ amount:.5, from:"random" },
      }, 1.4);

      /* ── 3. Conveyor — rânduri se mișcă ── */
      tl
        .to(".cl-row-1", { x:"-4%", duration:1.4, ease:"none" }, 2.1)
        .to(".cl-row-2", { x:"4%",  duration:1.4, ease:"none" }, 2.1)
        .to(".cl-row-3", { x:"-4%", duration:1.4, ease:"none" }, 2.1);

      /* ── 4. Logo + alte celule dispar ── */
      tl
        .to(".cl-logo",               { opacity:0, duration:.4, ease:"power2.in" }, 2.8)
        .to(".cl-cell:not(.cl-hero)", { opacity:0, duration:.5, stagger:.02 }, 2.85);

      /* ── 5. Hero zoom cu motion blur ── */
      // Faza A: zoom + blur apare
      tl.to(".cl-hero", {
        scale:3, filter:"blur(14px)", duration:.55, ease:"power2.in",
      }, 3.1);
      // Faza B: zoom mai mare + blur dispare
      tl.to(".cl-hero", {
        scale:7, filter:"blur(0px)", duration:.65, ease:"power2.out",
      });

      /* ── 6. Bare negre → se expandează în afară (letterbox open) ── */
      tl
        .to(".cl-bar-top",    { y:"-100%", duration:.7, ease:"power2.inOut" }, 3.95)
        .to(".cl-bar-bottom", { y:"100%",  duration:.7, ease:"power2.inOut" }, 3.95);

      /* ── 7. Fade-out loader → pagina apare ── */
      tl.to(".cl-root", {
        opacity:0, duration:.55, ease:"power2.in",
        onComplete: () => {
          sessionStorage.setItem("cl-shown","1");
          setVisible(false);
        },
      }, 4.55);
    };

    run();
    return () => { tl?.kill(); };
  }, []);

  if (!mounted || !visible) return null;

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

        {/* Bare negre letterbox — z-index 10, peste hero */}
        <div className="cl-bar cl-bar-top"    aria-hidden />
        <div className="cl-bar cl-bar-bottom" aria-hidden />

        {/* Grid rânduri */}
        <div className="cl-rows">

          {/* Rând 1 → stânga */}
          <div className="cl-row cl-row-1">
            {ROW1.map((src,i) => (
              <div key={i} className="cl-cell">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="eager" />
              </div>
            ))}
          </div>

          {/* Rând 2 → dreapta | Hero col 2 */}
          <div className="cl-row cl-row-2">
            {ROW2_LEFT.map((src,i) => (
              <div key={i} className="cl-cell">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="eager" />
              </div>
            ))}
            <div className="cl-cell cl-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_IMG} alt="" loading="eager" />
            </div>
            {ROW2_RIGHT.map((src,i) => (
              <div key={i} className="cl-cell">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="eager" />
              </div>
            ))}
          </div>

          {/* Rând 3 → stânga */}
          <div className="cl-row cl-row-3">
            {ROW3.map((src,i) => (
              <div key={i} className="cl-cell">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="eager" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
