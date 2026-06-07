"use client";

/**
 * CinematicLoader v9 — Grid imagini + Split Exit
 *
 * INTRO: Grid masonry de imagini care apar cu stagger
 * EXIT:  Ecranul se despică (sus/jos, CSS transition)
 *
 * Anti-glitch:
 *   • Toate elementele → opacity:0 în CSS (fără GSAP.set necesar)
 *   • Split-ul e CSS transition → independent de GSAP
 *   • Nicio imagine fake de hero → nicio dependență de network
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
/* ── Root ── */
.cl-root {
  position: fixed; inset: 0; z-index: 9999;
  background: #080706; overflow: hidden;
}

/* ── Panel sus/jos pentru exit split ── */
.cl-panel {
  position: absolute; left: 0; right: 0;
  background: #080706; z-index: 20;
  will-change: transform;
  transition: transform 1.05s cubic-bezier(0.76, 0, 0.24, 1);
}
.cl-panel-top    { top: 0;    height: 51%; }
.cl-panel-bottom { bottom: 0; height: 51%; }

/* Când se despică */
.cl-root.splitting .cl-panel-top    { transform: translateY(-100%); }
.cl-root.splitting .cl-panel-bottom { transform: translateY(100%); }

/* Logo dispare la split */
.cl-logo { transition: opacity 0.35s ease; }
.cl-root.splitting .cl-logo { opacity: 0 !important; }

/* ── Grid masonry ── */
.cl-grid {
  position: absolute; inset: 6px; z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: calc((100vh - 24px) / 3.6);
  gap: 6px;
}

/* STARE INIȚIALĂ — opacity:0 via CSS, zero flash */
.cl-cell {
  border-radius: 10px; overflow: hidden; position: relative;
  filter: saturate(.18) brightness(.8);
  opacity: 0;
  transform: translateY(24px);
  will-change: opacity, transform;
}
.cl-cell.tall { grid-row: span 2; }
.cl-cell img {
  width: 100%; height: 100%; object-fit: cover;
  object-position: center; display: block;
  will-change: transform;
}

/* ── Logo ── */
.cl-logo {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; text-align: center; pointer-events: none;
}
.cl-logo-eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: clamp(.55rem, .9vw, .65rem); font-weight: 700;
  letter-spacing: .55em; text-transform: uppercase;
  color: rgba(201,169,132,0.7); padding-right: .55em; display: block;
  opacity: 0; transform: translateY(6px); /* INIȚIAL */
}
.cl-logo-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 300;
  letter-spacing: .32em; text-transform: uppercase;
  color: #ede5da; padding-right: .32em; display: block; line-height: 1;
  opacity: 0; transform: translateY(20px); /* INIȚIAL */
}
.cl-logo-line {
  height: 1px; margin: 1rem auto .8rem; display: block;
  background: linear-gradient(to right, transparent, #c9a984, transparent);
  width: 0; /* INIȚIAL */
}
.cl-logo-tagline {
  font-family: 'Inter', sans-serif;
  font-size: clamp(.55rem, .9vw, .65rem); font-weight: 400;
  letter-spacing: .4em; text-transform: uppercase;
  color: rgba(237,229,218,0.35); padding-right: .4em; display: block;
  opacity: 0; /* INIȚIAL */
}
`;

type Phase = "ssr" | "animating" | "done";

export default function CinematicLoader() {
  const [phase, setPhase]   = useState<Phase>("ssr");
  const [split, setSplit]   = useState(false);
  const tlRef               = useRef<any>(null);

  useEffect(() => {
    if (sessionStorage.getItem("cl-shown")) {
      setPhase("done");
      return;
    }
    document.body.style.overflow = "hidden";
    setPhase("animating");

    const run = async () => {
      const { gsap } = await import("gsap");

      /* GSAP.set nu mai e necesar — CSS face asta */
      const tl = gsap.timeline();
      tlRef.current = tl;

      /* ── 1. Logo apare (0.15 → 1.8s) ── */
      tl
        .to(".cl-logo-eyebrow", { opacity: .7, y: 0, duration: .6, ease: "power2.out" }, 0.15)
        .to(".cl-logo-name",    { opacity: 1,  y: 0, duration: 1.0, ease: "power3.out" }, 0.25)
        .to(".cl-logo-line",    { width: "clamp(70px,9vw,115px)", duration: .7, ease: "power2.inOut" }, 0.9)
        .to(".cl-logo-tagline", { opacity: .35, duration: .5 }, 1.2);

      /* ── 2. Grid imagini apare (2.0 → 3.2s) ── */
      tl.to(".cl-cell", {
        opacity: 1, y: 0,
        duration: .55, ease: "power2.out",
        stagger: { amount: .8, from: "edges" },
      }, 2.0);

      /* Drift continuu pe imagini */
      tl.to(".cl-cell img", {
        y: "-8px", duration: 2.2, ease: "sine.inOut",
        stagger: { amount: .5, from: "random" },
        repeat: -1, yoyo: true,
      }, 2.2);

      /* ── 3. Logo + grid dispar (3.8 → 4.5s) ── */
      tl.to(".cl-logo", {
        opacity: 0, duration: .45, ease: "power2.in",
      }, 3.8);

      tl.to(".cl-cell", {
        opacity: 0,
        duration: .55, ease: "power2.in",
        stagger: { amount: .25, from: "center" },
      }, 3.85);

      /* ── 4. CSS Split (4.4s) — panelele se despică ── */
      tl.call(() => { setSplit(true); }, [], 4.4);

      /* ── 5. Cleanup după CSS transition (1.05s după split) ── */
      tl.call(() => {
        document.body.style.overflow = "";
        window.scrollTo({ top: 0, behavior: "instant" });
        sessionStorage.setItem("cl-shown", "1");
        setPhase("done");
      }, [], 5.55);
    };

    run();
    return () => { tlRef.current?.kill(); };
  }, []);

  /* SSR: div negru opac simplu */
  if (phase === "ssr") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="cl-root" aria-hidden="true">
          <div className="cl-panel cl-panel-top" />
          <div className="cl-panel cl-panel-bottom" />
        </div>
      </>
    );
  }

  if (phase === "done") return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`cl-root${split ? " splitting" : ""}`} aria-hidden="true">

        {/* Panele split — peste grid, z-index 20 */}
        <div className="cl-panel cl-panel-top" />
        <div className="cl-panel cl-panel-bottom" />

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
          <span className="cl-logo-eyebrow">Signature Collection</span>
          <span className="cl-logo-name">Moodilier</span>
          <span className="cl-logo-line" />
          <span className="cl-logo-tagline">Mobilier Premium la Comandă</span>
        </div>

      </div>
    </>
  );
}
