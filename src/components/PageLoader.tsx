"use client";

/**
 * PageLoader — Branded intro cu logo text animat.
 * Folosește Cormorant Garamond (deja încărcat pe site) —
 * mai premium decât imaginea cu fundal non-transparent.
 * Secvență: litere → linie aurie → tagline → fade-out pagină.
 */

const CSS = `
.pg-loader {
  position: fixed; inset: 0; z-index: 9999;
  background: #0b0907;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  animation: pgOut 0.85s cubic-bezier(.6,0,.3,1) 2.2s both;
}

/* Logo text */
.pg-logo-name {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: clamp(2.2rem, 6vw, 4.2rem);
  font-weight: 300;
  letter-spacing: .38em;
  text-transform: uppercase;
  color: #e8e0d5;
  opacity: 0;
  transform: translateY(10px);
  animation: pgLogoIn 1s cubic-bezier(.16,1,.3,1) 0.2s both;
  white-space: nowrap;
  padding-right: .38em; /* compensate letter-spacing on last char */
}

/* Signature subtitle */
.pg-logo-sub {
  font-family: 'Inter', sans-serif;
  font-size: clamp(.38rem, .9vw, .48rem);
  letter-spacing: .55em;
  text-transform: uppercase;
  color: #c9a984;
  opacity: 0;
  margin-top: .5rem;
  animation: pgTagIn 0.8s ease 0.85s both;
  padding-right: .55em;
}

/* Gold divider line */
.pg-line {
  width: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, #c9a984, transparent);
  margin: 1.1rem 0 .9rem;
  animation: pgLineIn 0.9s cubic-bezier(.4,0,.2,1) 0.72s both;
}

/* Tagline */
.pg-tag {
  font-family: 'Inter', sans-serif;
  font-size: clamp(.34rem, .75vw, .42rem);
  letter-spacing: .42em;
  text-transform: uppercase;
  color: #c9a984;
  opacity: 0;
  animation: pgTagIn 0.7s ease 1.1s both;
  padding-right: .42em;
}

@keyframes pgLogoIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pgLineIn {
  from { width: 0; }
  to   { width: clamp(80px, 12vw, 140px); }
}
@keyframes pgTagIn {
  from { opacity: 0; }
  to   { opacity: 0.65; }
}
@keyframes pgOut {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .pg-loader { animation-duration: 0.1s; animation-delay: 0s; }
  .pg-logo-name, .pg-logo-sub, .pg-line, .pg-tag { animation: none; opacity: 1; width: 120px; }
}
`;

export default function PageLoader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg-loader" aria-hidden="true">
        <div className="pg-logo-name">Moodilier</div>
        <div className="pg-logo-sub">• Signature •</div>
        <div className="pg-line" />
        <span className="pg-tag">Mobilier Premium</span>
      </div>
    </>
  );
}
