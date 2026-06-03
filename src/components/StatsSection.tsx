"use client";

import { useEffect, useRef, useState } from "react";

/**
 * StatsSection — Contoare animate declanșate la scroll.
 * Numerele pornesc de la 0 și se animează spre țintă cu easing.
 * Design: dark section, numere mari aurii, label-uri subtile.
 */

interface Stat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const STATS: Stat[] = [
  { value: 10,   suffix: "+",   label: "Ani de experiență" },
  { value: 300,  suffix: "+",   label: "Proiecte finalizate" },
  { value: 98,   suffix: "%",   label: "Clienți mulțumiți" },
  { value: 5000, suffix: "+",   label: "m² amenajați", prefix: "" },
];

function useCounter(target: number, duration = 2000, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return count;
}

function StatCard({ stat, started, delay }: { stat: Stat; started: boolean; delay: number }) {
  const count = useCounter(stat.value, 2000, started);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2.5rem 1rem",
        opacity: started ? 1 : 0,
        transform: started ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {/* Number */}
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "clamp(3rem, 7vw, 5.5rem)",
          color: "#c9a984",
          lineHeight: 1,
          letterSpacing: "-.02em",
          marginBottom: ".6rem",
        }}
      >
        {stat.prefix ?? ""}
        {count.toLocaleString("ro-RO")}
        {stat.suffix}
      </div>

      {/* Gold line */}
      <div
        style={{
          width: started ? "2.5rem" : "0",
          height: "1px",
          background: "#c9a984",
          opacity: 0.45,
          marginBottom: ".75rem",
          transition: `width .6s ease ${delay + 400}ms`,
        }}
      />

      {/* Label */}
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(.6rem, 1.2vw, .72rem)",
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "#9a9088",
          textAlign: "center",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "#0b0907",
        borderTop: "1px solid #1a1816",
        borderBottom: "1px solid #1a1816",
        padding: "clamp(3rem, 8vh, 6rem) 1rem",
      }}
    >
      {/* Section label */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "clamp(2rem, 5vh, 4rem)",
          opacity: started ? 1 : 0,
          transition: "opacity .6s ease",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: ".5rem",
            letterSpacing: ".45em",
            textTransform: "uppercase",
            color: "#c9a984",
            opacity: .7,
          }}
        >
          Moodilier în cifre
        </span>
      </div>

      {/* Stats grid */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 0,
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              borderRight: i < STATS.length - 1 ? "1px solid #1e1c1a" : "none",
            }}
          >
            <StatCard stat={stat} started={started} delay={i * 120} />
          </div>
        ))}
      </div>
    </section>
  );
}
