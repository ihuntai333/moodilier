"use client";

/**
 * PageLoader — Branded intro screen cu logo Moodilier animat.
 * Secvență: logo fade-in → linie aurie → tagline → fade-out pagină.
 * Pure CSS, pointer-events: none, nu blochează LCP.
 */

const CSS = `
.pg-loader {
  position: fixed; inset: 0; z-index: 9999;
  background: #0b0907;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.4rem;
  pointer-events: none;
  animation: pgOut 0.9s cubic-bezier(.6,0,.3,1) 2.1s both;
}

/* Logo */
.pg-logo {
  width: clamp(140px, 22vw, 220px);
  opacity: 0;
  transform: translateY(12px);
  animation: pgLogoIn 0.9s cubic-bezier(.16,1,.3,1) 0.25s both;
  filter: brightness(0) invert(1);
}

/* Gold line */
.pg-line {
  width: 0;
  height: 1px;
  background: #c9a984;
  animation: pgLineIn 0.8s cubic-bezier(.4,0,.2,1) 0.85s both;
}

/* Tagline */
.pg-tag {
  opacity: 0;
  font-family: 'Inter', sans-serif;
  font-size: clamp(.42rem, 1.1vw, .55rem);
  letter-spacing: .42em;
  text-transform: uppercase;
  color: #c9a984;
  animation: pgTagIn 0.7s ease 1.15s both;
}

@keyframes pgLogoIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pgLineIn {
  from { width: 0; }
  to   { width: clamp(100px, 16vw, 160px); }
}
@keyframes pgTagIn {
  from { opacity: 0; }
  to   { opacity: 0.7; }
}
@keyframes pgOut {
  0%   { opacity: 1; }
  100% { opacity: 0; pointer-events: none; }
}
@media (prefers-reduced-motion: reduce) {
  .pg-loader { animation-duration: 0.1s; animation-delay: 0s; }
  .pg-logo, .pg-line, .pg-tag { animation: none; opacity: 1; }
}
`;

export default function PageLoader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg-loader" aria-hidden="true">
        <img
          src="/brand/logo-white.png"
          alt="Moodilier"
          className="pg-logo"
        />
        <div className="pg-line" />
        <span className="pg-tag">Mobilier Premium</span>
      </div>
    </>
  );
}
