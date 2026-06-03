"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollVideoSection — Apple-style scroll scrubbing
 * Strategy: load first 15 frames immediately, rest only when
 * section enters viewport (IntersectionObserver, 800px ahead).
 * Canvas draw on scroll — smooth, 60fps capable.
 */

// Updated after re-extraction — adjust if frame count changes
const FRAME_COUNT = 104;
const getFrameSrc = (i: number) =>
  `/frames/frame-${String(i + 1).padStart(4, "0")}.webp`;

const OVERLAYS = [
  { at: 0.0,  text: "Un spațiu gol…" },
  { at: 0.3,  text: "Prinde contur." },
  { at: 0.62, text: "Se transformă." },
  { at: 0.88, text: "Devine acasă." },
];

export default function ScrollVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const framesRef    = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const loadedRef    = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const bulkLoadedRef = useRef(false);
  const currentRef   = useRef(0);
  const overlayRef   = useRef<HTMLParagraphElement>(null);

  /* ── Helper: load a single frame ── */
  const loadFrame = (i: number) => {
    if (loadedRef.current[i]) return;
    const img = new Image();
    img.src = getFrameSrc(i);
    img.onload = () => { loadedRef.current[i] = true; };
    framesRef.current[i] = img;
  };

  /* ── Phase 1: load first 15 frames immediately ── */
  useEffect(() => {
    for (let i = 0; i < Math.min(15, FRAME_COUNT); i++) loadFrame(i);

    // Draw first frame as soon as it's ready
    const check = setInterval(() => {
      if (loadedRef.current[0]) {
        drawFrame(0);
        clearInterval(check);
      }
    }, 40);
    return () => clearInterval(check);
  }, []);

  /* ── Phase 2: load rest when section is near viewport ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !bulkLoadedRef.current) {
          bulkLoadedRef.current = true;
          // Load in small batches to avoid saturating bandwidth
          let i = 15;
          const loadNext = () => {
            if (i >= FRAME_COUNT) return;
            const end = Math.min(i + 10, FRAME_COUNT);
            for (; i < end; i++) loadFrame(i);
            setTimeout(loadNext, 80);
          };
          loadNext();
        }
      },
      { rootMargin: "800px" } // start loading 800px before section enters view
    );
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  /* ── Draw frame on canvas ── */
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !loadedRef.current[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    currentRef.current = index;
  };

  /* ── Resize canvas + scroll handler ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
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
      const index    = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

      drawFrame(index);

      // Update progress bar
      const bar = document.getElementById("svs-bar");
      if (bar) bar.style.width = `${progress * 100}%`;

      // Update overlay text
      const overlay = overlayRef.current;
      if (overlay) {
        let activeText = "";
        for (const o of OVERLAYS) {
          if (progress >= o.at) activeText = o.text;
        }
        if (overlay.dataset.text !== activeText) {
          overlay.style.opacity = "0";
          overlay.dataset.text = activeText;
          setTimeout(() => {
            overlay.textContent = activeText;
            overlay.style.opacity = "1";
          }, 180);
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
    <div
      ref={containerRef}
      style={{ position: "relative", height: "550vh", background: "#0b0907" }}
    >
      {/* Sticky viewport */}
      <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>

        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 48%, rgba(11,9,7,.5) 100%)",
        }} />

        {/* Bottom gradient + text */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to top, rgba(11,9,7,.7) 0%, transparent 40%)",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "0 5vw 7vh",
        }}>
          <p
            ref={overlayRef}
            data-text="Un spațiu gol…"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 5.5rem)",
              color: "#ede5da", lineHeight: 1,
              letterSpacing: "-.02em",
              opacity: 1,
              transition: "opacity .2s ease",
              marginBottom: ".8rem",
            }}
          >
            Un spațiu gol…
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: ".52rem", letterSpacing: ".42em",
            textTransform: "uppercase", color: "#c9a984", opacity: .6,
          }}>
            Scroll pentru a vedea transformarea
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "2px", background: "rgba(201,169,132,.1)",
        }}>
          <div
            id="svs-bar"
            style={{ height: "100%", background: "#c9a984", width: "0%", transition: "width .08s linear" }}
          />
        </div>
      </div>
    </div>
  );
}
