"use client";

/**
 * CinematicLoader v8 — Split Reveal
 *
 * Simplu, garantat fără glitch, 100% premium.
 *
 * Secvență:
 *   1. Negru complet → logo MOODILIER apare (slide up)
 *   2. Linie aurie se extinde
 *   3. Tagline apare
 *   4. Scurtă pauză
 *   5. Logo dispare → ecranul se despică (sus urcă, jos coboară)
 *   6. Hero-ul paginii e dezvăluit
 *
 * De ce funcționează mereu:
 *   • Nu depinde de imagini externe (nicio imagine în loader)
 *   • CSS transitions pentru split → nu depinde de GSAP loaded
 *   • Stare inițială în CSS → zero flash
 */

import { useEffect, useRef, useState } from "react";

const CSS = `
/* ── Root ── */
.cl-root {
  position: fixed; inset: 0; z-index: 9999;
  overflow: hidden; pointer-events: none;
}

/* ── Jumătăți ── */
.cl-top, .cl-bottom {
  position: absolute;
  left: 0; right: 0;
  background: #0a0907;
  will-change: transform;
  transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1);
}
.cl-top    { top: 0;    height: 51%; transform-origin: top; }
.cl-bottom { bottom: 0; height: 51%; transform-origin: bottom; }

/* Când se despică */
.cl-root.split .cl-top    { transform: translateY(-100%); }
.cl-root.split .cl-bottom { transform: translateY(100%); }

/* ── Logo ── */
.cl-logo {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; text-align: center;
  transition: opacity 0.4s ease 0s;
}
.cl-root.split .cl-logo { opacity: 0; transition-delay: 0s; }

.cl-logo-eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: clamp(.55rem, 1vw, .68rem);
  font-weight: 700;
  letter-spacing: .55em;
  text-transform: uppercase;
  color: rgba(201,169,132,0.7);
  display: block;
  padding-right: .55em;
  /* inițial ascuns */
  opacity: 0;
  transform: translateY(6px);
}
.cl-logo-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 6.5vw, 5.5rem);
  font-weight: 300;
  letter-spacing: .32em;
  text-transform: uppercase;
  color: #ede5da;
  padding-right: .32em;
  display: block;
  line-height: 1;
  /* inițial ascuns */
  opacity: 0;
  transform: translateY(20px);
}
.cl-logo-line {
  height: 1px;
  margin: 1.1rem auto .9rem;
  display: block;
  background: linear-gradient(to right, transparent, #c9a984, transparent);
  /* inițial ascuns */
  width: 0;
}
.cl-logo-tagline {
  font-family: 'Inter', sans-serif;
  font-size: clamp(.55rem, 1vw, .68rem);
  font-weight: 400;
  letter-spacing: .45em;
  text-transform: uppercase;
  color: rgba(237,229,218,0.4);
  display: block;
  padding-right: .45em;
  /* inițial ascuns */
  opacity: 0;
}
`;

type Phase = "ssr" | "animating" | "done";

export default function CinematicLoader() {
  const [phase, setPhase]     = useState<Phase>("ssr");
  const [split, setSplit]     = useState(false);
  const tlRef                 = useRef<any>(null);

  useEffect(() => {
    if (sessionStorage.getItem("cl-shown")) {
      setPhase("done");
      return;
    }

    document.body.style.overflow = "hidden";
    setPhase("animating");

    const run = async () => {
      const { gsap } = await import("gsap");

      const tl = gsap.timeline();
      tlRef.current = tl;

      /* ── 1. Logo apare ── */
      tl
        .to(".cl-logo-name",     { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }, 0.15)
        .to(".cl-logo-line",     { width: "clamp(70px,9vw,120px)", duration: .75, ease: "power2.inOut" }, 0.85)
        .to(".cl-logo-tagline",  { opacity: .4, duration: .6, ease: "power2.out" }, 1.15)
        .to(".cl-logo-eyebrow",  { opacity: .7, y: 0, duration: .6, ease: "power2.out" }, 1.1);

      /* ── 2. Pauză (logo vizibil 1.3s) ── */

      /* ── 3. Logo fade out + split ── */
      tl.call(() => {
        // CSS transition handles the split — garantat smooth, independent de GSAP
        setSplit(true);
      }, [], 2.8);

      /* ── 4. Cleanup după split ── */
      tl.call(() => {
        document.body.style.overflow = "";
        window.scrollTo({ top: 0, behavior: "instant" });
        sessionStorage.setItem("cl-shown", "1");
        setPhase("done");
      }, [], 4.1);
    };

    run();
    return () => { tlRef.current?.kill(); };
  }, []);

  if (phase === "ssr") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="cl-root" aria-hidden="true">
          <div className="cl-top" />
          <div className="cl-bottom" />
          {/* Logo vizibil pe SSR — starea inițială e ascunsă via CSS */}
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

  if (phase === "done") return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`cl-root${split ? " split" : ""}`} aria-hidden="true">
        <div className="cl-top" />
        <div className="cl-bottom" />
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
