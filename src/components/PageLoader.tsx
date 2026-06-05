"use client";

/**
 * CinematicLoader v6 — fără glitch
 *
 * FIX flash la start:
 *   • Renderează un div negru opac imediat la SSR (înainte de mount)
 *   • Dacă 'cl-shown' e în sessionStorage: dispare instant după hydration
 *
 * FIX glitch la reveal:
 *   • Nu mai există imagine fake (cl-hero-bg eliminat)
 *   • Când grila dispare → background-ul loader-ului devine transparent
 *   • Pagina reală se vede din spate — fără mismatch
 *   • Bare negre se deschid pe marginile paginii reale
 *
 * Animație:
 *   1. Negru curat → logo Moodilier (2s hold)
 *   2. Grid masonry apare cu stagger (drift vertical pe imagini)
 *   3. Toate imaginile dispar → background loader → transparent
 *   4. Bare negre (sus/jos) se expandează în afară
 *   5. Loader fade-out → pagina 100% vizibilă
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

const CSS = `
.cl-root {
  position: fixed; inset: 0; z-index: 9999;
  background: #080706;
  overflow: hidden;
  /* pointer-events none lasă scroll-ul să funcționeze după fade */
}

/* ── Grid masonry ── */
.cl-grid {
  position: absolute; inset: 6px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: calc((100vh - 24px) / 3.6);
  gap: 6px;
  z-index: 2;
}
.cl-cell {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  filter: saturate(.2) brightness(.8);
  will-change: opacity, transform;
}
.cl-cell.tall { grid-row: span 2; }
.cl-cell img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  display: block;
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

/* ── Bare negre letterbox ── */
.cl-bar {
  position: absolute; left: 0; right: 0;
  z-index: 8;
  will-change: transform;
}
.cl-bar-top    { top: 0;    height: 18%; background: #080706; }
.cl-bar-bottom { bottom: 0; height: 18%; background: #080706; }
`;

type Phase = "ssr" | "animating" | "done";

export default function CinematicLoader() {
  const [phase, setPhase] = useState<Phase>("ssr");
  const tlRef = useRef<any>(null);

  useEffect(() => {
    // Dacă loaderul a fost deja arătat — elimin imediat
    if (sessionStorage.getItem("cl-shown")) {
      setPhase("done");
      return;
    }

    setPhase("animating");

    const run = async () => {
      const { gsap } = await import("gsap");

      /* Set explicit initial state — fără CSS implicit → zero glitch */
      gsap.set(".cl-logo-name", { opacity: 0, y: 18 });
      gsap.set(".cl-logo-line", { width: 0 });
      gsap.set(".cl-logo-sub",  { opacity: 0 });
      gsap.set(".cl-cell",      { opacity: 0, y: 28 });
      gsap.set(".cl-bar-top",   { y: "0%" });
      gsap.set(".cl-bar-bottom",{ y: "0%" });

      const tl = gsap.timeline();
      tlRef.current = tl;

      /* ── 1. Logo (0 – 2s) ── */
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

      /* Drift continuu pe fiecare imagine — mișcare vie */
      tl.to(".cl-cell img", {
        y: "-10px",
        duration: 2.4, ease: "sine.inOut",
        stagger: { amount: .6, from: "random" },
        repeat: -1, yoyo: true,
      }, 2.3);

      /* ── 3. Logo dispare (3.5s) ── */
      tl.to(".cl-logo", {
        opacity: 0, y: -10,
        duration: .5, ease: "power2.inOut",
      }, 3.5);

      /* ── 4. Grid dispare fluid (3.6s) — opacity fără y pentru smoothness ── */
      tl.to(".cl-cell", {
        opacity: 0,
        duration: .65, ease: "power2.inOut",
        stagger: { amount: .25, from: "random" },
      }, 3.6);

      /* ── 5. Loader bg → transparent (4.1s) — pagina din spate devine vizibilă ── */
      tl.to(".cl-root", {
        backgroundColor: "rgba(8,7,6,0)",
        duration: .8, ease: "power1.inOut",
      }, 4.1);

      /* ── 6. Bare se deschid simultan cu reveal-ul (4.2s) ── */
      tl
        .to(".cl-bar-top",    { y: "-100%", duration: .9, ease: "expo.inOut" }, 4.2)
        .to(".cl-bar-bottom", { y:  "100%", duration: .9, ease: "expo.inOut" }, 4.2);

      /* ── 7. Fade-out final (5.0s) ── */
      tl.to(".cl-root", {
        opacity: 0,
        duration: .5, ease: "power2.in",
        onComplete: () => {
          sessionStorage.setItem("cl-shown", "1");
          setPhase("done");
        },
      }, 5.0);

    };

    run();

    return () => { tlRef.current?.kill(); };
  }, []);

  /* SSR & hydration: div negru opac care previne flash-ul paginii */
  if (phase === "ssr") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="cl-root" aria-hidden="true" />
      </>
    );
  }

  if (phase === "done") return null;

  /* Animating: loader complet */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cl-root" aria-hidden="true">

        {/* Bare negre sus/jos — rămân chiar și după ce background devine transparent */}
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

        {/* Logo centrat */}
        <div className="cl-logo">
          <span className="cl-logo-name">Moodilier</span>
          <span className="cl-logo-line" />
          <span className="cl-logo-sub">✦ Signature ✦</span>
        </div>

      </div>
    </>
  );
}
