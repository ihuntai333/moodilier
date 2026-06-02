"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

/* ══════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════ */
const STYLES = `
:root {
  --gold: #c9a984; --gold2: #e8d5b7;
  --bg: #0b0907; --bg2: #141210; --bg3: #1c1916;
  --fg: #ede5da; --fg2: #7a6e62; --fg3: rgba(237,229,218,.08);
  --serif: 'Cormorant Garamond', serif;
  --sans: 'Inter', sans-serif;
}
.v6 { background: var(--bg); color: var(--fg); font-family: var(--sans); cursor: none; }
/* Hide custom cursor on touch devices */
@media (hover: none), (pointer: coarse) {
  .v6 { cursor: auto !important; }
  .v6-cursor { display: none !important; }
}
.v6 *, .v6 *::before, .v6 *::after { box-sizing: border-box; margin: 0; padding: 0; }
.v6 a { text-decoration: none; color: inherit; }

/* ─── PAGE LOADER ─────────────────────────────────────────── */
.v6-loader {
  position: fixed; inset: 0; z-index: 9000;
  background: var(--bg);
  pointer-events: none;
  animation: v6LoaderOut 0.65s cubic-bezier(0.76, 0, 0.24, 1) 0.2s both;
}
@keyframes v6LoaderOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}

/* ─── CURSOR ──────────────────────────────────────────────── */
.v6-cursor {
  position: fixed; z-index: 8999; pointer-events: none;
  top: 0; left: 0; width: 8px; height: 8px;
  background: var(--gold); border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width .3s, height .3s, opacity .3s;
  will-change: transform;
}
.v6-cursor.expand { width: 52px; height: 52px; background: rgba(201,169,132,.12); }

/* ─── HERO ────────────────────────────────────────────────── */
.v6-hero {
  position: relative; height: 100vh; overflow: hidden;
  display: flex; flex-direction: column; justify-content: flex-end;
}
.v6-hero-bg { position: absolute; inset: 0; will-change: transform; }
.v6-hero-bg img { width: 100%; height: 100%; object-fit: cover; object-position: center 35%; }
.v6-hero-ov {
  position: absolute; inset: 0;
  background: linear-gradient(170deg, rgba(11,9,7,.45) 0%, rgba(11,9,7,.05) 45%, rgba(11,9,7,.88) 100%);
}
.v6-hero-body {
  position: relative; z-index: 1;
  padding: 0 5vw 5vh;
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(3.5rem, 16vw, 18rem);
  line-height: .82; letter-spacing: -.03em;
}
.v6-mask { overflow: hidden; display: block; }
.v6-mask-inner { display: block; transform: translateY(110%); }
.v6-hero-body em { font-style: italic; color: var(--gold); }

.v6-hero-strip {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 1;
  display: flex; justify-content: space-between; align-items: flex-end;
  padding: 1.8rem 5vw;
  border-top: 1px solid var(--fg3);
}
.v6-hero-tagline {
  font-family: var(--serif); font-style: italic;
  font-size: clamp(.85rem, 1.4vw, 1.1rem);
  color: rgba(237,229,218,.45); max-width: 300px; line-height: 1.55;
  opacity: 0;
}
.v6-scroll-wrap {
  display: flex; flex-direction: column; align-items: center; gap: .5rem;
  opacity: 0;
}
.v6-scroll-label {
  font-size: .48rem; letter-spacing: .42em; text-transform: uppercase;
  color: var(--gold); writing-mode: vertical-rl; transform: rotate(180deg);
}
.v6-scroll-line {
  width: 1px; height: 52px; background: var(--gold);
  transform-origin: top; transform: scaleY(0);
  animation: v6LineAnim 2s cubic-bezier(0.5, 0, 0.5, 1) 2s infinite;
}
@keyframes v6LineAnim {
  0%   { transform: scaleY(0); transform-origin: top; }
  45%  { transform: scaleY(1); transform-origin: top; }
  55%  { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

/* ─── MARQUEE ─────────────────────────────────────────────── */
.v6-marquee {
  overflow: hidden; padding: 1.1rem 0;
  background: #0e0c0a;
  border-top: 1px solid var(--fg3); border-bottom: 1px solid var(--fg3);
}
.v6-mtrack {
  display: flex; width: max-content;
  animation: v6MScroll 60s linear infinite;
}
@keyframes v6MScroll { to { transform: translateX(-33.333%); } }
.v6-mitem {
  display: inline-flex; align-items: center; gap: .7rem;
  padding: 0 2.5rem;
  font-family: var(--serif); font-style: italic;
  font-size: clamp(.95rem, 1.8vw, 1.3rem);
  color: var(--fg2); white-space: nowrap;
}
.v6-msep { color: var(--gold); opacity: .45; font-style: normal; font-size: .65em; }

/* ─── PROJECTS ────────────────────────────────────────────── */
.v6-projs { }
.v6-proj {
  display: grid; grid-template-columns: 1fr 1fr; min-height: 82vh;
  border-bottom: 1px solid var(--fg3); overflow: hidden;
}
.v6-proj:nth-child(even) { direction: rtl; }
.v6-proj:nth-child(even) > * { direction: ltr; }
.v6-proj-img {
  position: relative; overflow: hidden;
  clip-path: inset(0 0 100% 0);
}
.v6-proj-img-inner {
  position: absolute; inset: -14% 0;
}
.v6-proj-img-inner img { width: 100%; height: 100%; object-fit: cover; }
.v6-proj-info {
  padding: 5vw 4.5vw; background: var(--bg);
  display: flex; flex-direction: column; justify-content: flex-end; gap: 0;
}
.v6-proj-idx {
  font-family: var(--serif); font-size: clamp(3.5rem, 7vw, 8rem); font-weight: 300;
  color: rgba(201,169,132,.07); line-height: 1; margin-bottom: auto;
}
.v6-proj-cat {
  font-size: .54rem; letter-spacing: .42em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 1rem;
}
.v6-proj-name {
  font-family: var(--serif); font-size: clamp(1.9rem, 3.5vw, 3.8rem);
  font-weight: 300; line-height: .92; letter-spacing: -.02em; margin-bottom: .8rem;
}
.v6-proj-name em { font-style: italic; color: var(--gold); }
.v6-proj-loc { font-size: .68rem; color: var(--fg2); letter-spacing: .1em; margin-bottom: 2rem; }
.v6-proj-cta {
  display: inline-flex; align-items: center; gap: .6rem;
  font-size: .58rem; letter-spacing: .28em; text-transform: uppercase;
  padding-bottom: .35rem; border-bottom: 1px solid rgba(237,229,218,.18);
  width: fit-content;
  transition: color .3s, border-color .3s, gap .3s;
}
.v6-proj-cta:hover { color: var(--gold); border-color: var(--gold); gap: .9rem; }

/* ─── ABOUT ───────────────────────────────────────────────── */
.v6-about {
  display: grid; grid-template-columns: 1fr 1fr;
  min-height: 70vh; overflow: hidden;
  border-bottom: 1px solid var(--fg3);
}
.v6-about-img {
  position: relative; overflow: hidden;
  clip-path: inset(0 0 100% 0);
}
.v6-about-img-inner { position: absolute; inset: -12% 0; }
.v6-about-img-inner img { width: 100%; height: 100%; object-fit: cover; }
.v6-about-text {
  padding: 7vw 5vw; display: flex; flex-direction: column; justify-content: center;
  background: var(--bg2);
}
.v6-about-tag {
  font-size: .54rem; letter-spacing: .42em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 1.4rem; display: block;
}
.v6-about-h {
  font-family: var(--serif); font-size: clamp(1.8rem, 3vw, 3.2rem);
  font-weight: 300; line-height: 1.15; letter-spacing: -.01em; margin-bottom: 1.8rem;
}
.v6-about-h em { font-style: italic; color: var(--gold); }
.v6-about-p { font-size: .82rem; line-height: 1.9; color: var(--fg2); margin-bottom: 1rem; max-width: 46ch; }
.v6-divider { width: 40px; height: 1px; background: var(--gold); margin: 1.5rem 0; }
.v6-stats { display: flex; gap: 2rem; flex-wrap: wrap; margin-top: 2rem; }
.v6-stat-n { font-family: var(--serif); font-size: 2.2rem; font-weight: 300; color: var(--gold); }
.v6-stat-l { font-size: .5rem; letter-spacing: .26em; text-transform: uppercase; color: var(--fg2); margin-top: .15rem; }

/* ─── PROCESS ─────────────────────────────────────────────── */
.v6-process { background: var(--bg); padding: clamp(4rem, 8vw, 10rem) 6vw; }
.v6-process-head { text-align: center; margin-bottom: 4rem; }
.v6-process-tag {
  font-size: .54rem; letter-spacing: .42em; text-transform: uppercase;
  color: var(--gold); display: block; margin-bottom: 1rem;
}
.v6-process-title {
  font-family: var(--serif); font-size: clamp(2rem, 4vw, 4rem); font-weight: 300;
}
.v6-process-title em { font-style: italic; color: var(--gold); }
.v6-process-grid {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px;
  background: var(--fg3);
}
.v6-step {
  background: var(--bg); padding: 2.5rem 1.8rem;
  opacity: 0; transform: translateY(28px);
  transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
}
.v6-step.in { opacity: 1; transform: none; }
.v6-step-num {
  font-family: var(--serif); font-size: 3rem; font-weight: 300;
  color: rgba(201,169,132,.15); line-height: 1; margin-bottom: 1.2rem;
}
.v6-step-title {
  font-size: .85rem; font-weight: 500; color: var(--fg); margin-bottom: .7rem;
}
.v6-step-desc { font-size: .75rem; line-height: 1.75; color: var(--fg2); }

/* ─── SERVICES ────────────────────────────────────────────── */
.v6-svcs { background: var(--bg2); padding: clamp(4rem, 8vw, 10rem) 6vw; }
.v6-svcs-head {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 3.5rem; padding-bottom: 2rem; border-bottom: 1px solid var(--fg3);
}
.v6-svcs-h {
  font-family: var(--serif); font-size: clamp(1.8rem, 3.5vw, 3.5rem); font-weight: 300;
}
.v6-svcs-h em { font-style: italic; color: var(--gold); }
.v6-svcs-tag { font-size: .54rem; letter-spacing: .42em; text-transform: uppercase; color: var(--gold); }
.v6-svc {
  display: grid; grid-template-columns: 80px 1fr auto;
  padding: 1.6rem 0; border-bottom: 1px solid var(--fg3);
  align-items: baseline;
  opacity: 0; transform: translateY(22px);
  transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
}
.v6-svc.in { opacity: 1; transform: none; }
.v6-svc-n { font-family: var(--serif); font-size: .9rem; color: rgba(201,169,132,.25); }
.v6-svc-name { font-family: var(--serif); font-size: clamp(1.15rem, 2vw, 1.9rem); font-weight: 300; }
.v6-svc-desc { font-size: .72rem; color: var(--fg2); text-align: right; max-width: 28ch; }

/* ─── FULL-BLEED QUOTE ────────────────────────────────────── */
.v6-quote-block {
  position: relative; height: 70vh; overflow: hidden;
  display: grid; place-items: center;
}
.v6-quote-bg { position: absolute; inset: 0; }
.v6-quote-bg img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.v6-quote-ov { position: absolute; inset: 0; background: rgba(8,6,4,.72); }
.v6-quote-cnt { position: relative; z-index: 1; text-align: center; max-width: 700px; padding: 2rem 4vw; }
.v6-quote-text {
  font-family: var(--serif); font-style: italic; font-weight: 300;
  font-size: clamp(1.5rem, 3.5vw, 3rem); line-height: 1.35;
  color: var(--fg); margin-bottom: 1.5rem;
}
.v6-quote-attr { font-size: .55rem; letter-spacing: .38em; text-transform: uppercase; color: var(--gold); }

/* ─── CTA ─────────────────────────────────────────────────── */
.v6-cta {
  position: relative; height: 85vh; overflow: hidden;
  display: grid; place-items: center;
}
.v6-cta-bg { position: absolute; inset: 0; }
.v6-cta-bg img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.v6-cta-ov { position: absolute; inset: 0; background: rgba(8,6,4,.65); }
.v6-cta-cnt { position: relative; z-index: 1; text-align: center; max-width: 880px; padding: 2rem 4vw; }
.v6-cta-tag { display: block; font-size: .56rem; letter-spacing: .48em; text-transform: uppercase; color: var(--gold); margin-bottom: 2.2rem; }
.v6-cta-h {
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(3rem, 8vw, 9rem);
  line-height: .86; letter-spacing: -.03em; margin-bottom: 2.8rem;
}
.v6-cta-h em { font-style: italic; color: var(--gold); }
.v6-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.v6-btn-p {
  padding: .95rem 2.2rem; background: var(--gold); color: var(--bg);
  font-size: .6rem; letter-spacing: .2em; text-transform: uppercase; transition: background .3s;
}
.v6-btn-p:hover { background: var(--gold2); }
.v6-btn-o {
  padding: .95rem 2.2rem; border: 1px solid rgba(201,169,132,.28);
  color: var(--gold); font-size: .6rem; letter-spacing: .2em;
  text-transform: uppercase; transition: all .3s;
}
.v6-btn-o:hover { background: var(--gold); color: var(--bg); }

/* ─── FOOTER ──────────────────────────────────────────────── */
.v6-footer {
  background: #050403; padding: 2.2rem 5vw;
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid var(--fg3);
}
.v6-footer-logo { font-family: var(--serif); font-size: 1rem; font-weight: 300; letter-spacing: .25em; color: var(--fg2); }
.v6-footer-copy { font-size: .5rem; color: rgba(237,229,218,.16); letter-spacing: .1em; }
.v6-footer-nav { display: flex; gap: 2rem; font-size: .5rem; letter-spacing: .2em; text-transform: uppercase; color: var(--fg2); }
.v6-footer-nav a:hover { color: var(--gold); }

/* ─── RESPONSIVE ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .v6-proj, .v6-about { grid-template-columns: 1fr; direction: ltr !important; }
  .v6-proj:nth-child(even) > * { direction: ltr; }
  .v6-proj-img { height: 60vw; position: relative; min-height: 260px; }
  .v6-about-img { height: 55vw; position: relative; min-height: 240px; }
  .v6-process-grid { grid-template-columns: 1fr 1fr; }
  .v6-svc { grid-template-columns: 40px 1fr; gap: .4rem .8rem; }
  .v6-svc-desc { display: none; }
  .v6-svcs-head { flex-direction: column; align-items: flex-start; gap: .8rem; }
  .v6-footer { flex-direction: column; gap: 1.2rem; text-align: center; }
  .v6-stats { gap: 1.4rem; }
}
@media (max-width: 600px) {
  .v6-hero-body { padding: 0 6vw 10vh; }
  .v6-hero-strip { flex-direction: column-reverse; align-items: flex-start; gap: .8rem; padding: 1.4rem 6vw; }
  .v6-hero-tagline { max-width: 100%; font-size: .82rem; }
  .v6-scroll-wrap { flex-direction: row; align-items: center; }
  .v6-scroll-label { writing-mode: horizontal-tb; transform: none; }
  .v6-scroll-line { width: 32px; height: 1px; transform-origin: left; }
  .v6-about-text { padding: 6vw 5vw; }
  .v6-process { padding: 3rem 5vw; }
  .v6-svcs { padding: 3rem 5vw; }
  .v6-cta-h { font-size: clamp(2.4rem, 11vw, 6rem); }
  .v6-proj-idx { display: none; }
  .v6-proj-info { padding: 6vw 5vw; }
  .v6-quote-text { font-size: clamp(1.2rem, 5vw, 2rem); }
}
@media (max-width: 560px) {
  .v6-process-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .v6-loader { animation: none; opacity: 0; }
  .v6-scroll-line { animation: none; transform: scaleY(1); }
}
/* Scrollbar subtle */
@media (min-width: 901px) {
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: rgba(201,169,132,.25); border-radius: 2px; }
  scrollbar-width: thin; scrollbar-color: rgba(201,169,132,.25) var(--bg);
}
`;

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const PROJECTS = [
  { idx:"01", cat:"Rezidențial", loc:"Ilfov · 2024",
    name:"Vila", em:"Cosmopolis",
    img:"/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg",
    href:"/proiecte/executie_vila-cosmopolis" },
  { idx:"02", cat:"Rezidențial", loc:"Constanța · 2023",
    name:"Apartament", em:"Olimp",
    img:"/images-scraped/Olimp_03.jpg",
    href:"/proiecte/executie_apt-olimp" },
  { idx:"03", cat:"Comercial", loc:"București · 2024",
    name:"Sediu", em:"Corporate",
    img:"/images-scraped/carusel_office.jpg",
    href:"/proiecte/executie_sediu-office" },
];

const PROCESS = [
  { step:"1", title:"Consultare inițială", desc:"Analizăm cerințele, stilul dorit și particularitățile spațiului dumneavoastră." },
  { step:"2", title:"Măsurători și concept", desc:"Efectuăm măsurătorile exacte și dezvoltăm conceptul de design personalizat." },
  { step:"3", title:"Proiect tehnic 3D", desc:"Realizăm proiectul tehnic complet cu dimensiuni, materiale, finisaje și accesorii." },
  { step:"4", title:"Producție proprie", desc:"Execuție în atelierul nostru cu tehnologie modernă și finisaje premium." },
  { step:"5", title:"Montaj și recepție", desc:"Montaj profesionist cu verificare finală a fiecărui detaliu." },
];

const SERVICES = [
  { num:"01", name:"Servicii de proiectare", desc:"Concept, vizualizări 3D și proiectare tehnică completă" },
  { num:"02", name:"Mobilier la comandă", desc:"Bucătării, dressinguri, livinguri, dormitoare" },
  { num:"03", name:"Spații comerciale", desc:"Office, recepții, showroom-uri, retail" },
  { num:"04", name:"Moodilier Store", desc:"Import premium din Italia și Danemarca" },
  { num:"05", name:"Montaj profesionist", desc:"Montaj precis și verificare finală" },
  { num:"06", name:"Design interior", desc:"Consiliere completă proiecte rezidențiale" },
];

const MARQUEE = ["Mobilier Premium","Design Interior","La Comandă","Bucătării","Dressinguri","Livinguri","Dormitoare","Spații Comerciale"];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export default function FrontPageV6() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const stepRefs  = useRef<(HTMLDivElement|null)[]>([]);
  const svcRefs   = useRef<(HTMLDivElement|null)[]>([]);

  /* ── Cursor ── */
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    let cx = 0, cy = 0, tx = 0, ty = 0, raf = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const onEnter = () => cursor.classList.add("expand");
    const onLeave = () => cursor.classList.remove("expand");
    const tick = () => {
      cx += (tx - cx) * 0.13;
      cy += (ty - cy) * 0.13;
      cursor.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
      raf = requestAnimationFrame(tick);
    };
    const targets = document.querySelectorAll("a, button");
    targets.forEach(el => { el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); });
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  /* ── Lenis + GSAP ── */
  useEffect(() => {
    let lenis: InstanceType<typeof import("lenis").default> | null = null;
    let dead = false;

    const boot = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (dead) return;

      gsap.registerPlugin(ScrollTrigger);

      /* Skip Lenis on touch — native scroll is smoother on mobile */
      const isTouch = window.matchMedia("(hover: none)").matches;
      if (isTouch) {
        ScrollTrigger.refresh();
        return;
      }
      lenis = new Lenis({ duration: 1.35, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenis.on("scroll", () => ScrollTrigger.update());
      gsap.ticker.add((t: number) => lenis?.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      /* ── Hero text curtain ── */
      gsap.to(".v6-mask-inner", {
        y: "0%", duration: 1.25, ease: "power3.out", stagger: 0.13, delay: 0.25,
      });
      gsap.to([".v6-hero-tagline",".v6-scroll-wrap"], {
        opacity: 1, duration: 1, ease: "power2.out", stagger: .2, delay: 1.1,
      });

      /* ── Hero bg parallax ── */
      gsap.to(".v6-hero-bg", {
        yPercent: 18, ease: "none",
        scrollTrigger: { trigger: ".v6-hero", start: "top top", end: "bottom top", scrub: true },
      });

      /* ── Project image reveals + parallax ── */
      document.querySelectorAll<HTMLElement>(".v6-proj-img").forEach(wrap => {
        gsap.to(wrap, {
          clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "power3.inOut",
          scrollTrigger: { trigger: wrap, start: "top 84%", toggleActions: "play none none none" },
        });
        const inner = wrap.querySelector<HTMLElement>(".v6-proj-img-inner");
        if (inner) gsap.fromTo(inner, { yPercent: -9 }, { yPercent: 9, ease: "none",
          scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* Project text stagger reveal */
      document.querySelectorAll<HTMLElement>(".v6-proj-info").forEach(info => {
        gsap.from(info.querySelectorAll(".v6-proj-cat,.v6-proj-name,.v6-proj-loc,.v6-proj-cta"), {
          opacity: 0, y: 22, duration: .85, stagger: .07, ease: "power2.out",
          scrollTrigger: { trigger: info, start: "top 80%" },
        });
      });

      /* ── About image reveal ── */
      const aboutImg = document.querySelector<HTMLElement>(".v6-about-img");
      if (aboutImg) {
        gsap.to(aboutImg, {
          clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "power3.inOut",
          scrollTrigger: { trigger: aboutImg, start: "top 82%", toggleActions: "play none none none" },
        });
        const inner = aboutImg.querySelector<HTMLElement>(".v6-about-img-inner");
        if (inner) gsap.fromTo(inner, { yPercent: -9 }, { yPercent: 9, ease: "none",
          scrollTrigger: { trigger: aboutImg, start: "top bottom", end: "bottom top", scrub: true } });
      }
      gsap.from(".v6-about-text > *", {
        opacity: 0, y: 28, duration: .9, stagger: .08, ease: "power2.out",
        scrollTrigger: { trigger: ".v6-about-text", start: "top 78%" },
      });

      /* ── Quote + CTA parallax ── */
      [".v6-quote-bg", ".v6-cta-bg"].forEach(sel => {
        const el = document.querySelector<HTMLElement>(sel);
        if (el) gsap.fromTo(el, { yPercent: -10 }, { yPercent: 10, ease: "none",
          scrollTrigger: { trigger: el.parentElement!, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* Quote text reveal */
      gsap.from(".v6-quote-text, .v6-quote-attr", {
        opacity: 0, y: 30, duration: 1, stagger: .15, ease: "power2.out",
        scrollTrigger: { trigger: ".v6-quote-cnt", start: "top 72%" },
      });

      /* CTA curtain */
      gsap.to(".v6-cta .v6-mask-inner", {
        y: "0%", duration: 1.2, ease: "power3.out", stagger: .1,
        scrollTrigger: { trigger: ".v6-cta", start: "top 68%" },
      });
      gsap.from(".v6-cta-tag, .v6-cta-btns", {
        opacity: 0, y: 18, duration: .9, stagger: .15, ease: "power2.out",
        scrollTrigger: { trigger: ".v6-cta", start: "top 68%" },
      });

      ScrollTrigger.refresh();
    };

    boot();
    return () => {
      dead = true;
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.killAll());
      lenis?.destroy();
    };
  }, []);

  /* ── IntersectionObserver for steps + services ── */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("in"); obs.unobserve(e.target); }});
    }, { threshold: 0.08 });
    [...stepRefs.current, ...svcRefs.current].forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="v6">

        {/* ── PAGE LOADER ── */}
        <div className="v6-loader" aria-hidden />

        {/* ── CURSOR ── */}
        <div ref={cursorRef} className="v6-cursor" aria-hidden />

        {/* ══ HERO ══ */}
        <section className="v6-hero">
          <div className="v6-hero-bg">
            <Image src="/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
              alt="Moodilier — Mobilier Premium" fill sizes="100vw" priority quality={90}
              style={{ objectFit:"cover", objectPosition:"center 35%" }} />
          </div>
          <div className="v6-hero-ov" />

          <div className="v6-hero-body">
            <span className="v6-mask"><span className="v6-mask-inner">Mobilier</span></span>
            <span className="v6-mask"><span className="v6-mask-inner"><em>premium</em></span></span>
          </div>

          <div className="v6-hero-strip">
            <p className="v6-hero-tagline">
              „Fiecare spațiu merită să devină o operă de artă — executată cu precizie și trăită cu bucurie."
            </p>
            <div className="v6-scroll-wrap">
              <span className="v6-scroll-label">Scroll</span>
              <div className="v6-scroll-line" />
            </div>
          </div>
        </section>

        {/* ══ MARQUEE ══ */}
        <div className="v6-marquee" aria-hidden>
          <div className="v6-mtrack">
            {[...MARQUEE,...MARQUEE,...MARQUEE].map((item,i) => (
              <span key={i} className="v6-mitem"><span className="v6-msep">✦</span> {item}</span>
            ))}
          </div>
        </div>

        {/* ══ PROJECTS ══ */}
        <section className="v6-projs">
          {PROJECTS.map((p, i) => (
            <div key={i} className="v6-proj">
              <div className="v6-proj-img" style={{ clipPath:"inset(0 0 100% 0)" }}>
                <div className="v6-proj-img-inner">
                  <Image src={p.img} alt={p.name} fill sizes="50vw"
                    style={{ objectFit:"cover" }} unoptimized loading={i===0?"eager":"lazy"} />
                </div>
              </div>
              <div className="v6-proj-info">
                <div className="v6-proj-idx">{p.idx}</div>
                <div>
                  <div className="v6-proj-cat">{p.cat}</div>
                  <h2 className="v6-proj-name">{p.name}<br /><em>{p.em}</em></h2>
                  <p className="v6-proj-loc">{p.loc}</p>
                  <Link href={p.href} className="v6-proj-cta">Vezi proiectul →</Link>
                </div>
              </div>
            </div>
          ))}
          <div style={{ textAlign:"center", padding:"3rem 5vw", background:"var(--bg)" }}>
            <Link href="/proiecte" className="v6-btn-o">Toate proiectele →</Link>
          </div>
        </section>

        {/* ══ ABOUT ══ */}
        <section className="v6-about">
          <div className="v6-about-img" style={{ clipPath:"inset(0 0 100% 0)" }}>
            <div className="v6-about-img-inner">
              <Image src="/images-scraped/mobilier-premium-01.webp"
                alt="Atelier Moodilier" fill sizes="50vw"
                style={{ objectFit:"cover" }} unoptimized />
            </div>
          </div>
          <div className="v6-about-text">
            <span className="v6-about-tag">Despre noi</span>
            <h2 className="v6-about-h">Mobilier creat<br />cu <em>pasiune</em> și<br />precizie</h2>
            <p className="v6-about-p">
              La Moodilier transformăm ideile de amenajare în piese de mobilier premium la comandă,
              create pentru spații elegante, funcționale și atemporale.
            </p>
            <p className="v6-about-p">
              Cu peste 10 ani de experiență în proiectarea și producția de mobilier premium,
              realizăm soluții personalizate pentru interioare rezidențiale și comerciale.
            </p>
            <div className="v6-divider" />
            <div className="v6-stats">
              {[["10+","Ani experiență"],["200+","Proiecte"],["100%","Execuție proprie"]].map(([n,l],i) => (
                <div key={i}>
                  <div className="v6-stat-n">{n}</div>
                  <div className="v6-stat-l">{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"2.5rem" }}>
              <Link href="/despre-noi" className="v6-btn-o">Află mai multe →</Link>
            </div>
          </div>
        </section>

        {/* ══ PROCESS ══ */}
        <section className="v6-process">
          <div className="v6-process-head">
            <span className="v6-process-tag">Cum lucrăm</span>
            <h2 className="v6-process-title">Etapele unui <em>proiect</em></h2>
          </div>
          <div className="v6-process-grid">
            {PROCESS.map((s, i) => (
              <div key={i} className="v6-step"
                ref={el => { stepRefs.current[i] = el; }}
                style={{ transitionDelay:`${i * 0.08}s` }}>
                <div className="v6-step-num">{s.step}</div>
                <div className="v6-step-title">{s.title}</div>
                <p className="v6-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ QUOTE ══ */}
        <div className="v6-quote-block">
          <div className="v6-quote-bg">
            <Image src="/images-scraped/vila_corbeanca_exec_living_4.jpg"
              alt="" fill sizes="100vw" style={{ objectFit:"cover" }} unoptimized aria-hidden />
          </div>
          <div className="v6-quote-ov" />
          <div className="v6-quote-cnt">
            <p className="v6-quote-text">
              „We are the furniture engineers — fiecare detaliu contează."
            </p>
            <span className="v6-quote-attr">Moodilier · București</span>
          </div>
        </div>

        {/* ══ SERVICES ══ */}
        <section className="v6-svcs">
          <div className="v6-svcs-head">
            <h2 className="v6-svcs-h">Servicii <em>oferite</em></h2>
            <span className="v6-svcs-tag">Ce facem pentru tine</span>
          </div>
          {SERVICES.map((s, i) => (
            <div key={i} className="v6-svc"
              ref={el => { svcRefs.current[i] = el; }}
              style={{ transitionDelay:`${i * 0.05}s` }}>
              <span className="v6-svc-n">{s.num}</span>
              <span className="v6-svc-name">{s.name}</span>
              <span className="v6-svc-desc">{s.desc}</span>
            </div>
          ))}
          <div style={{ textAlign:"center", marginTop:"3.5rem" }}>
            <Link href="/servicii" className="v6-btn-o">Toate serviciile →</Link>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="v6-cta">
          <div className="v6-cta-bg">
            <Image src="/images-scraped/Black_Pearl_01.jpg"
              alt="Contact Moodilier" fill sizes="100vw" style={{ objectFit:"cover" }} unoptimized />
          </div>
          <div className="v6-cta-ov" />
          <div className="v6-cta-cnt">
            <span className="v6-cta-tag">Hai să construim ceva frumos împreună</span>
            <h2 className="v6-cta-h">
              {["Viziunea ta.", "<em>Execuția</em>", "noastră."].map((line, i) => (
                <div key={i} className="v6-mask">
                  <span className="v6-mask-inner" style={{ display:"block", transform:"translateY(110%)" }}
                    dangerouslySetInnerHTML={{ __html: line }} />
                </div>
              ))}
            </h2>
            <div className="v6-cta-btns">
              <Link href="/contact" className="v6-btn-p">Solicită ofertă gratuită →</Link>
              <Link href="/proiecte" className="v6-btn-o">Descoperă portofoliul</Link>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="v6-footer">
          <span className="v6-footer-logo">MOODILIER</span>
          <span className="v6-footer-copy">© 2025 SC Moodilier SRL · București</span>
          <nav className="v6-footer-nav">
            <Link href="/proiecte">Proiecte</Link>
            <Link href="/servicii">Servicii</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </footer>

      </div>
    </>
  );
}
