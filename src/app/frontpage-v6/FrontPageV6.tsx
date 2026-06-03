"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollVideoSection from "@/components/ScrollVideoSection";
import StatsSection from "@/components/StatsSection";
import HeroSlider from "@/components/HeroSlider";

/* ══════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════ */
const STYLES = `
:root {
  --gold: #c9a984; --gold2: #e8d5b7;
  --bg: #0b0907; --bg2: #141210; --bg3: #1c1916;
  --fg: #ede5da; --fg2: #7a6e62; --border: rgba(237,229,218,.07);
  --serif: 'Cormorant Garamond', serif; --sans: 'Inter', sans-serif;
}
.v6 { background: var(--bg); color: var(--fg); font-family: var(--sans); cursor: none; }
@media (hover: none),(pointer: coarse) { .v6 { cursor: auto !important; } .v6-cursor { display: none !important; } }
.v6 *, .v6 *::before, .v6 *::after { box-sizing: border-box; margin: 0; padding: 0; }
.v6 a { text-decoration: none; color: inherit; }

/* ─── LOADER ──────────────────────────────────────────────── */
.v6-loader {
  position: fixed; inset: 0; z-index: 9000; background: var(--bg); pointer-events: none;
  animation: v6Out .7s cubic-bezier(.76,0,.24,1) .15s both;
}
@keyframes v6Out { to { opacity: 0; } }

/* ─── CURSOR ──────────────────────────────────────────────── */
.v6-cursor {
  position: fixed; z-index: 8999; pointer-events: none;
  top: 0; left: 0; width: 8px; height: 8px;
  background: var(--gold); border-radius: 50%;
  transform: translate(-50%,-50%); will-change: transform;
  transition: width .28s, height .28s;
}
.v6-cursor.x { width: 50px; height: 50px; background: rgba(201,169,132,.12); }

/* ─── HERO ────────────────────────────────────────────────── */
.v6-hero {
  position: relative;
  height: 100vh; height: 100svh;        /* svh excludes browser chrome */
  min-height: 560px;
  overflow: hidden;
  display: flex; flex-direction: column;
}
.v6-hbg { position: absolute; inset: 0; will-change: transform; }
.v6-hbg img { width: 100%; height: 100%; object-fit: cover; object-position: center 40%; }
.v6-hov {
  position: absolute; inset: 0;
  background: linear-gradient(175deg, rgba(11,9,7,.5) 0%, rgba(11,9,7,.05) 38%, rgba(11,9,7,.92) 100%);
}

/* Title block */
.v6-htitle {
  position: relative; z-index: 1;
  margin-top: auto;
  padding: 0 5vw 1.5rem;
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(2rem, 7.5vw, 8.5rem);
  line-height: .88; letter-spacing: -.025em;
}
.v6-mask { overflow: hidden; display: block; }
.v6-mi { display: block; transform: translateY(110%); }
.v6-htitle em { font-style: italic; color: var(--gold); }

/* CTA row directly in hero */
.v6-hcta {
  position: relative; z-index: 1;
  padding: 0 5vw 2rem;
  display: flex; gap: .7rem; flex-wrap: wrap;
}

/* Strip */
.v6-hstrip {
  position: relative; z-index: 1;
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.2rem 5vw;
  border-top: 1px solid var(--border);
}
.v6-htagline {
  font-family: var(--serif); font-style: italic;
  font-size: clamp(.78rem, 1.3vw, 1rem);
  color: rgba(237,229,218,.42); max-width: 280px; line-height: 1.5; opacity: 0;
}
.v6-scroll {
  display: flex; align-items: center; gap: .5rem; opacity: 0;
  flex-shrink: 0;
}
.v6-scroll span { font-size: .46rem; letter-spacing: .4em; text-transform: uppercase; color: var(--gold); }
.v6-sline {
  width: 36px; height: 1px; background: var(--gold); transform-origin: left;
  animation: v6Pulse 2s ease 2.2s infinite;
}
@keyframes v6Pulse { 0%,100%{opacity:1;transform:scaleX(1)} 50%{opacity:.3;transform:scaleX(.4)} }

/* ─── BUTTONS ─────────────────────────────────────────────── */
.v6-btn-p {
  padding: .85rem 2rem; background: var(--gold); color: var(--bg);
  font-size: .6rem; letter-spacing: .18em; text-transform: uppercase; transition: background .3s;
  white-space: nowrap;
}
.v6-btn-p:hover { background: var(--gold2); }
.v6-btn-o {
  padding: .85rem 2rem; border: 1px solid rgba(201,169,132,.3);
  color: var(--gold); font-size: .6rem; letter-spacing: .18em;
  text-transform: uppercase; transition: all .3s;
  white-space: nowrap;
}
.v6-btn-o:hover { background: var(--gold); color: var(--bg); }

/* ─── MARQUEE ─────────────────────────────────────────────── */
.v6-mq { overflow: hidden; padding: 1rem 0; background: #0e0c0a; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.v6-mqt { display: flex; width: max-content; animation: v6Mq 55s linear infinite; }
@keyframes v6Mq { to { transform: translateX(-33.333%); } }
.v6-mqi { display: inline-flex; align-items: center; gap: .65rem; padding: 0 2.2rem; font-family: var(--serif); font-style: italic; font-size: clamp(.9rem, 1.6vw, 1.2rem); color: var(--fg2); white-space: nowrap; }
.v6-mqs { color: var(--gold); opacity: .4; font-style: normal; font-size: .6em; }

/* ─── PROJECTS ────────────────────────────────────────────── */
.v6-projs {}

/* Desktop: alternating full-width */
.v6-proj {
  display: grid; grid-template-columns: 1fr 1fr;
  min-height: 78vh; border-bottom: 1px solid var(--border); overflow: hidden;
}
.v6-proj:nth-child(even) { direction: rtl; }
.v6-proj:nth-child(even) > * { direction: ltr; }
.v6-pimg { position: relative; overflow: hidden; clip-path: inset(0 0 100% 0); }
.v6-pimg-in { position: absolute; inset: -14% 0; }
.v6-pimg-in img { width: 100%; height: 100%; object-fit: cover; }
.v6-pinfo {
  padding: 5vw 4vw; background: var(--bg);
  display: flex; flex-direction: column; justify-content: flex-end;
}
.v6-pidx { font-family: var(--serif); font-size: clamp(3rem, 6vw, 7rem); font-weight: 300; color: rgba(201,169,132,.06); line-height: 1; margin-bottom: auto; }
.v6-pcat { font-size: .52rem; letter-spacing: .4em; text-transform: uppercase; color: var(--gold); margin-bottom: .9rem; }
.v6-pname { font-family: var(--serif); font-size: clamp(1.8rem, 3vw, 3.5rem); font-weight: 300; line-height: .9; letter-spacing: -.02em; margin-bottom: .7rem; }
.v6-pname em { font-style: italic; color: var(--gold); }
.v6-ploc { font-size: .65rem; color: var(--fg2); letter-spacing: .08em; margin-bottom: 1.8rem; }
.v6-pcta {
  display: inline-flex; align-items: center; gap: .5rem;
  font-size: .56rem; letter-spacing: .26em; text-transform: uppercase;
  padding-bottom: .3rem; border-bottom: 1px solid rgba(237,229,218,.15);
  width: fit-content; transition: color .3s, border-color .3s, gap .3s;
}
.v6-pcta:hover { color: var(--gold); border-color: var(--gold); gap: .8rem; }

/* Mobile: compact card grid */
.v6-proj-mobile-grid {
  display: none;
  grid-template-columns: 1fr 1fr;
  gap: 2px; background: var(--border);
}
.v6-pcard { display: block; position: relative; overflow: hidden; background: var(--bg2); }
.v6-pcard:first-child { grid-column: span 2; }
.v6-pcard-img { position: relative; overflow: hidden; padding-top: 70%; clip-path: inset(0 0 100% 0); }
.v6-pcard:first-child .v6-pcard-img { padding-top: 55%; }
.v6-pcard-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.v6-pcard-info { padding: 1rem; }
.v6-pcard-cat { font-size: .48rem; letter-spacing: .35em; text-transform: uppercase; color: var(--gold); margin-bottom: .3rem; }
.v6-pcard-name { font-family: var(--serif); font-size: 1.1rem; font-weight: 300; line-height: 1; }
.v6-pcard-name em { font-style: italic; color: var(--gold); }

/* ─── HUMAN TOUCH ─────────────────────────────────────────── */
.v6-human {
  display: grid; grid-template-columns: 1fr 1fr; min-height: 65vh;
  border-bottom: 1px solid var(--border); overflow: hidden;
}
.v6-human-img { position: relative; overflow: hidden; clip-path: inset(0 0 100% 0); }
.v6-human-img-in { position: absolute; inset: -12% 0; }
.v6-human-img-in img { width: 100%; height: 100%; object-fit: cover; }
.v6-human-text {
  padding: 6vw 5vw; background: var(--bg3);
  display: flex; flex-direction: column; justify-content: center; gap: 0;
}
.v6-human-tag { font-size: .52rem; letter-spacing: .42em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.5rem; display: block; }
.v6-human-h { font-family: var(--serif); font-size: clamp(1.6rem, 2.8vw, 3rem); font-weight: 300; line-height: 1.2; margin-bottom: 1.5rem; }
.v6-human-h em { font-style: italic; color: var(--gold); }
.v6-testimonials { display: flex; flex-direction: column; gap: 1.8rem; margin-top: .5rem; }
.v6-testi { padding: 1.4rem 1.6rem; border-left: 2px solid rgba(201,169,132,.2); background: rgba(201,169,132,.04); }
.v6-testi-q { font-family: var(--serif); font-style: italic; font-size: .95rem; line-height: 1.65; color: var(--fg2); margin-bottom: .8rem; }
.v6-testi-a { font-size: .52rem; letter-spacing: .25em; text-transform: uppercase; color: var(--gold); }

/* ─── ABOUT ───────────────────────────────────────────────── */
.v6-about {
  display: grid; grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--border); overflow: hidden;
}
.v6-about-img { position: relative; overflow: hidden; min-height: 480px; clip-path: inset(0 0 100% 0); }
.v6-about-img-in { position: absolute; inset: -12% 0; }
.v6-about-img-in img { width: 100%; height: 100%; object-fit: cover; }
.v6-about-txt { padding: 7vw 5vw; background: var(--bg2); display: flex; flex-direction: column; justify-content: center; }
.v6-atag { font-size: .52rem; letter-spacing: .42em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.4rem; display: block; }
.v6-ah { font-family: var(--serif); font-size: clamp(1.7rem, 2.8vw, 3rem); font-weight: 300; line-height: 1.15; margin-bottom: 1.6rem; }
.v6-ah em { font-style: italic; color: var(--gold); }
.v6-ap { font-size: .8rem; line-height: 1.9; color: var(--fg2); margin-bottom: .9rem; max-width: 44ch; }
.v6-div { width: 36px; height: 1px; background: var(--gold); margin: 1.4rem 0; }
.v6-stats { display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 2rem; }
.v6-sn { font-family: var(--serif); font-size: 2rem; font-weight: 300; color: var(--gold); }
.v6-sl { font-size: .48rem; letter-spacing: .24em; text-transform: uppercase; color: var(--fg2); margin-top: .1rem; }

/* ─── PROCESS ─────────────────────────────────────────────── */
.v6-proc { background: var(--bg); padding: clamp(3.5rem, 7vw, 9rem) 5vw; }
.v6-proc-head { text-align: center; margin-bottom: 3.5rem; }
.v6-proc-tag { font-size: .52rem; letter-spacing: .42em; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: .9rem; }
.v6-proc-h { font-family: var(--serif); font-size: clamp(1.8rem, 3.5vw, 3.5rem); font-weight: 300; }
.v6-proc-h em { font-style: italic; color: var(--gold); }
.v6-pgrid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--border); }
.v6-step { background: var(--bg); padding: 2.2rem 1.5rem; opacity: 0; transform: translateY(24px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.v6-step.in { opacity: 1; transform: none; }
.v6-snum { font-family: var(--serif); font-size: 2.8rem; font-weight: 300; color: rgba(201,169,132,.12); line-height: 1; margin-bottom: 1rem; }
.v6-stitle { font-size: .82rem; font-weight: 500; color: var(--fg); margin-bottom: .6rem; }
.v6-sdesc { font-size: .72rem; line-height: 1.72; color: var(--fg2); }

/* ─── SERVICES ────────────────────────────────────────────── */
.v6-svcs { background: var(--bg2); padding: clamp(3.5rem, 7vw, 9rem) 5vw; }
.v6-svcs-hd { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; padding-bottom: 1.8rem; border-bottom: 1px solid var(--border); }
.v6-svcs-h { font-family: var(--serif); font-size: clamp(1.7rem, 3vw, 3rem); font-weight: 300; }
.v6-svcs-h em { font-style: italic; color: var(--gold); }
.v6-svcs-t { font-size: .52rem; letter-spacing: .4em; text-transform: uppercase; color: var(--gold); }
.v6-svc { display: grid; grid-template-columns: 60px 1fr auto; padding: 1.4rem 0; border-bottom: 1px solid var(--border); align-items: baseline; opacity: 0; transform: translateY(18px); transition: opacity .65s cubic-bezier(.16,1,.3,1), transform .65s cubic-bezier(.16,1,.3,1); }
.v6-svc.in { opacity: 1; transform: none; }
.v6-svn { font-family: var(--serif); font-size: .85rem; color: rgba(201,169,132,.22); }
.v6-svname { font-family: var(--serif); font-size: clamp(1.1rem, 1.8vw, 1.8rem); font-weight: 300; }
.v6-svdesc { font-size: .7rem; color: var(--fg2); text-align: right; max-width: 26ch; }

/* ─── QUOTE ───────────────────────────────────────────────── */
.v6-qblock { position: relative; height: 60vh; min-height: 340px; overflow: hidden; display: grid; place-items: center; }
.v6-qbg { position: absolute; inset: 0; }
.v6-qbg img { width: 100%; height: 100%; object-fit: cover; }
.v6-qov { position: absolute; inset: 0; background: rgba(8,6,4,.72); }
.v6-qcnt { position: relative; z-index: 1; text-align: center; max-width: 680px; padding: 2rem 5vw; }
.v6-qt { font-family: var(--serif); font-style: italic; font-size: clamp(1.3rem, 3vw, 2.8rem); line-height: 1.4; color: var(--fg); margin-bottom: 1.2rem; }
.v6-qa { font-size: .52rem; letter-spacing: .36em; text-transform: uppercase; color: var(--gold); }

/* ─── CTA ─────────────────────────────────────────────────── */
.v6-cta { position: relative; height: 80vh; min-height: 400px; overflow: hidden; display: grid; place-items: center; }
.v6-cta-bg { position: absolute; inset: 0; }
.v6-cta-bg img { width: 100%; height: 100%; object-fit: cover; }
.v6-cta-ov { position: absolute; inset: 0; background: rgba(8,6,4,.65); }
.v6-cta-cnt { position: relative; z-index: 1; text-align: center; max-width: 840px; padding: 2rem 5vw; }
.v6-cta-tag { display: block; font-size: .54rem; letter-spacing: .46em; text-transform: uppercase; color: var(--gold); margin-bottom: 2rem; }
.v6-cta-h { font-family: var(--serif); font-weight: 300; font-size: clamp(2.8rem, 8vw, 8.5rem); line-height: .86; letter-spacing: -.03em; margin-bottom: 2.5rem; }
.v6-cta-h em { font-style: italic; color: var(--gold); }
.v6-cta-btns { display: flex; gap: .8rem; justify-content: center; flex-wrap: wrap; }

/* ─── FOOTER ──────────────────────────────────────────────── */
.v6-footer { background: #050403; padding: 2rem 5vw; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); }
.v6-flogo { font-family: var(--serif); font-size: .95rem; font-weight: 300; letter-spacing: .25em; color: var(--fg2); }
.v6-fcopy { font-size: .48rem; color: rgba(237,229,218,.15); letter-spacing: .1em; }
.v6-fnav { display: flex; gap: 1.8rem; font-size: .48rem; letter-spacing: .18em; text-transform: uppercase; color: var(--fg2); }
.v6-fnav a:hover { color: var(--gold); }

/* ─── SERVICES CARDS ─────────────────────────────────────── */
.v6-svc-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 2px; background: var(--border);
  margin-bottom: 2.5rem;
}
.v6-svc-card {
  position: relative; overflow: hidden;
  background: var(--bg3); aspect-ratio: 4/3; cursor: default;
}
.v6-svc-card-bg {
  position: absolute; inset: 0; overflow: hidden;
  opacity: .22; transition: opacity .6s ease;
}
.v6-svc-card-bg img { width:100%; height:100%; object-fit:cover; transition: transform .6s ease; }
.v6-svc-card:hover .v6-svc-card-bg { opacity: .4; }
.v6-svc-card:hover .v6-svc-card-bg img { transform: scale(1.05); }
.v6-svc-card-body {
  position: absolute; inset: 0; padding: 1.4rem 1.5rem;
  display: flex; flex-direction: column; justify-content: flex-end;
  background: linear-gradient(to top, rgba(11,9,7,.9) 0%, rgba(11,9,7,.05) 55%);
}
.v6-svc-card-n { font-family: var(--serif); font-size: .65rem; color: rgba(201,169,132,.28); margin-bottom:.5rem; }
.v6-svc-card-name { font-family: var(--serif); font-size: clamp(.95rem, 1.5vw, 1.35rem); font-weight: 300; color: var(--fg); line-height:1.1; margin-bottom:.3rem; }
.v6-svc-card-desc { font-size: .58rem; color: rgba(201,169,132,.6); letter-spacing:.04em; line-height:1.5; }
@media (max-width: 900px) { .v6-svc-grid { grid-template-columns: repeat(2, 1fr); } .v6-svc-card { aspect-ratio: 1; } }
@media (max-width: 540px) { .v6-svc-card-desc { display: none; } }

/* ─── SCROLLBAR ───────────────────────────────────────────── */
@media (min-width: 901px) {
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: rgba(201,169,132,.2); }
  scrollbar-width: thin; scrollbar-color: rgba(201,169,132,.2) var(--bg);
}

/* ══════════════════════════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════════════════════════ */
@media (max-width: 900px) {
  /* Switch to mobile project grid */
  .v6-proj   { display: none; }
  .v6-proj-mobile-grid { display: grid; }

  /* Human & About: stack */
  .v6-human, .v6-about { grid-template-columns: 1fr; }
  .v6-human-img, .v6-about-img { height: 55vw; min-height: 220px; min-height: unset; }
  .v6-human-text, .v6-about-txt { padding: 6vw 5vw; }

  /* Process */
  .v6-pgrid { grid-template-columns: 1fr 1fr; }

  /* Services */
  .v6-svc { grid-template-columns: 48px 1fr; }
  .v6-svdesc { display: none; }
  .v6-svcs-hd { flex-direction: column; align-items: flex-start; gap: .7rem; }

  /* Footer */
  .v6-footer { flex-direction: column; gap: 1rem; text-align: center; }
  .v6-fnav { justify-content: center; }
}
@media (max-width: 600px) {
  /* Hero */
  .v6-htitle { padding: 0 5vw 1rem; }
  .v6-hcta { padding: 0 5vw 1.2rem; }
  .v6-hstrip { padding: 1rem 5vw; }
  .v6-htagline { display: none; }

  /* Projects mobile: single col on tiny screens */
  .v6-proj-mobile-grid { grid-template-columns: 1fr; }
  .v6-pcard:first-child { grid-column: span 1; }

  /* About stats */
  .v6-stats { gap: 1.2rem; }

  /* Process */
  .v6-pgrid { grid-template-columns: 1fr; }

  /* Smaller CTAs */
  .v6-cta-h { font-size: clamp(2.2rem, 10vw, 5rem); }
  .v6-qt { font-size: clamp(1.1rem, 4.5vw, 1.8rem); }
}
@media (prefers-reduced-motion: reduce) {
  .v6-loader { animation: none; opacity: 0; }
  .v6-sline { animation: none; }
  .v6-mi { transform: none; }
  .v6-pimg, .v6-pcard-img, .v6-human-img, .v6-about-img { clip-path: none !important; }
}
`;

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const PROJECTS = [
  { idx:"01", cat:"Rezidențial", loc:"Ilfov · 2024",      name:"Vila",       em:"Cosmopolis",  img:"/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href:"/proiecte/executie_vila-cosmopolis" },
  { idx:"02", cat:"Rezidențial", loc:"Constanța · 2023",  name:"Apartament", em:"Olimp",       img:"/images-scraped/Olimp_03.jpg",                               href:"/proiecte/executie_apt-olimp" },
  { idx:"03", cat:"Rezidențial", loc:"Mamaia Nord · 2023",name:"Black",      em:"Pearl",       img:"/images-scraped/Black_Pearl_01.jpg",                         href:"/proiecte/executie_apt-mamaia-nord" },
  { idx:"04", cat:"Rezidențial", loc:"București · 2023",  name:"Apartament", em:"Dristor",      img:"/images-scraped/executie_apt-dristor_living_03.jpg",                  href:"/proiecte" },
  { idx:"05", cat:"Rezidențial", loc:"Ilfov · 2023",      name:"Casa",       em:"Mogoșoaia",   img:"/images-scraped/Mogosoaia_01.jpg",                           href:"/proiecte/executie_casa-mogosoaia" },
  { idx:"06", cat:"Rezidențial", loc:"Ilfov · 2024",      name:"Vila",       em:"Corbeanca",   img:"/images-scraped/vila_corbeanca_exec_living_4.jpg",           href:"/proiecte" },
];

const PROCESS = [
  { s:"1", title:"Consultare", desc:"Analizăm cerințele, stilul și particularitățile spațiului dumneavoastră." },
  { s:"2", title:"Concept 3D", desc:"Dezvoltăm un concept vizual complet cu dimensiuni și finisaje." },
  { s:"3", title:"Proiect tehnic", desc:"Planuri tehnice complete, gata de execuție în atelier." },
  { s:"4", title:"Producție", desc:"Execuție în atelierul propriu cu tehnologie modernă." },
  { s:"5", title:"Montaj", desc:"Montaj profesionist cu verificare finală a fiecărui detaliu." },
];

const SERVICES = [
  { n:"01", name:"Servicii de proiectare", desc:"Concept, vizualizări 3D și proiect tehnic" },
  { n:"02", name:"Mobilier la comandă",    desc:"Bucătării, dressinguri, livinguri, dormitoare" },
  { n:"03", name:"Spații comerciale",      desc:"Office, recepții, showroom-uri" },
  { n:"04", name:"Moodilier Store",        desc:"Import premium Italia & Danemarca" },
  { n:"05", name:"Montaj profesionist",    desc:"Montaj precis și recepție finală" },
  { n:"06", name:"Design interior",        desc:"Consiliere completă rezidențial & comercial" },
];

const MQ = ["Mobilier Premium","Design Interior","La Comandă","Bucătării","Dressinguri","Livinguri","Dormitoare","Spații Comerciale"];

const TESTIMONIALS = [
  { q:'„Echipa Moodilier a transformat complet livingul nostru. Fiecare detaliu a fost gândit și executat impecabil — rezultatul a depășit așteptările."', a:"A.M. · Vila Cosmopolis" },
  { q:'„Am ales Moodilier pentru bucătăria de la vila din Mamaia. Calitatea materialelor și precizia execuției sunt remarcabile."', a:"R.P. · Mamaia Nord" },
];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export default function FrontPageV6() {
  const stepRefs  = useRef<(HTMLDivElement|null)[]>([]);
  const svcRefs   = useRef<(HTMLDivElement|null)[]>([]);


  /* ── GSAP + Lenis ── */
  useEffect(()=>{
    let lenis: InstanceType<typeof import("lenis").default>|null=null;
    let dead=false;
    const boot=async()=>{
      const [{default:Lenis},{gsap},{ScrollTrigger}]=await Promise.all([
        import("lenis"), import("gsap"), import("gsap/ScrollTrigger"),
      ]);
      if(dead) return;
      gsap.registerPlugin(ScrollTrigger);

      /* Lenis only on desktop */
      if(!window.matchMedia("(hover: none)").matches){
        lenis=new Lenis({duration:1.3,easing:(t:number)=>Math.min(1,1.001-Math.pow(2,-10*t))});
        lenis.on("scroll",()=>ScrollTrigger.update());
        gsap.ticker.add((t:number)=>lenis?.raf(t*1000));
        gsap.ticker.lagSmoothing(0);
      }

      /* Hero text reveal */
      gsap.to(".v6-mi",{y:"0%",duration:1.2,ease:"power3.out",stagger:.12,delay:.2});
      gsap.to([".v6-htagline",".v6-scroll"],{opacity:1,duration:.9,ease:"power2.out",stagger:.15,delay:1});

      /* Hero bg parallax */
      gsap.to(".v6-hbg",{yPercent:18,ease:"none",
        scrollTrigger:{trigger:".v6-hero",start:"top top",end:"bottom top",scrub:true}});

      /* Desktop project reveals */
      document.querySelectorAll<HTMLElement>(".v6-pimg").forEach(wrap=>{
        gsap.to(wrap,{clipPath:"inset(0 0 0% 0)",duration:1.4,ease:"power3.inOut",
          scrollTrigger:{trigger:wrap,start:"top 85%",toggleActions:"play none none none"}});
        const inn=wrap.querySelector<HTMLElement>(".v6-pimg-in");
        if(inn) gsap.fromTo(inn,{yPercent:-9},{yPercent:9,ease:"none",
          scrollTrigger:{trigger:wrap,start:"top bottom",end:"bottom top",scrub:true}});
      });
      document.querySelectorAll<HTMLElement>(".v6-pinfo").forEach(info=>{
        gsap.from(info.querySelectorAll(".v6-pcat,.v6-pname,.v6-ploc,.v6-pcta"),
          {opacity:0,y:20,duration:.8,stagger:.06,ease:"power2.out",
           scrollTrigger:{trigger:info,start:"top 82%"}});
      });

      /* Mobile card reveals */
      document.querySelectorAll<HTMLElement>(".v6-pcard-img").forEach(wrap=>{
        gsap.to(wrap,{clipPath:"inset(0 0 0% 0)",duration:1.2,ease:"power3.inOut",
          scrollTrigger:{trigger:wrap,start:"top 90%",toggleActions:"play none none none"}});
      });

      /* Human section */
      const hImg=document.querySelector<HTMLElement>(".v6-human-img");
      if(hImg){
        gsap.to(hImg,{clipPath:"inset(0 0 0% 0)",duration:1.4,ease:"power3.inOut",
          scrollTrigger:{trigger:hImg,start:"top 85%",toggleActions:"play none none none"}});
        const inn=hImg.querySelector<HTMLElement>(".v6-human-img-in");
        if(inn) gsap.fromTo(inn,{yPercent:-9},{yPercent:9,ease:"none",
          scrollTrigger:{trigger:hImg,start:"top bottom",end:"bottom top",scrub:true}});
      }
      gsap.from(".v6-human-text > *",{opacity:0,y:24,duration:.85,stagger:.07,ease:"power2.out",
        scrollTrigger:{trigger:".v6-human-text",start:"top 80%"}});

      /* About section */
      const aImg=document.querySelector<HTMLElement>(".v6-about-img");
      if(aImg){
        gsap.to(aImg,{clipPath:"inset(0 0 0% 0)",duration:1.4,ease:"power3.inOut",
          scrollTrigger:{trigger:aImg,start:"top 85%",toggleActions:"play none none none"}});
        const inn=aImg.querySelector<HTMLElement>(".v6-about-img-in");
        if(inn) gsap.fromTo(inn,{yPercent:-9},{yPercent:9,ease:"none",
          scrollTrigger:{trigger:aImg,start:"top bottom",end:"bottom top",scrub:true}});
      }
      gsap.from(".v6-about-txt > *",{opacity:0,y:24,duration:.85,stagger:.07,ease:"power2.out",
        scrollTrigger:{trigger:".v6-about-txt",start:"top 80%"}});

      /* Quote + CTA bg parallax */
      [".v6-qbg",".v6-cta-bg"].forEach(sel=>{
        const el=document.querySelector<HTMLElement>(sel);
        if(el) gsap.fromTo(el,{yPercent:-10},{yPercent:10,ease:"none",
          scrollTrigger:{trigger:el.parentElement!,start:"top bottom",end:"bottom top",scrub:true}});
      });
      gsap.from(".v6-qt,.v6-qa",{opacity:0,y:28,duration:.9,stagger:.15,ease:"power2.out",
        scrollTrigger:{trigger:".v6-qcnt",start:"top 72%"}});

      /* CTA curtain */
      gsap.to(".v6-cta .v6-mi",{y:"0%",duration:1.1,ease:"power3.out",stagger:.1,
        scrollTrigger:{trigger:".v6-cta",start:"top 70%"}});
      gsap.from(".v6-cta-tag,.v6-cta-btns",{opacity:0,y:18,duration:.85,stagger:.15,ease:"power2.out",
        scrollTrigger:{trigger:".v6-cta",start:"top 70%"}});

      ScrollTrigger.refresh();
    };
    boot();
    return ()=>{
      dead=true;
      import("gsap/ScrollTrigger").then(({ScrollTrigger})=>ScrollTrigger.killAll());
      lenis?.destroy();
    };
  },[]);

  /* ── IntersectionObserver for steps & services ── */
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){(e.target as HTMLElement).classList.add("in");obs.unobserve(e.target);}});
    },{threshold:.08});
    [...stepRefs.current,...svcRefs.current].forEach(el=>el&&obs.observe(el));
    return ()=>obs.disconnect();
  },[]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:STYLES}} />
      <div className="v6">
        <div className="v6-loader" aria-hidden />

        {/* ══ HERO ══ */}
        <section className="v6-hero">
          <div className="v6-hbg">
            <HeroSlider slides={[
              { src:"/images-scraped/vila_corbeanca_exec_living_4.jpg",  pos:"center 40%" },
              { src:"/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", pos:"center 30%" },
              { src:"/images-scraped/Black_Pearl_01.jpg",                pos:"center center" },
              { src:"/images-scraped/apptown_exec_28.jpg",               pos:"center 20%" },
              { src:"/images-scraped/Mogosoaia_01.jpg",                  pos:"center 35%" },
            ]} intervalMs={5500} />
          </div>
          <div className="v6-hov" />
          <div className="v6-htitle">
            <span className="v6-mask"><span className="v6-mi">Mobilier</span></span>
            <span className="v6-mask"><span className="v6-mi"><em>premium</em></span></span>
          </div>
          <div className="v6-hcta">
            <Link href="/proiecte" className="v6-btn-p">Descoperă proiectele →</Link>
            <Link href="/contact" className="v6-btn-o">Solicită ofertă</Link>
          </div>
          <div className="v6-hstrip">
            <p className="v6-htagline">„Fiecare spațiu merită să devină o operă de artă — executată cu precizie."</p>
            <div className="v6-scroll">
              <span>Scroll</span>
              <div className="v6-sline" />
            </div>
          </div>
        </section>

        {/* ══ MARQUEE ══ */}
        <div className="v6-mq" aria-hidden>
          <div className="v6-mqt">
            {[...MQ,...MQ,...MQ].map((item,i)=>(
              <span key={i} className="v6-mqi"><span className="v6-mqs">✦</span> {item}</span>
            ))}
          </div>
        </div>

        {/* ══ SCROLL VIDEO ══ */}
        <ScrollVideoSection />

        {/* ══ STATS ══ */}
        <StatsSection />

        {/* ══ PROJECTS — desktop alternating ══ */}
        {PROJECTS.map((p,i)=>(
          <div key={i} className="v6-proj">
            <div className="v6-pimg" style={{clipPath:"inset(0 0 100% 0)"}}>
              <div className="v6-pimg-in">
                <Image src={p.img} alt={p.name} fill sizes="50vw"
                  style={{objectFit:"cover"}} unoptimized loading={i===0?"eager":"lazy"} />
              </div>
            </div>
            <div className="v6-pinfo">
              <div className="v6-pidx">{p.idx}</div>
              <div>
                <div className="v6-pcat">{p.cat}</div>
                <h2 className="v6-pname">{p.name}<br/><em>{p.em}</em></h2>
                <p className="v6-ploc">{p.loc}</p>
                <Link href={p.href} className="v6-pcta">Vezi proiectul →</Link>
              </div>
            </div>
          </div>
        ))}

        {/* ══ PROJECTS — mobile compact grid ══ */}
        <div className="v6-proj-mobile-grid">
          {PROJECTS.map((p,i)=>(
            <Link key={i} href={p.href} className="v6-pcard">
              <div className="v6-pcard-img" style={{clipPath:"inset(0 0 100% 0)"}}>
                <Image src={p.img} alt={p.name} fill sizes="50vw"
                  style={{objectFit:"cover"}} unoptimized loading={i<2?"eager":"lazy"} />
              </div>
              <div className="v6-pcard-info">
                <div className="v6-pcard-cat">{p.cat}</div>
                <div className="v6-pcard-name">{p.name} <em>{p.em}</em></div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{padding:"2rem 5vw",background:"var(--bg)",textAlign:"center"}}>
          <Link href="/proiecte" className="v6-btn-o">Toate proiectele →</Link>
        </div>

        {/* ══ HUMAN TOUCH ══ */}
        <section className="v6-human">
          <div className="v6-human-img" style={{clipPath:"inset(0 0 100% 0)"}}>
            <div className="v6-human-img-in">
              <Image src="/images-scraped/mobilier-premium-01.webp"
                alt="Atelier Moodilier" fill sizes="50vw"
                style={{objectFit:"cover"}} unoptimized />
            </div>
          </div>
          <div className="v6-human-text">
            <span className="v6-human-tag">Clienți care au ales Moodilier</span>
            <h2 className="v6-human-h">Spații trăite,<br/><em>nu doar admirate</em></h2>
            <div className="v6-testimonials">
              {TESTIMONIALS.map((t,i)=>(
                <div key={i} className="v6-testi">
                  <p className="v6-testi-q">{t.q}</p>
                  <span className="v6-testi-a">{t.a}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:"2rem"}}>
              <Link href="/proiecte" className="v6-btn-o">Vezi toate proiectele →</Link>
            </div>
          </div>
        </section>

        {/* ══ ABOUT ══ */}
        <section className="v6-about">
          <div className="v6-about-img" style={{clipPath:"inset(0 0 100% 0)"}}>
            <div className="v6-about-img-in">
              <Image src="/images-scraped/Mogosoaia_01.jpg"
                alt="Proiect Moodilier" fill sizes="50vw"
                style={{objectFit:"cover"}} unoptimized />
            </div>
          </div>
          <div className="v6-about-txt">
            <span className="v6-atag">Despre noi</span>
            <h2 className="v6-ah">10 ani de<br/><em>mobilier la comandă</em><br/>în București</h2>
            <p className="v6-ap">La Moodilier transformăm ideile de amenajare în piese premium la comandă, create pentru spații elegante, funcționale și atemporale.</p>
            <p className="v6-ap">Proiectăm, producem și montăm în atelierul propriu — de la bucătării și dressinguri până la spații comerciale complete.</p>
            <div className="v6-div" />
            <div className="v6-stats">
              {[["10+","Ani experiență"],["200+","Proiecte"],["100%","Execuție proprie"]].map(([n,l],i)=>(
                <div key={i}><div className="v6-sn">{n}</div><div className="v6-sl">{l}</div></div>
              ))}
            </div>
            <Link href="/despre-noi" className="v6-btn-o">Află mai multe →</Link>
          </div>
        </section>

        {/* ══ PROCESS ══ */}
        <section className="v6-proc">
          <div className="v6-proc-head">
            <span className="v6-proc-tag">Cum lucrăm</span>
            <h2 className="v6-proc-h">Etapele unui <em>proiect</em></h2>
          </div>
          <div className="v6-pgrid">
            {PROCESS.map((p,i)=>(
              <div key={i} className="v6-step" ref={el=>{stepRefs.current[i]=el;}} style={{transitionDelay:`${i*.07}s`}}>
                <div className="v6-snum">{p.s}</div>
                <div className="v6-stitle">{p.title}</div>
                <p className="v6-sdesc">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ QUOTE ══ */}
        <div className="v6-qblock">
          <div className="v6-qbg">
            <Image src="/images-scraped/apptown_exec_28.jpg" alt="" fill sizes="100vw"
              style={{objectFit:"cover"}} unoptimized aria-hidden />
          </div>
          <div className="v6-qov"/>
          <div className="v6-qcnt">
            <p className="v6-qt">„We are the furniture engineers — fiecare detaliu contează, fiecare spațiu spune o poveste."</p>
            <span className="v6-qa">Moodilier · București · Est. 2014</span>
          </div>
        </div>

        {/* ══ SERVICES ══ */}
        <section className="v6-svcs">
          <div className="v6-svcs-hd">
            <h2 className="v6-svcs-h">Servicii <em>oferite</em></h2>
            <span className="v6-svcs-t">Ce facem pentru tine</span>
          </div>
          <div className="v6-svc-grid">
            {([
              { n:"01", name:"Proiectare",        desc:"Concept, 3D, proiect tehnic",       img:"/images-scraped/proiectare.jpg" },
              { n:"02", name:"Mobilier La Comandă", desc:"Bucătării, dressinguri, livinguri",  img:"/images-scraped/buc_giurgiu_1.jpg" },
              { n:"03", name:"Spații Comerciale",   desc:"Office, recepții, showroom-uri",   img:"/images-scraped/executie_sediu-office15.jpg" },
              { n:"04", name:"Moodilier Store",     desc:"Import premium Italia & Danemarca", img:"/images-scraped/moodilier_store.jpg" },
              { n:"05", name:"Montaj",              desc:"Montaj profesionist la cheie",     img:"/images-scraped/montaj.jpg" },
              { n:"06", name:"Design Interior",     desc:"Consiliere rezidențial & comercial",img:"/images-scraped/living_01_.jpg" },
            ] as {n:string;name:string;desc:string;img:string}[]).map((s,i)=>(
              <div key={i} className="v6-svc-card"
                ref={el=>{svcRefs.current[i]=el;}}
                style={{opacity:0,transform:"translateY(16px)",transition:`opacity .6s ease ${i*.08}s,transform .6s cubic-bezier(.16,1,.3,1) ${i*.08}s`}}
              >
                <div className="v6-svc-card-bg">
                  <Image src={s.img} alt="" fill sizes="33vw" style={{objectFit:"cover"}} unoptimized />
                </div>
                <div className="v6-svc-card-body">
                  <span className="v6-svc-card-n">{s.n}</span>
                  <div className="v6-svc-card-name">{s.name}</div>
                  <div className="v6-svc-card-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center"}}>
            <Link href="/servicii" className="v6-btn-o">Toate serviciile →</Link>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="v6-cta">
          <div className="v6-cta-bg">
            <Image src="/images-scraped/Black_Pearl_01.jpg" alt="Contact Moodilier"
              fill sizes="100vw" style={{objectFit:"cover"}} unoptimized />
          </div>
          <div className="v6-cta-ov"/>
          <div className="v6-cta-cnt">
            <span className="v6-cta-tag">Hai să construim ceva frumos împreună</span>
            <h2 className="v6-cta-h">
              {["Viziunea ta.", "<em>Execuția</em>", "noastră."].map((line,i)=>(
                <div key={i} className="v6-mask">
                  <span className="v6-mi" style={{display:"block",transform:"translateY(110%)"}}
                    dangerouslySetInnerHTML={{__html:line}} />
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
          <span className="v6-flogo">MOODILIER</span>
          <span className="v6-fcopy">© 2025 SC Moodilier SRL · București</span>
          <nav className="v6-fnav">
            <Link href="/proiecte">Proiecte</Link>
            <Link href="/servicii">Servicii</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
