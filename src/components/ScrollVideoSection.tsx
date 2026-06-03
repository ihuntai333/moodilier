"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollVideoSection — Apple-style scroll scrubbing
 * Desktop: fullscreen canvas (100vh)
 * Mobile: 16:9 aspect ratio box — shows full frame, no cropping
 */

const FRAME_COUNT = 70;
const getFrameSrc = (i: number, mobile: boolean) => {
  const name = `frame-${String(i + 1).padStart(4, "0")}.webp`;
  return mobile ? `/frames/mobile/${name}` : `/frames/${name}`;
};

const OVERLAYS = [
  { at: 0.0,  text: "Un spațiu gol…" },
  { at: 0.3,  text: "Prinde contur." },
  { at: 0.62, text: "Se transformă." },
  { at: 0.88, text: "Devine acasă." },
];

export default function ScrollVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const framesRef    = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const loadedRef    = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const bulkDoneRef  = useRef(false);
  const isMobileRef  = useRef(false);
  const currentRef   = useRef(0);
  const overlayRef   = useRef<HTMLParagraphElement>(null);

  const isMobile = () => window.innerWidth < 900;

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !loadedRef.current[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (isMobileRef.current) {
      // 16:9 box — draw full frame, no cropping
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      // Desktop: cover-fit (fill viewport)
      const vw = canvas.width, vh = canvas.height;
      const iw = img.naturalWidth || 1920, ih = img.naturalHeight || 1080;
      const scale = Math.max(vw / iw, vh / ih);
      const sw = iw * scale, sh = ih * scale;
      ctx.clearRect(0, 0, vw, vh);
      ctx.drawImage(img, (vw - sw) / 2, (vh - sh) / 2, sw, sh);
    }
    currentRef.current = index;
  };

  const loadFrame = (i: number) => {
    if (loadedRef.current[i] || framesRef.current[i]) return;
    const img = new Image();
    img.src = getFrameSrc(i, isMobileRef.current);
    img.onload = () => {
      loadedRef.current[i] = true;
      if (i === 0) drawFrame(0);
    };
    framesRef.current[i] = img;
  };

  /* Phase 1: first 15 frames immediately */
  useEffect(() => {
    isMobileRef.current = isMobile();
    for (let i = 0; i < Math.min(15, FRAME_COUNT); i++) loadFrame(i);
  }, []);

  /* Phase 2: rest via IntersectionObserver */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !bulkDoneRef.current) {
        bulkDoneRef.current = true;
        let i = 15;
        const next = () => {
          if (i >= FRAME_COUNT) return;
          const end = Math.min(i + 10, FRAME_COUNT);
          for (; i < end; i++) loadFrame(i);
          setTimeout(next, 100);
        };
        next();
      }
    }, { rootMargin: "800px" });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  /* Resize + scroll */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const resize = () => {
      isMobileRef.current = isMobile();
      if (isMobileRef.current) {
        // 16:9 box: full width
        const w = window.innerWidth;
        const h = Math.round(w * 9 / 16);
        canvas.width  = w;
        canvas.height = h;
        canvas.style.width  = "100%";
        canvas.style.height = `${h}px`;
        wrap.style.height   = `${h}px`;
        wrap.style.alignItems = "center";
      } else {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width  = "100%";
        canvas.style.height = "100%";
        wrap.style.height   = "100vh";
      }
      drawFrame(currentRef.current);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect     = container.getBoundingClientRect();
      const total    = container.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      if (scrolled < 0 || scrolled > total) return;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const idx      = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

      drawFrame(idx);

      const bar = document.getElementById("svs-bar");
      if (bar) bar.style.width = `${progress * 100}%`;

      const ol = overlayRef.current;
      if (ol) {
        let txt = "";
        for (const o of OVERLAYS) { if (progress >= o.at) txt = o.text; }
        if (ol.dataset.cur !== txt) {
          ol.style.opacity = "0";
          ol.dataset.cur = txt;
          setTimeout(() => { ol.textContent = txt; ol.style.opacity = "1"; }, 180);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", height: "480vh", background: "#0b0907" }}>

      {/* Sticky wrapper */}
      <div
        ref={wrapRef}
        style={{
          position: "sticky", top: 0,
          width: "100%", height: "100vh",
          background: "#0b0907",
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative" }}>
          <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />

          {/* Vignette — desktop only visual */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(11,9,7,.4) 100%)",
          }} />

          {/* Bottom gradient + text */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to top, rgba(11,9,7,.75) 0%, transparent 50%)",
            display: "flex", flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 6vw clamp(1.2rem,4vh,3.5rem)",
          }}>
            <p
              ref={overlayRef}
              data-cur="Un spațiu gol…"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic", fontWeight: 300,
                fontSize: "clamp(1.4rem, 4vw, 5rem)",
                color: "#ede5da", lineHeight: 1,
                letterSpacing: "-.02em",
                transition: "opacity .2s ease",
                marginBottom: ".5rem",
              }}
            >
              Un spațiu gol…
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(.38rem,.7vw,.52rem)",
              letterSpacing: ".36em", textTransform: "uppercase",
              color: "#c9a984", opacity: .6,
            }}>
              Scroll pentru a vedea transformarea
            </p>
          </div>

          {/* Progress bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "2px", background: "rgba(201,169,132,.1)",
          }}>
            <div id="svs-bar" style={{
              height: "100%", background: "#c9a984",
              width: "0%", transition: "width .08s linear",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
