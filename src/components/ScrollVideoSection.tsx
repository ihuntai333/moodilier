"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollVideoSection
 * Apple-style scroll-scrubbing: pins a canvas and draws video frames
 * based on scroll progress through a tall (600vh) container.
 * 120 frames pre-extracted from video at 12fps.
 */

const FRAME_COUNT = 120;
const getFrameSrc = (i: number) =>
  `/frames/frame-${String(i + 1).padStart(4, "0")}.webp`;

const OVERLAYS = [
  { at: 0.0,  text: "Un spațiu gol…" },
  { at: 0.35, text: "Prinde contur." },
  { at: 0.65, text: "Se transformă." },
  { at: 0.88, text: "Devine acasă." },
];

export default function ScrollVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const framesRef    = useRef<HTMLImageElement[]>([]);
  const loadedRef    = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const currentRef   = useRef(0);
  const overlayRef   = useRef<HTMLParagraphElement>(null);

  /* ── Preload frames ── */
  useEffect(() => {
    const imgs = framesRef.current;
    // Load first 30 immediately, rest progressively
    const loadBatch = (start: number, end: number) => {
      for (let i = start; i < end && i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
        img.onload = () => { loadedRef.current[i] = true; };
        imgs[i] = img;
      }
    };
    loadBatch(0, 30);
    const t = setTimeout(() => loadBatch(30, FRAME_COUNT), 800);
    return () => clearTimeout(t);
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

  /* ── Scroll handler ── */
  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    // Size canvas to window
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentRef.current);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Draw first frame when loaded
    const firstCheck = setInterval(() => {
      if (loadedRef.current[0]) { drawFrame(0); clearInterval(firstCheck); }
    }, 50);

    // Scroll → frame index
    const onScroll = () => {
      const rect     = container.getBoundingClientRect();
      const total    = container.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const index    = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

      drawFrame(index);

      // Overlay text
      const overlay = overlayRef.current;
      if (overlay) {
        let activeText = "";
        for (const o of OVERLAYS) {
          if (progress >= o.at) activeText = o.text;
        }
        if (overlay.textContent !== activeText) {
          overlay.style.opacity = "0";
          setTimeout(() => {
            overlay.textContent = activeText;
            overlay.style.opacity = "1";
          }, 200);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      clearInterval(firstCheck);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: "600vh", background: "#0b0907" }}
    >
      {/* Sticky canvas */}
      <div
        style={{
          position: "sticky", top: 0,
          height: "100vh", width: "100%",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Dark vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(11,9,7,.55) 100%)",
          pointerEvents: "none",
        }} />

        {/* Overlay text */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 5vw 8vh",
          pointerEvents: "none",
        }}>
          <p
            ref={overlayRef}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 5.5rem)",
              color: "#ede5da",
              lineHeight: 1,
              letterSpacing: "-.02em",
              opacity: 1,
              transition: "opacity .25s ease",
            }}
          >
            Un spațiu gol…
          </p>
          <p style={{
            marginTop: "1rem",
            fontFamily: "'Inter', sans-serif",
            fontSize: ".52rem",
            letterSpacing: ".42em",
            textTransform: "uppercase",
            color: "#c9a984",
            opacity: .7,
          }}>
            Scroll pentru a vedea transformarea
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "2px", background: "rgba(201,169,132,.12)",
        }}>
          <div
            id="svs-progress"
            style={{ height: "100%", background: "#c9a984", width: "0%", transition: "width .1s linear" }}
          />
        </div>
      </div>

      {/* Progress bar update via CSS custom property trick — needs a separate effect */}
      <ScrollProgressBar containerRef={containerRef} />
    </div>
  );
}

/* Tiny companion — updates the progress bar width */
function ScrollProgressBar({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const bar = document.getElementById("svs-progress");
    if (!bar) return;
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect     = container.getBoundingClientRect();
      const total    = container.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const pct      = Math.max(0, Math.min(100, (scrolled / total) * 100));
      bar.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
