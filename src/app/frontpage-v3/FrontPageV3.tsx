"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
function easeOutCubic(t: number) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3); }
function easeInOutCubic(t: number) {
  t = Math.max(0, Math.min(1, t));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function phase(p: number, a: number, b: number) {
  return easeOutCubic(Math.max(0, Math.min(1, (p - a) / (b - a))));
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/* ─────────────────────────────────────────────────────────────
   SELF-CONTAINED STYLES
───────────────────────────────────────────────────────────── */
const STYLES = `
.fp3 {
  --gold: #c9a984; --gold2: #e8d5b7;
  --bg: #0e0c0a; --bg2: #161210; --bg3: #1a1714;
  --fg: #ede5da; --fg2: #7a6e62; --border: rgba(201,169,132,.1);
  --sans: 'Inter', sans-serif; --serif: 'Cormorant Garamond', serif;
  background: var(--bg); color: var(--fg);
  /* overflow-x: clip instead of hidden — clip doesn't break position:sticky */
  font-family: var(--sans); overflow-x: clip;
}
.fp3 * { box-sizing: border-box; }
.fp3 a { text-decoration: none; color: inherit; }

/* ── INTRO HERO ─────────────────────────────────────────── */
.fp3-intro {
  height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; position: relative; overflow: hidden;
}
.fp3-intro__bg {
  position: absolute; inset: 0;
  animation: fp3BgZoom 2.5s cubic-bezier(.16,1,.3,1) both;
}
@keyframes fp3BgZoom {
  from { transform: scale(1.15); filter: brightness(.4); }
  to   { transform: scale(1);    filter: brightness(.45); }
}
.fp3-intro__ov {
  position: absolute; inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10,8,6,.3) 0%,
    rgba(10,8,6,.1) 40%,
    rgba(10,8,6,.8) 100%
  );
}
.fp3-intro__content {
  position: relative; z-index: 2;
}
.fp3-intro__pre {
  font-size: .58rem; letter-spacing: .45em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 1.8rem;
  opacity: 0; transform: translateY(12px);
  animation: fp3FadeUp .7s ease .4s both;
}
.fp3-intro__h1 {
  font-family: var(--serif); font-weight: 300; font-size: clamp(5rem, 13vw, 13rem);
  line-height: .85; letter-spacing: -.025em;
  opacity: 0; transform: translateY(40px) scale(.96);
  animation: fp3FadeUp 1.1s cubic-bezier(.16,1,.3,1) .6s both;
}
.fp3-intro__h1 em { font-style: italic; color: var(--gold); }
.fp3-intro__sub {
  font-family: var(--sans); font-size: .75rem; letter-spacing: .15em;
  color: rgba(237,229,218,.5); margin-top: 1.5rem;
  opacity: 0; animation: fp3FadeUp .7s ease 1s both;
}
.fp3-scroll-cue {
  position: absolute; bottom: 3rem; left: 50%;
  transform: translateX(-50%); z-index: 2;
  display: flex; flex-direction: column; align-items: center; gap: .8rem;
  opacity: 0; animation: fp3FadeUp .6s ease 1.5s both;
}
.fp3-scroll-cue span {
  font-size: .52rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--gold);
}
.fp3-scroll-cue svg { animation: fp3Bounce 1.6s ease-in-out 2s infinite; }
@keyframes fp3Bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(6px); }
}
@keyframes fp3FadeUp {
  from { opacity: 0; transform: translateY(24px) scale(.97); }
  to   { opacity: 1; transform: none; }
}

/* ── ROOM SECTION (sticky scroll) ──────────────────────── */
.fp3-room-wrap {
  position: relative;
  /* height set inline — 600vh for scroll space */
}
.fp3-room-sticky {
  position: sticky; top: 0; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; background: var(--bg);
}


/* 3-D perspective viewport */
.fp3-room-3d {
  position: relative; width: 100%; height: 100%;
  perspective: 1400px;
  perspective-origin: 50% 48%;
}
.fp3-room-scene {
  position: absolute; inset: 0;
  transform-style: preserve-3d;
}

/* Generic panel */
.fp3-panel {
  position: absolute; overflow: hidden;
  backface-visibility: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,.7);
  border: 1px solid rgba(201,169,132,.2);
  will-change: transform, opacity;
  transition: none; /* driven by JS */
}
.fp3-panel img { display: block; width: 100%; height: 100%; object-fit: cover; }

/* Gold corner accents on panels */
.fp3-panel::before, .fp3-panel::after {
  content: ''; position: absolute; z-index: 2;
  pointer-events: none;
  background: var(--gold);
}
.fp3-panel::before {
  width: 20px; height: 1px;
  top: 12px; left: 12px;
  box-shadow: 0 -10px 0 var(--gold), 10px 0 0 transparent;
}
.fp3-panel::after {
  width: 1px; height: 20px;
  top: 12px; left: 12px;
}

/* Panel label */
.fp3-panel-label {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 1rem 1.2rem;
  background: linear-gradient(to top, rgba(8,6,4,.85) 0%, transparent 100%);
  z-index: 2;
}
.fp3-panel-cat {
  font-size: .52rem; letter-spacing: .3em; text-transform: uppercase;
  color: var(--gold); margin-bottom: .3rem;
}
.fp3-panel-name {
  font-family: var(--serif); font-size: 1.1rem; font-weight: 300;
}

/* CENTER TEXT overlay in room */
.fp3-room-text {
  position: absolute; z-index: 10;
  width: 100%; text-align: center;
  top: 50%; transform: translateY(-50%);
  pointer-events: none;
  display: flex; flex-direction: column; align-items: center; gap: .8rem;
  will-change: opacity;
}
.fp3-room-label {
  font-size: .58rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--gold);
}
.fp3-room-phase-title {
  font-family: var(--serif); font-size: clamp(2rem, 5vw, 4.5rem);
  font-weight: 300; line-height: 1;
}
.fp3-room-phase-title em { font-style: italic; color: var(--gold); }

/* PROGRESS BAR */
.fp3-progress-bar {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 20;
  height: 1px; background: rgba(201,169,132,.08);
}
.fp3-progress-fill {
  height: 100%; background: var(--gold);
  will-change: width;
}
.fp3-progress-label {
  position: absolute; bottom: 10px; left: 50%;
  transform: translateX(-50%);
  font-size: .5rem; letter-spacing: .35em; text-transform: uppercase;
  color: var(--fg2);
  will-change: opacity;
}

/* Final CTA inside room */
.fp3-room-cta {
  position: absolute; z-index: 15;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  text-align: center;
  will-change: opacity, transform;
  display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
}
.fp3-room-cta__tag {
  font-size: .58rem; letter-spacing: .4em; text-transform: uppercase; color: var(--gold);
}
.fp3-room-cta__h {
  font-family: var(--serif); font-size: clamp(2.5rem, 6vw, 5.5rem);
  font-weight: 300; line-height: .9; letter-spacing: -.02em;
}
.fp3-room-cta__h em { font-style: italic; color: var(--gold); }
.fp3-room-cta__btns {
  display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
}

/* ── BUTTONS ────────────────────────────────────────────── */
.fp3-btn-p {
  padding: .9rem 2.2rem; background: var(--gold);
  color: #0e0c0a; font-size: .63rem; letter-spacing: .22em;
  text-transform: uppercase; display: inline-block;
  transition: background .3s;
}
.fp3-btn-p:hover { background: var(--gold2); }
.fp3-btn-o {
  padding: .9rem 2.2rem; border: 1px solid rgba(201,169,132,.35);
  color: var(--gold); font-size: .63rem; letter-spacing: .22em;
  text-transform: uppercase; display: inline-block;
  transition: all .3s;
}
.fp3-btn-o:hover { background: var(--gold); color: #0e0c0a; }

/* ── PROJECTS SECTION (3D flip reveal) ──────────────────── */
.fp3-proj { padding: 8rem 4rem; max-width: 1400px; margin: 0 auto; }
.fp3-proj__head { text-align: center; margin-bottom: 5rem; }
.fp3-proj__label {
  font-size: .58rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--gold); display: block; margin-bottom: 1rem;
}
.fp3-proj__title {
  font-family: var(--serif); font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 300;
}
.fp3-proj__title em { font-style: italic; color: var(--gold); }
.fp3-proj__grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
}
.fp3-pcard {
  display: block; position: relative; overflow: hidden;
  opacity: 0; transform: perspective(600px) rotateY(25deg) translateX(30px);
  transition: opacity 1s cubic-bezier(.16,1,.3,1), transform 1.2s cubic-bezier(.16,1,.3,1);
}
.fp3-pcard:nth-child(3n+2) { transform: perspective(600px) rotateX(-20deg) translateY(-20px); }
.fp3-pcard:nth-child(3n+3) { transform: perspective(600px) rotateY(-25deg) translateX(-30px); }
.fp3-pcard.fp3-in { opacity: 1; transform: none; }
.fp3-pcard__img { aspect-ratio: 3/2; position: relative; overflow: hidden; }
.fp3-pcard__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s ease; }
.fp3-pcard:hover .fp3-pcard__img img { transform: scale(1.05); }
.fp3-pcard__info { padding: 1rem 0; }
.fp3-pcard__cat { font-size: .55rem; letter-spacing: .3em; text-transform: uppercase; color: var(--gold); }
.fp3-pcard__name { font-family: var(--serif); font-size: 1.2rem; font-weight: 300; }

/* ── SERVICES ───────────────────────────────────────────── */
.fp3-svc { background: var(--bg2); padding: 8rem 4rem; }
.fp3-svc__head { text-align: center; margin-bottom: 5rem; }
.fp3-svc__label { font-size: .58rem; letter-spacing: .4em; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 1rem; }
.fp3-svc__title { font-family: var(--serif); font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 300; }
.fp3-svc__title em { font-style: italic; color: var(--gold); }
.fp3-svc__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; max-width: 1200px; margin: 0 auto; }
.fp3-scard {
  background: var(--bg); padding: 2.5rem;
  opacity: 0; transform: translateY(40px);
  transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1), border-color .3s;
  border: 1px solid var(--border);
}
.fp3-scard.fp3-in { opacity: 1; transform: none; }
.fp3-scard:hover { border-color: rgba(201,169,132,.28); }
.fp3-scard__num { font-family: var(--serif); font-size: 2.5rem; color: rgba(201,169,132,.12); margin-bottom: .8rem; }
.fp3-scard__name { font-family: var(--serif); font-size: 1.2rem; font-weight: 300; margin-bottom: .6rem; }
.fp3-scard__desc { font-size: .78rem; line-height: 1.8; color: var(--fg2); }

/* ── CTA FINALE ─────────────────────────────────────────── */
.fp3-cta {
  position: relative; height: 85vh; overflow: hidden;
  display: flex; align-items: center; justify-content: center; text-align: center;
}
.fp3-cta__bg { position: absolute; inset: 0; }
.fp3-cta__bg img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform 1.5s ease; }
.fp3-cta__bg.fp3-in img { transform: scale(1); }
.fp3-cta__ov { position: absolute; inset: 0; background: rgba(8,6,4,.72); }
.fp3-cta__cnt { position: relative; z-index: 1; max-width: 700px; padding: 2rem; }
.fp3-cta__tag {
  font-size: .58rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--gold); display: block; margin-bottom: 2rem;
  opacity: 0; transform: translateY(16px);
  transition: all .8s cubic-bezier(.16,1,.3,1);
}
.fp3-cta__h {
  font-family: var(--serif); font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 300; line-height: .9; letter-spacing: -.02em; margin-bottom: 2.5rem;
  opacity: 0; transform: translateY(32px);
  transition: all 1s cubic-bezier(.16,1,.3,1) .12s;
}
.fp3-cta__h em { font-style: italic; color: var(--gold); }
.fp3-cta__btns {
  display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
  opacity: 0; transform: translateY(20px);
  transition: all .8s cubic-bezier(.16,1,.3,1) .25s;
}
.fp3-cta__cnt.fp3-in .fp3-cta__tag,
.fp3-cta__cnt.fp3-in .fp3-cta__h,
.fp3-cta__cnt.fp3-in .fp3-cta__btns { opacity: 1; transform: none; }

/* ── MARQUEE ────────────────────────────────────────────── */
.fp3-marquee { background: var(--bg3); overflow: hidden; padding: 1rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.fp3-marquee__track { display: flex; width: max-content; animation: fp3Marquee 65s linear infinite; }
.fp3-marquee__track:hover { animation-play-state: paused; }
@keyframes fp3Marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
.fp3-marquee__item { display: inline-flex; align-items: center; gap: 1rem; padding: 0 2rem; white-space: nowrap; font-size: .6rem; letter-spacing: .3em; text-transform: uppercase; color: var(--gold); font-weight: 500; }
.fp3-marquee__dot { opacity: .35; }

/* ── FOOTER ─────────────────────────────────────────────── */
.fp3-footer { background: var(--bg2); padding: 2rem 4rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); }
.fp3-footer__logo { font-family: var(--serif); font-size: 1rem; font-weight: 300; letter-spacing: .2em; color: var(--fg2); }
.fp3-footer__copy { font-size: .55rem; letter-spacing: .1em; color: rgba(237,229,218,.2); }
.fp3-footer__back { font-size: .55rem; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }

@media (max-width: 900px) {
  .fp3-proj__grid { grid-template-columns: 1fr 1fr; }
  .fp3-svc__grid { grid-template-columns: 1fr 1fr; }
  .fp3-proj, .fp3-svc { padding: 5rem 2rem; }
  .fp3-footer { flex-direction: column; gap: 1rem; padding: 2rem; text-align: center; }
}
@media (max-width: 600px) {
  .fp3-proj__grid { grid-template-columns: 1fr; }
  .fp3-svc__grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .fp3-panel, .fp3-pcard, .fp3-scard, .fp3-cta__tag, .fp3-cta__h, .fp3-cta__btns { transition: none !important; opacity: 1 !important; transform: none !important; }
  .fp3-intro__bg { animation: none; filter: brightness(.45); }
}
`;

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const ROOM_PANELS = [
  { id: "left",   img: "/images-scraped/Olimp_03.jpg",              cat: "Rezidențial",  name: "Apt. Olimp",          side: "LIVING ROOM" },
  { id: "top",    img: "/images-scraped/buc_giurgiu_1.jpg",         cat: "Bucătărie",    name: "Bucătărie modernă",    side: "KITCHEN" },
  { id: "right",  img: "/images-scraped/Black_Pearl_01.jpg",        cat: "Rezidențial",  name: "Apt. Mamaia Nord",     side: "BEDROOM" },
  { id: "bottom", img: "/images-scraped/apptown_exec_28.jpg",       cat: "Rezidențial",  name: "AppTown North",       side: "DRESSING" },
];

const PHASE_TEXTS = [
  { t: 0.00, label: "Scroll pentru a mobila camera", title: "Camera ta\nde vis", italic: false },
  { t: 0.15, label: "Living room",   title: "Spații care\ninspirează",        italic: true },
  { t: 0.35, label: "Kitchen",       title: "Bucătării\npremium",             italic: true },
  { t: 0.55, label: "Bedroom",       title: "Dormitoare\nde lux",             italic: true },
  { t: 0.72, label: "Dressing",      title: "Fiecare\ndetaliu contează",      italic: true },
  { t: 0.88, label: "Moodilier",     title: "Your space.\nYour furniture.",   italic: false },
];

const PROJECTS = [
  { cat: "Rezidențial", name: "Vila Cosmopolis",   img: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href: "/proiecte/executie_vila-cosmopolis" },
  { cat: "Rezidențial", name: "Casa Mogoșoaia",    img: "/images-scraped/Mogosoaia_01.jpg",                             href: "/proiecte/executie_casa-mogosoaia" },
  { cat: "Comercial",   name: "Sediu de Birouri",  img: "/images-scraped/carusel_office.jpg",                           href: "/proiecte/executie_sediu-office" },
  { cat: "Rezidențial", name: "Vila Corbeanca",    img: "/images-scraped/vila_corbeanca_exec_living_4.jpg",             href: "/proiecte" },
  { cat: "Rezidențial", name: "Apt. Olimp",        img: "/images-scraped/Olimp_03.jpg",                                href: "/proiecte/executie_apt-olimp" },
  { cat: "Rezidențial", name: "Apt. Mamaia Nord",  img: "/images-scraped/Black_Pearl_01.jpg",                          href: "/proiecte/executie_apt-mamaia-nord" },
];

const SERVICES = [
  { num: "01", name: "Servicii de proiectare", desc: "Concept, vizualizări 3D și proiectare tehnică completă, adaptată spațiului și stilului tău." },
  { num: "02", name: "Mobilier la comandă",    desc: "Bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil." },
  { num: "03", name: "Moodilier Store",        desc: "Import selecționat de mobilier premium de la designeri consacrați din Italia și Danemarca." },
  { num: "04", name: "Montaj profesionist",    desc: "Montaj precis și verificare finală pentru ca fiecare detaliu să fie impecabil." },
  { num: "05", name: "Spații comerciale",      desc: "Recepții, birouri, showroom-uri — mobilier care reflectă identitatea brandului." },
  { num: "06", name: "Design interior",        desc: "Consiliere completă de design interior pentru proiecte rezidențiale și comerciale." },
];

const MARQUEE_ITEMS = ["Bucătării", "Dressinguri", "Livinguri", "Dormitoare", "Comercial", "Design Interior", "Premium", "La Comandă"];

/* ─────────────────────────────────────────────────────────────
   ROOM SCENE — scroll-linked 3D assembly
───────────────────────────────────────────────────────────── */
function RoomScene() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  /* ── Track scroll position relative to this section ── */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect  = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p     = Math.max(0, Math.min(1, -rect.top / total));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Per-panel transforms ── */
  // LEFT:   rotateY -90→0, transform-origin left center
  const leftRot   = lerp(-90, 0,  phase(progress, 0.05, 0.30));
  const leftOp    = phase(progress, 0.05, 0.25);

  // TOP:    rotateX 90→0, transform-origin top center
  const topRot    = lerp(90, 0,   phase(progress, 0.22, 0.46));
  const topOp     = phase(progress, 0.22, 0.40);

  // RIGHT:  rotateY 90→0, transform-origin right center
  const rightRot  = lerp(90, 0,   phase(progress, 0.40, 0.64));
  const rightOp   = phase(progress, 0.40, 0.58);

  // BOTTOM: rotateX -90→0, transform-origin bottom center
  const botRot    = lerp(-90, 0,  phase(progress, 0.58, 0.82));
  const botOp     = phase(progress, 0.58, 0.76);

  // CENTER CTA
  const ctaOp     = phase(progress, 0.84, 0.98);
  const ctaScale  = lerp(0.88, 1, phase(progress, 0.84, 0.98));

  // Panel dims fade as CTA appears
  const panelDim  = lerp(1, 0.35, phase(progress, 0.84, 0.98));

  // Phase text (fades between labels as scroll progresses)
  const activePhase = PHASE_TEXTS.reduce((acc, pt) => progress >= pt.t ? pt : acc, PHASE_TEXTS[0]);
  const textOp = 1 - phase(progress, 0.84, 0.92); // hides as CTA comes in

  /* ── Room line coords unused now ── */

  return (
    <div ref={wrapRef} className="fp3-room-wrap" style={{ height: "600vh" }}>
      <div className="fp3-room-sticky">


        {/* 3D scene */}
        <div className="fp3-room-3d">
          <div className="fp3-room-scene">

            {/* LEFT panel — opens like a left door */}
            <div className="fp3-panel" style={{
              width: "35%", height: "60%",
              top: "20%", left: "0",
              transformOrigin: "0% 50%",
              transform: `rotateY(${leftRot}deg)`,
              opacity: leftOp * panelDim,
            }}>
              <Image src={ROOM_PANELS[0].img} alt={ROOM_PANELS[0].name} fill sizes="35vw" style={{ objectFit: "cover" }} unoptimized />
              <div className="fp3-panel-label">
                <div className="fp3-panel-cat">{ROOM_PANELS[0].cat}</div>
                <div className="fp3-panel-name">{ROOM_PANELS[0].name}</div>
              </div>
            </div>

            {/* TOP panel — drops from ceiling */}
            <div className="fp3-panel" style={{
              width: "55%", height: "42%",
              top: "0", left: "22.5%",
              transformOrigin: "50% 0%",
              transform: `rotateX(${topRot}deg)`,
              opacity: topOp * panelDim,
            }}>
              <Image src={ROOM_PANELS[1].img} alt={ROOM_PANELS[1].name} fill sizes="55vw" style={{ objectFit: "cover" }} unoptimized />
              <div className="fp3-panel-label">
                <div className="fp3-panel-cat">{ROOM_PANELS[1].cat}</div>
                <div className="fp3-panel-name">{ROOM_PANELS[1].name}</div>
              </div>
            </div>

            {/* RIGHT panel — opens like a right door */}
            <div className="fp3-panel" style={{
              width: "35%", height: "60%",
              top: "20%", right: "0",
              transformOrigin: "100% 50%",
              transform: `rotateY(${rightRot}deg)`,
              opacity: rightOp * panelDim,
            }}>
              <Image src={ROOM_PANELS[2].img} alt={ROOM_PANELS[2].name} fill sizes="35vw" style={{ objectFit: "cover" }} unoptimized />
              <div className="fp3-panel-label">
                <div className="fp3-panel-cat">{ROOM_PANELS[2].cat}</div>
                <div className="fp3-panel-name">{ROOM_PANELS[2].name}</div>
              </div>
            </div>

            {/* BOTTOM panel — rises from floor */}
            <div className="fp3-panel" style={{
              width: "55%", height: "38%",
              bottom: "0", left: "22.5%",
              transformOrigin: "50% 100%",
              transform: `rotateX(${botRot}deg)`,
              opacity: botOp * panelDim,
            }}>
              <Image src={ROOM_PANELS[3].img} alt={ROOM_PANELS[3].name} fill sizes="55vw" style={{ objectFit: "cover" }} unoptimized />
              <div className="fp3-panel-label">
                <div className="fp3-panel-cat">{ROOM_PANELS[3].cat}</div>
                <div className="fp3-panel-name">{ROOM_PANELS[3].name}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Phase text — fades between room phases */}
        <div className="fp3-room-text" style={{ opacity: textOp, pointerEvents: "none" }}>
          <span className="fp3-room-label">{activePhase.label}</span>
          <h2 className="fp3-room-phase-title" style={{ whiteSpace: "pre-line" }}>
            {activePhase.italic
              ? <em>{activePhase.title}</em>
              : activePhase.title}
          </h2>
        </div>

        {/* FINAL CTA — assembles when all panels are in */}
        <div className="fp3-room-cta" style={{
          opacity: ctaOp,
          transform: `translate(-50%, -50%) scale(${ctaScale})`,
          pointerEvents: ctaOp > 0.5 ? "auto" : "none",
        }}>
          <span className="fp3-room-cta__tag">✦ Moodilier · mobilier premium ✦</span>
          <h2 className="fp3-room-cta__h">
            Camera ta<br />se <em>mobilează.</em>
          </h2>
          <div className="fp3-room-cta__btns">
            <Link href="/proiecte" className="fp3-btn-p">Descoperă proiectele →</Link>
            <Link href="/contact"  className="fp3-btn-o">Solicită ofertă</Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="fp3-progress-bar">
          <div className="fp3-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="fp3-progress-label" style={{ opacity: lerp(1, 0, phase(progress, 0.92, 1)) }}>
          {progress < 0.05 ? "Scrollează pentru a mobila camera" : `${Math.round(progress * 100)}% asamblat`}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function FrontPageV3() {
  const projRefs  = useRef<(HTMLAnchorElement | null)[]>([]);
  const svcRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const ctaBgRef  = useRef<HTMLDivElement>(null);
  const ctaCntRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const delay = Number(el.dataset.delay ?? 0);
          setTimeout(() => el.classList.add("fp3-in"), delay);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });

    projRefs.current.forEach((el, i) => {
      if (!el) return;
      el.dataset.delay = String(i * 80);
      obs.observe(el);
    });
    svcRefs.current.forEach((el, i) => {
      if (!el) return;
      el.dataset.delay = String(i * 75);
      obs.observe(el);
    });
    if (ctaBgRef.current)  obs.observe(ctaBgRef.current);
    if (ctaCntRef.current) obs.observe(ctaCntRef.current);

    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="fp3">

        {/* ═══ INTRO HERO ═══ */}
        <section className="fp3-intro">
          <div className="fp3-intro__bg">
            <Image
              src="/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
              alt="Moodilier — Mobilier Premium"
              fill sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 30%" }}
              priority quality={85}
            />
          </div>
          <div className="fp3-intro__ov" />
          <div className="fp3-intro__content">
            <p className="fp3-intro__pre">✦ Mobilier premium la comandă · București</p>
            <h1 className="fp3-intro__h1">
              Mood<em>ilier</em>
            </h1>
            <p className="fp3-intro__sub">Executat cu precizie · Trăit cu bucurie</p>
          </div>
          <div className="fp3-scroll-cue">
            <span>Scrollează</span>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path d="M8 1v18M1 13l7 7 7-7" stroke="#c9a984" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </section>

        {/* ═══ MARQUEE ═══ */}
        <div className="fp3-marquee" aria-hidden>
          <div className="fp3-marquee__track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="fp3-marquee__item">
                <span className="fp3-marquee__dot">✦</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ 3D ROOM ASSEMBLY ═══ */}
        <RoomScene />

        {/* ═══ PROJECTS (3D flip) ═══ */}
        <section style={{ background: "var(--bg)" }}>
          <div className="fp3-proj">
            <div className="fp3-proj__head">
              <span className="fp3-proj__label">Portofoliu selectat</span>
              <h2 className="fp3-proj__title">Proiecte <em>realizate</em></h2>
            </div>
            <div className="fp3-proj__grid">
              {PROJECTS.map((p, i) => (
                <Link
                  href={p.href} key={i}
                  className="fp3-pcard"
                  ref={(el) => { projRefs.current[i] = el; }}
                  style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
                >
                  <div className="fp3-pcard__img">
                    <Image src={p.img} alt={p.name} fill sizes="33vw"
                      style={{ objectFit: "cover" }} unoptimized
                      loading={i < 3 ? "eager" : "lazy"} />
                  </div>
                  <div className="fp3-pcard__info">
                    <div className="fp3-pcard__cat">{p.cat}</div>
                    <div className="fp3-pcard__name">{p.name}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
              <Link href="/proiecte" className="fp3-btn-o">
                Toate proiectele →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ SERVICES ═══ */}
        <section className="fp3-svc">
          <div className="fp3-svc__head">
            <span className="fp3-svc__label">Ce facem</span>
            <h2 className="fp3-svc__title">Servicii <em>oferite</em></h2>
          </div>
          <div className="fp3-svc__grid">
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className="fp3-scard"
                ref={(el) => { svcRefs.current[i] = el; }}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className="fp3-scard__num">{s.num}</div>
                <div className="fp3-scard__name">{s.name}</div>
                <div className="fp3-scard__desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CTA FINALE ═══ */}
        <section className="fp3-cta">
          <div className="fp3-cta__bg" ref={ctaBgRef}>
            <Image
              src="/images-scraped/vila_corbeanca_exec_living_4.jpg"
              alt="Contact Moodilier" fill sizes="100vw"
              style={{ objectFit: "cover" }} unoptimized
            />
          </div>
          <div className="fp3-cta__ov" />
          <div className="fp3-cta__cnt" ref={ctaCntRef}>
            <span className="fp3-cta__tag">Hai să lucrăm împreună</span>
            <h2 className="fp3-cta__h">
              Transformăm<br /><em>viziunea</em> ta<br />în mobilier real.
            </h2>
            <div className="fp3-cta__btns">
              <Link href="/contact" className="fp3-btn-p">Solicită ofertă gratuită →</Link>
              <Link href="/proiecte" className="fp3-btn-o">Descoperă portofoliul</Link>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="fp3-footer">
          <span className="fp3-footer__logo">MOODILIER</span>
          <span className="fp3-footer__copy">© 2025 SC Moodilier SRL · București</span>
          <Link href="/" className="fp3-footer__back">← Site principal</Link>
        </footer>

      </div>
    </>
  );
}
