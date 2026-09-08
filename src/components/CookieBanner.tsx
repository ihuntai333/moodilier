"use client";

import { useState, useEffect } from "react";

interface Consents {
  necessary: boolean;
  statistics: boolean;
  marketing: boolean;
}

function emitConsent(consents: Consents) {
  localStorage.setItem("moodilier-cookie-consent", JSON.stringify(consents));
  window.dispatchEvent(new CustomEvent("moodilier-consent", { detail: consents }));
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [consents, setConsents] = useState<Consents>({
    necessary: true,
    statistics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("moodilier-cookie-consent");
    if (!stored) {
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function acceptAll() {
    emitConsent({ necessary: true, statistics: true, marketing: true });
    setShow(false);
  }

  function rejectOptional() {
    emitConsent({ necessary: true, statistics: false, marketing: false });
    setShow(false);
  }

  function savePrefs() {
    emitConsent({
      necessary: true,
      statistics: consents.statistics,
      marketing: consents.marketing,
    });
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className={`cookie-notice${prefsOpen ? " is-expanded" : ""}`}
      role="dialog"
      aria-label="Preferințe cookie"
    >
      <div className="cookie-notice-inner">
        <p className="cookie-notice-text">
          Folosim cookie-uri necesare și, cu acordul tău, statistici și marketing.{" "}
          <a href="/politica-cookies">Politica cookie</a>
          {" · "}
          <a href="/politica-de-confidentialitate">Confidențialitate</a>
        </p>
        <div className="cookie-notice-actions">
          <button
            type="button"
            className="cookie-notice-btn cookie-notice-btn--ghost"
            onClick={rejectOptional}
          >
            Doar necesare
          </button>
          <button
            type="button"
            className="cookie-notice-btn cookie-notice-btn--ghost"
            onClick={() => setPrefsOpen((v) => !v)}
            aria-expanded={prefsOpen}
          >
            {prefsOpen ? "Ascunde" : "Opțiuni"}
          </button>
          <button
            type="button"
            className="cookie-notice-btn cookie-notice-btn--solid"
            onClick={acceptAll}
          >
            Accept
          </button>
        </div>
      </div>

      <div className="cookie-notice-prefs" aria-hidden={!prefsOpen}>
        <div className="cookie-notice-prefs-inner">
          <label className="cookie-notice-row">
            <input type="checkbox" checked disabled readOnly />
            <span>
              <strong>Necesare</strong>
              <em>Funcționare, securitate, preferințe — mereu active.</em>
            </span>
          </label>
          <label className="cookie-notice-row">
            <input
              type="checkbox"
              checked={consents.statistics}
              onChange={(e) =>
                setConsents((c) => ({ ...c, statistics: e.target.checked }))
              }
            />
            <span>
              <strong>Statistici</strong>
              <em>Google Analytics — măsurarea traficului.</em>
            </span>
          </label>
          <label className="cookie-notice-row">
            <input
              type="checkbox"
              checked={consents.marketing}
              onChange={(e) =>
                setConsents((c) => ({ ...c, marketing: e.target.checked }))
              }
            />
            <span>
              <strong>Marketing</strong>
              <em>Meta Pixel — campanii și conversii.</em>
            </span>
          </label>
          <button
            type="button"
            className="cookie-notice-btn cookie-notice-btn--solid"
            onClick={savePrefs}
          >
            Salvează preferințele
          </button>
        </div>
      </div>
    </div>
  );
}
