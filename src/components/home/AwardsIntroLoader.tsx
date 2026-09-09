"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { IntroConfig } from "@/lib/site-settings";
import { DEFAULT_INTRO, DEFAULT_INTRO_IMAGES } from "@/lib/site-settings";

/** Kept for admin/tools that may clear it; homepage intro runs every visit. */
export const INTRO_KEY = "moodilier-intro-seen";

const CSS = `
.aw-intro {
  position: fixed; inset: 0; z-index: 10000;
  background: #070707;
  overflow: hidden;
  color: #fff;
  cursor: pointer;
  opacity: 1;
  transition: opacity 420ms cubic-bezier(0.23, 1, 0.32, 1);
}
.aw-intro.is-leaving {
  opacity: 0;
  pointer-events: none;
}
.aw-intro-veil {
  position: absolute; inset: 0; z-index: 2;
  background:
    radial-gradient(ellipse 55% 50% at 50% 48%, rgba(7,7,7,.18) 0%, rgba(7,7,7,.72) 55%, rgba(7,7,7,.94) 100%);
  pointer-events: none;
  opacity: 0;
  animation: aw-intro-veil-in 900ms cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards;
}
.aw-intro-grid {
  position: absolute; inset: -2%;
  display: grid;
  grid-template-columns: 1.15fr 1fr 1fr 1.15fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  padding: 8px;
  z-index: 1;
}
.aw-intro-frame {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background: #151515;
  opacity: 0;
  clip-path: inset(12% 12% 12% 12%);
  transform: translate3d(0, 18px, 0) scale(0.97);
  animation:
    aw-intro-reveal 1.05s cubic-bezier(0.16, 1, 0.3, 1) forwards,
    aw-intro-settle 4.8s cubic-bezier(0.23, 1, 0.32, 1) 1.05s forwards;
}
.aw-intro-frame img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  filter: saturate(.55) brightness(.72);
  transform: scale(1.12);
  animation: aw-intro-ken 6s cubic-bezier(0.23, 1, 0.32, 1) 0.55s both;
}
.aw-intro-frame:nth-child(1) { grid-column: 1; grid-row: 1 / span 2; animation-delay: 0.08s, 1.13s; }
.aw-intro-frame:nth-child(2) { grid-column: 2 / span 2; grid-row: 1; animation-delay: 0.22s, 1.27s; }
.aw-intro-frame:nth-child(3) { grid-column: 2 / span 2; grid-row: 2; animation-delay: 0.36s, 1.41s; }
.aw-intro-frame:nth-child(4) { grid-column: 4; grid-row: 1 / span 2; animation-delay: 0.5s, 1.55s; }
.aw-intro-frame:nth-child(1) img { animation-delay: 0.2s; }
.aw-intro-frame:nth-child(2) img { animation-delay: 0.35s; }
.aw-intro-frame:nth-child(3) img { animation-delay: 0.5s; }
.aw-intro-frame:nth-child(4) img { animation-delay: 0.65s; }
@keyframes aw-intro-reveal {
  from {
    opacity: 0;
    clip-path: inset(14% 14% 14% 14%);
    transform: translate3d(0, 22px, 0) scale(0.96);
  }
  to {
    opacity: 1;
    clip-path: inset(0 0 0 0);
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes aw-intro-settle {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(0, -4px, 0) scale(1.01); }
}
@keyframes aw-intro-ken {
  from { transform: scale(1.12) translate3d(0, 2%, 0); }
  to { transform: scale(1.04) translate3d(0, -1%, 0); }
}
@keyframes aw-intro-veil-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes aw-intro-logo-in {
  from { opacity: 0; transform: translate3d(0, 10px, 0) scale(0.97); }
  to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
@media (max-width: 700px) {
  .aw-intro-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .aw-intro-frame:nth-child(n) { grid-column: auto; grid-row: auto; }
}
.aw-intro-center {
  position: absolute; inset: 0; z-index: 5;
  display: grid; place-items: center;
  pointer-events: none;
}
.aw-intro-plate {
  text-align: center;
  padding: 1.25rem 1.5rem;
  max-width: min(92vw, 420px);
  opacity: 0;
  animation: aw-intro-logo-in 780ms cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
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
.aw-intro-eyebrow,
.aw-intro-name { display: none !important; }
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
.aw-intro-tag:empty { display: none; }
.aw-intro-plate:has(.aw-intro-tag:empty) .aw-intro-rule { display: none; }
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
  animation: aw-intro-bar 2.6s linear forwards;
}
@keyframes aw-intro-bar {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@media (prefers-reduced-motion: reduce) {
  .aw-intro { transition: opacity 160ms ease; }
  .aw-intro-progress > span { animation: none; transform: scaleX(1); }
  .aw-intro-frame,
  .aw-intro-frame img,
  .aw-intro-veil,
  .aw-intro-plate { animation: none !important; opacity: 1; transform: none; clip-path: none; }
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
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const closing = useRef(false);
  const frames = (config.images?.length ? config.images : DEFAULT_INTRO_IMAGES).slice(0, 4);
  const logo = `/brand/logo-white.png?v=20260824c`;
  // No text under logo — motion only
  const tagline = "";

  function close() {
    if (closing.current) return;
    closing.current = true;
    finishIntro();
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShow(false);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => setShow(false), 420);
  }

  useLayoutEffect(() => {
    if (!enabled) {
      finishIntro();
      return;
    }
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finishIntro();
        return;
      }
    } catch {
      /* ignore */
    }
    document.documentElement.classList.add("aw-intro-pending");
    document.documentElement.classList.remove("aw-intro-done");
    document.body.style.overflow = "hidden";
    setShow(true);
  }, [enabled]);

  useEffect(() => {
    if (!show) return;
    const failsafe = window.setTimeout(close, 2800);
    return () => window.clearTimeout(failsafe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div
        className={`aw-intro${leaving ? " is-leaving" : ""}`}
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
              <img
                src={src}
                alt=""
                decoding="async"
                loading={i < 2 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
              />
            </div>
          ))}
        </div>
        <div className="aw-intro-veil" />
        <div className="aw-intro-center">
          <div className="aw-intro-plate">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="Moodilier" className="aw-intro-logo" />
            {tagline.trim() ? (
              <>
                <span className="aw-intro-rule" />
                <span className="aw-intro-tag">{tagline}</span>
              </>
            ) : null}
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
