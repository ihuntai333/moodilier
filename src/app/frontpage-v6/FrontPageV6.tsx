"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

/* ══════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════ */
const STYLES = `
:root {
  --gold: #c9a984;
  --gold2: #e8d5b7;
  --bg: #0b0907;
  --bg2: #141210;
  --fg: #ede5da;
  --fg2: #7a6e62;
  --serif: 'Cormorant Garamond', serif;
  --sans: 'Inter', sans-serif;
}

.v6 { background: var(--bg); color: var(--fg); font-family: var(--sans); }
.v6 *, .v6 *::before, .v6 *::after { box-sizing: border-box; margin: 0; padding: 0; }
.v6 a { text-decoration: none; color: inherit; }

/* ─── CURSOR ───────────────────────────────────────────────── */
.v6-cursor {
  position: fixed; z-index: 9999; pointer-events: none;
  top: 0; left: 0;
  width: 10px; height: 10px;
  background: var(--gold);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width .35s, height .35s, background .35s, mix-blend-mode .35s;
  mix-blend-mode: normal;
  will-change: transform;
}
.v6-cursor.expand {
  width: 60px; height: 60px;
  background: rgba(201,169,132,.15);
  mix-blend-mode: screen;
}

/* ─── HERO ─────────────────────────────────────────────────── */
.v6-hero {
  position: relative; height: 100vh; overflow: hidden;
  display: flex; flex-direction: column;
  justify-content: flex-end;
}
.v6-hero__bg {
  position: absolute; inset: 0;
  will-change: transform;
}
.v6-hero__bg img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }
.v6-hero__ov {
  position: absolute; inset: 0;
  background: linear-gradient(
    160deg,
    rgba(11,9,7,.5) 0%,
    rgba(11,9,7,.1) 40%,
    rgba(11,9,7,.85) 100%
  );
}

/* Pre-header */
.v6-hero__pre {
  position: absolute; top: 2.4rem; left: 0; right: 0;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 5vw; z-index: 2;
}
.v6-hero__logo {
  font-family: var(--serif); font-size: 1.1rem; font-weight: 300;
  letter-spacing: .25em;
}
.v6-hero__nav {
  display: flex; gap: 2.5rem;
  font-size: .58rem; letter-spacing: .28em; text-transform: uppercase; color: var(--fg2);
}
.v6-hero__nav a:hover { color: var(--gold); }

/* Main title */
.v6-hero__title {
  position: relative; z-index: 2;
  padding: 0 5vw 4vh;
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(5rem, 14vw, 16rem);
  line-height: .85; letter-spacing: -.025em;
}
.v6-mask { overflow: hidden; display: block; }
.v6-mask-inner {
  display: block;
  transform: translateY(110%);
  /* will be animated by GSAP */
}
.v6-hero__title em { font-style: italic; color: var(--gold); }

/* Hero bottom strip */
.v6-hero__strip {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
  display: flex; justify-content: space-between; align-items: flex-end;
  padding: 2rem 5vw;
  border-top: 1px solid rgba(237,229,218,.08);
}
.v6-hero__tagline {
  font-family: var(--serif); font-style: italic;
  font-size: clamp(.9rem, 1.5vw, 1.2rem); color: rgba(237,229,218,.55);
  max-width: 340px; line-height: 1.5;
  opacity: 0; /* animated */
}
.v6-hero__scroll {
  display: flex; flex-direction: column; align-items: center; gap: .5rem;
  opacity: 0; /* animated */
}
.v6-hero__scroll-label {
  font-size: .5rem; letter-spacing: .45em; text-transform: uppercase; color: var(--gold);
  writing-mode: vertical-rl; transform: rotate(180deg);
}
.v6-hero__scroll-line {
  width: 1px; height: 56px; background: var(--gold);
  transform-origin: top; transform: scaleY(0);
  animation: v6LineGrow 1s cubic-bezier(.16,1,.3,1) 1.8s both;
  animation-iteration-count: infinite;
}
@keyframes v6LineGrow {
  0%,100% { transform: scaleY(0); transform-origin: top; }
  50%      { transform: scaleY(1); transform-origin: top; }
  50.001%  { transform-origin: bottom; }
}

/* ─── MARQUEE ──────────────────────────────────────────────── */
.v6-marquee {
  overflow: hidden; padding: 1.2rem 0;
  background: #0f0d0b;
  border-top: 1px solid rgba(201,169,132,.08);
  border-bottom: 1px solid rgba(201,169,132,.08);
}
.v6-marquee__track {
  display: flex; width: max-content;
  animation: v6Scroll 55s linear infinite;
}
@keyframes v6Scroll { to { transform: translateX(-33.333%); } }
.v6-marquee__item {
  display: inline-flex; align-items: center; gap: .8rem;
  padding: 0 3rem;
  font-family: var(--serif); font-style: italic;
  font-size: clamp(1rem, 2vw, 1.4rem); color: var(--fg2); white-space: nowrap;
}
.v6-marquee__sep { color: var(--gold); opacity: .5; font-style: normal; font-size: .7em; }

/* ─── PROJECTS ─────────────────────────────────────────────── */
.v6-projects { padding: 0; }
.v6-proj-item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 85vh;
  border-bottom: 1px solid rgba(237,229,218,.06);
  overflow: hidden;
}
.v6-proj-item:nth-child(even) { direction: rtl; }
.v6-proj-item:nth-child(even) > * { direction: ltr; }

/* Image side */
.v6-proj-img {
  position: relative; overflow: hidden;
  clip-path: inset(0 0 100% 0);
  /* animated by GSAP ScrollTrigger */
}
.v6-proj-img__inner {
  position: absolute; inset: -15% 0;
  /* extra height for parallax */
}
.v6-proj-img__inner img {
  width: 100%; height: 100%; object-fit: cover;
}

/* Text side */
.v6-proj-info {
  padding: 6vw 5vw;
  display: flex; flex-direction: column; justify-content: flex-end;
  background: var(--bg);
}
.v6-proj-index {
  font-family: var(--serif);
  font-size: clamp(4rem, 8vw, 9rem);
  font-weight: 300; color: rgba(201,169,132,.08);
  line-height: 1; margin-bottom: auto;
}
.v6-proj-cat {
  font-size: .55rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 1.2rem;
}
.v6-proj-name {
  font-family: var(--serif);
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 300; line-height: .95;
  letter-spacing: -.02em; margin-bottom: 1rem;
}
.v6-proj-name em { font-style: italic; color: var(--gold); }
.v6-proj-loc {
  font-size: .7rem; color: var(--fg2); letter-spacing: .1em;
  margin-bottom: 2.5rem;
}
.v6-proj-link {
  display: inline-flex; align-items: center; gap: .6rem;
  font-size: .6rem; letter-spacing: .3em; text-transform: uppercase;
  color: var(--fg);
  padding-bottom: .4rem;
  border-bottom: 1px solid rgba(237,229,218,.2);
  transition: color .3s, border-color .3s, gap .3s;
  width: fit-content;
}
.v6-proj-link:hover { color: var(--gold); border-color: var(--gold); gap: 1rem; }

/* ─── ABOUT ────────────────────────────────────────────────── */
.v6-about {
  padding: clamp(6rem, 12vw, 14rem) 8vw;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 8vw; align-items: end;
}
.v6-about__quote {
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(1.8rem, 3.5vw, 3.8rem);
  line-height: 1.2; letter-spacing: -.015em;
}
.v6-about__quote em { font-style: italic; color: var(--gold); }
.v6-about__right {}
.v6-about__body {
  font-size: .82rem; line-height: 1.9; color: var(--fg2);
  margin-bottom: 3rem; max-width: 44ch;
}
.v6-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(201,169,132,.08); }
.v6-stat { background: var(--bg); padding: 2rem 1.5rem; text-align: center; }
.v6-stat__n {
  font-family: var(--serif); font-size: clamp(2.5rem, 4vw, 4rem);
  font-weight: 300; color: var(--gold); line-height: 1;
}
.v6-stat__l {
  font-size: .5rem; letter-spacing: .28em; text-transform: uppercase;
  color: var(--fg2); margin-top: .4rem;
}

/* ─── SERVICES ─────────────────────────────────────────────── */
.v6-services { background: var(--bg2); padding: clamp(5rem, 10vw, 12rem) 8vw; }
.v6-services__head {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 5rem; padding-bottom: 2rem;
  border-bottom: 1px solid rgba(237,229,218,.07);
}
.v6-services__title {
  font-family: var(--serif); font-size: clamp(2rem, 4vw, 4rem); font-weight: 300;
}
.v6-services__title em { font-style: italic; color: var(--gold); }
.v6-services__tag {
  font-size: .55rem; letter-spacing: .4em; text-transform: uppercase; color: var(--gold);
}
.v6-svc-row {
  display: grid; grid-template-columns: 2fr 4fr 2fr;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(237,229,218,.07);
  align-items: baseline;
  opacity: 0; transform: translateY(30px);
  transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
}
.v6-svc-row.in { opacity: 1; transform: none; }
.v6-svc-num { font-family: var(--serif); font-size: 1rem; color: rgba(201,169,132,.3); }
.v6-svc-name { font-family: var(--serif); font-size: clamp(1.3rem, 2vw, 2rem); font-weight: 300; }
.v6-svc-desc { font-size: .75rem; line-height: 1.7; color: var(--fg2); text-align: right; }

/* ─── CTA ──────────────────────────────────────────────────── */
.v6-cta {
  position: relative; height: 90vh; overflow: hidden;
  display: grid; place-items: center;
}
.v6-cta__bg { position: absolute; inset: 0; }
.v6-cta__bg img { width: 100%; height: 100%; object-fit: cover; }
.v6-cta__ov {
  position: absolute; inset: 0;
  background: rgba(8,6,4,.68);
}
.v6-cta__cnt {
  position: relative; z-index: 1;
  text-align: center; max-width: 900px; padding: 2rem;
}
.v6-cta__tag {
  display: block; font-size: .58rem; letter-spacing: .5em;
  text-transform: uppercase; color: var(--gold); margin-bottom: 2.5rem;
}
.v6-cta__h {
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(3rem, 8vw, 9rem);
  line-height: .88; letter-spacing: -.03em; margin-bottom: 3rem;
}
.v6-cta__h em { font-style: italic; color: var(--gold); }
.v6-cta__btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.v6-btn-p {
  padding: 1rem 2.4rem; background: var(--gold); color: var(--bg);
  font-size: .62rem; letter-spacing: .2em; text-transform: uppercase;
  transition: background .3s;
}
.v6-btn-p:hover { background: var(--gold2); }
.v6-btn-o {
  padding: 1rem 2.4rem; border: 1px solid rgba(201,169,132,.3);
  color: var(--gold); font-size: .62rem; letter-spacing: .2em;
  text-transform: uppercase; transition: all .3s;
}
.v6-btn-o:hover { background: var(--gold); color: var(--bg); }

/* ─── FOOTER ───────────────────────────────────────────────── */
.v6-footer {
  background: #050403; padding: 2.5rem 5vw;
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid rgba(201,169,132,.06);
}
.v6-footer__logo { font-family: var(--serif); font-size: 1.1rem; font-weight: 300; letter-spacing: .25em; color: var(--fg2); }
.v6-footer__copy { font-size: .52rem; color: rgba(237,229,218,.18); letter-spacing: .1em; }
.v6-footer__nav { display: flex; gap: 2rem; font-size: .52rem; letter-spacing: .2em; text-transform: uppercase; color: var(--fg2); }
.v6-footer__nav a:hover { color: var(--gold); }

@media (max-width: 900px) {
  .v6-proj-item { grid-template-columns: 1fr; direction: ltr !important; }
  .v6-proj-item:nth-child(even) > * { direction: ltr; }
  .v6-proj-img { height: 55vw; clip-path: inset(0 0 100% 0); }
  .v6-about { grid-template-columns: 1fr; gap: 3rem; }
  .v6-services__head { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .v6-svc-row { grid-template-columns: 1fr; gap: .5rem; }
  .v6-svc-desc { text-align: left; }
  .v6-footer { flex-direction: column; gap: 1.5rem; text-align: center; }
  .v6-hero__nav { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .v6-hero__scroll-line { animation: none; transform: scaleY(1); }
}
`;

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    index: "01", cat: "Rezidențial", loc: "Ilfov · 2024",
    name: "Vila", nameEm: "Cosmopolis",
    img: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg",
    href: "/proiecte/executie_vila-cosmopolis",
  },
  {
    index: "02", cat: "Rezidențial", loc: "Ilfov · 2023",
    name: "Casa", nameEm: "Mogoșoaia",
    img: "/images-scraped/Mogosoaia_01.jpg",
    href: "/proiecte/executie_casa-mogosoaia",
  },
  {
    index: "03", cat: "Comercial", loc: "București · 2024",
    name: "Sediu", nameEm: "Corporate",
    img: "/images-scraped/carusel_office.jpg",
    href: "/proiecte/executie_sediu-office",
  },
];

const SERVICES = [
  { num: "01", name: "Servicii de proiectare", desc: "Concept, vizualizări 3D și proiectare tehnică completă" },
  { num: "02", name: "Mobilier la comandă", desc: "Bucătării, dressinguri, livinguri, dormitoare" },
  { num: "03", name: "Spații comerciale", desc: "Office, recepții, showroom-uri, retail" },
  { num: "04", name: "Moodilier Store", desc: "Import premium din Italia și Danemarca" },
  { num: "05", name: "Montaj profesionist", desc: "Montaj precis și verificare finală impecabilă" },
  { num: "06", name: "Design interior",    desc: "Consiliere completă pentru proiecte rezidențiale" },
];

const MARQUEE_ITEMS = ["Mobilier Premium", "Design Interior", "La Comandă", "Bucătării", "Dressinguri", "Livinguri", "Dormitoare", "Spații Comerciale"];

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function FrontPageV6() {
  const cursorRef   = useRef<HTMLDivElement>(null);
  const heroRef     = useRef<HTMLElement>(null);
  const projRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const svcRefs     = useRef<(HTMLDivElement | null)[]>([]);

  /* ── Cursor ── */
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    let cx = 0, cy = 0, tx = 0, ty = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const onEnter = () => cursor.classList.add("expand");
    const onLeave = () => cursor.classList.remove("expand");

    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursor.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
      raf = requestAnimationFrame(tick);
    };

    const hoverEls = document.querySelectorAll("a, button");
    hoverEls.forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── Lenis + GSAP ── */
  useEffect(() => {
    let lenis: InstanceType<typeof import("lenis").default> | null = null;
    let rafId = 0;

    const init = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      /* ── Init Lenis ── */
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      const onLenisScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onLenisScroll);
      gsap.ticker.add((time: number) => lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      /* ─────────────────────────────────────────────────────────
         HERO ANIMATIONS
      ───────────────────────────────────────────────────────── */
      const heroInners = document.querySelectorAll<HTMLElement>(".v6-mask-inner");
      gsap.to(heroInners, {
        y: "0%",
        duration: 1.3,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.25,
      });

      gsap.to(".v6-hero__tagline", { opacity: 1, duration: 1, delay: 0.9, ease: "power2.out" });
      gsap.to(".v6-hero__scroll",  { opacity: 1, duration: 1, delay: 1.1, ease: "power2.out" });

      /* Hero bg parallax */
      const heroBg = document.querySelector<HTMLElement>(".v6-hero__bg");
      if (heroBg) {
        gsap.to(heroBg, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: ".v6-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* ─────────────────────────────────────────────────────────
         PROJECT REVEALS
      ───────────────────────────────────────────────────────── */
      document.querySelectorAll<HTMLElement>(".v6-proj-img").forEach((imgWrap) => {
        /* Clip-path reveal */
        gsap.to(imgWrap, {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: imgWrap,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });

        /* Inner parallax */
        const inner = imgWrap.querySelector<HTMLElement>(".v6-proj-img__inner");
        if (inner) {
          gsap.fromTo(inner, { yPercent: -8 }, {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: imgWrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });

      /* Project text reveals */
      document.querySelectorAll<HTMLElement>(".v6-proj-info").forEach((info) => {
        gsap.from(info.querySelectorAll(".v6-proj-cat, .v6-proj-name, .v6-proj-loc, .v6-proj-link"), {
          opacity: 0,
          y: 24,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: info,
            start: "top 78%",
          },
        });
      });

      /* ─────────────────────────────────────────────────────────
         ABOUT QUOTE — line-by-line
      ───────────────────────────────────────────────────────── */
      const aboutLines = document.querySelectorAll<HTMLElement>(".v6-about .v6-mask-inner");
      gsap.to(aboutLines, {
        y: "0%",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".v6-about",
          start: "top 70%",
        },
      });
      gsap.from(".v6-about__body, .v6-stats", {
        opacity: 0, y: 30, duration: 1, stagger: .2, ease: "power2.out",
        scrollTrigger: { trigger: ".v6-about__right", start: "top 75%" },
      });

      /* ─────────────────────────────────────────────────────────
         SERVICES
      ───────────────────────────────────────────────────────── */
      document.querySelectorAll<HTMLElement>(".v6-svc-row").forEach((row, i) => {
        gsap.to(row, {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 88%" },
          delay: i * 0.04,
        });
      });

      /* ─────────────────────────────────────────────────────────
         CTA
      ───────────────────────────────────────────────────────── */
      const ctaMasks = document.querySelectorAll<HTMLElement>(".v6-cta .v6-mask-inner");
      gsap.to(ctaMasks, {
        y: "0%", duration: 1.2, ease: "power3.out", stagger: .1,
        scrollTrigger: { trigger: ".v6-cta", start: "top 65%" },
      });
      gsap.from(".v6-cta__tag, .v6-cta__btns", {
        opacity: 0, y: 20, duration: .9, stagger: .15, ease: "power2.out",
        scrollTrigger: { trigger: ".v6-cta", start: "top 65%" },
      });

      /* CTA bg parallax */
      const ctaBg = document.querySelector<HTMLElement>(".v6-cta__bg");
      if (ctaBg) {
        gsap.fromTo(ctaBg, { yPercent: -10 }, {
          yPercent: 10, ease: "none",
          scrollTrigger: { trigger: ".v6-cta", start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      ScrollTrigger.refresh();
    };

    init();

    return () => {
      cancelAnimationFrame(rafId);
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.killAll());
      lenis?.destroy();
    };
  }, []);

  /* ── Services IntersectionObserver fallback ── */
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("in"); obs.unobserve(e.target); }});
    }, { threshold: 0.1 });
    svcRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="v6" style={{ cursor: "none" }}>

        {/* Custom cursor */}
        <div ref={cursorRef} className="v6-cursor" aria-hidden />

        {/* ═══ HERO ═══ */}
        <section className="v6-hero" ref={heroRef}>
          <div className="v6-hero__bg">
            <Image
              src="/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
              alt="Moodilier — Mobilier Premium"
              fill sizes="100vw" priority quality={90}
              style={{ objectFit: "cover", objectPosition: "center 30%" }}
            />
          </div>
          <div className="v6-hero__ov" />

          {/* Nav */}
          <div className="v6-hero__pre">
            <span className="v6-hero__logo">MOODILIER</span>
            <nav className="v6-hero__nav">
              <Link href="/proiecte">Proiecte</Link>
              <Link href="/servicii">Servicii</Link>
              <Link href="/despre-noi">Despre noi</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>

          {/* Big title */}
          <div className="v6-hero__title">
            <span className="v6-mask">
              <span className="v6-mask-inner">Mobilier</span>
            </span>
            <span className="v6-mask">
              <span className="v6-mask-inner"><em>premium</em></span>
            </span>
            <span className="v6-mask">
              <span className="v6-mask-inner" style={{ fontSize: ".38em", fontFamily: "var(--sans)", letterSpacing: ".35em", textTransform: "uppercase", color: "var(--fg2)" }}>
                la comandă · București
              </span>
            </span>
          </div>

          {/* Strip */}
          <div className="v6-hero__strip">
            <p className="v6-hero__tagline">
              „Fiecare spațiu merită să devină o operă de artă — executată cu precizie și trăită cu bucurie."
            </p>
            <div className="v6-hero__scroll">
              <span className="v6-hero__scroll-label">Scroll</span>
              <div className="v6-hero__scroll-line" />
            </div>
          </div>
        </section>

        {/* ═══ MARQUEE ═══ */}
        <div className="v6-marquee" aria-hidden>
          <div className="v6-marquee__track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="v6-marquee__item">
                <span className="v6-marquee__sep">✦</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ PROJECTS ═══ */}
        <section className="v6-projects">
          {PROJECTS.map((p, i) => (
            <div key={i} className="v6-proj-item" ref={el => { projRefs.current[i] = el; }}>
              <div className="v6-proj-img" style={{ clipPath: "inset(0 0 100% 0)" }}>
                <div className="v6-proj-img__inner">
                  <Image src={p.img} alt={p.name} fill sizes="50vw" style={{ objectFit: "cover" }} unoptimized loading={i === 0 ? "eager" : "lazy"} />
                </div>
              </div>
              <div className="v6-proj-info">
                <div className="v6-proj-index">{p.index}</div>
                <div>
                  <div className="v6-proj-cat">{p.cat}</div>
                  <h2 className="v6-proj-name">{p.name}<br /><em>{p.nameEm}</em></h2>
                  <p className="v6-proj-loc">{p.loc}</p>
                  <Link href={p.href} className="v6-proj-link">
                    Vezi proiectul →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ═══ ABOUT ═══ */}
        <section className="v6-about">
          <div className="v6-about__quote">
            {["La Moodilier,", "mobilierul premium", "înseamnă mai mult", "decât execuție —", "înseamnă <em>identitate</em>."].map((line, i) => (
              <div key={i} className="v6-mask">
                <span className="v6-mask-inner" style={{ display: "block", transform: "translateY(110%)" }}
                  dangerouslySetInnerHTML={{ __html: line }} />
              </div>
            ))}
          </div>
          <div className="v6-about__right">
            <p className="v6-about__body">
              Cu peste 10 ani de experiență în producția de mobilier la comandă și amenajări interioare premium,
              am dezvoltat un proces complet care îmbină designul contemporan, precizia tehnică și atenția
              impecabilă la detalii. Fiecare proiect este unic — creat pentru tine, executat de noi.
            </p>
            <div className="v6-stats">
              {[["10+", "Ani experiență"], ["200+", "Proiecte"], ["100%", "Execuție proprie"]].map(([n, l], i) => (
                <div key={i} className="v6-stat">
                  <div className="v6-stat__n">{n}</div>
                  <div className="v6-stat__l">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SERVICES ═══ */}
        <section className="v6-services">
          <div className="v6-services__head">
            <h2 className="v6-services__title">Servicii <em>oferite</em></h2>
            <span className="v6-services__tag">Ce facem pentru tine</span>
          </div>
          {SERVICES.map((s, i) => (
            <div key={i} className="v6-svc-row" ref={el => { svcRefs.current[i] = el; }}
              style={{ transitionDelay: `${i * 0.06}s` }}>
              <span className="v6-svc-num">{s.num}</span>
              <span className="v6-svc-name">{s.name}</span>
              <span className="v6-svc-desc">{s.desc}</span>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <Link href="/servicii" className="v6-btn-o">Descoperă toate serviciile →</Link>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="v6-cta">
          <div className="v6-cta__bg">
            <Image src="/images-scraped/vila_corbeanca_exec_living_4.jpg"
              alt="Contact Moodilier" fill sizes="100vw" style={{ objectFit: "cover" }} unoptimized />
          </div>
          <div className="v6-cta__ov" />
          <div className="v6-cta__cnt">
            <span className="v6-cta__tag">Hai să construim ceva frumos împreună</span>
            <h2 className="v6-cta__h">
              {["Viziunea ta.", "<em>Execuția</em>", "noastră."].map((line, i) => (
                <div key={i} className="v6-mask">
                  <span className="v6-mask-inner" style={{ display: "block", transform: "translateY(110%)" }}
                    dangerouslySetInnerHTML={{ __html: line }} />
                </div>
              ))}
            </h2>
            <div className="v6-cta__btns">
              <Link href="/contact" className="v6-btn-p">Solicită ofertă gratuită →</Link>
              <Link href="/proiecte" className="v6-btn-o">Descoperă portofoliul</Link>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="v6-footer">
          <span className="v6-footer__logo">MOODILIER</span>
          <span className="v6-footer__copy">© 2025 SC Moodilier SRL · București</span>
          <nav className="v6-footer__nav">
            <Link href="/proiecte">Proiecte</Link>
            <Link href="/servicii">Servicii</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/">← Principal</Link>
          </nav>
        </footer>

      </div>
    </>
  );
}
