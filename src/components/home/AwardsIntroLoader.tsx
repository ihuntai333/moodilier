"use client";

import { useEffect, useRef, useState } from "react";
import type { IntroConfig } from "@/lib/site-settings";
import { DEFAULT_INTRO, DEFAULT_INTRO_IMAGES } from "@/lib/site-settings";

export const INTRO_KEY = "moodilier-intro-seen";

const CSS = `
.aw-intro {
  position: fixed; inset: 0; z-index: 10000;
  background: #070707;
  overflow: hidden;
  color: #fff;
  cursor: pointer;
}
.aw-intro-veil {
  position: absolute; inset: 0; z-index: 2;
  background:
    radial-gradient(ellipse 55% 50% at 50% 48%, rgba(7,7,7,.2) 0%, rgba(7,7,7,.75) 55%, rgba(7,7,7,.94) 100%);
  pointer-events: none;
}
.aw-intro-grid {
  position: absolute; inset: -4%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  padding: 10px;
  z-index: 1;
}
.aw-intro-frame {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background: #151515;
}
.aw-intro-frame img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  filter: saturate(.55) brightness(.72);
}
.aw-intro-frame:nth-child(1) { grid-column: 1; grid-row: 1 / span 2; }
.aw-intro-frame:nth-child(2) { grid-column: 2; grid-row: 1; }
.aw-intro-frame:nth-child(3) { grid-column: 3; grid-row: 1; }
.aw-intro-frame:nth-child(4) { grid-column: 4; grid-row: 1 / span 2; }
.aw-intro-frame:nth-child(5) { grid-column: 2; grid-row: 2; }
.aw-intro-frame:nth-child(6) { grid-column: 3; grid-row: 2; }
.aw-intro-frame:nth-child(7),
.aw-intro-frame:nth-child(8) { display: none; }
@media (min-width: 900px) {
  .aw-intro-grid { grid-template-columns: repeat(6, 1fr); }
  .aw-intro-frame:nth-child(5) { grid-column: 5; grid-row: 1; }
  .aw-intro-frame:nth-child(6) { grid-column: 6; grid-row: 1 / span 2; }
  .aw-intro-frame:nth-child(7) { display: block; grid-column: 2; grid-row: 2; }
  .aw-intro-frame:nth-child(8) { display: block; grid-column: 3 / span 2; grid-row: 2; }
}
.aw-intro-center {
  position: absolute; inset: 0; z-index: 5;
  display: grid; place-items: center;
  pointer-events: none;
}
.aw-intro-plate {
  text-align: center;
  padding: 1.25rem 1.5rem;
  background: transparent;
  backdrop-filter: none;
  border: 0;
  max-width: min(92vw, 420px);
}
.aw-intro-logo {
  display: block;
  margin: 0 auto;
  max-height: clamp(72px, 16vw, 120px);
  max-width: min(86vw, 360px);
  width: auto;
  height: auto;
  object-fit: contain;
  mix-blend-mode: screen;
}
.aw-intro-eyebrow {
  display: none;
}
.aw-intro-name {
  display: none !important;
}
.aw-intro-rule {
  display: block;
  height: 1px;
  width: 72px;
  margin: 1rem auto 0.85rem;
  background: linear-gradient(90deg, transparent, rgba(239,174,116,.95), transparent);
}
.aw-intro-tag {
  display: block;
  font-family: var(--awards-font-display), "Playfair Display", Georgia, serif;
  font-size: clamp(0.9rem, 2vw, 1.15rem);
  font-style: italic;
  color: rgba(255,255,255,.78);
}
.aw-intro-skip {
  position: absolute;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 8;
  border: 1px solid rgba(255,255,255,.25);
  background: rgba(0,0,0,.35);
  color: rgba(255,255,255,.85);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.55rem 0.85rem;
  cursor: pointer;
  pointer-events: auto;
}
.aw-intro-progress {
  position: absolute;
  left: 50%;
  bottom: 8%;
  transform: translateX(-50%);
  z-index: 6;
  width: min(140px, 28vw);
  height: 1px;
  background: rgba(255,255,255,.15);
  overflow: hidden;
  pointer-events: none;
}
.aw-intro-progress > span {
  display: block;
  height: 100%;
  width: 100%;
  background: #efae74;
  transform-origin: left center;
  animation: aw-intro-bar 2.4s linear forwards;
}
@keyframes aw-intro-bar {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
`;

function finishIntro() {
  document.documentElement.classList.remove("aw-intro-pending");
  document.documentElement.classList.add("aw-intro-done");
  document.body.style.removeProperty("overflow");
  window.dispatchEvent(new CustomEvent("aw-intro-done"));
}

export default function AwardsIntroLoader({
  config = DEFAULT_INTRO,
}: {
  config?: IntroConfig;
}) {
  const enabled = config.enabled !== false;
  const [show, setShow] = useState(enabled);
  const closing = useRef(false);

  const frames = (config.images?.length ? config.images : DEFAULT_INTRO_IMAGES).slice(0, 8);
  // Always use official brand asset — never CSS wordmark / stale admin URL
  const logo = `/brand/logo-white.png?v=20260824c`;
  const tagline = config.tagline || DEFAULT_INTRO.tagline;

  function close() {
    if (closing.current) return;
    closing.current = true;
    finishIntro();
    setShow(false);
  }

  useEffect(() => {
    if (!enabled) {
      finishIntro();
      setShow(false);
      return;
    }

    // Always show loader on each homepage visit
    try {
      sessionStorage.removeItem(INTRO_KEY);
    } catch {
      /* ignore */
    }

    document.documentElement.classList.add("aw-intro-pending");
    document.body.style.overflow = "hidden";
    setShow(true);

    const failsafe = window.setTimeout(close, 2800);

    return () => {
      window.clearTimeout(failsafe);
      document.body.style.removeProperty("overflow");
      document.documentElement.classList.remove("aw-intro-pending");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!show) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div
        className="aw-intro"
        role="presentation"
        onClick={close}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter" || e.key === " ") close();
        }}
      >
        <div className="aw-intro-grid">
          {frames.map((src, i) => (
            <div key={`${src}-${i}`} className="aw-intro-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </div>
          ))}
        </div>
        <div className="aw-intro-veil" />
        <div className="aw-intro-center">
          <div className="aw-intro-plate">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="Moodilier" className="aw-intro-logo" />
            <span className="aw-intro-rule" />
            <span className="aw-intro-tag">{tagline}</span>
          </div>
        </div>
        <div className="aw-intro-progress">
          <span />
        </div>
        <button type="button" className="aw-intro-skip" onClick={close}>
          Skip
        </button>
      </div>
    </>
  );
}
