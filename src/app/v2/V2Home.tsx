"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────
   STYLE BLOCK — all styles are self-contained
   so this page can be used/tested standalone
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap');

  .v2 { --gold: #c9a984; --bg: #1a1714; --bg2: #141210; --fg: #e8ddd0; --fg2: #9a8e80; --sans: 'Inter', sans-serif; --serif: 'Cormorant Garamond', serif; }

  /* ── Preloader ── */
  .v2-preloader {
    position: fixed; inset: 0; z-index: 9999;
    background: var(--bg2);
    display: flex; align-items: center; justify-content: center;
    transition: transform 1.2s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.4s ease;
  }
  .v2-preloader.exit { transform: translateY(-100%); }
  .v2-preloader__logo {
    display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
  }
  .v2-preloader__word {
    font-family: var(--serif); font-size: clamp(2.5rem, 8vw, 6rem);
    font-weight: 300; letter-spacing: 0.3em; color: var(--fg);
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .v2-preloader__word.show { opacity: 1; transform: translateY(0); }
  .v2-preloader__line {
    width: 0; height: 1px; background: var(--gold);
    transition: width 1s ease 0.4s;
  }
  .v2-preloader__line.show { width: 120px; }
  .v2-preloader__sub {
    font-family: var(--sans); font-size: 0.7rem; letter-spacing: 0.4em;
    text-transform: uppercase; color: var(--gold);
    opacity: 0; transition: opacity 0.6s ease 0.8s;
  }
  .v2-preloader__sub.show { opacity: 1; }
  .v2-preloader__counter {
    position: absolute; bottom: 2rem; right: 2rem;
    font-family: var(--sans); font-size: 0.75rem; letter-spacing: 0.15em;
    color: var(--fg2); font-variant-numeric: tabular-nums;
  }

  /* ── Base ── */
  .v2 *, .v2 *::before, .v2 *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .v2 { background: var(--bg); color: var(--fg); font-family: var(--sans); overflow-x: hidden; }
  .v2 a { text-decoration: none; color: inherit; }
  .v2 img { display: block; max-width: 100%; }

  /* ── Nav ── */
  .v2-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 2rem 4rem;
    mix-blend-mode: normal;
    opacity: 0; transform: translateY(-20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .v2-nav.show { opacity: 1; transform: translateY(0); }
  .v2-nav__logo {
    font-family: var(--serif); font-size: 1.4rem; font-weight: 300;
    letter-spacing: 0.2em; color: var(--fg);
  }
  .v2-nav__links { display: flex; gap: 3rem; align-items: center; }
  .v2-nav__link {
    font-family: var(--sans); font-size: 0.7rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--fg2);
    transition: color 0.3s ease;
  }
  .v2-nav__link:hover { color: var(--gold); }
  .v2-nav__cta {
    padding: 0.75rem 1.75rem;
    border: 1px solid rgba(201,169,132,0.4);
    font-family: var(--sans); font-size: 0.65rem; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--gold);
    transition: all 0.3s ease;
  }
  .v2-nav__cta:hover { background: var(--gold); color: var(--bg2); }

  /* ── Tape Text Reveal ── */
  .tape { overflow: hidden; display: block; }
  .tape__inner {
    display: block;
    transform: translateY(110%);
    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .tape__inner.revealed { transform: translateY(0); }

  /* ── Entrance Section ── */
  .v2-entrance {
    position: relative; height: 100vh; overflow: hidden;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    text-align: center;
  }
  .v2-entrance__bg {
    position: absolute; inset: 0; z-index: 0;
    transform: scale(1.08);
    transition: transform 0s;
  }
  .v2-entrance__overlay {
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(to bottom, rgba(20,18,16,0.5) 0%, rgba(20,18,16,0.3) 50%, rgba(20,18,16,0.75) 100%);
  }
  .v2-entrance__content { position: relative; z-index: 2; }
  .v2-entrance__eyebrow {
    font-family: var(--sans); font-size: 0.65rem; letter-spacing: 0.4em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 2.5rem;
  }
  .v2-entrance__title {
    font-family: var(--serif); font-weight: 300;
    font-size: clamp(4rem, 10vw, 10rem);
    line-height: 0.9; letter-spacing: -0.02em;
    color: var(--fg);
  }
  .v2-entrance__title em {
    font-style: italic; color: var(--gold);
  }
  .v2-entrance__subtitle {
    font-family: var(--sans); font-size: 0.75rem; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--fg2); margin-top: 3rem;
  }
  .v2-scroll-btn {
    position: absolute; bottom: 3rem; left: 50%; transform: translateX(-50%);
    z-index: 2; width: 56px; height: 56px;
    border: 1px solid rgba(201,169,132,0.4); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.4s ease;
    animation: float 3s ease-in-out infinite;
  }
  .v2-scroll-btn:hover { border-color: var(--gold); background: rgba(201,169,132,0.1); }
  .v2-scroll-btn svg { transition: transform 0.3s ease; }
  .v2-scroll-btn:hover svg { transform: translateY(3px); }
  @keyframes float { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }

  /* ── Statement Section ── */
  .v2-statement {
    padding: 12rem 4rem;
    display: grid; grid-template-columns: 1fr 1fr; gap: 6rem;
    align-items: center; max-width: 1400px; margin: 0 auto;
  }
  .v2-statement__big {
    font-family: var(--serif); font-weight: 300; font-style: italic;
    font-size: clamp(3.5rem, 6vw, 7rem);
    line-height: 1.0; color: var(--fg); letter-spacing: -0.02em;
  }
  .v2-statement__right { display: flex; flex-direction: column; gap: 3rem; }
  .v2-statement__text {
    font-family: var(--sans); font-size: 0.95rem; line-height: 1.8;
    color: var(--fg2); max-width: 42ch;
  }
  .v2-statement__line {
    width: 60px; height: 1px; background: var(--gold);
    transform: scaleX(0); transform-origin: left;
    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .v2-statement__line.revealed { transform: scaleX(1); }
  .v2-statement__quote {
    font-family: var(--serif); font-size: 1.2rem; font-style: italic;
    color: var(--fg); line-height: 1.6; padding-left: 1.5rem;
    border-left: 1px solid var(--gold);
  }

  /* ── Marquee Full ── */
  .v2-marquee {
    overflow: hidden; padding: 2rem 0; border-top: 1px solid rgba(201,169,132,0.15);
    border-bottom: 1px solid rgba(201,169,132,0.15);
    background: var(--bg2);
  }
  .v2-marquee__track {
    display: flex; gap: 0; white-space: nowrap;
    animation: marquee 30s linear infinite;
  }
  .v2-marquee__item {
    font-family: var(--serif); font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: 300; font-style: italic; color: var(--fg2);
    padding: 0 3rem; flex-shrink: 0;
  }
  .v2-marquee__dot { color: var(--gold); margin-right: 3rem; font-style: normal; }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ── Cinematic Image Section ── */
  .v2-cinematic {
    position: relative; height: 100vh; overflow: hidden;
    display: flex; align-items: flex-end; padding: 5rem 4rem;
  }
  .v2-cinematic__bg {
    position: absolute; inset: 0;
    transform: scale(1.15);
    will-change: transform;
  }
  .v2-cinematic__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(20,18,16,0.85) 0%, rgba(20,18,16,0.1) 60%);
  }
  .v2-cinematic__content {
    position: relative; z-index: 1; max-width: 1400px; width: 100%;
    margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-end;
  }
  .v2-cinematic__left {}
  .v2-cinematic__label {
    font-family: var(--sans); font-size: 0.65rem; letter-spacing: 0.35em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 1.5rem;
  }
  .v2-cinematic__title {
    font-family: var(--serif); font-size: clamp(3rem, 6vw, 7rem);
    font-weight: 300; line-height: 0.95; letter-spacing: -0.02em;
  }
  .v2-cinematic__right { text-align: right; }
  .v2-cinematic__stat { margin-bottom: 2rem; }
  .v2-cinematic__stat-num {
    font-family: var(--serif); font-size: clamp(2.5rem, 5vw, 5rem);
    font-weight: 300; color: var(--gold); line-height: 1;
  }
  .v2-cinematic__stat-label {
    font-family: var(--sans); font-size: 0.65rem; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--fg2); margin-top: 0.25rem;
  }

  /* ── Projects Grid ── */
  .v2-projects { padding: 10rem 4rem; max-width: 1400px; margin: 0 auto; }
  .v2-projects__header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 6rem;
  }
  .v2-projects__title {
    font-family: var(--serif); font-size: clamp(2.5rem, 5vw, 5rem);
    font-weight: 300; line-height: 1; letter-spacing: -0.02em;
  }
  .v2-projects__title em { font-style: italic; color: var(--gold); }
  .v2-projects__link {
    font-family: var(--sans); font-size: 0.65rem; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--gold);
    border-bottom: 1px solid rgba(201,169,132,0.4);
    padding-bottom: 0.25rem; transition: border-color 0.3s;
  }
  .v2-projects__link:hover { border-color: var(--gold); }
  .v2-projects__grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
  }
  .v2-project-card {
    position: relative; overflow: hidden; cursor: pointer;
    background: var(--bg2);
  }
  .v2-project-card__img {
    width: 100%; aspect-ratio: 3/4; overflow: hidden;
  }
  .v2-project-card__img img {
    width: 100%; height: 100%; object-fit: cover;
    transform: scale(1.08);
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .v2-project-card:hover .v2-project-card__img img { transform: scale(1); }
  .v2-project-card__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(20,18,16,0.9) 0%, rgba(20,18,16,0) 50%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 2rem; opacity: 0; transition: opacity 0.5s ease;
  }
  .v2-project-card:hover .v2-project-card__overlay { opacity: 1; }
  .v2-project-card__info { transform: translateY(10px); transition: transform 0.5s ease; }
  .v2-project-card:hover .v2-project-card__info { transform: translateY(0); }
  .v2-project-card__cat {
    font-family: var(--sans); font-size: 0.6rem; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem;
  }
  .v2-project-card__title {
    font-family: var(--serif); font-size: 1.4rem; font-weight: 300;
    color: var(--fg); line-height: 1.1;
  }
  /* First card spans 2 rows */
  .v2-project-card:first-child {
    grid-row: span 2;
  }
  .v2-project-card:first-child .v2-project-card__img { aspect-ratio: auto; height: 100%; }

  /* ── Services Row ── */
  .v2-services {
    background: var(--bg2); padding: 10rem 4rem;
  }
  .v2-services__inner { max-width: 1400px; margin: 0 auto; }
  .v2-services__header { text-align: center; margin-bottom: 6rem; }
  .v2-services__eyebrow {
    font-family: var(--sans); font-size: 0.65rem; letter-spacing: 0.4em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 1.5rem;
  }
  .v2-services__title {
    font-family: var(--serif); font-size: clamp(2.5rem, 5vw, 5rem);
    font-weight: 300; letter-spacing: -0.02em;
  }
  .v2-services__grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid rgba(201,169,132,0.15);
  }
  .v2-service-item {
    padding: 3rem 2.5rem;
    border-right: 1px solid rgba(201,169,132,0.15);
    border-bottom: 1px solid rgba(201,169,132,0.15);
    transition: background 0.4s ease;
  }
  .v2-service-item:nth-child(3n) { border-right: none; }
  .v2-service-item:hover { background: rgba(201,169,132,0.04); }
  .v2-service-item__num {
    font-family: var(--serif); font-size: 3.5rem; font-weight: 300;
    color: rgba(201,169,132,0.2); line-height: 1; margin-bottom: 1.5rem;
    transition: color 0.4s ease;
  }
  .v2-service-item:hover .v2-service-item__num { color: rgba(201,169,132,0.5); }
  .v2-service-item__title {
    font-family: var(--serif); font-size: 1.3rem; font-weight: 400;
    color: var(--fg); margin-bottom: 1rem; line-height: 1.2;
  }
  .v2-service-item__desc {
    font-family: var(--sans); font-size: 0.8rem; line-height: 1.7;
    color: var(--fg2);
  }

  /* ── CTA Full ── */
  .v2-cta {
    position: relative; height: 80vh; overflow: hidden;
    display: flex; align-items: center; justify-content: center; text-align: center;
  }
  .v2-cta__bg { position: absolute; inset: 0; }
  .v2-cta__overlay {
    position: absolute; inset: 0;
    background: rgba(20,18,16,0.65);
  }
  .v2-cta__content { position: relative; z-index: 1; max-width: 700px; }
  .v2-cta__eyebrow {
    font-family: var(--sans); font-size: 0.65rem; letter-spacing: 0.4em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 2rem;
  }
  .v2-cta__title {
    font-family: var(--serif); font-size: clamp(2.5rem, 6vw, 5.5rem);
    font-weight: 300; line-height: 1.0; letter-spacing: -0.02em;
    margin-bottom: 2.5rem;
  }
  .v2-cta__title em { font-style: italic; color: var(--gold); }
  .v2-cta__btn {
    display: inline-flex; align-items: center; gap: 1rem;
    padding: 1rem 2.5rem;
    background: transparent; border: 1px solid var(--gold);
    font-family: var(--sans); font-size: 0.7rem; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--gold);
    transition: all 0.4s ease;
  }
  .v2-cta__btn:hover { background: var(--gold); color: var(--bg2); }

  /* ── Footer ── */
  .v2-footer {
    background: var(--bg2); padding: 3rem 4rem;
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid rgba(201,169,132,0.1);
  }
  .v2-footer__logo {
    font-family: var(--serif); font-size: 1.2rem; font-weight: 300;
    letter-spacing: 0.2em; color: var(--fg2);
  }
  .v2-footer__copy {
    font-family: var(--sans); font-size: 0.65rem; letter-spacing: 0.1em;
    color: rgba(154,142,128,0.5);
  }
  .v2-footer__back {
    font-family: var(--sans); font-size: 0.65rem; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--gold);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .v2-nav { padding: 1.5rem 2rem; }
    .v2-nav__links { gap: 1.5rem; }
    .v2-statement { grid-template-columns: 1fr; gap: 3rem; padding: 6rem 2rem; }
    .v2-projects { padding: 6rem 2rem; }
    .v2-projects__grid { grid-template-columns: repeat(2, 1fr); }
    .v2-project-card:first-child { grid-row: span 1; }
    .v2-project-card:first-child .v2-project-card__img { height: auto; aspect-ratio: 3/4; }
    .v2-services { padding: 6rem 2rem; }
    .v2-services__grid { grid-template-columns: 1fr 1fr; }
    .v2-service-item:nth-child(3n) { border-right: 1px solid rgba(201,169,132,0.15); }
    .v2-service-item:nth-child(2n) { border-right: none; }
    .v2-cinematic { padding: 3rem 2rem; }
    .v2-cinematic__content { flex-direction: column; align-items: flex-start; gap: 3rem; }
    .v2-footer { flex-direction: column; gap: 1.5rem; text-align: center; padding: 2rem; }
  }
  @media (max-width: 600px) {
    .v2-projects__grid { grid-template-columns: 1fr; }
    .v2-services__grid { grid-template-columns: 1fr; }
    .v2-entrance__title { font-size: clamp(3rem, 15vw, 5rem); }
    .v2-nav__links { display: none; }
  }
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const PROJECTS = [
  { title: "Vila Cosmopolis", cat: "Rezidențial", img: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href: "/proiecte/executie_vila-cosmopolis" },
  { title: "Apt. Olimp", cat: "Rezidențial", img: "/images-scraped/Olimp_03.jpg", href: "/proiecte/executie_apt-olimp" },
  { title: "Casa Mogoșoaia", cat: "Rezidențial", img: "/images-scraped/Mogosoaia_01.jpg", href: "/proiecte/executie_casa-mogosoaia" },
  { title: "Apt. Mamaia Nord", cat: "Rezidențial", img: "/images-scraped/Black_Pearl_01.jpg", href: "/proiecte/executie_apt-mamaia-nord" },
  { title: "AppTown North", cat: "Rezidențial", img: "/images-scraped/apptown_exec_28.jpg", href: "/proiecte/executie_apptown-north" },
];

const SERVICES = [
  { num: "01", title: "Proiectare & 3D", desc: "Concept complet, randări fotorealiste și proiect tehnic detaliat — vizualizezi fiecare detaliu înainte de execuție." },
  { num: "02", title: "Bucătării la comandă", desc: "Design contemporan, materiale certificate, accesorii premium Blum & Häfele, executate în atelierul propriu." },
  { num: "03", title: "Dressinguri", desc: "Sisteme de depozitare personalizate — walk-in sau cu uși — finisaje rafinate și organizare perfectă." },
  { num: "04", title: "Living & Dormitor", desc: "Mobilier de living și dormitor la comandă, cu linii curate și materiale premium selectate cu atenție." },
  { num: "05", title: "Spații comerciale", desc: "Recepții, birouri, showroom-uri și retail — designul care face prima impresie să conteze." },
  { num: "06", title: "Moodilier Store", desc: "Import de mobilier premium din Italia, Danemarca și Grecia — colecții exclusive, disponibile imediat." },
];

const MARQUEE_ITEMS = [
  "Mobilier premium la comandă",
  "The Art of Custom Furniture",
  "București · România",
  "10+ ani de experiență",
  "200+ proiecte finalizate",
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function V2Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [preloaderExit, setPreloaderExit] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [counter, setCounter] = useState(0);

  const entranceBgRef = useRef<HTMLDivElement>(null);
  const cinematicBgRef = useRef<HTMLDivElement>(null);
  const tapeRefs = useRef<HTMLSpanElement[]>([]);
  const lineRefs = useRef<HTMLDivElement[]>([]);

  /* ── Preloader sequence ── */
  useEffect(() => {
    // Count up 0→100
    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 50);

    // Exit preloader after 2.8s
    const exitTimer = setTimeout(() => {
      setPreloaderExit(true);
      setTimeout(() => {
        setPreloaderDone(true);
        setNavVisible(true);
        // Trigger tape reveals on entrance elements after preloader leaves
        setTimeout(() => {
          tapeRefs.current.forEach((el, i) => {
            if (el && i < 5) {  // entrance tapes
              setTimeout(() => el.classList.add("revealed"), i * 180);
            }
          });
          lineRefs.current.forEach((el) => {
            if (el) el.classList.add("revealed");
          });
        }, 200);
      }, 1200);
    }, 2800);

    return () => { clearInterval(interval); clearTimeout(exitTimer); };
  }, []);

  /* ── Scroll: parallax + tape reveals ── */
  useEffect(() => {
    if (!preloaderDone) return;

    const onScroll = () => {
      const scrollY = window.scrollY;

      // Entrance bg parallax
      if (entranceBgRef.current) {
        entranceBgRef.current.style.transform = `scale(1.08) translateY(${scrollY * 0.3}px)`;
      }
      // Cinematic bg parallax
      if (cinematicBgRef.current) {
        const el = cinematicBgRef.current;
        const rect = el.parentElement!.getBoundingClientRect();
        const progress = -rect.top / window.innerHeight;
        el.style.transform = `scale(1.15) translateY(${progress * 60}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [preloaderDone]);

  /* ── IntersectionObserver for tape reveals and line reveals ── */
  useEffect(() => {
    if (!preloaderDone) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            if (el.classList.contains("tape__inner")) {
              const delay = parseInt(el.dataset.delay || "0");
              setTimeout(() => el.classList.add("revealed"), delay);
            }
            if (el.classList.contains("v2-statement__line")) {
              el.classList.add("revealed");
            }
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );

    // Observe all tape inners that are NOT entrance (already handled by preloader)
    document.querySelectorAll(".tape__inner:not(.entrance-tape)").forEach((el) => io.observe(el));
    document.querySelectorAll(".v2-statement__line").forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [preloaderDone]);

  /* ── Helper to register tape refs ── */
  const addTapeRef = (el: HTMLSpanElement | null, i: number) => {
    if (el) tapeRefs.current[i] = el;
  };
  const addLineRef = (el: HTMLDivElement | null, i: number) => {
    if (el) lineRefs.current[i] = el;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── PRELOADER ── */}
      {!preloaderDone && (
        <div className={`v2-preloader${preloaderExit ? " exit" : ""}`} aria-hidden>
          <div className="v2-preloader__logo">
            <div
              className={`v2-preloader__word${counter > 15 ? " show" : ""}`}
              style={{ transitionDelay: "0ms" }}
            >
              MOODILIER
            </div>
            <div className={`v2-preloader__line${counter > 30 ? " show" : ""}`} />
            <div className={`v2-preloader__sub${counter > 50 ? " show" : ""}`}>
              The Art of Custom Furniture
            </div>
          </div>
          <div className="v2-preloader__counter">
            {Math.min(counter, 100).toString().padStart(2, "0")}
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <div className="v2">

        {/* ── NAV ── */}
        <nav className={`v2-nav${navVisible ? " show" : ""}`} aria-label="Navigare principală">
          <Link href="/" className="v2-nav__logo">MOODILIER</Link>
          <div className="v2-nav__links">
            <Link href="/proiecte" className="v2-nav__link">Proiecte</Link>
            <Link href="/servicii" className="v2-nav__link">Servicii</Link>
            <Link href="/despre-noi" className="v2-nav__link">Despre noi</Link>
            <Link href="/contact" className="v2-nav__cta">Solicită ofertă</Link>
          </div>
        </nav>

        {/* ── ENTRANCE ── */}
        <section className="v2-entrance" id="top">
          <div className="v2-entrance__bg" ref={entranceBgRef}>
            <Image
              src="/images-scraped/vila_corbeanca_exec_living_4.jpg"
              alt="Moodilier — interior premium"
              fill
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 30%" }}
              priority
              quality={90}
            />
          </div>
          <div className="v2-entrance__overlay" />

          <div className="v2-entrance__content">
            <div className="tape">
              <span
                className="tape__inner entrance-tape v2-entrance__eyebrow"
                ref={(el) => addTapeRef(el, 0)}
              >
                ✦ &nbsp; Tailored &nbsp; · &nbsp; Timeless &nbsp; · &nbsp; Premium &nbsp; ✦
              </span>
            </div>

            <h1 className="v2-entrance__title" aria-label="The Art of Custom Furniture">
              <div className="tape">
                <span className="tape__inner entrance-tape" ref={(el) => addTapeRef(el, 1)} data-delay="200">
                  The Art of
                </span>
              </div>
              <div className="tape">
                <span className="tape__inner entrance-tape" ref={(el) => addTapeRef(el, 2)} data-delay="380" style={{ color: "var(--gold)", fontStyle: "italic" }}>
                  Custom
                </span>
              </div>
              <div className="tape">
                <span className="tape__inner entrance-tape" ref={(el) => addTapeRef(el, 3)} data-delay="540">
                  Furniture
                </span>
              </div>
            </h1>

            <div className="tape">
              <span className="tape__inner entrance-tape v2-entrance__subtitle" ref={(el) => addTapeRef(el, 4)} data-delay="750">
                București &nbsp;·&nbsp; 10+ ani de experiență &nbsp;·&nbsp; 200+ proiecte
              </span>
            </div>
          </div>

          {/* Scroll down button */}
          <a href="#statement" className="v2-scroll-btn" aria-label="Scroll jos">
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <path d="M8 0v20M1 13l7 7 7-7" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </a>
        </section>

        {/* ── MARQUEE ── */}
        <div className="v2-marquee" aria-hidden>
          <div className="v2-marquee__track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span className="v2-marquee__item" key={i}>
                <span className="v2-marquee__dot">✦</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── STATEMENT ── */}
        <section className="v2-statement" id="statement">
          <div>
            <div className="tape">
              <span className="tape__inner" data-delay="0" style={{ display: "block" }}>
                <p className="v2-statement__big">
                  Creăm spații<br />
                  care transmit<br />
                  <em>emoție.</em>
                </p>
              </span>
            </div>
          </div>
          <div className="v2-statement__right">
            <div className="v2-statement__line" ref={(el) => addLineRef(el, 0)} />
            <div className="tape">
              <span className="tape__inner v2-statement__text" data-delay="100">
                La Moodilier, mobilierul premium la comandă nu înseamnă doar obiecte bine executate — ci spații care transmit emoție, echilibru și identitate. Cu peste 10 ani de experiență, creăm soluții personalizate pentru interioare rezidențiale și comerciale de excepție.
              </span>
            </div>
            <blockquote className="v2-statement__quote">
              <div className="tape">
                <span className="tape__inner" data-delay="200">
                  „We are the Furniture Engineers."
                </span>
              </div>
            </blockquote>
            <div className="tape">
              <span className="tape__inner" data-delay="350">
                <Link href="/despre-noi" style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", color: "var(--gold)", fontFamily: "var(--sans)", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                  Află mai multe
                  <span>→</span>
                </Link>
              </span>
            </div>
          </div>
        </section>

        {/* ── CINEMATIC IMAGE ── */}
        <section className="v2-cinematic">
          <div className="v2-cinematic__bg" ref={cinematicBgRef}>
            <Image
              src="/images-scraped/executie_sediu-office15.jpg"
              alt="Moodilier — atelier premium"
              fill
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              quality={80}
            />
          </div>
          <div className="v2-cinematic__overlay" />
          <div className="v2-cinematic__content">
            <div className="v2-cinematic__left">
              <div className="tape">
                <span className="tape__inner v2-cinematic__label" data-delay="0">Portofoliu</span>
              </div>
              <div className="v2-cinematic__title">
                <div className="tape">
                  <span className="tape__inner" data-delay="100">Proiecte realizate</span>
                </div>
                <div className="tape">
                  <span className="tape__inner" data-delay="260" style={{ fontStyle: "italic", color: "var(--gold)" }}>cu pasiune.</span>
                </div>
              </div>
            </div>
            <div className="v2-cinematic__right">
              {[
                { num: "200+", label: "Proiecte finalizate" },
                { num: "10+", label: "Ani de experiență" },
                { num: "100%", label: "Executate în atelier propriu" },
              ].map((s, i) => (
                <div className="v2-cinematic__stat" key={i}>
                  <div className="tape">
                    <span className="tape__inner v2-cinematic__stat-num" data-delay={`${i * 120}`}>{s.num}</span>
                  </div>
                  <div className="tape">
                    <span className="tape__inner v2-cinematic__stat-label" data-delay={`${i * 120 + 80}`}>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section className="v2-projects">
          <div className="v2-projects__header">
            <div className="v2-projects__title">
              <div className="tape"><span className="tape__inner" data-delay="0">Proiecte</span></div>
              <div className="tape"><span className="tape__inner" data-delay="120"><em>realizate</em></span></div>
            </div>
            <Link href="/proiecte" className="v2-projects__link">
              <div className="tape"><span className="tape__inner" data-delay="0">Vezi toate →</span></div>
            </Link>
          </div>

          <div className="v2-projects__grid">
            {PROJECTS.map((p, i) => (
              <Link href={p.href} key={i} className="v2-project-card">
                <div className="v2-project-card__img">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    sizes="(max-width: 900px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    quality={75}
                  />
                </div>
                <div className="v2-project-card__overlay">
                  <div className="v2-project-card__info">
                    <div className="v2-project-card__cat">{p.cat}</div>
                    <div className="v2-project-card__title">{p.title}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="v2-services">
          <div className="v2-services__inner">
            <div className="v2-services__header">
              <div className="tape">
                <span className="tape__inner v2-services__eyebrow" data-delay="0">Ce oferim</span>
              </div>
              <div className="tape">
                <span className="tape__inner v2-services__title" data-delay="100">
                  Servicii <em style={{ fontStyle: "italic", color: "var(--gold)" }}>complete</em>
                </span>
              </div>
            </div>
            <div className="v2-services__grid">
              {SERVICES.map((s, i) => (
                <div className="v2-service-item" key={i}>
                  <div className="v2-service-item__num">{s.num}</div>
                  <div className="tape">
                    <span className="tape__inner v2-service-item__title" data-delay={`${(i % 3) * 80}`}>{s.title}</span>
                  </div>
                  <div className="tape">
                    <span className="tape__inner v2-service-item__desc" data-delay={`${(i % 3) * 80 + 100}`}>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="v2-cta">
          <div className="v2-cta__bg">
            <Image
              src="/images-scraped/Mogosoaia_01.jpg"
              alt="Moodilier — contact"
              fill
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
              quality={75}
            />
          </div>
          <div className="v2-cta__overlay" />
          <div className="v2-cta__content">
            <div className="tape">
              <span className="tape__inner v2-cta__eyebrow" data-delay="0">Hai să lucrăm împreună</span>
            </div>
            <div className="v2-cta__title">
              <div className="tape"><span className="tape__inner" data-delay="100">Transformăm</span></div>
              <div className="tape"><span className="tape__inner" data-delay="240">viziunea ta în</span></div>
              <div className="tape"><span className="tape__inner" data-delay="380"><em>mobilier premium.</em></span></div>
            </div>
            <div className="tape">
              <span className="tape__inner" data-delay="500">
                <Link href="/contact" className="v2-cta__btn">
                  Solicită o ofertă gratuită →
                </Link>
              </span>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="v2-footer">
          <div className="v2-footer__logo">MOODILIER</div>
          <div className="v2-footer__copy">© 2025 Moodilier — mobilier premium la comandă</div>
          <Link href="/" className="v2-footer__back">← Înapoi la site</Link>
        </footer>

      </div>
    </>
  );
}
