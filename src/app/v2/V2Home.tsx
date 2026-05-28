"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

/* ═══════════════════════════════════════
   CSS — self-contained
═══════════════════════════════════════ */
const CSS = `
  .v2r{
    --gold:#c9a984;--bg:#191614;--bg2:#100e0c;--fg:#ede5da;--fg2:#8a7e70;
    --sans:'Inter',sans-serif;--serif:'Cormorant Garamond',serif;
  }
  .v2r*,.v2r*::before,.v2r*::after{box-sizing:border-box;margin:0;padding:0}
  .v2r{background:var(--bg);color:var(--fg);font-family:var(--sans);overflow-x:hidden}
  .v2r a{text-decoration:none;color:inherit}

  /* ── PRELOADER ── */
  .r-pre{
    position:fixed;inset:0;z-index:9000;background:var(--bg2);
    pointer-events:none;
  }
  .r-pre.slide-up{
    animation:preSlideUp 1.2s cubic-bezier(.76,0,.24,1) forwards;
  }
  @keyframes preSlideUp{to{transform:translateY(-100%)}}

  /* The flying logo — starts centered, flies to nav */
  .r-logo-fly{
    position:fixed;z-index:9100;
    font-family:var(--serif);font-weight:300;color:var(--fg);
    letter-spacing:.28em;white-space:nowrap;
    /* start: centered + large */
    top:50%;left:50%;
    transform:translate(-50%,-50%);
    font-size:clamp(2.5rem,6vw,5rem);
    opacity:0;
    /* NO transition initially */
  }
  .r-logo-fly.appear{
    animation:logoAppear .7s cubic-bezier(.16,1,.3,1) forwards;
  }
  @keyframes logoAppear{from{opacity:0;transform:translate(-50%,-55%)}to{opacity:1;transform:translate(-50%,-50%)}}
  /* When flying: apply transition + target via JS inline style */
  .r-logo-fly.fly{
    transition:all 1.1s cubic-bezier(.76,0,.24,1);
  }
  .r-logo-fly.done{display:none}

  /* Preloader sub-elements */
  .r-pre__line{
    position:absolute;top:50%;left:50%;
    width:0;height:1px;background:var(--gold);
    transform:translate(-50%,calc(3.5rem + .5rem));
    animation:lineGrow .9s ease .8s forwards;
  }
  @keyframes lineGrow{to{width:90px}}
  .r-pre__sub{
    position:absolute;top:50%;left:50%;
    transform:translate(-50%,calc(3.5rem + 2.2rem));
    font-family:var(--sans);font-size:.62rem;letter-spacing:.4em;
    text-transform:uppercase;color:var(--gold);white-space:nowrap;
    opacity:0;animation:fadeUp .6s ease 1.2s forwards;
  }
  @keyframes fadeUp{from{opacity:0;transform:translate(-50%,calc(3.5rem + 2.8rem))}to{opacity:1;transform:translate(-50%,calc(3.5rem + 2.2rem))}}
  .r-pre__num{
    position:fixed;bottom:2rem;right:2.5rem;z-index:9100;
    font-family:var(--sans);font-size:.7rem;letter-spacing:.15em;
    color:var(--fg2);font-variant-numeric:tabular-nums;
    opacity:0;animation:fadeUp2 .4s ease .4s forwards;
  }
  @keyframes fadeUp2{to{opacity:1}}

  /* ── NAV ── */
  .r-nav{
    position:fixed;top:0;left:0;right:0;z-index:200;
    display:flex;align-items:center;justify-content:space-between;
    padding:1.8rem 4rem;
  }
  .r-nav__logo{
    font-family:var(--serif);font-size:1.3rem;font-weight:300;
    letter-spacing:.28em;color:var(--fg);
    opacity:0;transition:opacity .3s ease;
  }
  .r-nav__logo.show{opacity:1}
  .r-nav__links{
    display:flex;gap:2.5rem;align-items:center;
    opacity:0;transform:translateY(-8px);
    transition:all .7s cubic-bezier(.16,1,.3,1);
  }
  .r-nav__links.show{opacity:1;transform:none}
  .r-nav__lk{
    font-family:var(--sans);font-size:.65rem;letter-spacing:.2em;
    text-transform:uppercase;color:var(--fg2);transition:color .3s;
  }
  .r-nav__lk:hover{color:var(--gold)}
  .r-nav__btn{
    padding:.7rem 1.6rem;border:1px solid rgba(201,169,132,.35);
    font-family:var(--sans);font-size:.6rem;letter-spacing:.25em;
    text-transform:uppercase;color:var(--gold);transition:all .35s;
  }
  .r-nav__btn:hover{background:var(--gold);color:var(--bg2)}

  /* ── TAPE REVEALS ── */
  .tm{overflow:hidden;display:block}
  .ti{
    display:block;transform:translateY(105%);
    transition:transform 1.1s cubic-bezier(.16,1,.3,1);
  }
  .ti.in{transform:translateY(0)}

  /* ── SECTION 1: ENTRANCE ── */
  .r-ent{
    position:relative;height:100vh;overflow:hidden;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;text-align:center;
  }
  .r-ent__bg{
    position:absolute;inset:0;will-change:opacity,transform;
  }
  .r-ent__ov{
    position:absolute;inset:0;z-index:1;
    background:linear-gradient(to bottom,rgba(20,18,16,.3) 0%,rgba(20,18,16,.15) 45%,rgba(20,18,16,.7) 100%);
  }
  .r-ent__content{
    position:relative;z-index:2;will-change:transform,opacity;
  }
  .r-ent__title{
    font-family:var(--serif);font-weight:300;
    font-size:clamp(4.5rem,11vw,11rem);
    line-height:.88;letter-spacing:-.02em;
  }
  .r-ent__title em{font-style:italic;color:var(--gold)}

  /* Bottom-left italic sub */
  .r-ent__sub{
    position:absolute;bottom:4.5rem;left:4rem;
    font-family:var(--serif);font-size:clamp(.9rem,1.8vw,1.3rem);
    font-style:italic;font-weight:300;color:rgba(237,229,218,.55);
    will-change:transform,opacity;
    overflow:hidden;
  }
  .r-ent__sub .ti{transform:translateY(110%)}

  /* Animated circle scroll button */
  .r-scr{
    position:absolute;bottom:3rem;left:50%;
    transform:translateX(-50%);z-index:2;
    width:58px;height:58px;cursor:pointer;
    will-change:transform,opacity;
  }
  .r-scr svg.ring{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .r-scr circle{
    fill:none;stroke:rgba(201,169,132,.4);stroke-width:1;
    stroke-dasharray:180;stroke-dashoffset:180;
    transition:stroke .4s;
  }
  .r-scr circle.draw{
    animation:drawRing 1s cubic-bezier(.16,1,.3,1) forwards;
  }
  @keyframes drawRing{to{stroke-dashoffset:0}}
  .r-scr:hover circle{stroke:var(--gold)}
  .r-scr__arr{
    position:absolute;inset:0;display:flex;align-items:center;
    justify-content:center;
    animation:arrBounce 2.8s ease-in-out 3s infinite;
  }
  @keyframes arrBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}

  /* ── SECTION 2: INTRO ── */
  .r-int{position:relative;background:var(--bg);overflow:hidden}

  /* Top row: small italic right-aligned */
  .r-int__eye{
    font-family:var(--serif);font-size:clamp(1rem,2vw,1.6rem);
    font-weight:300;font-style:italic;color:var(--fg2);
    text-align:right;padding:5rem 4rem 0;
    will-change:transform;
  }

  /* MOODILIER edge-to-edge — clip-path reveal */
  .r-int__wm{
    font-family:var(--serif);font-weight:300;
    font-size:clamp(5rem,13.5vw,15rem);
    line-height:.82;letter-spacing:-.04em;
    color:var(--gold);white-space:nowrap;
    padding:0 3rem;
    clip-path:inset(0 100% 0 0);
    transition:clip-path 1.5s cubic-bezier(.16,1,.3,1);
  }
  .r-int__wm.in{clip-path:inset(0 0% 0 0)}

  /* Two-col body */
  .r-int__body{
    display:grid;grid-template-columns:1fr 1fr;
    padding:0 4rem;margin-top:-2rem;gap:4rem;
    align-items:flex-end;position:relative;
  }
  .r-int__left{
    display:flex;flex-direction:column;justify-content:flex-end;
    padding-bottom:5rem;
  }
  .r-int__desc{
    font-family:var(--sans);font-size:.875rem;line-height:1.9;
    color:var(--fg2);max-width:40ch;margin-bottom:3rem;
  }

  /* Square animated-border button */
  .r-sqbtn{
    position:relative;display:inline-flex;align-items:center;
    justify-content:center;width:136px;height:136px;cursor:pointer;
  }
  .r-sqbtn__svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .r-sqbtn__rect{
    fill:none;stroke:rgba(201,169,132,.3);stroke-width:.7;
    vector-effect:non-scaling-stroke;
    stroke-dasharray:550;stroke-dashoffset:550;
    transition:stroke-dashoffset 1.3s cubic-bezier(.16,1,.3,1),stroke .4s;
  }
  .r-sqbtn__rect.draw{stroke-dashoffset:0}
  .r-sqbtn:hover .r-sqbtn__rect{stroke:var(--gold)}
  .r-sqbtn__txt{
    position:relative;z-index:1;
    font-family:var(--serif);font-size:.95rem;font-weight:300;
    color:var(--fg);text-align:center;line-height:1.5;
  }

  /* Portrait image */
  .r-int__img{
    position:relative;overflow:hidden;aspect-ratio:4/5;
  }
  .r-int__img img{
    width:100%;height:100%;object-fit:cover;
    transform:scale(1.14);will-change:transform;
    transform-origin:center;
  }

  /* Blockquote: offset right, counter-parallax */
  .r-int__quote{
    max-width:460px;margin:4rem 4rem 5rem auto;
    padding-left:1.75rem;border-left:1px solid rgba(201,169,132,.5);
    will-change:transform;
  }
  .r-int__qmark{
    font-family:var(--serif);font-size:2.5rem;color:var(--gold);
    line-height:.4;margin-bottom:.75rem;display:block;
  }
  .r-int__qtxt{
    font-family:var(--serif);font-size:clamp(.95rem,1.4vw,1.15rem);
    font-style:italic;font-weight:300;color:var(--fg);line-height:1.65;
  }
  .r-int__qauthor{
    display:block;margin-top:.9rem;
    font-family:var(--sans);font-size:.6rem;letter-spacing:.25em;
    text-transform:uppercase;color:var(--gold);
  }

  /* ── SECTION 3: STICKY AESTHETICS ── */
  .r-aes{position:relative;background:var(--bg2)}
  .r-aes__track{height:300vh;position:relative}
  .r-aes__sticky{
    position:sticky;top:0;height:100vh;overflow:hidden;
    display:grid;grid-template-columns:1fr 1fr;align-items:center;
    padding:0 4rem;gap:6rem;
  }
  .r-aes__img-wrap{
    position:relative;overflow:hidden;height:72vh;
    /* slides: stacked, toggled by activeSlide */
  }
  .r-aes__img-frame{
    position:absolute;inset:0;overflow:hidden;
    opacity:0;transition:opacity .7s ease;
  }
  .r-aes__img-frame.on{opacity:1}
  .r-aes__img-frame img{
    width:100%;height:100%;object-fit:cover;will-change:transform;
  }
  .r-aes__right{position:relative}
  .r-aes__slide{
    position:absolute;inset:0;
    display:flex;flex-direction:column;justify-content:center;
    opacity:0;transform:translateY(20px);
    transition:opacity .6s ease,transform .6s cubic-bezier(.16,1,.3,1);
    pointer-events:none;
  }
  .r-aes__slide.on{opacity:1;transform:none;pointer-events:auto;position:relative}
  .r-aes__num{
    font-family:var(--serif);font-size:5rem;font-weight:300;
    color:rgba(201,169,132,.15);line-height:1;margin-bottom:1rem;
  }
  .r-aes__lbl{
    font-family:var(--sans);font-size:.62rem;letter-spacing:.35em;
    text-transform:uppercase;color:var(--gold);margin-bottom:1.25rem;
  }
  .r-aes__h{
    font-family:var(--serif);font-size:clamp(2.5rem,4.5vw,4.5rem);
    font-weight:300;line-height:.95;margin-bottom:1.5rem;
  }
  .r-aes__h em{font-style:italic;color:var(--gold)}
  .r-aes__p{
    font-family:var(--sans);font-size:.82rem;line-height:1.75;
    color:var(--fg2);max-width:36ch;
  }
  .r-aes__dots{
    position:absolute;right:2rem;top:50%;transform:translateY(-50%);
    display:flex;flex-direction:column;gap:.7rem;
  }
  .r-aes__dot{
    width:4px;height:4px;border-radius:50%;background:var(--fg2);
    transition:all .4s;
  }
  .r-aes__dot.on{height:22px;border-radius:2px;background:var(--gold)}

  /* ── SECTION 4: PROJECTS ── */
  .r-proj-sec{padding:8rem 4rem;max-width:1400px;margin:0 auto}
  .r-proj-hd{
    display:flex;justify-content:space-between;align-items:flex-end;
    margin-bottom:5rem;
  }
  .r-proj-h{
    font-family:var(--serif);font-size:clamp(2.5rem,5vw,5rem);
    font-weight:300;line-height:1;
  }
  .r-proj-h em{font-style:italic;color:var(--gold)}
  .r-proj-all{
    font-family:var(--sans);font-size:.62rem;letter-spacing:.25em;
    text-transform:uppercase;color:var(--gold);
    border-bottom:1px solid rgba(201,169,132,.3);
    padding-bottom:.2rem;transition:border-color .3s;
  }
  .r-proj-all:hover{border-color:var(--gold)}
  .r-proj-grid{
    display:grid;grid-template-columns:1.5fr 1fr;
    grid-template-rows:auto auto;gap:2px;
  }
  .r-proj-card{position:relative;overflow:hidden;cursor:pointer;display:block}
  .r-proj-card:first-child{grid-row:span 2}
  .r-proj-card__wrap{overflow:hidden}
  .r-proj-card:first-child .r-proj-card__wrap{height:640px}
  .r-proj-card:not(:first-child) .r-proj-card__wrap{height:310px}
  .r-proj-card img{
    width:100%;height:100%;object-fit:cover;
    transition:transform 1s cubic-bezier(.16,1,.3,1);
  }
  .r-proj-card:hover img{transform:scale(1.04)}
  .r-proj-card__cap{padding:1.2rem 0}
  .r-proj-card__cat{
    font-family:var(--sans);font-size:.58rem;letter-spacing:.3em;
    text-transform:uppercase;color:var(--gold);margin-bottom:.35rem;
  }
  .r-proj-card__name{font-family:var(--serif);font-size:1.25rem;font-weight:300}

  /* ── CTA ── */
  .r-cta{
    position:relative;height:82vh;overflow:hidden;
    display:flex;align-items:center;justify-content:center;text-align:center;
  }
  .r-cta__bg{position:absolute;inset:0}
  .r-cta__ov{
    position:absolute;inset:0;
    background:linear-gradient(to top,rgba(12,10,8,.88) 0%,rgba(12,10,8,.35) 100%);
  }
  .r-cta__cnt{position:relative;z-index:1;max-width:680px;padding:2rem}
  .r-cta__lbl{
    font-family:var(--sans);font-size:.6rem;letter-spacing:.4em;
    text-transform:uppercase;color:var(--gold);margin-bottom:2rem;display:block;
  }
  .r-cta__h{
    font-family:var(--serif);font-size:clamp(3rem,7vw,6rem);
    font-weight:300;line-height:.92;letter-spacing:-.02em;margin-bottom:2.5rem;
  }
  .r-cta__h em{font-style:italic;color:var(--gold)}
  .r-cta__btn{
    display:inline-flex;align-items:center;gap:1rem;
    padding:.9rem 2.4rem;border:1px solid var(--gold);
    font-family:var(--sans);font-size:.62rem;letter-spacing:.3em;
    text-transform:uppercase;color:var(--gold);transition:all .4s;
  }
  .r-cta__btn:hover{background:var(--gold);color:var(--bg2)}

  /* ── FOOTER ── */
  .r-foot{
    background:var(--bg2);padding:2.5rem 4rem;
    display:flex;justify-content:space-between;align-items:center;
    border-top:1px solid rgba(201,169,132,.07);
  }
  .r-foot__logo{font-family:var(--serif);font-size:1.1rem;font-weight:300;letter-spacing:.2em;color:var(--fg2)}
  .r-foot__copy{font-family:var(--sans);font-size:.58rem;letter-spacing:.1em;color:rgba(237,229,218,.3)}
  .r-foot__back{font-family:var(--sans);font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}

  /* ── RESPONSIVE ── */
  @media(max-width:960px){
    .r-nav{padding:1.5rem 2rem}
    .r-int__body{grid-template-columns:1fr;padding:0 2rem;margin-top:0}
    .r-int__eye{padding:4rem 2rem 0}
    .r-int__wm{padding:0 2rem;font-size:clamp(4rem,18vw,8rem)}
    .r-int__quote{margin:3rem 2rem 4rem auto}
    .r-aes__sticky{grid-template-columns:1fr;padding:0 2rem;gap:2rem}
    .r-aes__img-wrap{height:45vh}
    .r-proj-sec{padding:5rem 2rem}
    .r-proj-grid{grid-template-columns:1fr}
    .r-proj-card:first-child{grid-row:span 1}
    .r-proj-card:first-child .r-proj-card__wrap{height:320px}
    .r-ent__sub{font-size:.9rem;left:2rem;bottom:6rem}
    .r-foot{flex-direction:column;gap:1rem;padding:2rem;text-align:center}
  }
  @media(max-width:600px){
    .r-nav__links{display:none}
    .r-ent__title{font-size:clamp(3.5rem,16vw,6rem)}
  }
`;

/* ── DATA ── */
const SLIDES = [
  {
    num: "01", lbl: "Proiectare & Design",
    h: ["Concept", "& Viziune"],
    p: "De la schiță la randare 3D fotorealistă — fiecare proiect începe cu o conversație profundă despre spațiul și stilul tău de viață.",
    img: "/images-scraped/proiectare.jpg",
  },
  {
    num: "02", lbl: "Execuție în atelier propriu",
    h: ["Precizie", "& Calitate"],
    p: "Atelier propriu cu CNC, vopsitorie MDF și termoformare — fiecare detaliu controlat de la materie primă la finisaj impecabil.",
    img: "/images-scraped/buc_giurgiu_1.jpg",
  },
  {
    num: "03", lbl: "Montaj & Finalizare",
    h: ["Perfecțiunea", "Finalului"],
    p: "Echipa noastră de montaj tratează fiecare spațiu ca pe un tablou — poziționare milimetrică, verificare finală, predare perfectă.",
    img: "/images-scraped/executie_sediu-office15.jpg",
  },
];

const PROJECTS = [
  { title: "Vila Cosmopolis", cat: "Rezidențial luxury", img: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href: "/proiecte/executie_vila-cosmopolis" },
  { title: "Apt. Olimp", cat: "Rezidențial", img: "/images-scraped/Olimp_03.jpg", href: "/proiecte/executie_apt-olimp" },
  { title: "Casa Mogoșoaia", cat: "Rezidențial", img: "/images-scraped/Mogosoaia_01.jpg", href: "/proiecte/executie_casa-mogosoaia" },
];

/* ════════════════════════════════
   COMPONENT
════════════════════════════════ */
export default function V2Home() {
  const [count, setCount]         = useState(0);
  const [preSlide, setPreSlide]   = useState(false); // preloader slides up
  const [preDone, setPreDone]     = useState(false); // preloader removed
  const [navLinksOn, setNavLinksOn] = useState(false);
  const [navLogoOn, setNavLogoOn] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  /* Refs */
  const flyLogoRef    = useRef<HTMLDivElement>(null);
  const navLogoRef    = useRef<HTMLSpanElement>(null);
  const navNumRef     = useRef<HTMLSpanElement>(null); // counter in preloader
  const entSectionRef = useRef<HTMLElement>(null);
  const entBgRef      = useRef<HTMLDivElement>(null);
  const entConRef     = useRef<HTMLDivElement>(null);
  const entSubRef     = useRef<HTMLParagraphElement>(null);
  const scrBtnRef     = useRef<HTMLAnchorElement>(null);
  const scrCircleRef  = useRef<SVGCircleElement>(null);
  const intImgRef     = useRef<HTMLImageElement>(null);
  const intQuoteRef   = useRef<HTMLDivElement>(null);
  const wmRef         = useRef<HTMLDivElement>(null);
  const aesTrackRef   = useRef<HTMLDivElement>(null);
  const sqRectRef     = useRef<SVGRectElement>(null);
  const aesImgRefs    = useRef<(HTMLImageElement | null)[]>([]);

  const tapes = useRef<HTMLSpanElement[]>([]);
  const raf   = useRef<number>(0);

  /* ── PRELOADER + LOGO FLY ── */
  useEffect(() => {
    // Count up
    let n = 0;
    const iv = setInterval(() => {
      n = Math.min(n + Math.floor(Math.random() * 8) + 3, 100);
      setCount(n);
      if (n >= 100) clearInterval(iv);
    }, 38);

    // t=350ms: logo appears with animation
    const t1 = setTimeout(() => {
      flyLogoRef.current?.classList.add("appear");
    }, 350);

    // t=2200ms: logo flies to nav position
    const t2 = setTimeout(() => {
      if (!flyLogoRef.current || !navLogoRef.current) return;

      // Measure positions
      const flyRect = flyLogoRef.current.getBoundingClientRect();
      const navRect = navLogoRef.current.getBoundingClientRect();

      // The fly logo is centered with translate(-50%,-50%)
      // We need to move it so it lands exactly on the nav logo
      const flyCX = flyRect.left + flyRect.width / 2;
      const flyCY = flyRect.top + flyRect.height / 2;
      const navCX = navRect.left + navRect.width / 2;
      const navCY = navRect.top + navRect.height / 2;

      const dx = navCX - flyCX;
      const dy = navCY - flyCY;
      const scale = navRect.height / flyRect.height;

      flyLogoRef.current.classList.add("fly");
      flyLogoRef.current.style.transform =
        `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${scale})`;
      flyLogoRef.current.style.letterSpacing = ".28em";

      // Preloader slides up right after logo starts flying
      setTimeout(() => setPreSlide(true), 300);

      // Nav links appear
      setTimeout(() => setNavLinksOn(true), 500);

      // Nav logo replaces fly logo
      setTimeout(() => {
        setNavLogoOn(true);
        flyLogoRef.current?.classList.add("done");
      }, 900);

      // Preloader fully gone (DOM removed)
      setTimeout(() => {
        setPreDone(true);
        // Trigger entrance tape reveals
        tapes.current.forEach((el, i) => {
          if (el?.dataset.entrance) {
            setTimeout(() => el.classList.add("in"), i * 200);
          }
        });
        // Draw circle button
        scrCircleRef.current?.classList.add("draw");
      }, 1200);

    }, 2200);

    return () => { clearInterval(iv); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* ── RAF scroll driver ── */
  const handleScroll = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const sy = window.scrollY;

      // ENTRANCE: fade+scale over first 20% of section height
      if (entSectionRef.current) {
        const h = entSectionRef.current.offsetHeight;
        const p = Math.min(sy / (h * 0.2), 1);
        const op = 1 - p;
        const sc = 1 - p * 0.13;
        const ty = -(p * 5);

        if (entBgRef.current)  entBgRef.current.style.opacity = `${op}`;
        if (entConRef.current) { entConRef.current.style.opacity = `${op}`; entConRef.current.style.transform = `scale(${sc}) translateY(${ty}vh)`; }
        if (entSubRef.current) { entSubRef.current.style.opacity = `${op}`; entSubRef.current.style.transform = `scale(${sc}) translateY(${ty}vh)`; }
        if (scrBtnRef.current) { scrBtnRef.current.style.opacity = `${op}`; scrBtnRef.current.style.transform = `translateX(-50%) translateY(${ty}vh)`; }
      }

      // INTRO image: scale 1.14→1
      if (intImgRef.current) {
        const rect = intImgRef.current.closest(".r-int__img")?.getBoundingClientRect();
        if (rect) {
          const p = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
          intImgRef.current.style.transform = `scale(${1.14 - p * 0.14})`;
        }
      }

      // INTRO quote: translateY 5vmin→-5vmin
      if (intQuoteRef.current) {
        const rect = intQuoteRef.current.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
        intQuoteRef.current.style.transform = `translateY(${5 - p * 10}vmin)`;
      }

      // AESTHETICS sticky: which slide is active + horizontal parallax
      if (aesTrackRef.current) {
        const rect = aesTrackRef.current.getBoundingClientRect();
        const trackH = aesTrackRef.current.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        const segH = trackH / SLIDES.length;
        const idx = Math.min(Math.floor(scrolled / segH), SLIDES.length - 1);
        if (idx >= 0) setActiveSlide(idx);

        // horizontal parallax per image
        aesImgRefs.current.forEach((img, i) => {
          if (!img) return;
          const segProgress = Math.max(0, Math.min(1, (scrolled - i * segH) / segH));
          const dir = i % 2 === 0 ? 1 : -1;
          img.style.transform = `translateX(${dir * (segProgress - .5) * 70}px) scale(1.08)`;
        });
      }
    });
  }, []);

  /* ── IntersectionObserver for non-entrance reveals ── */
  useEffect(() => {
    if (!preDone) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        if (el.classList.contains("ti") && !el.dataset.entrance) {
          setTimeout(() => el.classList.add("in"), Number(el.dataset.d ?? 0));
        }
        if (el.classList.contains("r-int__wm")) el.classList.add("in");
        if (el.classList.contains("r-sqbtn__rect")) el.classList.add("draw");
        io.unobserve(el);
      }),
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    tapes.current.forEach((el) => { if (el && !el.dataset.entrance) io.observe(el); });
    if (wmRef.current) io.observe(wmRef.current);
    if (sqRectRef.current) io.observe(sqRectRef.current);

    return () => { window.removeEventListener("scroll", handleScroll); io.disconnect(); cancelAnimationFrame(raf.current); };
  }, [preDone, handleScroll]);

  /* Helper: register tape span */
  const t = (entrance = false, delay = 0) => (el: HTMLSpanElement | null) => {
    if (!el || tapes.current.includes(el)) return;
    if (entrance) el.dataset.entrance = "1";
    if (delay)   el.dataset.d = String(delay);
    tapes.current.push(el);
  };

  /* ════════ RENDER ════════ */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── FLYING LOGO (exists outside preloader, fixed position) ── */}
      <div className="r-logo-fly" ref={flyLogoRef} aria-hidden="true">
        MOODILIER
      </div>

      {/* ── PRELOADER BACKGROUND ── */}
      {!preDone && (
        <div className={`r-pre${preSlide ? " slide-up" : ""}`} aria-hidden="true">
          <div className="r-pre__line" />
          <div className="r-pre__sub">Mobilier premium la comandă</div>
          <span className="r-pre__num" ref={navNumRef}>{String(Math.min(count, 100)).padStart(2, "0")}</span>
        </div>
      )}

      <div className="v2r">

        {/* ── NAV ── */}
        <nav className="r-nav" aria-label="Navigare">
          <span
            ref={navLogoRef}
            className={`r-nav__logo${navLogoOn ? " show" : ""}`}
          >
            <Link href="/">MOODILIER</Link>
          </span>
          <div className={`r-nav__links${navLinksOn ? " show" : ""}`}>
            <Link href="/proiecte" className="r-nav__lk">Proiecte</Link>
            <Link href="/servicii" className="r-nav__lk">Servicii</Link>
            <Link href="/despre-noi" className="r-nav__lk">Despre noi</Link>
            <Link href="/contact" className="r-nav__btn">Solicită ofertă</Link>
          </div>
        </nav>

        {/* ══════ S1: ENTRANCE ══════ */}
        <section className="r-ent" ref={entSectionRef} id="top">
          <div className="r-ent__bg" ref={entBgRef}>
            <Image
              src="/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
              alt="Moodilier interior premium"
              fill sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 35%" }}
              priority quality={90}
            />
            <div className="r-ent__ov" />
          </div>

          {/* Center title — fades + scales on scroll */}
          <div className="r-ent__content" ref={entConRef}>
            <h1 className="r-ent__title" aria-label="Mobilier Premium la Comandă">
              <div className="tm"><span className="ti" ref={t(true, 0)}>Mobilier</span></div>
              <div className="tm"><span className="ti" ref={t(true, 190)} style={{ fontStyle: "italic", color: "var(--gold)" }}>Premium</span></div>
              <div className="tm"><span className="ti" ref={t(true, 360)}>la&nbsp;Comandă</span></div>
            </h1>
          </div>

          {/* Bottom-left italic — fades on scroll */}
          <p className="r-ent__sub" ref={entSubRef}>
            <span className="tm" style={{ display: "inline-block" }}>
              <span className="ti" ref={t(true, 600)}>Executat cu pasiune, trăit cu bucurie</span>
            </span>
          </p>

          {/* Animated circle button */}
          <a href="#intro" className="r-scr" ref={scrBtnRef} aria-label="Scroll în jos">
            <svg className="ring" viewBox="0 0 58 58">
              <circle ref={scrCircleRef} cx="29" cy="29" r="27.5" />
            </svg>
            <div className="r-scr__arr">
              <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
                <line x1="5.5" y1="0" x2="5.5" y2="14" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M1 10l4.5 4.5L10 10" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </a>
        </section>

        {/* ══════ S2: INTRO ══════ */}
        <section className="r-int" id="intro">
          {/* Small italic — top right, parallax-in from below */}
          <div className="r-int__eye">
            <div className="tm"><span className="ti" ref={t(false, 0)}>executat cu</span></div>
            <div className="tm"><span className="ti" ref={t(false, 140)}>precizie &amp; pasiune</span></div>
          </div>

          {/* Edge-to-edge wordmark */}
          <div className="r-int__wm" ref={wmRef}>MOODILIER</div>

          {/* Two-col */}
          <div className="r-int__body">
            <div className="r-int__left">
              <p className="r-int__desc">
                <span className="tm" style={{ display: "block" }}>
                  <span className="ti" ref={t(false, 0)}>
                    Atelierul nostru din București combină tehnologia modernă cu
                    măiestria execuției artizanale. Fiecare proiect — de la concept
                    la cheie în ușă.
                  </span>
                </span>
              </p>
              {/* Square SVG button */}
              <Link href="/despre-noi" className="r-sqbtn">
                <svg className="r-sqbtn__svg" viewBox="0 0 136 136" preserveAspectRatio="none">
                  <rect ref={sqRectRef} className="r-sqbtn__rect" x="1" y="1" width="134" height="134" />
                </svg>
                <span className="r-sqbtn__txt">Descoperă<br />atelierul</span>
              </Link>
            </div>

            {/* Portrait image */}
            <div className="r-int__img">
              <Image
                ref={intImgRef}
                src="/images-scraped/Mogosoaia_01.jpg"
                alt="Moodilier — interior premium"
                fill sizes="50vw"
                style={{ objectFit: "cover", objectPosition: "center", transformOrigin: "center bottom" }}
                quality={80}
              />
            </div>
          </div>

          {/* Blockquote — offset right, counter-parallax */}
          <div className="r-int__quote" ref={intQuoteRef}>
            <span className="r-int__qmark" aria-hidden>"</span>
            <p className="r-int__qtxt">
              <span className="tm" style={{ display: "block" }}>
                <span className="ti" ref={t(false, 0)}>
                  Mobilierul premium nu înseamnă doar obiecte bine executate —
                  ci spații care transmit emoție, echilibru și identitate.
                </span>
              </span>
            </p>
            <span className="tm r-int__qauthor" style={{ display: "block" }}>
              <span className="ti" ref={t(false, 200)}>Moodilier, din 2013</span>
            </span>
          </div>
        </section>

        {/* ══════ S3: AESTHETICS sticky ══════ */}
        <section className="r-aes">
          <div className="r-aes__track" ref={aesTrackRef}>
            <div className="r-aes__sticky">
              {/* Left: stacked images */}
              <div className="r-aes__img-wrap">
                {SLIDES.map((s, i) => (
                  <div key={i} className={`r-aes__img-frame${activeSlide === i ? " on" : ""}`}>
                    <Image
                      ref={(el) => { if (el) aesImgRefs.current[i] = el; }}
                      src={s.img} alt={s.h.join(" ")}
                      fill sizes="50vw"
                      style={{ objectFit: "cover", objectPosition: "center", transformOrigin: "center" }}
                      quality={75}
                    />
                  </div>
                ))}
              </div>

              {/* Right: slide info */}
              <div className="r-aes__right">
                {SLIDES.map((s, i) => (
                  <div key={i} className={`r-aes__slide${activeSlide === i ? " on" : ""}`}>
                    <div className="r-aes__num">{s.num}</div>
                    <div className="r-aes__lbl">{s.lbl}</div>
                    <div className="r-aes__h">
                      <span style={{ display: "block" }}>{s.h[0]}</span>
                      <em style={{ display: "block" }}>{s.h[1]}</em>
                    </div>
                    <p className="r-aes__p">{s.p}</p>
                  </div>
                ))}
              </div>

              {/* Progress dots */}
              <div className="r-aes__dots" aria-hidden="true">
                {SLIDES.map((_, i) => (
                  <div key={i} className={`r-aes__dot${activeSlide === i ? " on" : ""}`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════ S4: PROJECTS ══════ */}
        <section className="r-proj-sec">
          <div className="r-proj-hd">
            <h2 className="r-proj-h">
              <div className="tm"><span className="ti" ref={t()}>Proiecte</span></div>
              <div className="tm"><span className="ti" ref={t(false, 110)}><em>realizate</em></span></div>
            </h2>
            <Link href="/proiecte" className="r-proj-all">
              <span className="tm" style={{ display: "block" }}>
                <span className="ti" ref={t()}>Vezi toate →</span>
              </span>
            </Link>
          </div>
          <div className="r-proj-grid">
            {PROJECTS.map((p, i) => (
              <Link href={p.href} key={i} className="r-proj-card">
                <div className="r-proj-card__wrap">
                  <Image src={p.img} alt={p.title} fill
                    sizes={i === 0 ? "55vw" : "45vw"}
                    style={{ objectFit: "cover" }} quality={70}
                  />
                </div>
                <div className="r-proj-card__cap">
                  <div className="r-proj-card__cat">{p.cat}</div>
                  <div className="r-proj-card__name">{p.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════ S5: CTA ══════ */}
        <section className="r-cta">
          <div className="r-cta__bg">
            <Image src="/images-scraped/vila_corbeanca_exec_living_4.jpg"
              alt="Contact Moodilier" fill sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }} quality={75}
            />
          </div>
          <div className="r-cta__ov" />
          <div className="r-cta__cnt">
            <span className="r-cta__lbl">
              <span className="tm" style={{ display: "inline-block" }}>
                <span className="ti" ref={t()}>Hai să construim împreună</span>
              </span>
            </span>
            <div className="r-cta__h">
              <div className="tm"><span className="ti" ref={t()}>Transformăm</span></div>
              <div className="tm"><span className="ti" ref={t(false, 130)}>viziunea ta</span></div>
              <div className="tm"><span className="ti" ref={t(false, 260)}><em>în spațiu real.</em></span></div>
            </div>
            <div className="tm" style={{ display: "inline-block" }}>
              <span className="ti" ref={t(false, 380)}>
                <Link href="/contact" className="r-cta__btn">Solicită ofertă gratuită →</Link>
              </span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="r-foot">
          <span className="r-foot__logo">MOODILIER</span>
          <span className="r-foot__copy">© 2025 SC Moodilier SRL</span>
          <Link href="/" className="r-foot__back">← Înapoi la site</Link>
        </footer>
      </div>
    </>
  );
}
