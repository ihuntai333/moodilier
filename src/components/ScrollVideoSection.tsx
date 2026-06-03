"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollVideoSection — Apple-style scroll scrubbing
 * Dual resolution: desktop 1920×1080, mobile 768×432 WebP
 * Lazy loading: first 15 frames immediately, rest via IntersectionObserver
 */

const FRAME_COUNT = 70; // 5.81s × 12fps
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
  const containerRef  = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const framesRef     = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const loadedRef     = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const bulkDoneRef   = useRef(false);
  const isMobileRef   = useRef(false);
  const currentRef    = useRef(0);
  const overlayRef    = useRef<HTMLParagraphElement>(null);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !loadedRef.current[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Cover: maintain aspect ratio, fill canvas
    const vw = canvas.width, vh = canvas.height;
    const iw = img.naturalWidth || 1920, ih = img.naturalHeight || 1080;
    const scale = Math.max(vw / iw, vh / ih);
    const sw = iw * scale, sh = ih * scale;
    const sx = (vw - sw) / 2, sy = (vh - sh) / 2;
    ctx.clearRect(0, 0, vw, vh);
    ctx.drawImage(img, sx, sy, sw, sh);
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

  /* ── Phase 1: detect device + load first 15 frames ── */
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 900;
    for (let i = 0; i < Math.min(15, FRAME_COUNT); i++) loadFrame(i);
  }, []);

  /* ── Phase 2: load rest when section near viewport ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !bulkDoneRef.current) {
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

  /* ── Resize + scroll ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobileRef.current = window.innerWidth < 900;
      drawFrame(currentRef.current);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect    = container.getBoundingClientRect();
      const total   = container.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      if (scrolled < 0 || scrolled > total) return;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const idx      = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

      drawFrame(idx);

      // Progress bar
      const bar = document.getElementById("svs-bar");
      if (bar) bar.style.width = `${progress * 100}%`;

      // Overlay text
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
    <div ref={containerRef} style={{ position: "relative", height: "520vh", background: "#0b0907" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>

        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />

        {/* Vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(11,9,7,.45) 100%)",
        }} />

        {/* Bottom text */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to top, rgba(11,9,7,.72) 0%, transparent 45%)",
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 6vw clamp(3rem,7vh,6rem)",
        }}>
          <p
            ref={overlayRef}
            data-cur="Un spațiu gol…"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", fontWeight: 300,
              fontSize: "clamp(1.8rem, 5vw, 5.5rem)",
              color: "#ede5da", lineHeight: 1,
              letterSpacing: "-.02em",
              transition: "opacity .2s ease",
              marginBottom: ".7rem",
            }}
          >
            Un spațiu gol…
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(.42rem,.9vw,.55rem)",
            letterSpacing: ".38em", textTransform: "uppercase",
            color: "#c9a984", opacity: .65,
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
  );
}
