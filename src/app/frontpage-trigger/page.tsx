"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─── DATA ─────────────────────────────────────────────── */
const SLIDES = [
  { idx:"01", title:"Vila Cosmopolis",    sub:"Rezidențial · Ilfov · 2024",    img:"/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href:"/proiecte/executie_vila-cosmopolis" },
  { idx:"02", title:"Black Pearl",         sub:"Rezidențial · Mamaia Nord · 2023", img:"/images-scraped/Black_Pearl_01.jpg",                           href:"/proiecte/executie_apt-mamaia-nord" },
  { idx:"03", title:"Casa Mogoșoaia",      sub:"Rezidențial · Ilfov · 2023",    img:"/images-scraped/Mogosoaia_01.jpg",                             href:"/proiecte/executie_casa-mogosoaia" },
  { idx:"04", title:"Apt. Olimp",          sub:"Rezidențial · Constanța · 2023",img:"/images-scraped/Olimp_03.jpg",                                 href:"/proiecte/executie_apt-olimp" },
  { idx:"05", title:"Vila Corbeanca",      sub:"Rezidențial · Ilfov · 2024",    img:"/images-scraped/vila_corbeanca_exec_living_4.jpg",              href:"/proiecte" },
  { idx:"06", title:"AppTown North",       sub:"Rezidențial · București · 2023",img:"/images-scraped/apptown_exec_28.jpg",                          href:"/proiecte/executie_apptown-north" },
];

const PROJECTS_LIST = [
  { idx:"01", title:"Vila Cosmopolis",  cat:"Rezidențial", year:"2024", img:"/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href:"/proiecte/executie_vila-cosmopolis" },
  { idx:"02", title:"Black Pearl",      cat:"Rezidențial", year:"2023", img:"/images-scraped/Black_Pearl_01.jpg",                           href:"/proiecte/executie_apt-mamaia-nord" },
  { idx:"03", title:"Casa Mogoșoaia",   cat:"Rezidențial", year:"2023", img:"/images-scraped/Mogosoaia_01.jpg",                             href:"/proiecte/executie_casa-mogosoaia" },
  { idx:"04", title:"Apt. Olimp",       cat:"Rezidențial", year:"2023", img:"/images-scraped/Olimp_03.jpg",                                 href:"/proiecte/executie_apt-olimp" },
  { idx:"05", title:"Vila Corbeanca",   cat:"Rezidențial", year:"2024", img:"/images-scraped/vila_corbeanca_exec_living_4.jpg",              href:"/proiecte" },
  { idx:"06", title:"AppTown North",    cat:"Rezidențial", year:"2023", img:"/images-scraped/apptown_exec_28.jpg",                          href:"/proiecte/executie_apptown-north" },
];

/* ─── STYLES ────────────────────────────────────────────── */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080706;--bg2:#0e0c0b;--fg:#ede8e1;--fg2:#5a5248;--fg3:#1e1c1a;
  --gold:#c9a984;--gold2:#e8d5b7;
  --ease:cubic-bezier(.76,0,.24,1);
  --serif:'Cormorant Garamond',Georgia,serif;
  --sans:'Inter',system-ui,sans-serif;
}
.pg{background:var(--bg);color:var(--fg);font-family:var(--sans);overflow-x:hidden;}
.pg a{text-decoration:none;color:inherit;}
.pg *{cursor:none;}
@media(hover:none),(pointer:coarse){.pg *{cursor:auto!important;}.pg-cur{display:none!important;}}

/* CURSOR */
.pg-cur{
  position:fixed;inset:auto;top:0;left:0;z-index:9999;pointer-events:none;
  border-radius:50%;background:var(--gold);
  width:8px;height:8px;
  transform:translate(-50%,-50%);
  will-change:left,top;
  transition:width .35s var(--ease),height .35s var(--ease),background .35s;
}
.pg-cur.big{width:70px;height:70px;background:transparent;border:1px solid rgba(201,169,132,.5);}
.pg-cur.big::after{
  content:attr(data-label);
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  font-family:var(--sans);font-size:.4rem;letter-spacing:.22em;text-transform:uppercase;
  color:var(--gold);white-space:nowrap;
}

/* TOP NAV */
.pg-nav{
  position:fixed;top:0;left:0;right:0;z-index:200;
  display:flex;justify-content:space-between;align-items:center;
  padding:1.8rem 3vw;
  mix-blend-mode:difference;
  pointer-events:none;
}
.pg-nav-logo{
  font-family:var(--serif);font-weight:300;letter-spacing:.28em;
  font-size:.95rem;text-transform:uppercase;color:#fff;
  pointer-events:all;
}
.pg-nav-links{
  display:flex;gap:2.8rem;font-size:.5rem;letter-spacing:.28em;
  text-transform:uppercase;color:rgba(255,255,255,.55);pointer-events:all;
}
.pg-nav-links a:hover{color:#fff;}
@media(max-width:768px){.pg-nav-links{display:none;}}

/* ════════════════════════════════════════════════════════
   HERO — full-screen cinematic carousel
════════════════════════════════════════════════════════ */
.pg-hero{
  position:relative;width:100vw;height:100svh;min-height:580px;
  overflow:hidden;background:var(--bg);
}

/* Slide stack */
.pg-slide{
  position:absolute;inset:0;
  display:grid;grid-template-rows:1fr auto;
}

/* Image container: fills top 75% */
.pg-slide-img{
  position:relative;overflow:hidden;
  clip-path:inset(0 0 100% 0);
}
.pg-slide-img img{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transform:scale(1.08);transition:transform 1.8s var(--ease);
}
.pg-slide-img.active img{transform:scale(1);}

/* Title block — below image */
.pg-slide-info{
  padding:1.4rem 3vw 0;
  display:grid;grid-template-columns:1fr auto;align-items:end;gap:1rem;
  border-top:1px solid var(--fg3);background:var(--bg);
  position:relative;z-index:2;overflow:hidden;
}
.pg-slide-name{
  font-family:var(--serif);font-weight:300;font-style:italic;
  font-size:clamp(2.4rem,6vw,7rem);
  line-height:.88;letter-spacing:-.025em;
  transform:translateY(110%);
  will-change:transform;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  color:var(--fg);
}
.pg-slide-sub{
  font-size:.48rem;letter-spacing:.28em;text-transform:uppercase;
  color:var(--fg2);padding-bottom:.2rem;
  transform:translateY(110%);white-space:nowrap;
  will-change:transform;
}

/* Big ghost index in corner of image */
.pg-slide-ghost{
  position:absolute;bottom:1.2rem;left:3vw;z-index:3;
  font-family:var(--serif);font-size:clamp(6rem,18vw,20rem);
  font-weight:300;line-height:1;
  color:rgba(255,255,255,.04);
  pointer-events:none;user-select:none;
  transform:translateY(20px);opacity:0;
}

/* Counter top-right of image */
.pg-counter{
  position:absolute;top:1.8rem;right:3vw;z-index:5;
  font-size:.48rem;letter-spacing:.28em;text-transform:uppercase;
  color:rgba(237,232,225,.4);
  display:flex;align-items:center;gap:.7rem;
}
.pg-counter-cur{color:var(--gold);}

/* Progress bar */
.pg-progress{
  position:absolute;bottom:0;left:0;right:0;z-index:6;height:1px;
  background:var(--fg3);
}
.pg-progress-fill{
  height:100%;background:var(--gold);
  transition:width .1s linear;
  width:0%;
}

/* Prev / Next arrows */
.pg-arrows{
  position:absolute;bottom:1.4rem;right:3vw;z-index:6;
  display:flex;gap:.6rem;
}
.pg-arr{
  width:2.4rem;height:2.4rem;border:1px solid var(--fg3);
  display:flex;align-items:center;justify-content:center;
  color:var(--fg2);transition:border-color .3s,color .3s;
  background:none;outline:none;cursor:pointer!important;
}
.pg-arr:hover{border-color:var(--gold);color:var(--gold);}
.pg-arr svg{width:14px;height:14px;}

/* Drag hint */
.pg-drag{
  position:absolute;bottom:1.4rem;left:3vw;z-index:6;
  font-size:.44rem;letter-spacing:.28em;text-transform:uppercase;
  color:rgba(237,232,225,.25);display:flex;align-items:center;gap:.5rem;
}
.pg-drag-line{
  width:28px;height:1px;background:rgba(237,232,225,.2);
  animation:dragpulse 2s ease infinite;
}
@keyframes dragpulse{0%,100%{transform:scaleX(1);opacity:.3}50%{transform:scaleX(.4);opacity:.9}}

/* View project link (shown bottom-center on hover) */
.pg-view{
  position:absolute;bottom:5rem;left:50%;transform:translateX(-50%);z-index:6;
  font-size:.48rem;letter-spacing:.28em;text-transform:uppercase;
  color:var(--gold);border-bottom:1px solid rgba(201,169,132,.3);padding-bottom:.3rem;
  opacity:0;transition:opacity .3s;pointer-events:none;
}
.pg-hero:hover .pg-view{opacity:1;}

/* Overlay on image */
.pg-slide-ov{
  position:absolute;inset:0;z-index:2;
  background:linear-gradient(to bottom,rgba(8,7,6,.05) 0%,rgba(8,7,6,.4) 75%,rgba(8,7,6,.92) 100%);
  pointer-events:none;
}

/* ── MARQUEE ── */
.pg-mq{overflow:hidden;padding:.85rem 0;background:var(--bg2);border-top:1px solid var(--fg3);border-bottom:1px solid var(--fg3);}
.pg-mqt{display:flex;width:max-content;animation:mq 44s linear infinite;}
@keyframes mq{to{transform:translateX(-50%);}}
.pg-mqi{display:inline-flex;align-items:center;gap:.6rem;padding:0 2rem;font-family:var(--serif);font-style:italic;font-size:clamp(.82rem,1.3vw,1.05rem);color:var(--fg2);white-space:nowrap;}
.pg-mqs{color:var(--gold);opacity:.35;font-size:.55em;font-style:normal;}

/* ── PROJECT LIST ── */
.pg-works{padding:0 3vw;background:var(--bg);}
.pg-wh{padding:3.5rem 0 1.8rem;display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--fg3);}
.pg-wht{font-family:var(--serif);font-size:clamp(1rem,2vw,1.6rem);font-weight:300;color:var(--fg2);}
.pg-whc{font-size:.46rem;letter-spacing:.3em;text-transform:uppercase;color:var(--fg2);}

.pg-row{
  display:grid;grid-template-columns:3rem 1fr auto;align-items:center;gap:0 2rem;
  padding:1.6rem 0;border-bottom:1px solid var(--fg3);
  position:relative;overflow:hidden;transition:border-color .3s;
}
.pg-row::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--gold);transform:scaleY(0);transform-origin:bottom;transition:transform .4s var(--ease);}
.pg-row:hover::before{transform:scaleY(1);}
.pg-row:hover{border-bottom-color:rgba(201,169,132,.25);}

.pg-ri{font-family:var(--serif);font-size:.7rem;color:rgba(201,169,132,.2);transition:color .3s;}
.pg-row:hover .pg-ri{color:var(--gold);}

.pg-rn{font-family:var(--serif);font-weight:300;font-size:clamp(1.6rem,3.5vw,3.5rem);line-height:1;letter-spacing:-.02em;transition:transform .4s var(--ease),color .3s;}
.pg-row:hover .pg-rn{transform:translateX(.6rem);color:var(--fg);}

.pg-rm{display:flex;flex-direction:column;align-items:flex-end;gap:.25rem;opacity:0;transform:translateX(10px);transition:opacity .35s,transform .35s var(--ease);}
.pg-row:hover .pg-rm{opacity:1;transform:none;}
.pg-rc{font-size:.45rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);}
.pg-ry{font-size:.45rem;letter-spacing:.15em;color:var(--fg2);}

/* Floating cursor image */
.pg-fimg{
  position:fixed;top:0;left:0;z-index:49;pointer-events:none;
  width:clamp(200px,20vw,340px);aspect-ratio:4/3;
  transform:translate(-50%,-50%);will-change:left,top;
  clip-path:inset(100% 0 0 0);
  transition:clip-path .5s var(--ease);
}
.pg-fimg.show{clip-path:inset(0 0 0 0);}

@media(max-width:768px){.pg-rm{display:none;}.pg-row{grid-template-columns:2.4rem 1fr;}}

/* ── STATEMENT ── */
.pg-stmt{padding:clamp(5rem,9vw,11rem) 3vw;border-top:1px solid var(--fg3);}
.pg-stmt-q{font-family:var(--serif);font-style:italic;font-weight:300;font-size:clamp(2rem,4.5vw,5.5rem);line-height:1.1;letter-spacing:-.02em;max-width:22ch;margin-bottom:4rem;overflow:hidden;}
.pg-stmt-w{display:inline-block;transform:translateY(112%);margin-right:.22em;will-change:transform;}
.pg-stats{display:flex;gap:4rem;flex-wrap:wrap;border-top:1px solid var(--fg3);padding-top:2.5rem;}
.pg-sn{font-family:var(--serif);font-size:clamp(2.5rem,4.5vw,5rem);font-weight:300;color:var(--gold);line-height:1;}
.pg-sl{font-size:.46rem;letter-spacing:.3em;text-transform:uppercase;color:var(--fg2);margin-top:.35rem;}

/* ── CTA ── */
.pg-cta{position:relative;min-height:85vh;overflow:hidden;border-top:1px solid var(--fg3);display:flex;align-items:flex-end;}
.pg-cta-bg{position:absolute;inset:0;}
.pg-cta-bg img{width:100%;height:100%;object-fit:cover;}
.pg-cta-ov{position:absolute;inset:0;background:linear-gradient(175deg,rgba(8,7,6,.45),rgba(8,7,6,.88));}
.pg-cta-body{position:relative;z-index:1;padding:3vw 3vw 4rem;}
.pg-cta-tag{font-size:.5rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:2rem;}
.pg-cta-h{font-family:var(--serif);font-weight:300;font-size:clamp(3.5rem,10vw,13rem);line-height:.82;letter-spacing:-.03em;margin-bottom:3rem;overflow:hidden;}
.pg-cta-hl{display:block;overflow:hidden;}
.pg-cta-hw{display:inline-block;transform:translateY(112%);will-change:transform;}
.pg-cta-hw em{font-style:italic;color:var(--gold);}
.pg-cta-btns{display:flex;gap:.8rem;flex-wrap:wrap;}
.pg-btn-g{padding:.95rem 2.4rem;background:var(--gold);color:var(--bg);font-size:.56rem;letter-spacing:.22em;text-transform:uppercase;transition:background .3s;white-space:nowrap;}
.pg-btn-g:hover{background:var(--gold2);}
.pg-btn-o{padding:.95rem 2.4rem;border:1px solid rgba(201,169,132,.3);color:var(--gold);font-size:.56rem;letter-spacing:.22em;text-transform:uppercase;transition:all .3s;white-space:nowrap;}
.pg-btn-o:hover{background:var(--gold);color:var(--bg);}

/* ── FOOTER ── */
.pg-foot{padding:1.8rem 3vw;background:var(--bg2);display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--fg3);flex-wrap:wrap;gap:1rem;}
.pg-fl{font-family:var(--serif);font-size:.88rem;font-weight:300;letter-spacing:.22em;color:var(--fg2);}
.pg-fn{display:flex;gap:1.8rem;font-size:.44rem;letter-spacing:.18em;text-transform:uppercase;color:var(--fg2);}
.pg-fn a:hover{color:var(--gold);}
.pg-fc{font-size:.42rem;letter-spacing:.1em;color:rgba(237,232,225,.12);}
`;

/* ─── COMPONENT ─────────────────────────────────────────── */
export default function FrontPageTrigger() {
  const [current, setCurrent] = useState(0);
  const [hoverProject, setHoverProject] = useState<number|null>(null);
  const cursorRef  = useRef<HTMLDivElement>(null);
  const fimgRef    = useRef<HTMLDivElement>(null);
  const fillRef    = useRef<HTMLDivElement>(null);
  const slideNameRefs = useRef<(HTMLElement|null)[]>([]);
  const slideSubRefs  = useRef<(HTMLElement|null)[]>([]);
  const heroRef    = useRef<HTMLElement>(null);
  const autoRef    = useRef<NodeJS.Timeout|null>(null);
  const TOTAL      = SLIDES.length;
  const INTERVAL   = 5500;

  /* ── cursor + floating image tracking ── */
  useEffect(() => {
    const cur = cursorRef.current;
    const fim = fimgRef.current;
    if (!cur || window.matchMedia("(hover:none)").matches) return;
    let raf=0, mx=window.innerWidth/2, my=window.innerHeight/2;
    let cx=mx,cy=my,fx=mx,fy=my;
    const tick = () => {
      cx += (mx-cx)*.14; cy += (my-cy)*.14;
      fx += (mx-fx)*.07; fy += (my-fy)*.07;
      cur.style.left = cx+"px"; cur.style.top = cy+"px";
      if (fim) { fim.style.left = fx+"px"; fim.style.top = fy+"px"; }
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e:MouseEvent) => { mx=e.clientX; my=e.clientY; };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove",onMove); cancelAnimationFrame(raf); };
  }, []);

  /* ── slide transition via GSAP ── */
  const goTo = useCallback(async (next: number, dir: 1|-1 = 1) => {
    const { gsap } = await import("gsap");
    const prev = current;
    if (next === prev) return;

    const slides = document.querySelectorAll<HTMLElement>(".pg-slide");
    const imgs   = document.querySelectorAll<HTMLElement>(".pg-slide-img");
    const prevS  = slides[prev], nextS = slides[next];
    const prevImg= imgs[prev],   nextImg= imgs[next];

    // Outgoing: slide title down
    gsap.to([slideNameRefs.current[prev], slideSubRefs.current[prev]], {
      y:"110%", duration:.55, ease:"power2.in", stagger:.04,
    });

    // Outgoing image: clip wipe out
    gsap.to(prevImg, {
      clipPath:"inset(0 0 100% 0)", duration:.9, ease:"power3.inOut", delay:.1,
    });

    // Incoming: prepare
    gsap.set(nextS, { zIndex:5 });
    gsap.set(prevS, { zIndex:4 });
    gsap.set(nextImg, { clipPath:"inset(0 0 100% 0)" });
    gsap.set([slideNameRefs.current[next], slideSubRefs.current[next]], { y:"110%" });

    // Incoming image: clip reveal
    gsap.to(nextImg, {
      clipPath:"inset(0 0 0% 0)", duration:1.1, ease:"power3.inOut", delay:.3,
      onComplete: () => {
        nextImg.classList.add("active");
        prevImg.classList.remove("active");
        gsap.set(prevS, { zIndex:1 });
        gsap.set(nextS, { zIndex:2 });
      }
    });

    // Incoming title
    gsap.to(slideNameRefs.current[next], { y:"0%", duration:.9, ease:"power3.out", delay:.6 });
    gsap.to(slideSubRefs.current[next],  { y:"0%", duration:.8, ease:"power3.out", delay:.72 });

    setCurrent(next);
  }, [current]);

  /* ── auto advance with progress bar ── */
  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;
    fill.style.transition = "none";
    fill.style.width = "0%";

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const pct = Math.min(((now-start)/INTERVAL)*100, 100);
      fill.style.width = pct+"%";
      if (pct < 100) { raf = requestAnimationFrame(tick); }
      else { goTo((current+1)%TOTAL); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current, goTo]);

  /* ── initial entrance ── */
  useEffect(() => {
    (async () => {
      const { gsap } = await import("gsap");
      const imgs = document.querySelectorAll<HTMLElement>(".pg-slide-img");
      imgs[0].classList.add("active");
      gsap.to(imgs[0], { clipPath:"inset(0 0 0% 0)", duration:1.4, ease:"power3.inOut", delay:.2 });
      gsap.to(slideNameRefs.current[0], { y:"0%", duration:1.1, ease:"power3.out", delay:.8 });
      gsap.to(slideSubRefs.current[0],  { y:"0%", duration:.9,  ease:"power3.out", delay:1.0 });
    })();
  }, []);

  /* ── GSAP scroll reveals ── */
  useEffect(() => {
    let dead = false;
    (async () => {
      const [{ gsap },{ ScrollTrigger }] = await Promise.all([import("gsap"),import("gsap/ScrollTrigger")]);
      if(dead) return;
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".pg-row", { opacity:0, y:22, duration:.75, ease:"power2.out", stagger:.055,
        scrollTrigger:{trigger:".pg-works",start:"top 82%"} });

      gsap.to(".pg-stmt-w", { y:"0%", duration:1.1, ease:"power3.out", stagger:.05,
        scrollTrigger:{trigger:".pg-stmt-q",start:"top 78%"} });

      gsap.from(".pg-sn", { opacity:0, y:28, duration:.9, ease:"power2.out", stagger:.1,
        scrollTrigger:{trigger:".pg-stats",start:"top 85%"} });

      gsap.to(".pg-cta-hw", { y:"0%", duration:1.1, ease:"power3.out", stagger:.1,
        scrollTrigger:{trigger:".pg-cta",start:"top 72%"} });

      ScrollTrigger.refresh();
    })();
    return () => { dead=true; import("gsap/ScrollTrigger").then(({ScrollTrigger})=>ScrollTrigger.killAll()); };
  }, []);

  const prev = () => goTo((current-1+TOTAL)%TOTAL, -1);
  const next = () => goTo((current+1)%TOTAL);

  const stmtWords = "Mobilier care nu se cumpără — se trăiește.".split(" ");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg">

        {/* CURSOR */}
        <div className="pg-cur" ref={cursorRef} data-label="VER" aria-hidden />

        {/* FLOATING IMAGE (project list hover) */}
        <div className={`pg-fimg ${hoverProject !== null ? "show" : ""}`} ref={fimgRef} aria-hidden>
          {hoverProject !== null && (
            <Image src={PROJECTS_LIST[hoverProject].img} alt="" fill sizes="340px"
              style={{objectFit:"cover"}} unoptimized />
          )}
        </div>

        {/* TOP NAV */}
        <nav className="pg-nav">
          <Link href="/" className="pg-nav-logo">Moodilier</Link>
          <div className="pg-nav-links">
            <Link href="/proiecte">Proiecte</Link>
            <Link href="/servicii">Servicii</Link>
            <Link href="/despre-noi">Despre noi</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>

        {/* ══ HERO CAROUSEL ══ */}
        <section className="pg-hero" ref={heroRef}>

          {/* Counter */}
          <div className="pg-counter">
            <span className="pg-counter-cur">{String(current+1).padStart(2,"0")}</span>
            <span>/</span>
            <span>{String(TOTAL).padStart(2,"0")}</span>
          </div>

          {/* Slides */}
          {SLIDES.map((s,i) => (
            <div
              key={s.idx}
              className="pg-slide"
              style={{ zIndex: i===current ? 2 : 1 }}
            >
              {/* Image */}
              <div className="pg-slide-img" style={{ clipPath: i===0?"inset(0 0 100% 0)":i===current?"inset(0 0 0% 0)":"inset(0 0 100% 0)" }}>
                <Image src={s.img} alt={s.title} fill sizes="100vw"
                  priority={i===0} quality={88}
                  style={{objectFit:"cover",objectPosition:"center 35%"}} />
                <div className="pg-slide-ov" />

                {/* Ghost number */}
                <div className="pg-slide-ghost" style={i===current?{opacity:1,transform:"translateY(0)",transition:"opacity .8s ease .6s, transform .8s var(--ease) .6s"}:{}}>
                  {s.idx}
                </div>
              </div>

              {/* Title bar below image */}
              <div className="pg-slide-info">
                <span
                  className="pg-slide-name"
                  ref={el => { slideNameRefs.current[i]=el; }}
                  style={i===0?{}:{transform:"translateY(110%)"}}
                >
                  {s.title}
                </span>
                <span
                  className="pg-slide-sub"
                  ref={el => { slideSubRefs.current[i]=el; }}
                  style={i===0?{}:{transform:"translateY(110%)"}}
                >
                  {s.sub}
                </span>
              </div>
            </div>
          ))}

          {/* Progress bar */}
          <div className="pg-progress">
            <div className="pg-progress-fill" ref={fillRef} />
          </div>

          {/* Drag hint */}
          <div className="pg-drag">
            <div className="pg-drag-line" />
            <span>Drag</span>
          </div>

          {/* Arrows */}
          <div className="pg-arrows">
            <button className="pg-arr" onClick={prev} aria-label="Anterior">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <button className="pg-arr" onClick={next} aria-label="Următor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          {/* View link */}
          <Link href={SLIDES[current].href} className="pg-view">
            Vezi proiect →
          </Link>

        </section>

        {/* MARQUEE */}
        <div className="pg-mq" aria-hidden>
          <div className="pg-mqt">
            {["Mobilier Premium","Design Interior","La Comandă","Execuție Proprie",
              "Bucătării","Dressinguri","Livinguri","Spații Comerciale",
              "Mobilier Premium","Design Interior","La Comandă","Execuție Proprie",
              "Bucătării","Dressinguri","Livinguri","Spații Comerciale"].map((item,i) => (
              <span key={i} className="pg-mqi"><span className="pg-mqs">✦</span> {item}</span>
            ))}
          </div>
        </div>

        {/* PROJECT LIST */}
        <section className="pg-works">
          <div className="pg-wh">
            <span className="pg-wht">Proiecte selectate</span>
            <span className="pg-whc">0{PROJECTS_LIST.length} lucrări</span>
          </div>
          {PROJECTS_LIST.map((p,i) => (
            <Link key={p.idx} href={p.href} className="pg-row"
              onMouseEnter={() => { setHoverProject(i); const c=cursorRef.current; c?.classList.add("big"); }}
              onMouseLeave={() => { setHoverProject(null); const c=cursorRef.current; c?.classList.remove("big"); }}
            >
              <span className="pg-ri">{p.idx}</span>
              <span className="pg-rn">{p.title}</span>
              <span className="pg-rm">
                <span className="pg-rc">{p.cat}</span>
                <span className="pg-ry">{p.year}</span>
              </span>
            </Link>
          ))}
          <div style={{padding:"2.5rem 0",textAlign:"center"}}>
            <Link href="/proiecte" className="pg-btn-o">Toate proiectele →</Link>
          </div>
        </section>

        {/* STATEMENT */}
        <section className="pg-stmt">
          <p className="pg-stmt-q">
            {stmtWords.map((w,i) => (
              <span key={i} className="pg-stmt-w">{w}</span>
            ))}
          </p>
          <div className="pg-stats">
            {[{n:"10+",l:"Ani experiență"},{n:"200+",l:"Proiecte finalizate"},{n:"100%",l:"Execuție proprie"},{n:"24h",l:"Răspuns ofertă"}]
              .map((s,i) => (
              <div key={i}>
                <div className="pg-sn">{s.n}</div>
                <div className="pg-sl">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pg-cta">
          <div className="pg-cta-bg">
            <Image src="/images-scraped/Black_Pearl_03.jpg" alt="" fill sizes="100vw"
              style={{objectFit:"cover"}} unoptimized />
          </div>
          <div className="pg-cta-ov" />
          <div className="pg-cta-body">
            <span className="pg-cta-tag">Hai să construim ceva frumos împreună</span>
            <div className="pg-cta-h">
              <span className="pg-cta-hl"><span className="pg-cta-hw">Solicită</span></span>
              <span className="pg-cta-hl"><span className="pg-cta-hw"><em>oferta</em></span></span>
              <span className="pg-cta-hl"><span className="pg-cta-hw">ta.</span></span>
            </div>
            <div className="pg-cta-btns">
              <Link href="/contact" className="pg-btn-g">Contactează-ne →</Link>
              <Link href="/proiecte" className="pg-btn-o">Vezi portofoliul</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pg-foot">
          <span className="pg-fl">Moodilier</span>
          <nav className="pg-fn">
            <Link href="/proiecte">Proiecte</Link>
            <Link href="/servicii">Servicii</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <span className="pg-fc">© {new Date().getFullYear()} SC Moodilier SRL</span>
        </footer>

      </div>
    </>
  );
}
