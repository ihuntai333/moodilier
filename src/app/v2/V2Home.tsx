"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

/* ───────────────── TYPES ───────────────── */
interface ParallaxEl {
  el: HTMLElement;
  type: "entrance-content" | "entrance-bg" | "entrance-sub" | "entrance-btn"
       | "intro-title" | "intro-quote" | "img-horizontal" | "img-scale";
  offset?: number; // for horizontal parallax, the max px shift
}

/* ───────────────── CSS ───────────────── */
const CSS = `
  /* ── Tokens ── */
  .v2r{
    --gold:#c9a984; --gold2:rgba(201,169,132,0.18);
    --bg:#1a1714;   --bg2:#141210; --bg3:#0e0c0a;
    --fg:#ede5da;   --fg2:#8a7e70; --fg3:rgba(237,229,218,0.5);
    --sans:'Inter',sans-serif; --serif:'Cormorant Garamond',serif;
  }
  .v2r*,.v2r*::before,.v2r*::after{box-sizing:border-box;margin:0;padding:0}
  .v2r{background:var(--bg);color:var(--fg);font-family:var(--sans);overflow-x:hidden}
  .v2r a{text-decoration:none;color:inherit}

  /* ── Preloader ── */
  .r-pre{
    position:fixed;inset:0;z-index:9000;background:var(--bg3);
    display:flex;align-items:center;justify-content:center;
    will-change:transform;
  }
  .r-pre.out{animation:preOut 1.4s cubic-bezier(.76,0,.24,1) forwards}
  @keyframes preOut{to{transform:translateY(-100%)}}

  .r-pre__inner{display:flex;flex-direction:column;align-items:center;gap:1.2rem}
  .r-pre__logo{
    font-family:var(--serif);font-size:clamp(2rem,7vw,5.5rem);
    font-weight:300;letter-spacing:.35em;color:var(--fg);
    clip-path:inset(0 100% 0 0);
    animation:logoReveal 1s cubic-bezier(.16,1,.3,1) .3s forwards;
  }
  @keyframes logoReveal{to{clip-path:inset(0 0% 0 0)}}
  .r-pre__line{
    width:0;height:1px;background:var(--gold);
    animation:lineGrow 1s ease .9s forwards;
  }
  @keyframes lineGrow{to{width:100px}}
  .r-pre__sub{
    font-family:var(--sans);font-size:.65rem;letter-spacing:.4em;
    text-transform:uppercase;color:var(--gold);
    opacity:0;animation:fadeUp .6s ease 1.3s forwards;
  }
  @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .r-pre__num{
    position:absolute;bottom:2rem;right:2.5rem;
    font-family:var(--sans);font-size:.7rem;letter-spacing:.2em;color:var(--fg2);
    font-variant-numeric:tabular-nums;
  }

  /* ── Nav ── */
  .r-nav{
    position:fixed;top:0;left:0;right:0;z-index:200;
    display:flex;align-items:center;justify-content:space-between;
    padding:2rem 4rem;pointer-events:none;
    opacity:0;transition:opacity .8s ease;
  }
  .r-nav.show{opacity:1;pointer-events:auto}
  .r-nav__logo{font-family:var(--serif);font-size:1.3rem;font-weight:300;letter-spacing:.25em}
  .r-nav__links{display:flex;gap:2.5rem;align-items:center}
  .r-nav__lk{
    font-family:var(--sans);font-size:.65rem;letter-spacing:.2em;
    text-transform:uppercase;color:var(--fg2);transition:color .3s
  }
  .r-nav__lk:hover{color:var(--gold)}
  .r-nav__btn{
    padding:.7rem 1.6rem;border:1px solid rgba(201,169,132,.35);
    font-family:var(--sans);font-size:.6rem;letter-spacing:.25em;
    text-transform:uppercase;color:var(--gold);transition:all .35s;
  }
  .r-nav__btn:hover{background:var(--gold);color:var(--bg3)}

  /* ── Text reveals (clip-path tape) ── */
  .t-mask{overflow:hidden;display:block}
  .t-inner{
    display:block;
    transform:translateY(105%);
    transition:transform 1.1s cubic-bezier(.16,1,.3,1);
  }
  .t-inner.in{transform:translateY(0)}

  /* ── Section 1: ENTRANCE ── */
  .r-entrance{
    position:relative;height:100vh;overflow:hidden;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;
  }
  .r-entrance__bg{
    position:absolute;inset:0;will-change:opacity;
  }
  .r-entrance__overlay{
    position:absolute;inset:0;z-index:1;
    background:linear-gradient(to bottom,
      rgba(20,18,16,.4) 0%,
      rgba(20,18,16,.2) 40%,
      rgba(20,18,16,.7) 100%
    )
  }
  .r-entrance__content{
    position:relative;z-index:2;
    will-change:transform,opacity;
  }
  .r-entrance__title{
    font-family:var(--serif);font-weight:300;
    font-size:clamp(5rem,12vw,12rem);
    line-height:.9;letter-spacing:-.02em;
  }
  .r-entrance__title em{font-style:italic;color:var(--gold)}
  .r-entrance__sub{
    position:absolute;bottom:4.5rem;left:4rem;
    font-family:var(--serif);font-size:clamp(1rem,2vw,1.4rem);
    font-weight:300;font-style:italic;color:var(--fg3);
    will-change:transform,opacity;
  }

  /* SVG animated circle button */
  .r-scroll-btn{
    position:absolute;bottom:3rem;left:50%;transform:translateX(-50%);
    z-index:2;width:60px;height:60px;cursor:pointer;
    will-change:transform,opacity;
  }
  .r-scroll-btn svg{position:absolute;inset:0;width:100%;height:100%}
  .r-scroll-btn__border{
    fill:none;stroke:rgba(201,169,132,.4);stroke-width:1;
    stroke-dasharray:188;stroke-dashoffset:188;
    animation:drawCircle 1.2s cubic-bezier(.16,1,.3,1) 2.8s forwards;
  }
  @keyframes drawCircle{to{stroke-dashoffset:0}}
  .r-scroll-btn__arrow{
    position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
    animation:arrowBounce 2.5s ease-in-out 3s infinite;
  }
  @keyframes arrowBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
  .r-scroll-btn:hover .r-scroll-btn__border{stroke:var(--gold)}

  /* ── Section 2: INTRO ── */
  .r-intro{
    position:relative;overflow:hidden;
    background:var(--bg);padding-bottom:6rem;
  }
  /* "executat cu precizie" — small text above big title */
  .r-intro__eyebrow{
    font-family:var(--serif);font-size:clamp(1.2rem,2.5vw,2rem);
    font-weight:300;font-style:italic;color:var(--fg2);
    padding:6rem 4rem 2rem;
    text-align:right;max-width:60%;margin-left:auto;
    will-change:transform;
  }
  /* MOODILIER edge-to-edge */
  .r-intro__wordmark{
    font-family:var(--serif);font-weight:300;
    font-size:clamp(5rem,14vw,16rem);
    line-height:.85;letter-spacing:-.04em;
    color:var(--gold);white-space:nowrap;
    padding:0 3rem;overflow:hidden;
    clip-path:inset(0 100% 0 0);
    transition:clip-path 1.4s cubic-bezier(.16,1,.3,1);
  }
  .r-intro__wordmark.in{clip-path:inset(0 0% 0 0)}
  /* Two-col: image right, text left */
  .r-intro__body{
    display:grid;grid-template-columns:1fr 1fr;
    padding:0 4rem;margin-top:-4rem;gap:4rem;position:relative;
    will-change:transform;
  }
  .r-intro__left{
    display:flex;flex-direction:column;justify-content:flex-end;
    padding-bottom:4rem;
  }
  .r-intro__desc{
    font-family:var(--sans);font-size:.9rem;line-height:1.8;color:var(--fg2);
    max-width:38ch;margin-bottom:3rem;
  }
  /* "Meet the doctor" SVG outline button */
  .r-outline-btn{
    position:relative;display:inline-flex;align-items:center;justify-content:center;
    width:140px;height:140px;cursor:pointer;
  }
  .r-outline-btn svg.r-outline-btn__border{
    position:absolute;inset:0;width:100%;height:100%;overflow:visible;
  }
  .r-outline-btn__rect{
    fill:none;stroke:rgba(201,169,132,.35);stroke-width:.8;
    vector-effect:non-scaling-stroke;
    stroke-dasharray:600;stroke-dashoffset:600;
    transition:stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1), stroke .4s;
  }
  .r-outline-btn__rect.draw{stroke-dashoffset:0}
  .r-outline-btn:hover .r-outline-btn__rect{stroke:var(--gold)}
  .r-outline-btn__text{
    position:relative;z-index:1;
    font-family:var(--serif);font-size:.95rem;font-weight:300;
    color:var(--fg);text-align:center;line-height:1.4;
  }
  /* Portrait image */
  .r-intro__img{
    position:relative;overflow:hidden;
    aspect-ratio:4/5;
  }
  .r-intro__img img{
    width:100%;height:100%;object-fit:cover;
    transform:scale(1.15);
    will-change:transform;
  }
  /* Blockquote — offset right */
  .r-intro__quote{
    max-width:480px;margin:3rem auto 0;margin-right:4rem;margin-left:auto;
    padding-left:2rem;border-left:1px solid var(--gold);
    will-change:transform;
  }
  .r-intro__quote-mark{
    font-family:var(--serif);font-size:3rem;color:var(--gold);
    line-height:.5;margin-bottom:1rem;display:block;
  }
  .r-intro__quote-text{
    font-family:var(--serif);font-size:clamp(1rem,1.5vw,1.25rem);
    font-style:italic;font-weight:300;color:var(--fg);line-height:1.6;
  }
  .r-intro__quote-author{
    display:block;margin-top:1rem;
    font-family:var(--sans);font-size:.65rem;letter-spacing:.25em;
    text-transform:uppercase;color:var(--gold);
  }

  /* ── Section 3: STICKY AESTHETICS ── */
  .r-aesthetics{
    position:relative;background:var(--bg2);
  }
  .r-aesthetics__track{
    /* tall enough for 3 slides */
    height:300vh;position:relative;
  }
  .r-aesthetics__sticky{
    position:sticky;top:0;height:100vh;overflow:hidden;
  }
  .r-aesthetics__slide{
    position:absolute;inset:0;display:grid;
    grid-template-columns:1fr 1fr;align-items:center;
    padding:0 4rem;gap:4rem;
    opacity:0;transition:opacity .6s ease;pointer-events:none;
  }
  .r-aesthetics__slide.active{opacity:1;pointer-events:auto}
  .r-aesthetics__img-wrap{
    position:relative;overflow:hidden;
    height:70vh;
  }
  .r-aesthetics__img{
    width:100%;height:100%;object-fit:cover;
    will-change:transform;
  }
  .r-aesthetics__info{padding:2rem 0}
  .r-aesthetics__num{
    font-family:var(--serif);font-size:6rem;font-weight:300;
    color:var(--gold2);line-height:1;margin-bottom:1rem;
  }
  .r-aesthetics__label{
    font-family:var(--sans);font-size:.65rem;letter-spacing:.35em;
    text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem;
  }
  .r-aesthetics__title{
    font-family:var(--serif);font-size:clamp(2.5rem,5vw,5rem);
    font-weight:300;line-height:1;margin-bottom:1.5rem;
  }
  .r-aesthetics__title em{font-style:italic;color:var(--gold)}
  .r-aesthetics__desc{
    font-family:var(--sans);font-size:.85rem;line-height:1.7;
    color:var(--fg2);max-width:38ch;
  }
  /* Progress dots */
  .r-aesthetics__dots{
    position:absolute;right:2rem;top:50%;transform:translateY(-50%);
    display:flex;flex-direction:column;gap:.75rem;z-index:10;
  }
  .r-aesthetics__dot{
    width:4px;height:4px;border-radius:50%;
    background:var(--fg2);transition:all .4s;
  }
  .r-aesthetics__dot.active{height:20px;border-radius:2px;background:var(--gold)}

  /* ── Section 4: PROJECTS ── */
  .r-projects{padding:8rem 4rem;max-width:1400px;margin:0 auto}
  .r-projects__hd{
    display:flex;justify-content:space-between;align-items:flex-end;
    margin-bottom:5rem;
  }
  .r-projects__h{
    font-family:var(--serif);font-size:clamp(2.5rem,5vw,5rem);
    font-weight:300;line-height:1;
  }
  .r-projects__h em{font-style:italic;color:var(--gold)}
  .r-projects__all{
    font-family:var(--sans);font-size:.65rem;letter-spacing:.25em;
    text-transform:uppercase;color:var(--gold);
    border-bottom:1px solid rgba(201,169,132,.3);
    padding-bottom:.25rem;transition:border-color .3s;
  }
  .r-projects__all:hover{border-color:var(--gold)}
  /* Editorial grid: first large, rest smaller */
  .r-projects__grid{
    display:grid;
    grid-template-columns:1.4fr 1fr;
    grid-template-rows:auto auto;
    gap:2px;
  }
  .r-proj{
    position:relative;overflow:hidden;cursor:pointer;display:block;
  }
  .r-proj:first-child{grid-row:span 2}
  .r-proj__img{
    width:100%;height:100%;object-fit:cover;
    transition:transform 1s cubic-bezier(.16,1,.3,1);
  }
  .r-proj:first-child .r-proj__img-wrap{height:600px}
  .r-proj__img-wrap{height:290px;overflow:hidden}
  .r-proj:hover .r-proj__img{transform:scale(1.04)}
  .r-proj__caption{
    padding:1.25rem 0;
  }
  .r-proj__cat{
    font-family:var(--sans);font-size:.6rem;letter-spacing:.3em;
    text-transform:uppercase;color:var(--gold);margin-bottom:.4rem;
  }
  .r-proj__name{
    font-family:var(--serif);font-size:1.3rem;font-weight:300;
  }

  /* ── CTA ── */
  .r-cta{
    position:relative;height:85vh;overflow:hidden;
    display:flex;align-items:center;justify-content:center;text-align:center;
  }
  .r-cta__bg{position:absolute;inset:0}
  .r-cta__ov{
    position:absolute;inset:0;
    background:linear-gradient(to top,rgba(14,12,10,.9) 0%,rgba(14,12,10,.4) 100%);
  }
  .r-cta__content{position:relative;z-index:1;max-width:700px;padding:2rem}
  .r-cta__label{
    font-family:var(--sans);font-size:.65rem;letter-spacing:.4em;
    text-transform:uppercase;color:var(--gold);margin-bottom:2rem;display:block;
  }
  .r-cta__h{
    font-family:var(--serif);font-size:clamp(3rem,7vw,6rem);
    font-weight:300;line-height:.95;letter-spacing:-.02em;margin-bottom:3rem;
  }
  .r-cta__h em{font-style:italic;color:var(--gold)}
  .r-cta__btn{
    display:inline-flex;align-items:center;gap:1rem;
    padding:1rem 2.5rem;border:1px solid var(--gold);
    font-family:var(--sans);font-size:.65rem;letter-spacing:.3em;
    text-transform:uppercase;color:var(--gold);transition:all .4s;
  }
  .r-cta__btn:hover{background:var(--gold);color:var(--bg3)}

  /* ── Footer ── */
  .r-foot{
    background:var(--bg3);padding:2.5rem 4rem;
    display:flex;justify-content:space-between;align-items:center;
    border-top:1px solid rgba(201,169,132,.08);
  }
  .r-foot__logo{font-family:var(--serif);font-size:1.1rem;font-weight:300;letter-spacing:.2em;color:var(--fg2)}
  .r-foot__copy{font-family:var(--sans);font-size:.6rem;letter-spacing:.1em;color:var(--fg3)}
  .r-foot__back{font-family:var(--sans);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}

  /* ── Responsive ── */
  @media(max-width:960px){
    .r-nav{padding:1.5rem 2rem}
    .r-nav__links{gap:1.5rem}
    .r-intro__body{grid-template-columns:1fr;padding:0 2rem}
    .r-intro__eyebrow{padding:5rem 2rem 1.5rem;max-width:100%;margin-left:0;text-align:left}
    .r-intro__wordmark{font-size:clamp(4rem,18vw,7rem);padding:0 2rem}
    .r-intro__quote{margin-right:2rem}
    .r-aesthetics__slide{grid-template-columns:1fr;padding:0 2rem;gap:2rem}
    .r-aesthetics__img-wrap{height:45vh}
    .r-projects{padding:5rem 2rem}
    .r-projects__grid{grid-template-columns:1fr}
    .r-proj:first-child{grid-row:span 1}
    .r-proj:first-child .r-proj__img-wrap{height:300px}
    .r-entrance__sub{font-size:.9rem;bottom:6rem}
    .r-foot{flex-direction:column;gap:1rem;padding:2rem;text-align:center}
  }
  @media(max-width:600px){
    .r-nav__links{display:none}
    .r-entrance__title{font-size:clamp(4rem,18vw,7rem)}
  }
`;

/* ── DATA ── */
const PROJECTS = [
  { title: "Vila Cosmopolis", cat: "Rezidențial luxury", img: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href: "/proiecte/executie_vila-cosmopolis" },
  { title: "Apt. Olimp", cat: "Rezidențial", img: "/images-scraped/Olimp_03.jpg", href: "/proiecte/executie_apt-olimp" },
  { title: "Casa Mogoșoaia", cat: "Rezidențial", img: "/images-scraped/Mogosoaia_01.jpg", href: "/proiecte/executie_casa-mogosoaia" },
];

const AESTHETICS = [
  {
    num: "01",
    label: "Proiectare & Design",
    title: "Concept\n& Viziune",
    desc: "De la schiță la randare 3D fotorealistă — fiecare proiect începe cu o conversație profundă despre spațiul și stilul tău de viață.",
    img: "/images-scraped/proiectare.jpg",
    translateDir: 1,
  },
  {
    num: "02",
    label: "Execuție",
    title: "Precizie\n& Calitate",
    desc: "Atelierul propriu cu tehnologie CNC, vopsitorie MDF și termoformare — fiecare detaliu este controlat de la materie primă la finisaj.",
    img: "/images-scraped/buc_giurgiu_1.jpg",
    translateDir: -1,
  },
  {
    num: "03",
    label: "Montaj & Livrare",
    title: "Perfecțiunea\nFinalului",
    desc: "Echipa noastră de montaj tratează fiecare spațiu ca pe un tablou — poziționare milimetrică, verificare finală, satisfacție garantată.",
    img: "/images-scraped/executie_sediu-office15.jpg",
    translateDir: 1,
  },
];

/* ── COMPONENT ── */
export default function V2Home() {
  const [preOut, setPreOut] = useState(false);
  const [preDone, setPreDone] = useState(false);
  const [navOn, setNavOn] = useState(false);
  const [count, setCount] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  /* refs for scroll-driven animations */
  const entranceBgRef   = useRef<HTMLDivElement>(null);
  const entranceConRef  = useRef<HTMLDivElement>(null);
  const entranceSubRef  = useRef<HTMLParagraphElement>(null);
  const entranceBtnRef  = useRef<HTMLAnchorElement>(null);
  const entranceSectionRef = useRef<HTMLElement>(null);

  const introTitleRef   = useRef<HTMLDivElement>(null);
  const introQuoteRef   = useRef<HTMLDivElement>(null);
  const introImgRef     = useRef<HTMLImageElement>(null);
  const wordmarkRef     = useRef<HTMLDivElement>(null);

  const aestheticsTrackRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const rectBtnRef      = useRef<SVGRectElement>(null);
  const scrollBtnRef    = useRef<HTMLAnchorElement>(null);

  /* tape reveals for static elements */
  const tapes = useRef<HTMLSpanElement[]>([]);
  const ioRef = useRef<IntersectionObserver | null>(null);

  /* ── Preloader ── */
  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => {
      n = Math.min(n + Math.floor(Math.random() * 9) + 3, 100);
      setCount(n);
      if (n >= 100) clearInterval(iv);
    }, 40);

    const t1 = setTimeout(() => {
      setPreOut(true);
      const t2 = setTimeout(() => {
        setPreDone(true);
        setNavOn(true);
        // stagger entrance tape reveals
        tapes.current.forEach((el, i) => {
          if (el?.dataset.entrance) {
            setTimeout(() => el.classList.add("in"), 200 + i * 200);
          }
        });
      }, 1400);
      return () => clearTimeout(t2);
    }, 2600);

    return () => { clearInterval(iv); clearTimeout(t1); };
  }, []);

  /* ── RAF scroll handler ── */
  const rafId = useRef<number>(0);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      /* ENTRANCE: fade+scale(1→0.87)+translateY(0→-5vh) over first 20% of 100vh */
      if (entranceSectionRef.current) {
        const h = entranceSectionRef.current.offsetHeight;
        const p = Math.min(scrollY / (h * 0.2), 1); // 0→1
        const op = 1 - p;
        const sc = 1 - p * 0.13;
        const ty = -(p * 5);

        if (entranceBgRef.current)
          entranceBgRef.current.style.opacity = String(op);

        if (entranceConRef.current) {
          entranceConRef.current.style.opacity = String(op);
          entranceConRef.current.style.transform = `scale(${sc}) translateY(${ty}vh)`;
        }
        if (entranceSubRef.current) {
          entranceSubRef.current.style.opacity = String(op);
          entranceSubRef.current.style.transform = `scale(${sc}) translateY(${ty}vh)`;
        }
        if (scrollBtnRef.current) {
          scrollBtnRef.current.style.opacity = String(op);
          scrollBtnRef.current.style.transform = `translateX(-50%) translateY(${ty}vh)`;
        }
      }

      /* INTRO TITLE: translateY(-8vh→0) as section enters from bottom */
      if (introTitleRef.current) {
        const rect = introTitleRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));
        const ty = (1 - progress) * -8;
        introTitleRef.current.style.transform = `translateY(${ty}vh)`;
      }

      /* INTRO IMAGE: scale 1.15→1 as section scrolls through */
      if (introImgRef.current) {
        const rect = introImgRef.current.closest(".r-intro__img")?.getBoundingClientRect();
        if (rect) {
          const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
          const scale = 1.15 - progress * 0.15;
          introImgRef.current.style.transform = `scale(${scale})`;
        }
      }

      /* INTRO QUOTE: translateY(5vmin→-5vmin) as it scrolls */
      if (introQuoteRef.current) {
        const rect = introQuoteRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));
        const ty = 5 - progress * 10; // 5→-5 vmin
        introQuoteRef.current.style.transform = `translateY(${ty}vmin)`;
      }

      /* AESTHETICS: sticky slide index based on track scroll */
      if (aestheticsTrackRef.current) {
        const rect = aestheticsTrackRef.current.getBoundingClientRect();
        const trackH = aestheticsTrackRef.current.offsetHeight;
        const scrolled = -rect.top;
        const segH = (trackH - window.innerHeight) / AESTHETICS.length;
        const idx = Math.min(Math.floor(scrolled / segH), AESTHETICS.length - 1);
        if (idx >= 0) setActiveSlide(idx);

        /* horizontal parallax on each aesthetic image */
        imgRefs.current.forEach((img, i) => {
          if (!img) return;
          const segStart = i * segH;
          const segProgress = Math.max(0, Math.min(1, (scrolled - segStart) / segH));
          const dir = AESTHETICS[i].translateDir;
          img.style.transform = `translateX(${dir * (segProgress - 0.5) * 80}px) scale(1.08)`;
        });
      }
    });
  }, []);

  /* ── Scroll listener (after preloader) ── */
  useEffect(() => {
    if (!preDone) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial call
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [preDone, onScroll]);

  /* ── IntersectionObserver for non-entrance tape reveals ── */
  useEffect(() => {
    if (!preDone) return;
    ioRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = Number(el.dataset.delay ?? 0);
            setTimeout(() => el.classList.add("in"), delay);
            // wordmark reveal
            if (el.classList.contains("r-intro__wordmark")) el.classList.add("in");
            ioRef.current?.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    tapes.current.forEach((el) => { if (el && !el.dataset.entrance) ioRef.current?.observe(el); });
    if (wordmarkRef.current) ioRef.current.observe(wordmarkRef.current);
    // outline button
    if (rectBtnRef.current) {
      const io2 = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          rectBtnRef.current?.classList.add("draw");
          io2.disconnect();
        }
      }, { threshold: 0.5 });
      io2.observe(rectBtnRef.current.closest(".r-outline-btn")!);
    }
    return () => ioRef.current?.disconnect();
  }, [preDone]);

  /* ── Helper: register tape spans ── */
  const tape = (isEntrance = false) => (el: HTMLSpanElement | null) => {
    if (el) {
      if (isEntrance) el.dataset.entrance = "1";
      if (!tapes.current.includes(el)) tapes.current.push(el);
    }
  };

  /* ────────────── RENDER ────────────── */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* PRELOADER */}
      {!preDone && (
        <div className={`r-pre${preOut ? " out" : ""}`} aria-hidden="true">
          <div className="r-pre__inner">
            <span className="r-pre__logo">MOODILIER</span>
            <div className="r-pre__line" />
            <span className="r-pre__sub">Mobilier premium la comandă</span>
          </div>
          <span className="r-pre__num">{String(Math.min(count, 100)).padStart(2, "0")}</span>
        </div>
      )}

      <div className="v2r">

        {/* NAV */}
        <nav className={`r-nav${navOn ? " show" : ""}`}>
          <Link href="/" className="r-nav__logo">MOODILIER</Link>
          <div className="r-nav__links">
            <Link href="/proiecte" className="r-nav__lk">Proiecte</Link>
            <Link href="/servicii" className="r-nav__lk">Servicii</Link>
            <Link href="/despre-noi" className="r-nav__lk">Despre noi</Link>
            <Link href="/contact" className="r-nav__btn">Solicită ofertă</Link>
          </div>
        </nav>

        {/* ── S1: ENTRANCE ── */}
        <section className="r-entrance" ref={entranceSectionRef} id="top">
          {/* BG image — fades out on scroll */}
          <div className="r-entrance__bg" ref={entranceBgRef}>
            <Image
              src="/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
              alt="Moodilier interior premium"
              fill sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 35%" }}
              priority quality={90}
            />
            <div className="r-entrance__overlay" />
          </div>

          {/* CENTER CONTENT — fades + scales on scroll */}
          <div className="r-entrance__content" ref={entranceConRef}>
            <h1 className="r-entrance__title" aria-label="Mobilier Premium la Comandă">
              <div className="t-mask">
                <span className="t-inner" ref={tape(true)} data-delay="0">Mobilier</span>
              </div>
              <div className="t-mask">
                <span className="t-inner" ref={tape(true)} data-delay="180" style={{ fontStyle: "italic", color: "var(--gold)" }}>Premium</span>
              </div>
              <div className="t-mask">
                <span className="t-inner" ref={tape(true)} data-delay="340">la&nbsp;Comandă</span>
              </div>
            </h1>
          </div>

          {/* BOTTOM LEFT TEXT — also fades on scroll */}
          <p className="r-entrance__sub" ref={entranceSubRef}>
            <span className="t-mask" style={{ display: "inline-block" }}>
              <span className="t-inner" ref={tape(true)} data-delay="600">Executat cu pasiune, trăit cu bucurie</span>
            </span>
          </p>

          {/* SVG CIRCLE SCROLL BUTTON */}
          <a href="#intro" className="r-scroll-btn" ref={scrollBtnRef} aria-label="Scroll în jos">
            <svg viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="29" className="r-scroll-btn__border" />
            </svg>
            <div className="r-scroll-btn__arrow">
              <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                <path d="M6 0v16M1 11l5 5 5-5" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </a>
        </section>

        {/* ── S2: INTRO ── */}
        <section className="r-intro" id="intro">
          {/* Small italic text — right-aligned, above wordmark */}
          <div className="r-intro__eyebrow" ref={introTitleRef}>
            <div className="t-mask">
              <span className="t-inner" ref={tape()} data-delay="0">executat cu</span>
            </div>
            <div className="t-mask">
              <span className="t-inner" ref={tape()} data-delay="150">precizie&nbsp;&amp;&nbsp;pasiune</span>
            </div>
          </div>

          {/* EDGE-TO-EDGE WORDMARK */}
          <div className="r-intro__wordmark" ref={wordmarkRef}>
            MOODILIER
          </div>

          {/* TWO COL: text left, portrait image right */}
          <div className="r-intro__body">
            <div className="r-intro__left">
              <p className="r-intro__desc">
                <span className="t-mask" style={{ display: "block" }}>
                  <span className="t-inner" ref={tape()} data-delay="0">
                    Atelierul nostru din București combină tehnologia modernă cu măiestria execuției artizanale. Fiecare bucătărie, dressing, living sau spațiu comercial este proiectat și realizat integral — de la concept la cheie în ușă.
                  </span>
                </span>
              </p>

              {/* Animated SVG outline button — like "Meet the doctor" */}
              <Link href="/despre-noi" className="r-outline-btn">
                <svg className="r-outline-btn__border" viewBox="0 0 140 140" preserveAspectRatio="none">
                  <rect
                    ref={rectBtnRef}
                    className="r-outline-btn__rect"
                    x="1" y="1" width="138" height="138" rx="0"
                  />
                </svg>
                <span className="r-outline-btn__text">
                  Descoperă<br />atelierul
                </span>
              </Link>
            </div>

            {/* Portrait image with parallax */}
            <div className="r-intro__img">
              <Image
                ref={introImgRef}
                src="/images-scraped/Mogosoaia_01.jpg"
                alt="Moodilier — proiect rezidențial"
                fill sizes="50vw"
                style={{ objectFit: "cover", objectPosition: "center", transformOrigin: "center bottom" }}
                quality={80}
              />
            </div>
          </div>

          {/* BLOCKQUOTE — offset right, counter-parallax */}
          <div className="r-intro__quote" ref={introQuoteRef}>
            <span className="r-intro__quote-mark" aria-hidden>"</span>
            <p className="r-intro__quote-text">
              <span className="t-mask" style={{ display: "block" }}>
                <span className="t-inner" ref={tape()} data-delay="0">
                  Mobilierul premium nu înseamnă doar obiecte bine executate — ci spații care transmit emoție, echilibru și identitate.
                </span>
              </span>
            </p>
            <span className="t-mask r-intro__quote-author" style={{ display: "block" }}>
              <span className="t-inner" ref={tape()} data-delay="200">Moodilier, din 2013</span>
            </span>
          </div>
        </section>

        {/* ── S3: AESTHETICS (sticky scroll, 3 slides) ── */}
        <section className="r-aesthetics">
          <div className="r-aesthetics__track" ref={aestheticsTrackRef}>
            <div className="r-aesthetics__sticky">
              {AESTHETICS.map((s, i) => (
                <div key={i} className={`r-aesthetics__slide${activeSlide === i ? " active" : ""}`}>
                  {/* Image with horizontal parallax */}
                  <div className="r-aesthetics__img-wrap">
                    <Image
                      ref={(el) => { if (el) imgRefs.current[i] = el; }}
                      src={s.img}
                      alt={s.title}
                      fill sizes="50vw"
                      style={{ objectFit: "cover", objectPosition: "center", transformOrigin: "center" }}
                      quality={75}
                    />
                  </div>
                  {/* Info */}
                  <div className="r-aesthetics__info">
                    <div className="r-aesthetics__num">{s.num}</div>
                    <div className="r-aesthetics__label">{s.label}</div>
                    <div className="r-aesthetics__title">
                      {s.title.split("\n").map((line, j) => (
                        <span key={j} style={{ display: "block", fontStyle: j === 1 ? "italic" : "normal", color: j === 1 ? "var(--gold)" : "inherit" }}>
                          {line}
                        </span>
                      ))}
                    </div>
                    <p className="r-aesthetics__desc">{s.desc}</p>
                  </div>
                </div>
              ))}

              {/* Progress dots */}
              <div className="r-aesthetics__dots" aria-hidden="true">
                {AESTHETICS.map((_, i) => (
                  <div key={i} className={`r-aesthetics__dot${activeSlide === i ? " active" : ""}`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── S4: PROJECTS ── */}
        <section className="r-projects">
          <div className="r-projects__hd">
            <h2 className="r-projects__h">
              <div className="t-mask"><span className="t-inner" ref={tape()} data-delay="0">Proiecte</span></div>
              <div className="t-mask"><span className="t-inner" ref={tape()} data-delay="100"><em>realizate</em></span></div>
            </h2>
            <Link href="/proiecte" className="r-projects__all">
              <span className="t-mask" style={{ display: "block" }}>
                <span className="t-inner" ref={tape()} data-delay="0">Vezi toate →</span>
              </span>
            </Link>
          </div>
          <div className="r-projects__grid">
            {PROJECTS.map((p, i) => (
              <Link href={p.href} key={i} className="r-proj">
                <div className="r-proj__img-wrap">
                  <Image
                    src={p.img} alt={p.title}
                    fill sizes={i === 0 ? "55vw" : "45vw"}
                    className="r-proj__img"
                    style={{ objectFit: "cover" }}
                    quality={70}
                  />
                </div>
                <div className="r-proj__caption">
                  <div className="r-proj__cat">{p.cat}</div>
                  <div className="r-proj__name">{p.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── S5: CTA ── */}
        <section className="r-cta">
          <div className="r-cta__bg">
            <Image
              src="/images-scraped/vila_corbeanca_exec_living_4.jpg"
              alt="Contact Moodilier"
              fill sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              quality={75}
            />
          </div>
          <div className="r-cta__ov" />
          <div className="r-cta__content">
            <span className="r-cta__label">
              <span className="t-mask" style={{ display: "inline-block" }}>
                <span className="t-inner" ref={tape()}>Hai să construim împreună</span>
              </span>
            </span>
            <div className="r-cta__h">
              <div className="t-mask"><span className="t-inner" ref={tape()} data-delay="0">Transformăm</span></div>
              <div className="t-mask"><span className="t-inner" ref={tape()} data-delay="140">viziunea ta în</span></div>
              <div className="t-mask"><span className="t-inner" ref={tape()} data-delay="280"><em>spațiu real.</em></span></div>
            </div>
            <div className="t-mask" style={{ display: "inline-block" }}>
              <span className="t-inner" ref={tape()} data-delay="400">
                <Link href="/contact" className="r-cta__btn">
                  Solicită o ofertă gratuită →
                </Link>
              </span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="r-foot">
          <span className="r-foot__logo">MOODILIER</span>
          <span className="r-foot__copy">© 2025 SC Moodilier SRL — mobilier premium la comandă</span>
          <Link href="/" className="r-foot__back">← Înapoi la site</Link>
        </footer>

      </div>
    </>
  );
}
