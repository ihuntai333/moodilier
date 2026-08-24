"use client";

import { useState, useEffect } from "react";
import { X, Check, ChevronDown } from "lucide-react";

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
  const [showDetails, setShowDetails] = useState(false);
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

  function rejectAll() {
    emitConsent({ necessary: true, statistics: false, marketing: false });
    setShow(false);
  }

  function savePrefs() {
    emitConsent(consents);
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className={`cookie-banner ${show ? "show" : ""}`} role="dialog" aria-label="Consimțământ cookie-uri">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <p className="cookie-banner-label">Cookie-uri</p>
        <button
          type="button"
          onClick={rejectAll}
          style={{ background: "none", border: "none", color: "#777", cursor: "pointer" }}
          aria-label="Închide"
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: "1.25rem", lineHeight: 1.6 }}>
        Folosim cookie-uri pentru funcționarea site-ului și, cu acordul tău, pentru statistici
        (Google Analytics) și marketing (Meta Pixel).
      </p>

      {showDetails && (
        <div style={{ marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(
            [
              {
                key: "necessary" as const,
                label: "Necesare",
                desc: "Esențiale pentru funcționarea site-ului.",
                locked: true,
              },
              {
                key: "statistics" as const,
                label: "Statistici",
                desc: "Google Analytics — măsurarea traficului.",
                locked: false,
              },
              {
                key: "marketing" as const,
                label: "Marketing",
                desc: "Meta Pixel — reclame și conversii.",
                locked: false,
              },
            ] as const
          ).map((row) => (
            <label
              key={row.key}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                fontSize: "0.8rem",
                color: "#333",
              }}
            >
              <input
                type="checkbox"
                checked={consents[row.key]}
                disabled={row.locked}
                onChange={(e) =>
                  setConsents((prev) => ({ ...prev, [row.key]: e.target.checked }))
                }
              />
              <span>
                <strong>{row.label}</strong>
                <br />
                <span style={{ color: "#777" }}>{row.desc}</span>
              </span>
            </label>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button type="button" className="cookie-btn cookie-btn-primary" onClick={acceptAll}>
          <Check size={14} /> Acceptă tot
        </button>
        <button type="button" className="cookie-btn" onClick={rejectAll}>
          Doar necesare
        </button>
        <button
          type="button"
          className="cookie-btn"
          onClick={() => setShowDetails((v) => !v)}
        >
          <ChevronDown size={14} />
          {showDetails ? "Ascunde" : "Personalizează"}
        </button>
        {showDetails && (
          <button type="button" className="cookie-btn cookie-btn-primary" onClick={savePrefs}>
            Salvează
          </button>
        )}
      </div>
    </div>
  );
}
