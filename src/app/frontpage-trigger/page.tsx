"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */
const PROJECTS = [
  { idx: "01", title: "Vila Cosmopolis",    cat: "Rezidențial", year: "2024", img: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href: "/proiecte/executie_vila-cosmopolis" },
  { idx: "02", title: "Apt. Black Pearl",   cat: "Rezidențial", year: "2023", img: "/images-scraped/Black_Pearl_01.jpg",                           href: "/proiecte/executie_apt-mamaia-nord" },
  { idx: "03", title: "Casa Mogoșoaia",     cat: "Rezidențial", year: "2023", img: "/images-scraped/Mogosoaia_01.jpg",                             href: "/proiecte/executie_casa-mogosoaia" },
  { idx: "04", title: "Apt. Olimp",         cat: "Rezidențial", year: "2023", img: "/images-scraped/Olimp_03.jpg",                                 href: "/proiecte/executie_apt-olimp" },
  { idx: "05", title: "Vila Corbeanca",     cat: "Rezidențial", year: "2024", img: "/images-scraped/vila_corbeanca_exec_living_4.jpg",              href: "/proiecte" },
  { idx: "06", title: "AppTown North",      cat: "Rezidențial", year: "2023", img: "/images-scraped/apptown_exec_28.jpg",                          href: "/proiecte/executie_apptown-north" },
];

const MQ_ITEMS = ["Mobilier Premium","Design Interior","La Comandă","Execuție Proprie","Bucătării","Dressinguri","Livinguri","Spații Comerciale"];

/* ─────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0a0908;--bg2:#0f0e0d;--fg:#ede5da;--fg2:#6b645c;--fg3:#3a3530;
  --gold:#c9a984;--gold2:#e8d5b7;
  --serif:'Cormorant Garamond',serif;--sans:'Inter',sans-serif;
  --ease-out:cubic-bezier(0.16,1,0.3,1);
}
.tg{background:var(--bg);color:var(--fg);font-family:var(--sans);overflow-x:hidden;min-height:100vh;}
.tg a{text-decoration:none;color:inherit;}
.tg *{cursor:none;}
@media(hover:none),(pointer:coarse){.tg *{cursor:auto!important;}.tg-cur{display:none!important;}}

/* ── CURSOR ── */
.tg-cur{
  position:fixed;top:0;left:0;z-index:9000;pointer-events:none;
  width:10px;height:10px;border-radius:50%;background:var(--gold);
  transform:translate(-50%,-50%);transition:width .3s,height .3s,opacity .3s;
  will-change:left,top;
}
.tg-cur.expand{width:60px;height:60px;background:rgba(201,169,132,.12);}
.tg-cur.text::after{
  content:'VER';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  font-family:var(--sans);font-size:.38rem;letter-spacing:.22em;color:var(--gold);
  opacity:1;
}
.tg-cur.text{width:56px;height:56px;background:rgba(201,169,132,.08);border:1px solid rgba(201,169,132,.3);}

/* ── NAV ── */
.tg-nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  padding:1.6rem 3vw;
  display:flex;justify-content:space-between;align-items:center;
  mix-blend-mode:difference;
}
.tg-nav-logo{
  font-family:var(--serif);font-weight:300;letter-spacing:.25em;
  font-size:clamp(.8rem,1.5vw,1rem);text-transform:uppercase;color:#fff;
}
.tg-nav-links{display:flex;gap:2.5rem;font-size:.52rem;letter-spacing:.28em;text-transform:uppercase;color:rgba(255,255,255,.6);}
.tg-nav-links a:hover{color:#fff;}

/* ── HERO ── */
.tg-hero{
  min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;
  padding:0 3vw 2.5rem;position:relative;overflow:hidden;
}
.tg-hero-bg{position:absolute;inset:0;}
.tg-hero-bg img{width:100%;height:100%;object-fit:cover;object-position:center 40%;transform:scale(1.04);}
.tg-hero-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,9,8,1) 0%,rgba(10,9,8,.35) 55%,rgba(10,9,8,.1) 100%);}

.tg-hero-title{
  font-family:var(--serif);font-weight:300;
  font-size:clamp(4rem,14vw,16rem);
  line-height:.86;letter-spacing:-.03em;
  position:relative;z-index:1;
  overflow:hidden;
}
.tg-hero-line{display:block;overflow:hidden;}
.tg-hero-word{display:inline-block;transform:translateY(112%);will-change:transform;}
.tg-hero-word em{font-style:italic;color:var(--gold);}

.tg-hero-strip{
  position:relative;z-index:1;margin-top:1.5rem;
  display:flex;justify-content:space-between;align-items:flex-end;
  padding-top:1.2rem;border-top:1px solid rgba(255,255,255,.08);
}
.tg-hero-sub{
  font-size:.6rem;letter-spacing:.32em;text-transform:uppercase;color:rgba(237,229,218,.45);
  max-width:26ch;line-height:1.7;
}
.tg-hero-cta{display:flex;gap:.8rem;align-items:center;}
.tg-btn-gold{
  padding:.9rem 2.2rem;background:var(--gold);color:var(--bg);
  font-size:.56rem;letter-spacing:.22em;text-transform:uppercase;
  transition:background .3s;white-space:nowrap;
}
.tg-btn-gold:hover{background:var(--gold2);}
.tg-btn-ghost{
  padding:.9rem 2.2rem;border:1px solid rgba(201,169,132,.3);
  color:var(--gold);font-size:.56rem;letter-spacing:.22em;text-transform:uppercase;
  transition:all .3s;white-space:nowrap;
}
.tg-btn-ghost:hover{background:var(--gold);color:var(--bg);}

/* ── MARQUEE ── */
.tg-mq{
  overflow:hidden;padding:.9rem 0;background:var(--bg2);
  border-top:1px solid var(--fg3);border-bottom:1px solid var(--fg3);
}
.tg-mqt{display:flex;width:max-content;animation:tgMq 40s linear infinite;}
@keyframes tgMq{to{transform:translateX(-50%);}}
.tg-mqi{
  display:inline-flex;align-items:center;gap:.65rem;padding:0 2rem;
  font-family:var(--serif);font-style:italic;font-size:clamp(.85rem,1.4vw,1.1rem);
  color:var(--fg2);white-space:nowrap;
}
.tg-mqs{color:var(--gold);opacity:.4;font-style:normal;font-size:.55em;}

/* ── PROJECT LIST ── */
.tg-works{padding:0 3vw;background:var(--bg);}
.tg-works-head{
  padding:4rem 0 2rem;
  display:flex;justify-content:space-between;align-items:baseline;
  border-bottom:1px solid var(--fg3);
}
.tg-works-title{font-family:var(--serif);font-size:clamp(1.4rem,2.5vw,2.2rem);font-weight:300;color:var(--fg2);}
.tg-works-count{font-size:.48rem;letter-spacing:.32em;text-transform:uppercase;color:var(--fg2);}

.tg-proj-row{
  display:grid;grid-template-columns:3.5rem 1fr auto;
  align-items:center;gap:0 2rem;
  padding:1.8rem 0;border-bottom:1px solid var(--fg3);
  position:relative;overflow:hidden;
  transition:border-color .35s;
}
.tg-proj-row::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:0;
  background:var(--gold);opacity:.06;transition:width .6s var(--ease-out);
}
.tg-proj-row:hover::before{width:100%;}
.tg-proj-row:hover{border-bottom-color:rgba(201,169,132,.3);}

.tg-proj-idx{
  font-family:var(--serif);font-size:.75rem;color:rgba(201,169,132,.25);
  letter-spacing:.08em;transition:color .3s;
}
.tg-proj-row:hover .tg-proj-idx{color:var(--gold);}

.tg-proj-name{
  font-family:var(--serif);font-weight:300;
  font-size:clamp(1.8rem,4vw,4rem);
  line-height:1;letter-spacing:-.02em;
  transition:color .3s, transform .4s var(--ease-out);
  will-change:transform;
}
.tg-proj-row:hover .tg-proj-name{color:var(--fg);transform:translateX(.5rem);}

.tg-proj-meta{
  display:flex;flex-direction:column;align-items:flex-end;gap:.3rem;
  opacity:0;transform:translateX(8px);
  transition:opacity .4s,transform .4s var(--ease-out);
}
.tg-proj-row:hover .tg-proj-meta{opacity:1;transform:none;}
.tg-proj-cat{font-size:.48rem;letter-spacing:.32em;text-transform:uppercase;color:var(--gold);}
.tg-proj-yr{font-size:.48rem;letter-spacing:.18em;color:var(--fg2);}

/* ── FLOATING PREVIEW ── */
.tg-preview{
  position:fixed;top:0;left:0;z-index:50;
  width:clamp(220px,22vw,380px);
  aspect-ratio:4/3;
  pointer-events:none;
  transform:translate(-50%,-50%);
  will-change:left,top;
  opacity:0;
  transition:opacity .4s,transform .4s var(--ease-out);
  clip-path:inset(100% 0 0 0);
}
.tg-preview.visible{
  opacity:1;
  clip-path:inset(0 0 0 0);
}

/* ── ABOUT / STATEMENT ── */
.tg-statement{
  padding:clamp(5rem,10vw,12rem) 3vw;background:var(--bg);
  border-top:1px solid var(--fg3);
}
.tg-statement-q{
  font-family:var(--serif);font-style:italic;font-weight:300;
  font-size:clamp(2rem,4.5vw,5.5rem);
  line-height:1.1;letter-spacing:-.02em;
  max-width:18ch;margin-bottom:4rem;
  overflow:hidden;
}
.tg-statement-word{display:inline-block;transform:translateY(110%);}

.tg-stats-row{display:flex;gap:4rem;flex-wrap:wrap;border-top:1px solid var(--fg3);padding-top:2.5rem;}
.tg-stat-num{font-family:var(--serif);font-size:clamp(2.5rem,5vw,5rem);font-weight:300;color:var(--gold);line-height:1;}
.tg-stat-lbl{font-size:.48rem;letter-spacing:.32em;text-transform:uppercase;color:var(--fg2);margin-top:.4rem;}

/* ── CTA ── */
.tg-cta{
  position:relative;min-height:80vh;display:flex;align-items:center;
  overflow:hidden;border-top:1px solid var(--fg3);
}
.tg-cta-bg{position:absolute;inset:0;}
.tg-cta-bg img{width:100%;height:100%;object-fit:cover;}
.tg-cta-ov{position:absolute;inset:0;background:rgba(10,9,8,.72);}
.tg-cta-inner{
  position:relative;z-index:1;padding:3vw;
  max-width:80vw;
}
.tg-cta-tag{font-size:.52rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:2rem;}
.tg-cta-h{
  font-family:var(--serif);font-weight:300;
  font-size:clamp(3rem,9vw,11rem);
  line-height:.86;letter-spacing:-.03em;
  margin-bottom:3rem;overflow:hidden;
}
.tg-cta-hl{display:block;overflow:hidden;}
.tg-cta-hw{display:inline-block;transform:translateY(110%);}
.tg-cta-hw em{font-style:italic;color:var(--gold);}

/* ── FOOTER strip ── */
.tg-foot{
  padding:1.8rem 3vw;background:var(--bg2);
  display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid var(--fg3);flex-wrap:wrap;gap:1rem;
}
.tg-foot-logo{font-family:var(--serif);font-size:.85rem;font-weight:300;letter-spacing:.25em;color:var(--fg2);}
.tg-foot-copy{font-size:.44rem;letter-spacing:.12em;color:rgba(237,229,218,.15);}
.tg-foot-nav{display:flex;gap:1.8rem;font-size:.44rem;letter-spacing:.18em;text-transform:uppercase;color:var(--fg2);}
.tg-foot-nav a:hover{color:var(--gold);}

/* ── RESPONSIVE ── */
@media(max-width:768px){
  .tg-nav-links{display:none;}
  .tg-hero-title{font-size:clamp(3.2rem,18vw,7rem);}
  .tg-proj-row{grid-template-columns:2.5rem 1fr;}
  .tg-proj-meta{display:none;}
  .tg-stats-row{gap:2.5rem;}
  .tg-cta-h{font-size:clamp(2.5rem,12vw,5rem);}
}
@media(prefers-reduced-motion:reduce){
  .tg-hero-word,.tg-statement-word,.tg-cta-hw{transform:none!important;}
  .tg-mqt{animation:none;}
}
`;

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────── */
export default function FrontPageTrigger() {
  const cursorRef   = useRef<HTMLDivElement>(null);
  const previewRef  = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  /* ── Cursor + preview follow ── */
  useEffect(() => {
    const cur = cursorRef.current;
    const prv = previewRef.current;
    if (!cur || window.matchMedia("(hover:none)").matches) return;

    let raf = 0;
    let mx = 0, my = 0, cx = 0, cy = 0;
    let px = 0, py = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      cx = lerp(cx, mx, 0.13);
      cy = lerp(cy, my, 0.13);
      cur.style.left = cx + "px";
      cur.style.top  = cy + "px";

      if (prv) {
        px = lerp(px, mx, 0.08);
        py = lerp(py, my, 0.08);
        prv.style.left = px + "px";
        prv.style.top  = py + "px";
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── GSAP entrance ── */
  useEffect(() => {
    let dead = false;
    const boot = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);

      // Hero words
      gsap.to(".tg-hero-word", {
        y: "0%", duration: 1.2, ease: "power3.out",
        stagger: 0.14, delay: 0.1,
      });

      // Hero strip fade
      gsap.from(".tg-hero-strip > *", {
        opacity: 0, y: 16, duration: .9, ease: "power2.out",
        stagger: .12, delay: 0.9,
      });

      // Project rows stagger
      gsap.from(".tg-proj-row", {
        opacity: 0, y: 24, duration: .8, ease: "power2.out",
        stagger: .06,
        scrollTrigger: { trigger: ".tg-works", start: "top 82%" },
      });

      // Statement words
      gsap.to(".tg-statement-word", {
        y: "0%", duration: 1.1, ease: "power3.out",
        stagger: 0.04,
        scrollTrigger: { trigger: ".tg-statement-q", start: "top 78%" },
      });

      // Stats
      gsap.from(".tg-stat-num", {
        opacity: 0, y: 30, duration: .9, ease: "power2.out", stagger: .1,
        scrollTrigger: { trigger: ".tg-stats-row", start: "top 85%" },
      });

      // CTA words
      gsap.to(".tg-cta-hw", {
        y: "0%", duration: 1.1, ease: "power3.out", stagger: .1,
        scrollTrigger: { trigger: ".tg-cta", start: "top 72%" },
      });

      ScrollTrigger.refresh();
    };
    boot();
    return () => {
      dead = true;
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.killAll());
    };
  }, []);

  const onRowEnter = useCallback((i: number) => {
    setHoveredIdx(i);
    const prv = previewRef.current;
    if (prv) prv.classList.add("visible");
    const cur = cursorRef.current;
    if (cur) cur.classList.add("text");
  }, []);

  const onRowLeave = useCallback(() => {
    setHoveredIdx(null);
    const prv = previewRef.current;
    if (prv) prv.classList.remove("visible");
    const cur = cursorRef.current;
    if (cur) cur.classList.remove("text");
  }, []);

  /* Split statement text into animated words */
  const stmtWords = "Mobilier care nu se cumpără — se trăiește.".split(" ");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: S }} />
      <div className="tg">

        {/* ── CUSTOM CURSOR ── */}
        <div className="tg-cur" ref={cursorRef} aria-hidden />

        {/* ── FLOATING PREVIEW ── */}
        <div className="tg-preview" ref={previewRef} aria-hidden>
          {hoveredIdx !== null && (
            <Image
              src={PROJECTS[hoveredIdx].img}
              alt=""
              fill
              sizes="380px"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          )}
        </div>

        {/* ── NAV ── */}
        <nav className="tg-nav">
          <Link href="/" className="tg-nav-logo">Moodilier</Link>
          <div className="tg-nav-links">
            <Link href="/proiecte">Proiecte</Link>
            <Link href="/servicii">Servicii</Link>
            <Link href="/despre-noi">Despre noi</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="tg-hero">
          <div className="tg-hero-bg">
            <Image
              src="/images-scraped/vila_cosmopolis_exec_living_4.jpg"
              alt="Moodilier — Mobilier Premium"
              fill sizes="100vw" priority quality={90}
              style={{ objectFit: "cover", objectPosition: "center 35%" }}
            />
          </div>
          <div className="tg-hero-ov" />

          <div className="tg-hero-title">
            <span className="tg-hero-line">
              <span className="tg-hero-word">Mobilier</span>
            </span>
            <span className="tg-hero-line">
              <span className="tg-hero-word"><em>la comandă</em></span>
            </span>
            <span className="tg-hero-line">
              <span className="tg-hero-word" style={{ color: "rgba(237,229,218,.22)" }}>București</span>
            </span>
          </div>

          <div className="tg-hero-strip">
            <p className="tg-hero-sub">
              Atelier propriu · Design contemporan<br />
              Execuție impecabilă · 10+ ani experiență
            </p>
            <div className="tg-hero-cta">
              <Link href="/proiecte" className="tg-btn-gold">Proiecte →</Link>
              <Link href="/contact" className="tg-btn-ghost">Solicită ofertă</Link>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="tg-mq" aria-hidden>
          <div className="tg-mqt">
            {[...MQ_ITEMS, ...MQ_ITEMS].map((item, i) => (
              <span key={i} className="tg-mqi">
                <span className="tg-mqs">✦</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── PROJECT LIST ── */}
        <section className="tg-works">
          <div className="tg-works-head">
            <span className="tg-works-title">Proiecte selectate</span>
            <span className="tg-works-count">0{PROJECTS.length} lucrări</span>
          </div>

          {PROJECTS.map((p, i) => (
            <Link
              key={p.idx}
              href={p.href}
              className="tg-proj-row"
              onMouseEnter={() => onRowEnter(i)}
              onMouseLeave={onRowLeave}
            >
              <span className="tg-proj-idx">{p.idx}</span>
              <span className="tg-proj-name">{p.title}</span>
              <span className="tg-proj-meta">
                <span className="tg-proj-cat">{p.cat}</span>
                <span className="tg-proj-yr">{p.year}</span>
              </span>
            </Link>
          ))}

          <div style={{ padding: "3rem 0", textAlign: "center" }}>
            <Link href="/proiecte" className="tg-btn-ghost">
              Toate proiectele →
            </Link>
          </div>
        </section>

        {/* ── STATEMENT ── */}
        <section className="tg-statement">
          <p className="tg-statement-q">
            {stmtWords.map((w, i) => (
              <span key={i} className="tg-statement-word" style={{ marginRight: "0.22em" }}>
                {w}
              </span>
            ))}
          </p>
          <div className="tg-stats-row">
            {[
              { n: "10+",  l: "Ani experiență" },
              { n: "200+", l: "Proiecte finalizate" },
              { n: "100%", l: "Execuție proprie" },
              { n: "24h",  l: "Răspuns ofertă" },
            ].map((s, i) => (
              <div key={i}>
                <div className="tg-stat-num">{s.n}</div>
                <div className="tg-stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="tg-cta">
          <div className="tg-cta-bg">
            <Image
              src="/images-scraped/Black_Pearl_03.jpg"
              alt=""
              fill sizes="100vw"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>
          <div className="tg-cta-ov" />
          <div className="tg-cta-inner">
            <span className="tg-cta-tag">Hai să construim ceva frumos împreună</span>
            <div className="tg-cta-h">
              <span className="tg-cta-hl"><span className="tg-cta-hw">Solicită</span></span>
              <span className="tg-cta-hl"><span className="tg-cta-hw"><em>oferta</em></span></span>
              <span className="tg-cta-hl"><span className="tg-cta-hw">ta.</span></span>
            </div>
            <Link href="/contact" className="tg-btn-gold">
              Contactează-ne →
            </Link>
          </div>
        </section>

        {/* ── FOOTER strip ── */}
        <footer className="tg-foot">
          <span className="tg-foot-logo">Moodilier</span>
          <nav className="tg-foot-nav">
            <Link href="/proiecte">Proiecte</Link>
            <Link href="/servicii">Servicii</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <span className="tg-foot-copy">© {new Date().getFullYear()} SC Moodilier SRL</span>
        </footer>

      </div>
    </>
  );
}
