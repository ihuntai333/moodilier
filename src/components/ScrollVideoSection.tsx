"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollVideoSection — Apple-style scroll scrubbing
 * Desktop: canvas fills full viewport (cover-fit)
 * Mobile:  canvas is 16:9 centered inside full-height sticky wrapper
 *          Wrapper always stays 100svh — fixes iOS sticky bug
 *          touchmove listener for real-time iOS scrubbing
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

  /* ── Draw ── */
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !loadedRef.current[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (isMobileRef.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      const vw = canvas.width, vh = canvas.height;
      const iw = img.naturalWidth || 1920, ih = img.naturalHeight || 1080;
      const scale = Math.max(vw / iw, vh / ih);
      const sw = iw * scale, sh = ih * scale;
      ctx.clearRect(0, 0, vw, vh);
      ctx.drawImage(img, (vw - sw) / 2, (vh - sh) / 2, sw, sh);
    }
    currentRef.current = index;
  };

  /* ── Load ── */
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

  /* Phase 1 */
  useEffect(() => {
    isMobileRef.current = isMobile();
    for (let i = 0; i < Math.min(15, FRAME_COUNT); i++) loadFrame(i);
  }, []);

  /* Phase 2 */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !bulkDoneRef.current) {
        bulkDoneRef.current = true;
        let i = 15;
        const next = () => {
          if (i >= FRAME_COUNT) return;
          for (let end = Math.min(i + 10, FRAME_COUNT); i < end; i++) loadFrame(i);
          setTimeout(next, 100);
        };
        next();
      }
    }, { rootMargin: "800px" });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  /* ── Core: resize + scroll + touchmove ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const resize = () => {
      isMobileRef.current = isMobile();
      // Wrapper is ALWAYS full viewport height (100svh) — fixes iOS sticky
      wrap.style.height = "100svh";

      if (isMobileRef.current) {
        // Canvas = 16:9, centered vertically inside wrapper
        const w = window.innerWidth;
        const h = Math.round(w * 9 / 16);
        canvas.width  = w;
        canvas.height = h;
        canvas.style.width  = "100%";
        canvas.style.height = `${h}px`;
      } else {
        // Canvas = full viewport
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width  = "100%";
        canvas.style.height = "100%";
      }
      drawFrame(currentRef.current);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    /* ── Progress calc (shared by scroll + touchmove) ── */
    const updateProgress = () => {
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

    window.addEventListener("scroll",     updateProgress, { passive: true });
    window.addEventListener("touchmove",  updateProgress, { passive: true }); // iOS real-time
    return () => {
      window.removeEventListener("scroll",    updateProgress);
      window.removeEventListener("touchmove", updateProgress);
      window.removeEventListener("resize",    resize);
    };
  }, []);

  return (
    /* Mobile: 300vh (less scrolling); Desktop: 480vh */
    <div
      ref={containerRef}
      style={{
        position: "relative",
        background: "#0b0907",
      }}
      className="svs-container"
    >
      <style>{`
        .svs-container { height: 480vh; }
        @media (max-width: 899px) { .svs-container { height: 300vh; } }
      `}</style>

      {/* Sticky wrapper — always 100svh */}
      <div
        ref={wrapRef}
        style={{
          position: "sticky", top: 0,
          width: "100%", height: "100svh",
          background: "#0b0907",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Canvas wrapper — relative for overlays */}
        <div style={{ position: "relative", width: "100%" }}>
          <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />

          {/* Vignette */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(11,9,7,.4) 100%)",
          }} />

          {/* Bottom gradient + text */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to top, rgba(11,9,7,.8) 0%, transparent 55%)",
            display: "flex", flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 6vw clamp(1rem, 3vh, 3rem)",
          }}>
            <p
              ref={overlayRef}
              data-cur="Un spațiu gol…"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic", fontWeight: 300,
                fontSize: "clamp(1.3rem, 4vw, 5rem)",
                color: "#ede5da", lineHeight: 1,
                letterSpacing: "-.02em",
                transition: "opacity .2s ease",
                marginBottom: ".4rem",
              }}
            >
              Un spațiu gol…
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(.5rem, 1.2vw, .52rem)", // fixed: was .7vw = 2.6px on mobile
              letterSpacing: ".32em",
              textTransform: "uppercase",
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
