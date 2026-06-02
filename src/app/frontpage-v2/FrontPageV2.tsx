"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

/* ══════════════════════════════════════════════════════
   SELF-CONTAINED CSS — won't leak to other pages
══════════════════════════════════════════════════════ */
const STYLES = `
  /* ── Tokens ── */
  .fp2{
    --gold:#c9a984;--gold2:#e8d5b7;--bg:#191614;--bg2:#100e0c;
    --fg:#ede5da;--fg2:#8a7e70;--border:rgba(201,169,132,.12);
    --sans:'Inter',sans-serif;--serif:'Cormorant Garamond',serif;
  }
  .fp2*,.fp2*::before,.fp2*::after{box-sizing:border-box;margin:0;padding:0}
  .fp2{background:var(--bg);color:var(--fg);font-family:var(--sans);overflow-x:hidden}
  .fp2 a{text-decoration:none;color:inherit}
  .fp2 img{display:block}

  /* ══ HERO ══════════════════════════════════════════ */
  .fp2-hero{
    position:relative;height:100vh;display:flex;
    flex-direction:column;align-items:center;justify-content:center;
    text-align:center;overflow:hidden;
  }

  /* Background zoom-in on load */
  .fp2-hero__bg{
    position:absolute;inset:0;
    animation:fp2BgZoom 2.4s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes fp2BgZoom{
    from{transform:scale(1.12);opacity:0}
    to{transform:scale(1);opacity:1}
  }
  .fp2-hero__ov{
    position:absolute;inset:0;
    background:linear-gradient(to bottom,rgba(15,12,10,.45) 0%,rgba(15,12,10,.2) 50%,rgba(15,12,10,.75) 100%);
    z-index:1;
    animation:fp2OvFade .8s ease .2s both;
  }
  @keyframes fp2OvFade{from{opacity:0}to{opacity:1}}

  /* Gold decorative lines */
  .fp2-hero__lines{
    position:absolute;inset:0;z-index:2;pointer-events:none;overflow:visible;
  }
  .fp2-line-h{
    stroke:var(--gold);stroke-width:.6;fill:none;
    stroke-dasharray:2000;stroke-dashoffset:2000;
    animation:fp2LineDraw 1.4s ease .5s forwards;
  }
  .fp2-line-h2{
    stroke:var(--gold);stroke-width:.3;fill:none;opacity:.4;
    stroke-dasharray:2000;stroke-dashoffset:-2000;
    animation:fp2LineDraw2 1.2s ease .7s forwards;
  }
  @keyframes fp2LineDraw{to{stroke-dashoffset:0}}
  @keyframes fp2LineDraw2{to{stroke-dashoffset:0}}

  /* ── Letter fall animation ── */
  .fp2-letter{
    display:inline-block;
    animation:fp2LetterFall .8s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes fp2LetterFall{
    from{opacity:0;transform:translateY(-90px) rotateX(-30deg)}
    to{opacity:1;transform:translateY(0) rotateX(0)}
  }

  /* ── Hero title ── */
  .fp2-hero__title{
    position:relative;z-index:3;
    font-family:var(--serif);font-weight:300;
    font-size:clamp(4rem,11vw,11rem);
    line-height:.88;letter-spacing:-.02em;
    perspective:600px;transform-style:preserve-3d;
  }
  .fp2-hero__row{display:block;overflow:visible}

  /* Row 2: italic gold sweeps from left via clip-path */
  .fp2-hero__row2{
    font-style:italic;color:var(--gold);
    clip-path:inset(0 100% 0 0);
    animation:fp2ClipLeft 1s cubic-bezier(.76,0,.24,1) 1.5s both;
  }
  @keyframes fp2ClipLeft{to{clip-path:inset(0 0% 0 0)}}

  /* Row 3: slides from right */
  .fp2-hero__row3{
    opacity:0;transform:translateX(80px);
    animation:fp2SlideLeft .9s cubic-bezier(.16,1,.3,1) 1.85s both;
  }
  @keyframes fp2SlideLeft{to{opacity:1;transform:translateX(0)}}

  /* Tagline */
  .fp2-hero__tag{
    position:relative;z-index:3;
    margin-top:2rem;
    font-family:var(--sans);font-size:.7rem;letter-spacing:.4em;
    text-transform:uppercase;color:var(--gold);
    opacity:0;transform:translateY(20px);
    animation:fp2FadeUp .8s cubic-bezier(.16,1,.3,1) 2.1s both;
  }
  @keyframes fp2FadeUp{to{opacity:1;transform:translateY(0)}}

  /* Buttons */
  .fp2-hero__btns{
    position:relative;z-index:3;
    display:flex;gap:1rem;margin-top:2.5rem;
    flex-wrap:wrap;justify-content:center;
    opacity:0;transform:translateY(24px) scale(.96);
    animation:fp2BtnIn .9s cubic-bezier(.16,1,.3,1) 2.3s both;
  }
  @keyframes fp2BtnIn{to{opacity:1;transform:none}}
  .fp2-btn-p{
    padding:.9rem 2.2rem;background:var(--gold);
    color:var(--bg2);font-family:var(--sans);font-size:.65rem;
    letter-spacing:.25em;text-transform:uppercase;
    transition:all .35s;display:inline-flex;align-items:center;gap:.6rem;
  }
  .fp2-btn-p:hover{background:var(--gold2)}
  .fp2-btn-o{
    padding:.9rem 2.2rem;border:1px solid rgba(201,169,132,.4);
    color:var(--gold);font-family:var(--sans);font-size:.65rem;
    letter-spacing:.25em;text-transform:uppercase;
    transition:all .35s;
  }
  .fp2-btn-o:hover{background:var(--gold);color:var(--bg2)}

  /* Scroll indicator */
  .fp2-scroll{
    position:absolute;bottom:2.5rem;left:50%;
    transform:translateX(-50%);z-index:3;
    display:flex;flex-direction:column;align-items:center;gap:.6rem;
    opacity:0;animation:fp2FadeUp .6s ease 2.7s both;
  }
  .fp2-scroll span{
    font-family:var(--sans);font-size:.55rem;letter-spacing:.35em;
    text-transform:uppercase;color:var(--fg2);
  }
  .fp2-scroll-line{
    width:1px;height:40px;background:var(--gold);
    animation:fp2LineGrow 1s ease 3s both;
    transform-origin:top;
  }
  @keyframes fp2LineGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}

  /* ══ MARQUEE ══════════════════════════════════════ */
  .fp2-marquee{
    background:#1a1816;overflow:hidden;padding:1.1rem 0;
    border-top:1px solid var(--border);border-bottom:1px solid var(--border);
  }
  .fp2-marquee__track{
    display:flex;width:max-content;
    animation:fp2Marquee 60s linear infinite;
  }
  .fp2-marquee__track:hover{animation-play-state:paused}
  @keyframes fp2Marquee{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}
  .fp2-marquee__item{
    display:inline-flex;align-items:center;gap:1.2rem;
    padding:0 2.5rem;white-space:nowrap;
    font-family:var(--sans);font-size:.62rem;letter-spacing:.3em;
    text-transform:uppercase;color:var(--gold);font-weight:500;
  }
  .fp2-marquee__dot{opacity:.4;font-size:.5rem}

  /* ══ ABOUT ════════════════════════════════════════ */
  .fp2-about{padding:8rem 4rem;max-width:1400px;margin:0 auto;
    display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center}
  .fp2-about__img{
    position:relative;height:580px;overflow:hidden;
  }
  .fp2-about__img img{width:100%;height:100%;object-fit:cover;transform-origin:center}

  /* Image slides from left */
  .fp2-about__img.fp2-entered{animation:fp2FromLeft 1.2s cubic-bezier(.16,1,.3,1) both}
  @keyframes fp2FromLeft{
    from{opacity:0;transform:translateX(-80px) scale(.97)}
    to{opacity:1;transform:translateX(0) scale(1)}
  }

  /* Gold frame line that draws on enter */
  .fp2-about__frame{
    position:absolute;inset:-1px;pointer-events:none;
    stroke:var(--gold);stroke-width:.8;fill:none;overflow:visible;
  }
  .fp2-about__frame rect{
    stroke-dasharray:3000;stroke-dashoffset:3000;
    transition:stroke-dashoffset 1.8s ease .4s;
  }
  .fp2-about__img.fp2-entered .fp2-about__frame rect{stroke-dashoffset:0}

  .fp2-about__content{display:flex;flex-direction:column;gap:1.5rem}
  .fp2-about__label{
    font-family:var(--sans);font-size:.6rem;letter-spacing:.35em;
    text-transform:uppercase;color:var(--gold);
  }
  .fp2-about__title{
    font-family:var(--serif);font-size:clamp(2.5rem,4vw,4rem);
    font-weight:300;line-height:1.05;
  }
  .fp2-about__title em{font-style:italic;color:var(--gold)}
  .fp2-about__bar{
    width:0;height:1px;background:var(--gold);
    transition:width 1.2s ease .3s;
  }
  .fp2-entered .fp2-about__bar{width:60px}
  .fp2-about__text{
    font-family:var(--sans);font-size:.875rem;line-height:1.9;
    color:var(--fg2);max-width:48ch;
  }

  /* Content slides from right */
  .fp2-about__content.fp2-entered{
    animation:fp2FromRight 1.1s cubic-bezier(.16,1,.3,1) .15s both;
  }
  @keyframes fp2FromRight{
    from{opacity:0;transform:translateX(70px)}
    to{opacity:1;transform:translateX(0)}
  }

  /* ══ STATS ═══════════════════════════════════════ */
  .fp2-stats{
    background:var(--bg2);padding:5rem 4rem;
    display:grid;grid-template-columns:repeat(4,1fr);
    border-top:1px solid var(--border);border-bottom:1px solid var(--border);
  }
  .fp2-stat{
    text-align:center;padding:2rem;
    border-right:1px solid var(--border);
    opacity:0;transform:translateY(40px) scale(.92);
    transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);
  }
  .fp2-stat:last-child{border-right:none}
  .fp2-stat.fp2-entered{opacity:1;transform:none}
  .fp2-stat__num{
    font-family:var(--serif);font-size:clamp(3rem,5vw,4.5rem);
    font-weight:300;color:var(--gold);line-height:1;margin-bottom:.5rem;
  }
  .fp2-stat__label{
    font-family:var(--sans);font-size:.6rem;letter-spacing:.3em;
    text-transform:uppercase;color:var(--fg2);
  }

  /* ══ PROJECTS ════════════════════════════════════ */
  .fp2-proj{padding:8rem 0}
  .fp2-proj__head{
    text-align:center;padding:0 4rem;margin-bottom:5rem;
  }
  .fp2-proj__label{
    font-family:var(--sans);font-size:.6rem;letter-spacing:.4em;
    text-transform:uppercase;color:var(--gold);margin-bottom:1rem;display:block;
  }
  .fp2-proj__title{
    font-family:var(--serif);font-size:clamp(2.5rem,5vw,5rem);
    font-weight:300;line-height:1;
  }
  .fp2-proj__title em{font-style:italic;color:var(--gold)}

  /* 2-col staggered grid */
  .fp2-proj__grid{
    display:grid;grid-template-columns:repeat(2,1fr);
    gap:3px;padding:0 4rem;
    max-width:1400px;margin:0 auto;
  }

  /* Individual project card */
  .fp2-pcard{
    position:relative;overflow:hidden;display:block;
    opacity:0;
    transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1.1s cubic-bezier(.16,1,.3,1);
  }
  /* Odd: from left */
  .fp2-pcard:nth-child(odd){transform:translateX(-90px)}
  /* Even: from right */
  .fp2-pcard:nth-child(even){transform:translateX(90px)}
  .fp2-pcard.fp2-entered{opacity:1;transform:none}

  .fp2-pcard__img{
    position:relative;aspect-ratio:3/2;overflow:hidden;
  }
  .fp2-pcard__img img{
    width:100%;height:100%;object-fit:cover;
    transition:transform 1s cubic-bezier(.16,1,.3,1);
  }
  .fp2-pcard:hover .fp2-pcard__img img{transform:scale(1.05)}

  /* Gold wave SVG on hover */
  .fp2-pcard__waves{
    position:absolute;inset:0;pointer-events:none;z-index:2;
    opacity:0;transition:opacity .5s ease;overflow:hidden;
  }
  .fp2-pcard:hover .fp2-pcard__waves{opacity:1}

  /* Overlay text */
  .fp2-pcard__info{
    padding:1.2rem 0;display:flex;
    justify-content:space-between;align-items:center;
  }
  .fp2-pcard__cat{
    font-family:var(--sans);font-size:.58rem;letter-spacing:.3em;
    text-transform:uppercase;color:var(--gold);
  }
  .fp2-pcard__name{
    font-family:var(--serif);font-size:1.3rem;font-weight:300;
  }
  .fp2-pcard__arr{
    font-size:.7rem;color:var(--fg2);
    transition:transform .3s;
  }
  .fp2-pcard:hover .fp2-pcard__arr{transform:translateX(6px)}

  .fp2-proj__cta{
    text-align:center;margin-top:4rem;
    opacity:0;transform:translateY(30px);
    transition:all 1s cubic-bezier(.16,1,.3,1) .3s;
  }
  .fp2-proj__cta.fp2-entered{opacity:1;transform:none}

  /* ══ SERVICES ════════════════════════════════════ */
  .fp2-svc{background:var(--bg2);padding:8rem 4rem}
  .fp2-svc__head{text-align:center;margin-bottom:5rem}
  .fp2-svc__label{
    font-family:var(--sans);font-size:.6rem;letter-spacing:.4em;
    text-transform:uppercase;color:var(--gold);margin-bottom:1rem;display:block;
  }
  .fp2-svc__title{
    font-family:var(--serif);font-size:clamp(2rem,4vw,3.5rem);
    font-weight:300;
  }
  .fp2-svc__title em{font-style:italic;color:var(--gold)}

  .fp2-svc__grid{
    display:grid;grid-template-columns:repeat(3,1fr);
    gap:2px;max-width:1400px;margin:0 auto;
  }
  .fp2-svc__card{
    background:var(--bg);padding:2.5rem;
    border:1px solid var(--border);
    opacity:0;transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);
  }
  /* Fan-out from different directions based on position */
  .fp2-svc__card:nth-child(1){transform:translateY(-60px) translateX(-40px)}
  .fp2-svc__card:nth-child(2){transform:translateY(-70px)}
  .fp2-svc__card:nth-child(3){transform:translateY(-60px) translateX(40px)}
  .fp2-svc__card:nth-child(4){transform:translateX(-60px)}
  .fp2-svc__card:nth-child(5){transform:translateY(60px)}
  .fp2-svc__card:nth-child(6){transform:translateX(60px)}
  .fp2-svc__card.fp2-entered{opacity:1;transform:none}
  .fp2-svc__card:hover{border-color:rgba(201,169,132,.3)}

  .fp2-svc__num{
    font-family:var(--serif);font-size:3rem;font-weight:300;
    color:rgba(201,169,132,.15);line-height:1;margin-bottom:1rem;
  }
  .fp2-svc__name{
    font-family:var(--serif);font-size:1.3rem;font-weight:300;
    margin-bottom:.8rem;
  }
  .fp2-svc__desc{
    font-family:var(--sans);font-size:.8rem;line-height:1.8;color:var(--fg2);
  }

  /* ══ FULL BLEED ══════════════════════════════════ */
  .fp2-fullbleed{
    position:relative;height:60vh;overflow:hidden;
    display:flex;align-items:center;justify-content:center;
  }
  .fp2-fullbleed__img{
    position:absolute;inset:0;
    transition:transform 20s linear;
  }
  .fp2-fullbleed__img.fp2-entered{transform:scale(1.08)}
  .fp2-fullbleed__ov{
    position:absolute;inset:0;
    background:rgba(12,10,8,.65);
  }
  .fp2-fullbleed__quote{
    position:relative;z-index:1;
    font-family:var(--serif);font-size:clamp(1.8rem,4vw,3.5rem);
    font-weight:300;font-style:italic;color:var(--fg);
    text-align:center;max-width:800px;padding:2rem;
    opacity:0;transform:translateY(30px);
    transition:all 1.2s cubic-bezier(.16,1,.3,1);
  }
  .fp2-fullbleed__quote.fp2-entered{opacity:1;transform:none}
  .fp2-fullbleed__quote em{color:var(--gold)}

  /* ══ SUPPLIERS ═══════════════════════════════════ */
  .fp2-sup{padding:4rem;border-bottom:1px solid var(--border)}
  .fp2-sup__label{
    font-family:var(--sans);font-size:.6rem;letter-spacing:.35em;
    text-transform:uppercase;color:var(--fg2);
    text-align:center;margin-bottom:2.5rem;display:block;
  }
  .fp2-sup__logos{
    display:flex;flex-wrap:wrap;gap:2rem 4rem;
    justify-content:center;align-items:center;
    opacity:0;transform:translateY(20px);
    transition:all 1s cubic-bezier(.16,1,.3,1) .2s;
  }
  .fp2-sup__logos.fp2-entered{opacity:1;transform:none}

  /* ══ CTA ═════════════════════════════════════════ */
  .fp2-cta{
    position:relative;height:80vh;overflow:hidden;
    display:flex;align-items:center;justify-content:center;text-align:center;
  }
  .fp2-cta__bg{position:absolute;inset:0}
  .fp2-cta__bg img{
    width:100%;height:100%;object-fit:cover;
    transform:scale(1.1);transition:transform 1.4s cubic-bezier(.16,1,.3,1);
  }
  .fp2-cta__bg.fp2-entered img{transform:scale(1)}
  .fp2-cta__ov{
    position:absolute;inset:0;
    background:linear-gradient(to top,rgba(10,8,6,.9) 0%,rgba(10,8,6,.4) 100%);
  }
  .fp2-cta__cnt{
    position:relative;z-index:1;max-width:700px;padding:2rem;
  }
  .fp2-cta__tag{
    font-family:var(--sans);font-size:.6rem;letter-spacing:.4em;
    text-transform:uppercase;color:var(--gold);margin-bottom:2rem;
    display:block;opacity:0;transform:translateY(20px);
    transition:all .8s cubic-bezier(.16,1,.3,1);
  }
  .fp2-cta__cnt.fp2-entered .fp2-cta__tag{opacity:1;transform:none}
  .fp2-cta__h{
    font-family:var(--serif);font-size:clamp(3rem,7vw,6.5rem);
    font-weight:300;line-height:.9;letter-spacing:-.02em;margin-bottom:2.5rem;
    opacity:0;transform:translateY(40px);
    transition:all 1s cubic-bezier(.16,1,.3,1) .15s;
  }
  .fp2-cta__cnt.fp2-entered .fp2-cta__h{opacity:1;transform:none}
  .fp2-cta__h em{font-style:italic;color:var(--gold)}
  .fp2-cta__btns{
    display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;
    opacity:0;transform:translateY(30px);
    transition:all .9s cubic-bezier(.16,1,.3,1) .3s;
  }
  .fp2-cta__cnt.fp2-entered .fp2-cta__btns{opacity:1;transform:none}

  /* ══ FOOTER ══════════════════════════════════════ */
  .fp2-foot{
    background:var(--bg2);padding:2rem 4rem;
    display:flex;justify-content:space-between;align-items:center;
    border-top:1px solid var(--border);
  }
  .fp2-foot__logo{font-family:var(--serif);font-size:1.1rem;font-weight:300;letter-spacing:.2em;color:var(--fg2)}
  .fp2-foot__copy{font-family:var(--sans);font-size:.58rem;letter-spacing:.1em;color:rgba(237,229,218,.25)}
  .fp2-foot__back{font-family:var(--sans);font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}

  /* ══ RESPONSIVE ══════════════════════════════════ */
  @media(max-width:900px){
    .fp2-about{grid-template-columns:1fr;padding:5rem 2rem;gap:3rem}
    .fp2-about__img{height:380px}
    .fp2-stats{grid-template-columns:repeat(2,1fr)}
    .fp2-stat:nth-child(2){border-right:none}
    .fp2-proj__grid{grid-template-columns:1fr;padding:0 2rem}
    .fp2-svc{padding:5rem 2rem}
    .fp2-svc__grid{grid-template-columns:1fr}
    .fp2-svc__card:nth-child(n){transform:translateY(50px)}
    .fp2-foot{flex-direction:column;gap:1rem;padding:2rem;text-align:center}
  }
  @media(max-width:600px){
    .fp2-stats{grid-template-columns:1fr 1fr}
    .fp2-hero__title{font-size:clamp(3rem,15vw,6rem)}
  }

  @media(prefers-reduced-motion:reduce){
    .fp2-letter,.fp2-hero__bg,.fp2-hero__row2,.fp2-hero__row3,
    .fp2-hero__tag,.fp2-hero__btns,.fp2-scroll,
    .fp2-scroll-line,.fp2-line-h,.fp2-line-h2{animation:none;opacity:1;clip-path:none;transform:none}
    .fp2-pcard,.fp2-stat,.fp2-svc__card,.fp2-about__img,
    .fp2-about__content,.fp2-proj__cta,.fp2-sup__logos,
    .fp2-fullbleed__quote,.fp2-cta__tag,.fp2-cta__h,.fp2-cta__btns{opacity:1;transform:none;transition:none}
  }
`;

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const PROJECTS = [
  { title: "Vila Cosmopolis", cat: "Rezidențial luxury", img: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href: "/proiecte/executie_vila-cosmopolis" },
  { title: "Apt. Olimp", cat: "Rezidențial", img: "/images-scraped/Olimp_03.jpg", href: "/proiecte/executie_apt-olimp" },
  { title: "Casa Mogoșoaia", cat: "Rezidențial", img: "/images-scraped/Mogosoaia_01.jpg", href: "/proiecte/executie_casa-mogosoaia" },
  { title: "Apt. Mamaia Nord", cat: "Rezidențial", img: "/images-scraped/Black_Pearl_01.jpg", href: "/proiecte/executie_apt-mamaia-nord" },
  { title: "AppTown North", cat: "Rezidențial", img: "/images-scraped/apptown_exec_28.jpg", href: "/proiecte/executie_apptown-north" },
  { title: "Sediu de Birouri", cat: "Comercial", img: "/images-scraped/carusel_office.jpg", href: "/proiecte/executie_sediu-office" },
];

const SERVICES = [
  { num: "01", title: "Servicii de proiectare", desc: "Concept, vizualizări 3D și proiectare tehnică completă, adaptată spațiului și stilului tău." },
  { num: "02", title: "Mobilier la comandă", desc: "Bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil în atelierul propriu." },
  { num: "03", title: "Moodilier Store", desc: "Import selecționat de mobilier premium de la designeri consacrați din Italia, Danemarca și Grecia." },
  { num: "04", title: "Montaj profesionist", desc: "Montaj precis și verificare finală pentru ca fiecare detaliu să respecte standardele noastre." },
  { num: "05", title: "Spații comerciale", desc: "Recepții, birouri, showroom-uri și magazine — mobilier care reflectă identitatea brandului." },
  { num: "06", title: "Design interior", desc: "Consiliere completă de design interior pentru proiecte rezidențiale și comerciale premium." },
];

const STATS = [
  { val: 10, suffix: "+", label: "Ani experiență" },
  { val: 200, suffix: "+", label: "Proiecte finalizate" },
  { val: 100, suffix: "%", label: "Execuție proprie" },
  { val: 24, suffix: "h", label: "Răspuns ofertă" },
];

const SUPPLIERS = [
  "/images-scraped/logo_01_egger.png", "/images-scraped/logo_03_blum.png",
  "/images-scraped/logo_06_himacs.png", "/images-scraped/logo_05_krono.png",
  "/images-scraped/logo_02_avo.png", "/images-scraped/logo_07_hafele.png",
  "/images-scraped/logo_04_corian.png", "/images-scraped/logo_08_sch.png",
];

const MARQUEE = ["Bucătării", "Dressinguri", "Livinguri", "Dormitoare",
  "Spații comerciale", "Design interior", "Mobilier premium", "Execuție proprie"];

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */

/** Split text into letter spans that fall from above */
function LetterFall({ text, baseDelay }: { text: string; baseDelay: number }) {
  return (
    <span aria-label={text} style={{ display: "inline-block" }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="fp2-letter"
          aria-hidden="true"
          style={{ animationDelay: `${(baseDelay + i * 0.055).toFixed(3)}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/** Animated counter that counts up from 0 */
function Counter({ val, suffix, active }: { val: number; suffix: string; active: boolean }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    const dur = 1800;

    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * val));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, val]);

  return <>{display}{suffix}</>;
}

/** Wave paths for project cards (same as main site) */
function buildWave(y: number, amp: number, wl: number, reps: number): string {
  const startX = -wl * 1.5;
  const total = reps + 3;
  const hw = wl / 2;
  const cp = hw * 0.55;
  let d = `M${startX},${y}`;
  for (let i = 0; i < total; i++) {
    const x = startX + i * wl;
    d += ` C${x + cp},${y - amp} ${x + hw - cp},${y - amp} ${x + hw},${y}`;
    d += ` C${x + hw + cp},${y + amp} ${x + wl - cp},${y + amp} ${x + wl},${y}`;
  }
  return d;
}

const WAVE_CFG = [
  { y: 40, amp: 20, wl: 190, dur: "12s", dir: 1, sw: 0.6, op: 0.28 },
  { y: 100, amp: 16, wl: 250, dur: "16s", dir: -1, sw: 0.4, op: 0.18 },
  { y: 160, amp: 25, wl: 175, dur: "14s", dir: 1, sw: 0.8, op: 0.35 },
  { y: 215, amp: 14, wl: 235, dur: "18s", dir: -1, sw: 0.5, op: 0.20 },
  { y: 265, amp: 22, wl: 195, dur: "13s", dir: 1, sw: 0.7, op: 0.28 },
];

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function FrontPageV2() {
  /* ── Intersection refs ── */
  const aboutImgRef  = useRef<HTMLDivElement>(null);
  const aboutConRef  = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const statRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const projRefs     = useRef<(HTMLAnchorElement | null)[]>([]);
  const projCtaRef   = useRef<HTMLDivElement>(null);
  const svcRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const fullbleedRef = useRef<HTMLDivElement>(null);
  const quoteRef     = useRef<HTMLDivElement>(null);
  const supRef       = useRef<HTMLDivElement>(null);
  const ctaBgRef     = useRef<HTMLDivElement>(null);
  const ctaCntRef    = useRef<HTMLDivElement>(null);

  const [statsActive, setStatsActive] = useState(false);

  /* ── Single IntersectionObserver for all scroll reveals ── */
  useEffect(() => {
    const targets: [Element | null, { delay?: number }][] = [
      [aboutImgRef.current,  {}],
      [aboutConRef.current,  { delay: 150 }],
      [projCtaRef.current,   {}],
      [fullbleedRef.current, {}],
      [quoteRef.current,     {}],
      [supRef.current,       {}],
      [ctaBgRef.current,     {}],
      [ctaCntRef.current,    {}],
      ...statRefs.current.map((el, i) => [el, { delay: i * 120 }] as [Element | null, { delay: number }]),
      ...projRefs.current.map((el, i) => [el, { delay: i * 80 }] as [Element | null, { delay: number }]),
      ...svcRefs.current.map((el, i) => [el, { delay: i * 90 }] as [Element | null, { delay: number }]),
    ];

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = Number(el.dataset.delay ?? 0);
        setTimeout(() => el.classList.add("fp2-entered"), delay);

        // Stats trigger counter
        if (el === statsRef.current) setStatsActive(true);
        obs.unobserve(el);
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });

    targets.forEach(([el, { delay = 0 }]) => {
      if (!el) return;
      (el as HTMLElement).dataset.delay = String(delay);
      obs.observe(el);
    });

    // Stats special observer
    if (statsRef.current) {
      const statsObs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setStatsActive(true); statsObs.disconnect(); }
      }, { threshold: 0.2 });
      statsObs.observe(statsRef.current);
    }

    return () => obs.disconnect();
  }, []);

  /* ══ RENDER ══ */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="fp2">

        {/* ═══ HERO ═══ */}
        <section className="fp2-hero">
          {/* Background zoom */}
          <div className="fp2-hero__bg">
            <Image
              src="/images-scraped/Olimp_03.jpg"
              alt="Moodilier — Mobilier Premium"
              fill sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
              priority quality={85}
            />
          </div>
          <div className="fp2-hero__ov" />

          {/* Gold decorative lines SVG */}
          <svg className="fp2-hero__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <line className="fp2-line-h"  x1="0" y1="35" x2="100" y2="35" vectorEffect="non-scaling-stroke" />
            <line className="fp2-line-h2" x1="100" y1="65" x2="0" y2="65" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Title: letters fall + clip + slide */}
          <h1 className="fp2-hero__title">
            <span className="fp2-hero__row" style={{ perspective: "600px" }}>
              <LetterFall text="MOBILIER" baseDelay={0.7} />
            </span>
            <span className="fp2-hero__row fp2-hero__row2">Premium</span>
            <span className="fp2-hero__row fp2-hero__row3">la comandă</span>
          </h1>

          {/* Tagline */}
          <p className="fp2-hero__tag">✦ Executat cu pasiune · Trăit cu bucurie ✦</p>

          {/* Buttons */}
          <div className="fp2-hero__btns">
            <Link href="/proiecte" className="fp2-btn-p">
              Descoperă proiectele →
            </Link>
            <Link href="/contact" className="fp2-btn-o">
              Solicită o ofertă
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="fp2-scroll">
            <span>Scroll</span>
            <div className="fp2-scroll-line" />
          </div>
        </section>

        {/* ═══ MARQUEE ═══ */}
        <div className="fp2-marquee" aria-hidden>
          <div className="fp2-marquee__track">
            {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="fp2-marquee__item">
                <span className="fp2-marquee__dot">✦</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ ABOUT ═══ */}
        <section style={{ background: "var(--bg)" }}>
          <div className="fp2-about">
            {/* Image slides from left with gold frame */}
            <div className="fp2-about__img" ref={aboutImgRef}>
              <Image
                src="/images-scraped/mobilier-premium-01.webp"
                alt="Atelier Moodilier"
                fill sizes="50vw"
                style={{ objectFit: "cover" }}
                unoptimized
              />
              <svg className="fp2-about__frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                <rect x=".5" y=".5" width="99" height="99" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            {/* Content slides from right */}
            <div className="fp2-about__content" ref={aboutConRef}>
              <span className="fp2-about__label">Despre noi</span>
              <h2 className="fp2-about__title">
                The Art of<br /><em>Custom Furniture</em>
              </h2>
              <div className="fp2-about__bar" />
              <p className="fp2-about__text">
                La Moodilier transformăm ideile de amenajare în piese de mobilier premium la
                comandă, create pentru spații elegante, funcționale și atemporale.
              </p>
              <p className="fp2-about__text">
                Cu peste 10 ani de experiență în proiectarea și producția de mobilier premium,
                realizăm soluții personalizate pentru interioare rezidențiale și comerciale.
              </p>
              <Link href="/despre-noi" className="fp2-btn-o" style={{ alignSelf: "flex-start", marginTop: ".5rem" }}>
                Află mai multe →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ STATS (count-up) ═══ */}
        <div className="fp2-stats" ref={statsRef}>
          {STATS.map((s, i) => (
            <div
              key={i}
              className="fp2-stat"
              ref={(el) => { statRefs.current[i] = el; }}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="fp2-stat__num">
                <Counter val={s.val} suffix={s.suffix} active={statsActive} />
              </div>
              <div className="fp2-stat__label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ═══ PROJECTS ═══ */}
        <section className="fp2-proj">
          <div className="fp2-proj__head">
            <span className="fp2-proj__label">Portofoliu</span>
            <h2 className="fp2-proj__title">Proiecte<br /><em>realizate</em></h2>
          </div>

          <div className="fp2-proj__grid">
            {PROJECTS.map((p, i) => (
              <Link
                href={p.href}
                key={i}
                className="fp2-pcard"
                ref={(el) => { projRefs.current[i] = el; }}
                style={{ transitionDelay: `${(i % 2) * 0.1}s` }}
              >
                <div className="fp2-pcard__img">
                  <Image
                    src={p.img} alt={p.title} fill
                    sizes="50vw" style={{ objectFit: "cover" }}
                    unoptimized loading={i < 2 ? "eager" : "lazy"}
                  />
                  {/* Wave overlay on hover */}
                  <svg className="fp2-pcard__waves" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
                    {WAVE_CFG.map((w, wi) => (
                      <path key={wi} d={buildWave(w.y, w.amp, w.wl, 4)}
                        stroke={`rgba(201,169,132,${w.op})`} strokeWidth={w.sw} fill="none">
                        <animateTransform attributeName="transform" type="translate"
                          from={w.dir > 0 ? "0 0" : `${w.wl} 0`}
                          to={w.dir > 0 ? `${w.wl} 0` : "0 0"}
                          dur={w.dur} repeatCount="indefinite" />
                      </path>
                    ))}
                  </svg>
                </div>
                <div className="fp2-pcard__info">
                  <div>
                    <div className="fp2-pcard__cat">{p.cat}</div>
                    <div className="fp2-pcard__name">{p.title}</div>
                  </div>
                  <span className="fp2-pcard__arr">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="fp2-proj__cta" ref={projCtaRef}>
            <Link href="/proiecte" className="fp2-btn-o" style={{ display: "inline-block" }}>
              Vezi toate proiectele
            </Link>
          </div>
        </section>

        {/* ═══ SERVICES (fan-out) ═══ */}
        <section className="fp2-svc">
          <div className="fp2-svc__head">
            <span className="fp2-svc__label">Ce oferim</span>
            <h2 className="fp2-svc__title">Servicii <em>oferite</em></h2>
          </div>
          <div className="fp2-svc__grid">
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className="fp2-svc__card"
                ref={(el) => { svcRefs.current[i] = el; }}
                style={{ transitionDelay: `${i * 0.09}s` }}
              >
                <div className="fp2-svc__num">{s.num}</div>
                <div className="fp2-svc__name">{s.title}</div>
                <div className="fp2-svc__desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FULL-BLEED QUOTE ═══ */}
        <div className="fp2-fullbleed">
          <div className="fp2-fullbleed__img" ref={fullbleedRef}>
            <Image
              src="/images-scraped/vila_corbeanca_exec_living_4.jpg"
              alt="Moodilier premium interior" fill sizes="100vw"
              style={{ objectFit: "cover" }} unoptimized
            />
          </div>
          <div className="fp2-fullbleed__ov" />
          <blockquote className="fp2-fullbleed__quote" ref={quoteRef as React.Ref<HTMLQuoteElement>}>
            „We Are The <em>Furniture Engineers</em>"
          </blockquote>
        </div>

        {/* ═══ SUPPLIERS ═══ */}
        <div className="fp2-sup">
          <span className="fp2-sup__label">Furnizori parteneri</span>
          <div className="fp2-sup__logos" ref={supRef}>
            {SUPPLIERS.map((logo, i) => (
              <Image key={i} src={logo} alt={`Furnizor ${i + 1}`}
                width={120} height={50}
                style={{ height: "30px", width: "auto", objectFit: "contain", opacity: 0.6 }}
                unoptimized
              />
            ))}
          </div>
        </div>

        {/* ═══ CTA ═══ */}
        <section className="fp2-cta">
          <div className="fp2-cta__bg" ref={ctaBgRef}>
            <Image
              src="/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
              alt="Contact Moodilier" fill sizes="100vw"
              style={{ objectFit: "cover" }} quality={75}
              unoptimized
            />
          </div>
          <div className="fp2-cta__ov" />
          <div className="fp2-cta__cnt" ref={ctaCntRef}>
            <span className="fp2-cta__tag">Hai să lucrăm împreună</span>
            <h2 className="fp2-cta__h">
              Transformăm<br />viziunea ta în<br /><em>mobilier real.</em>
            </h2>
            <div className="fp2-cta__btns">
              <Link href="/contact" className="fp2-btn-p">
                Solicită ofertă gratuită →
              </Link>
              <Link href="/proiecte" className="fp2-btn-o">
                Descoperă portofoliul
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="fp2-foot">
          <span className="fp2-foot__logo">MOODILIER</span>
          <span className="fp2-foot__copy">© 2025 SC Moodilier SRL · București</span>
          <Link href="/" className="fp2-foot__back">← Înapoi la site principal</Link>
        </footer>
      </div>
    </>
  );
}
