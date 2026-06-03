"use client";

import { useEffect, useRef, useState } from "react";

/**
 * StatsSection — Contoare animate la scroll.
 * Stil identic cu secțiunea din pagina Despre noi:
 * clase globals.css: .stat-item, .stat-num, .stat-label
 */

const STATS = [
  { target: 10,   suffix: "+", label: "Ani experiență" },
  { target: 300,  suffix: "+", label: "Proiecte finalizate" },
  { target: 98,   suffix: "%", label: "Clienți mulțumiți" },
  { target: 5000, suffix: "+", label: "m² amenajați" },
];

function AnimatedNumber({ target, suffix, started }: {
  target: number; suffix: string; started: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const dur = 1800;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
      setCount(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return <>{count.toLocaleString("ro-RO")}{suffix}</>;
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        paddingBottom: 0,
      }}
    >
      {/* Label */}
      <p
        className="label"
        style={{
          textAlign: "center",
          paddingTop: "2.5rem",
          marginBottom: "2rem",
          opacity: started ? 1 : 0,
          transition: "opacity .6s ease .1s",
        }}
      >
        Moodilier în cifre
      </p>

      {/* Stats grid — 2px gaps on border background = clean divider lines */}
      <div className="stats-anim-grid">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="stat-item"
            style={{
              opacity: started ? 1 : 0,
              transform: started ? "translateY(0)" : "translateY(18px)",
              transition: `opacity .65s ease ${i * 100}ms, transform .65s cubic-bezier(.16,1,.3,1) ${i * 100}ms`,
            }}
          >
            <p className="stat-num">
              <AnimatedNumber target={s.target} suffix={s.suffix} started={started} />
            </p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      <style>{`
        .stats-anim-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          background: var(--color-border);
        }
        @media (min-width: 640px) {
          .stats-anim-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
