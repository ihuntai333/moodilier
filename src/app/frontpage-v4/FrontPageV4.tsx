"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ══════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════ */
const STYLES = `
.fp4 {
  --gold: #c9a984; --gold2: #e8d5b7; --gold-dim: rgba(201,169,132,.12);
  --bg: #0a0806; --bg2: #141210; --bg3: #1c1916;
  --fg: #ede5da; --fg2: #7a6e62;
  --sans: 'Inter', sans-serif; --serif: 'Cormorant Garamond', serif;
  background: var(--bg); color: var(--fg); font-family: var(--sans);
  /* clip not hidden — preserves sticky */
  overflow-x: clip;
}
.fp4 * { box-sizing: border-box; }
.fp4 a { text-decoration: none; color: inherit; }

/* ── HERO ─────────────────────────────────────────────────── */
.fp4-hero {
  position: relative; height: 100vh; overflow: hidden;
  display: grid; place-items: center;
}
.fp4-hero__bg {
  position: absolute; inset: 0;
  animation: fp4BgIn 2.4s cubic-bezier(.16,1,.3,1) both;
}
@keyframes fp4BgIn {
  from { transform: scale(1.14); filter: brightness(.3); }
  to   { transform: scale(1);    filter: brightness(.5); }
}
.fp4-hero__ov {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, rgba(10,8,6,.55) 0%, rgba(10,8,6,.15) 50%, rgba(10,8,6,.7) 100%);
}

/* Multi-direction title assembly */
.fp4-hero__title {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  gap: .4rem; text-align: center;
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(4.5rem, 11vw, 11rem); line-height: .88;
  letter-spacing: -.02em;
}

/* Line 1 wipes in from LEFT */
.fp4-hero__l1 {
  display: block; clip-path: inset(0 100% 0 0);
  animation: fp4WipeFromLeft 1.2s cubic-bezier(.76,0,.24,1) .3s both;
}
/* Line 2 wipes in from RIGHT */
.fp4-hero__l2 {
  display: block; clip-path: inset(0 0 0 100%);
  animation: fp4WipeFromRight 1.2s cubic-bezier(.76,0,.24,1) .55s both;
  font-style: italic; color: var(--gold);
}
/* Line 3 rises from below */
.fp4-hero__l3 {
  display: block; font-size: .38em; font-family: var(--sans);
  letter-spacing: .45em; text-transform: uppercase; color: var(--fg2);
  opacity: 0; transform: translateY(20px);
  animation: fp4FadeUp .9s cubic-bezier(.16,1,.3,1) 1.1s both;
}
/* Gold divider that draws left→right */
.fp4-hero__divider {
  display: block; width: 0; height: 1px; background: var(--gold);
  animation: fp4LineGrow 1s ease .8s both;
  align-self: stretch;
  margin: .4rem auto; max-width: 220px;
}
@keyframes fp4WipeFromLeft  { to { clip-path: inset(0 0% 0 0); } }
@keyframes fp4WipeFromRight { to { clip-path: inset(0 0 0 0%); } }
@keyframes fp4FadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}
@keyframes fp4LineGrow { to { width: 100%; } }

/* Hero bottom CTA */
.fp4-hero__bottom {
  position: absolute; bottom: 3rem; left: 0; right: 0; z-index: 2;
  display: flex; justify-content: space-between; align-items: flex-end;
  padding: 0 4rem;
  opacity: 0; animation: fp4FadeUp .8s ease 1.4s both;
}
.fp4-hero__cta-label {
  font-size: .55rem; letter-spacing: .4em; text-transform: uppercase; color: var(--gold);
}
.fp4-hero__scroll {
  display: flex; flex-direction: column; align-items: center; gap: .5rem;
}
.fp4-hero__scroll span {
  font-size: .5rem; letter-spacing: .35em; text-transform: uppercase; color: var(--fg2);
}
.fp4-scroll-arrow {
  width: 1px; height: 40px; background: var(--gold);
  transform-origin: top;
  animation: fp4ArrowGrow 1s ease 1.8s both, fp4ArrowPulse 2s ease 2.8s infinite;
}
@keyframes fp4ArrowGrow  { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes fp4ArrowPulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
.fp4-hero__tagline {
  font-family: var(--serif); font-size: 1rem; font-style: italic; color: rgba(237,229,218,.4);
  max-width: 260px; line-height: 1.5;
}

/* ── MARQUEE ─────────────────────────────────────────────── */
.fp4-marquee {
  background: #131109; overflow: hidden;
  padding: 1.1rem 0;
  border-top: 1px solid var(--gold-dim); border-bottom: 1px solid var(--gold-dim);
}
.fp4-marquee__track {
  display: flex; width: max-content;
  animation: fp4Marquee 70s linear infinite;
}
.fp4-marquee__track:hover { animation-play-state: paused; }
@keyframes fp4Marquee { to { transform: translateX(-33.333%); } }
.fp4-marquee__item {
  display: inline-flex; align-items: center; gap: .8rem;
  padding: 0 2.4rem; white-space: nowrap;
  font-size: .58rem; letter-spacing: .32em; text-transform: uppercase;
  color: var(--gold); font-weight: 500;
}
.fp4-marquee__sep { opacity: .3; }

/* ── HORIZONTAL JOURNEY ──────────────────────────────────── */
.fp4-h-wrap {
  position: relative;
  /* height set inline via JS: (N rooms - 1) × 100vh + 100vh */
}
.fp4-h-sticky {
  position: sticky; top: 0; height: 100vh; overflow: hidden;
}
.fp4-h-track {
  display: flex; height: 100vh;
  will-change: transform;
  /* width set inline: N × 100vw */
}

/* Individual room panel */
.fp4-room {
  flex-shrink: 0; width: 100vw; height: 100vh;
  position: relative; overflow: hidden;
}
.fp4-room__img {
  position: absolute; inset: 0;
  transition: transform .1s linear; /* subtle parallax handled via JS */
}
.fp4-room__img img { width: 100%; height: 100%; object-fit: cover; }
.fp4-room__ov {
  position: absolute; inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10,8,6,.2) 0%,
    rgba(10,8,6,.05) 40%,
    rgba(10,8,6,.75) 100%
  );
}

/* Room category (top center) */
.fp4-room__top {
  position: absolute; top: 3rem; left: 0; right: 0; z-index: 2;
  display: flex; justify-content: center; align-items: center; gap: 2rem;
}
.fp4-room__index {
  font-family: var(--serif); font-size: 4rem; font-weight: 300; line-height: 1;
  color: rgba(201,169,132,.18); letter-spacing: -.04em;
}
.fp4-room__category {
  font-size: .58rem; letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
}

/* Room bottom info */
.fp4-room__bottom {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
  padding: 0 5rem 3.5rem;
  display: flex; justify-content: space-between; align-items: flex-end;
}
.fp4-room__name {
  font-family: var(--serif); font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 300; line-height: .9; letter-spacing: -.02em;
}
.fp4-room__name em { font-style: italic; color: var(--gold); }
.fp4-room__meta {
  text-align: right; display: flex; flex-direction: column; gap: .4rem;
  align-items: flex-end;
}
.fp4-room__loc {
  font-size: .6rem; letter-spacing: .25em; text-transform: uppercase; color: var(--fg2);
}
.fp4-room__link {
  font-size: .58rem; letter-spacing: .2em; text-transform: uppercase; color: var(--gold);
  display: inline-flex; align-items: center; gap: .5rem;
  transition: gap .3s;
}
.fp4-room__link:hover { gap: .9rem; }

/* Vertical room progress indicator (right side) */
.fp4-h-indicator {
  position: absolute; right: 2.2rem; top: 50%; transform: translateY(-50%);
  z-index: 10; display: flex; flex-direction: column; gap: .7rem;
  align-items: center;
}
.fp4-h-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: rgba(201,169,132,.3);
  transition: all .4s ease;
}
.fp4-h-dot.active {
  background: var(--gold);
  box-shadow: 0 0 8px rgba(201,169,132,.5);
  transform: scale(1.6);
}

/* Horizontal progress bar (bottom) */
.fp4-h-progress {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 10;
  height: 1px; background: rgba(201,169,132,.08);
}
.fp4-h-progress__fill {
  height: 100%; background: var(--gold);
  will-change: width; transition: none;
}

/* ── STATS ───────────────────────────────────────────────── */
.fp4-stats {
  background: var(--bg2);
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--gold-dim); border-bottom: 1px solid var(--gold-dim);
}
.fp4-stat {
  padding: 4rem 2rem; text-align: center;
  border-right: 1px solid var(--gold-dim);
  opacity: 0; transform: translateY(30px) scale(.94);
  transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
}
.fp4-stat:last-child { border-right: none; }
.fp4-stat.fp4-in { opacity: 1; transform: none; }
.fp4-stat__n {
  font-family: var(--serif); font-size: clamp(3rem, 5vw, 5rem);
  font-weight: 300; color: var(--gold); line-height: 1; margin-bottom: .5rem;
}
.fp4-stat__l {
  font-size: .55rem; letter-spacing: .3em; text-transform: uppercase; color: var(--fg2);
}

/* ── PROJECTS ────────────────────────────────────────────── */
.fp4-proj { padding: 8rem 4rem; max-width: 1400px; margin: 0 auto; }
.fp4-proj__head { margin-bottom: 4rem; }
.fp4-proj__tag {
  font-size: .58rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--gold); display: block; margin-bottom: 1rem;
}
.fp4-proj__h {
  font-family: var(--serif); font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 300; line-height: 1;
}
.fp4-proj__h em { font-style: italic; color: var(--gold); }

/* Masonry-ish 2-col layout */
.fp4-proj__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  gap: 3px;
}
/* Big card first */
.fp4-pcard {
  display: block; position: relative; overflow: hidden;
  opacity: 0;
  transition: opacity 1.1s cubic-bezier(.16,1,.3,1), transform 1.2s cubic-bezier(.16,1,.3,1);
}
.fp4-pcard:nth-child(odd)  { transform: translateX(-60px) rotateY(6deg); }
.fp4-pcard:nth-child(even) { transform: translateX(60px) rotateY(-6deg); }
.fp4-pcard:first-child { grid-row: span 2; }
.fp4-pcard.fp4-in { opacity: 1; transform: none; }
.fp4-pcard__img { position: relative; overflow: hidden; height: 100%; min-height: 280px; }
.fp4-pcard__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(.16,1,.3,1); }
.fp4-pcard:hover .fp4-pcard__img img { transform: scale(1.06); }
.fp4-pcard__info {
  position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem;
  background: linear-gradient(to top, rgba(10,8,6,.88) 0%, transparent 100%);
}
.fp4-pcard__cat { font-size: .52rem; letter-spacing: .28em; text-transform: uppercase; color: var(--gold); margin-bottom: .3rem; }
.fp4-pcard__name { font-family: var(--serif); font-size: 1.3rem; font-weight: 300; }
.fp4-proj__more {
  margin-top: 3rem; text-align: right;
  opacity: 0; transform: translateY(20px);
  transition: all .8s cubic-bezier(.16,1,.3,1) .3s;
}
.fp4-proj__more.fp4-in { opacity: 1; transform: none; }

/* ── BUTTONS ─────────────────────────────────────────────── */
.fp4-btn-p {
  padding: .9rem 2.4rem; background: var(--gold); color: var(--bg);
  font-size: .62rem; letter-spacing: .22em; text-transform: uppercase;
  display: inline-block; transition: background .3s;
}
.fp4-btn-p:hover { background: var(--gold2); }
.fp4-btn-o {
  padding: .9rem 2.4rem; border: 1px solid rgba(201,169,132,.3);
  color: var(--gold); font-size: .62rem; letter-spacing: .22em;
  text-transform: uppercase; display: inline-block; transition: all .3s;
}
.fp4-btn-o:hover { background: var(--gold); color: var(--bg); }

/* ── CTA ─────────────────────────────────────────────────── */
.fp4-cta {
  position: relative; height: 90vh; overflow: hidden;
  display: grid; place-items: center; text-align: center;
}
.fp4-cta__bg { position: absolute; inset: 0; }
.fp4-cta__bg img {
  width: 100%; height: 100%; object-fit: cover;
  transform: scale(1.08);
  transition: transform 1.6s cubic-bezier(.16,1,.3,1);
}
.fp4-cta__bg.fp4-in img { transform: scale(1); }
.fp4-cta__ov {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(8,6,4,.9) 0%, rgba(8,6,4,.4) 60%, rgba(8,6,4,.15) 100%);
}
.fp4-cta__cnt { position: relative; z-index: 1; max-width: 800px; padding: 2rem; }
.fp4-cta__pre {
  font-size: .58rem; letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: block; margin-bottom: 2rem;
  opacity: 0; transform: translateY(14px);
  transition: all .8s cubic-bezier(.16,1,.3,1);
}
.fp4-cta__cnt.fp4-in .fp4-cta__pre { opacity: 1; transform: none; }
.fp4-cta__h {
  font-family: var(--serif); font-size: clamp(3.5rem, 8vw, 8rem);
  font-weight: 300; line-height: .88; letter-spacing: -.025em; margin-bottom: 3rem;
  opacity: 0; transform: translateY(50px) scale(.96);
  transition: all 1.2s cubic-bezier(.16,1,.3,1) .12s;
}
.fp4-cta__h em { font-style: italic; color: var(--gold); }
.fp4-cta__cnt.fp4-in .fp4-cta__h { opacity: 1; transform: none; }
.fp4-cta__btns {
  display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
  opacity: 0; transform: translateY(24px);
  transition: all .8s cubic-bezier(.16,1,.3,1) .3s;
}
.fp4-cta__cnt.fp4-in .fp4-cta__btns { opacity: 1; transform: none; }

/* ── FOOTER ──────────────────────────────────────────────── */
.fp4-footer {
  background: var(--bg2); padding: 2rem 4rem;
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid var(--gold-dim);
}
.fp4-footer__logo { font-family: var(--serif); font-size: 1.1rem; font-weight: 300; letter-spacing: .2em; color: var(--fg2); }
.fp4-footer__copy { font-size: .55rem; color: rgba(237,229,218,.2); letter-spacing: .1em; }
.fp4-footer__back { font-size: .55rem; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }

/* ── RESPONSIVE ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .fp4-hero__bottom { padding: 0 2rem; }
  .fp4-stats { grid-template-columns: 1fr 1fr; }
  .fp4-stat:nth-child(2) { border-right: none; }
  .fp4-proj { padding: 5rem 2rem; }
  .fp4-proj__grid { grid-template-columns: 1fr; }
  .fp4-pcard:first-child { grid-row: span 1; }
  .fp4-footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem; }
  .fp4-room__bottom { padding: 0 2rem 3rem; flex-direction: column; align-items: flex-start; gap: 1rem; }
  .fp4-room__meta { align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .fp4-hero__l1,.fp4-hero__l2,.fp4-hero__bg,.fp4-hero__l3,.fp4-hero__divider,
  .fp4-hero__bottom,.fp4-scroll-arrow { animation: none; opacity: 1; clip-path: none; transform: none; width: auto; }
  .fp4-stat,.fp4-pcard,.fp4-proj__more,.fp4-cta__pre,.fp4-cta__h,.fp4-cta__btns { opacity: 1; transform: none; transition: none; }
}
`;

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const ROOMS = [
  { index: "01", cat: "Living Room",  name: "Spații care",   nameEm: "respiră",   loc: "Olimp · București",   img: "/images-scraped/Olimp_03.jpg",                                   href: "/proiecte/executie_apt-olimp" },
  { index: "02", cat: "Kitchen",      name: "Bucătării",     nameEm: "premium",    loc: "Giurgiu · Proiect rezidențial", img: "/images-scraped/buc_giurgiu_1.jpg",                    href: "/proiecte" },
  { index: "03", cat: "Bedroom",      name: "Dormitoare",    nameEm: "de lux",     loc: "Mamaia Nord · Black Pearl",     img: "/images-scraped/Black_Pearl_01.jpg",                   href: "/proiecte/executie_apt-mamaia-nord" },
  { index: "04", cat: "Office",       name: "Spații",        nameEm: "comerciale", loc: "București · Sediu corporate",  img: "/images-scraped/carusel_office.jpg",                   href: "/proiecte/executie_sediu-office" },
];

const PROJECTS = [
  { cat: "Rezidențial", name: "Vila Cosmopolis",  img: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href: "/proiecte/executie_vila-cosmopolis" },
  { cat: "Rezidențial", name: "Casa Mogoșoaia",   img: "/images-scraped/Mogosoaia_01.jpg",               href: "/proiecte/executie_casa-mogosoaia" },
  { cat: "Comercial",   name: "Sediu de Birouri", img: "/images-scraped/carusel_office.jpg",             href: "/proiecte/executie_sediu-office" },
  { cat: "Rezidențial", name: "Vila Corbeanca",   img: "/images-scraped/vila_corbeanca_exec_living_4.jpg", href: "/proiecte" },
  { cat: "Rezidențial", name: "AppTown North",    img: "/images-scraped/apptown_exec_28.jpg",            href: "/proiecte/executie_apptown-north" },
];

const STATS = [
  { val: 10, sfx: "+", label: "Ani experiență" },
  { val: 200, sfx: "+", label: "Proiecte finalizate" },
  { val: 100, sfx: "%", label: "Execuție proprie" },
  { val: 24, sfx: "h", label: "Răspuns ofertă" },
];

const MARQUEE = ["Bucătării", "Dressinguri", "Livinguri", "Dormitoare", "Design Interior", "Spații Comerciale", "Premium", "La Comandă"];

/* ══════════════════════════════════════════════════════════════
   COUNTER
══════════════════════════════════════════════════════════════ */
function Counter({ val, sfx, active }: { val: number; sfx: string; active: boolean }) {
  const [n, setN] = useState(0);
  const started = useRef(false);
  const raf = useRef(0);
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const t0 = performance.now();
    const dur = 2000;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(e * val));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, val]);
  return <>{n}{sfx}</>;
}

/* ══════════════════════════════════════════════════════════════
   HORIZONTAL JOURNEY
══════════════════════════════════════════════════════════════ */
function HorizontalJourney() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const fillRef    = useRef<HTMLDivElement>(null);
  const [activeRoom, setActiveRoom] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    const fill  = fillRef.current;
    if (!wrap || !track || !fill) return;

    const N = ROOMS.length;

    const update = () => {
      const rect  = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const raw   = Math.max(0, Math.min(1, -rect.top / total));

      // Move track: at p=0 → translateX(0), at p=1 → translateX(-(N-1)*100vw)
      const tx = raw * (N - 1) * 100;
      track.style.transform = `translateX(-${tx}vw)`;

      // Progress fill
      fill.style.width = `${raw * 100}%`;

      // Active room indicator
      const roomIdx = Math.min(N - 1, Math.round(raw * (N - 1)));
      setActiveRoom(roomIdx);

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const N = ROOMS.length;

  return (
    <div
      ref={wrapRef}
      className="fp4-h-wrap"
      style={{ height: `${N * 100}vh` }}
    >
      <div className="fp4-h-sticky">
        <div
          ref={trackRef}
          className="fp4-h-track"
          style={{ width: `${N * 100}vw` }}
        >
          {ROOMS.map((room, i) => (
            <div key={i} className="fp4-room">
              <div className="fp4-room__img">
                <Image
                  src={room.img} alt={room.name}
                  fill sizes="100vw"
                  style={{ objectFit: "cover" }}
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  unoptimized
                />
              </div>
              <div className="fp4-room__ov" />

              {/* Top */}
              <div className="fp4-room__top">
                <span className="fp4-room__index">{room.index}</span>
                <span className="fp4-room__category">— {room.cat} —</span>
              </div>

              {/* Bottom */}
              <div className="fp4-room__bottom">
                <h2 className="fp4-room__name">
                  {room.name}<br /><em>{room.nameEm}</em>
                </h2>
                <div className="fp4-room__meta">
                  <span className="fp4-room__loc">{room.loc}</span>
                  <Link href={room.href} className="fp4-room__link">
                    Vezi proiectul →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Room dots indicator */}
        <div className="fp4-h-indicator" aria-hidden>
          {ROOMS.map((_, i) => (
            <div key={i} className={`fp4-h-dot${i === activeRoom ? " active" : ""}`} />
          ))}
        </div>

        {/* Progress bar */}
        <div className="fp4-h-progress">
          <div ref={fillRef} className="fp4-h-progress__fill" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function FrontPageV4() {
  const statRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const projRefs   = useRef<(HTMLAnchorElement | null)[]>([]);
  const projMoreRef = useRef<HTMLDivElement>(null);
  const ctaBgRef   = useRef<HTMLDivElement>(null);
  const ctaCntRef  = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const delay = Number(el.dataset.delay ?? 0);
        setTimeout(() => el.classList.add("fp4-in"), delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.07, rootMargin: "0px 0px -30px 0px" });

    statRefs.current.forEach((el, i) => {
      if (!el) return;
      el.dataset.delay = String(i * 110);
      obs.observe(el);
    });
    projRefs.current.forEach((el, i) => {
      if (!el) return;
      el.dataset.delay = String(i * 70);
      obs.observe(el);
    });
    if (projMoreRef.current) obs.observe(projMoreRef.current);
    if (ctaBgRef.current)    obs.observe(ctaBgRef.current);
    if (ctaCntRef.current)   obs.observe(ctaCntRef.current);

    // Stats counter trigger
    const statsObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStatsActive(true); statsObs.disconnect(); }
    }, { threshold: 0.2 });
    const firstStat = statRefs.current[0];
    if (firstStat) statsObs.observe(firstStat);

    return () => { obs.disconnect(); statsObs.disconnect(); };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="fp4">

        {/* ═══ HERO ═══ */}
        <section className="fp4-hero">
          <div className="fp4-hero__bg">
            <Image
              src="/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
              alt="Moodilier" fill sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 30%" }}
              priority quality={85}
            />
          </div>
          <div className="fp4-hero__ov" />

          <div className="fp4-hero__title">
            <span className="fp4-hero__l1">Mobilier</span>
            <span className="fp4-hero__divider" aria-hidden />
            <span className="fp4-hero__l2">Premium</span>
            <span className="fp4-hero__l3">la comandă · București</span>
          </div>

          <div className="fp4-hero__bottom">
            <p className="fp4-hero__tagline">
              „Fiecare spațiu merită să devină o operă de artă."
            </p>
            <div className="fp4-hero__scroll">
              <span>Scroll</span>
              <div className="fp4-scroll-arrow" />
            </div>
            <span className="fp4-hero__cta-label">
              <Link href="/contact" style={{ color: "inherit" }}>Solicită ofertă →</Link>
            </span>
          </div>
        </section>

        {/* ═══ MARQUEE ═══ */}
        <div className="fp4-marquee" aria-hidden>
          <div className="fp4-marquee__track">
            {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="fp4-marquee__item">
                <span className="fp4-marquee__sep">✦</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ HORIZONTAL ROOMS ═══ */}
        <HorizontalJourney />

        {/* ═══ STATS ═══ */}
        <div className="fp4-stats">
          {STATS.map((s, i) => (
            <div
              key={i} className="fp4-stat"
              ref={(el) => { statRefs.current[i] = el; }}
              style={{ transitionDelay: `${i * 0.11}s` }}
            >
              <div className="fp4-stat__n">
                <Counter val={s.val} sfx={s.sfx} active={statsActive} />
              </div>
              <div className="fp4-stat__l">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ═══ PROJECTS ═══ */}
        <section style={{ background: "var(--bg)" }}>
          <div className="fp4-proj">
            <div className="fp4-proj__head">
              <span className="fp4-proj__tag">Portofoliu selectat</span>
              <h2 className="fp4-proj__h">Proiecte <em>realizate</em></h2>
            </div>
            <div className="fp4-proj__grid">
              {PROJECTS.map((p, i) => (
                <Link
                  key={i} href={p.href}
                  className="fp4-pcard"
                  ref={(el) => { projRefs.current[i] = el; }}
                  style={{ transitionDelay: `${(i % 2) * 0.08}s` }}
                >
                  <div className="fp4-pcard__img">
                    <Image src={p.img} alt={p.name} fill sizes="50vw"
                      style={{ objectFit: "cover" }} unoptimized
                      loading={i < 2 ? "eager" : "lazy"} />
                  </div>
                  <div className="fp4-pcard__info">
                    <div className="fp4-pcard__cat">{p.cat}</div>
                    <div className="fp4-pcard__name">{p.name}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="fp4-proj__more" ref={projMoreRef}>
              <Link href="/proiecte" className="fp4-btn-o">
                Toate proiectele →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="fp4-cta">
          <div className="fp4-cta__bg" ref={ctaBgRef}>
            <Image
              src="/images-scraped/vila_corbeanca_exec_living_4.jpg"
              alt="Contact Moodilier" fill sizes="100vw"
              style={{ objectFit: "cover" }} unoptimized
            />
          </div>
          <div className="fp4-cta__ov" />
          <div className="fp4-cta__cnt" ref={ctaCntRef}>
            <span className="fp4-cta__pre">Hai să construim ceva frumos împreună</span>
            <h2 className="fp4-cta__h">
              Viziunea ta.<br /><em>Execuția</em> noastră.
            </h2>
            <div className="fp4-cta__btns">
              <Link href="/contact" className="fp4-btn-p">Solicită ofertă gratuită →</Link>
              <Link href="/proiecte" className="fp4-btn-o">Descoperă portofoliul</Link>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="fp4-footer">
          <span className="fp4-footer__logo">MOODILIER</span>
          <span className="fp4-footer__copy">© 2025 SC Moodilier SRL · București</span>
          <Link href="/" className="fp4-footer__back">← Site principal</Link>
        </footer>

      </div>
    </>
  );
}
