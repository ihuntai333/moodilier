"use client";
import { useState, useEffect } from "react";
import { X, Check, ChevronDown } from "lucide-react";

interface Consents {
  necessary: boolean;
  statistics: boolean;
  marketing: boolean;
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
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function acceptAll() {
    const all = { necessary: true, statistics: true, marketing: true };
    localStorage.setItem("moodilier-cookie-consent", JSON.stringify(all));
    setShow(false);
  }

  function rejectAll() {
    const none = { necessary: true, statistics: false, marketing: false };
    localStorage.setItem("moodilier-cookie-consent", JSON.stringify(none));
    setShow(false);
  }

  function savePrefs() {
    localStorage.setItem("moodilier-cookie-consent", JSON.stringify(consents));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className={`cookie-banner ${show ? "show" : ""}`} role="dialog" aria-label="Consimțământ cookie-uri">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <p className="label">Cookie-uri</p>
        <button
          onClick={rejectAll}
          style={{ background: "none", border: "none", color: "var(--color-fg-subtle)", cursor: "pointer" }}
          aria-label="Închide"
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: "0.85rem", color: "var(--color-fg-muted)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
        Folosim cookie-uri pentru a face site-ul să funcționeze corect și pentru a îmbunătăți experiența ta. 
        Poți alege ce tipuri de cookie-uri permiți.
      </p>

      {showDetails && (
        <div style={{ marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { key: "necessary", label: "Necesare", desc: "Esențiale pentru funcționarea site-ului.", locked: true },
            { key: "statistics", label: "Statistici", desc: "Ajută la înțelegerea comportamentului vizitatorilor.", locked: false },
            { key: "marketing", label: "Marketing", desc: "Folosite pentru publicitate personalizată.", locked: false },
          ].map((cat) => (
            <label
              key={cat.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem",
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                cursor: cat.locked ? "default" : "pointer",
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "0.2rem" }}>{cat.label}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-fg-subtle)" }}>{cat.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={consents[cat.key as keyof Consents]}
                disabled={cat.locked}
                onChange={() =>
                  !cat.locked &&
                  setConsents((prev) => ({ ...prev, [cat.key]: !prev[cat.key as keyof Consents] }))
                }
                style={{ accentColor: "var(--color-gold)", width: "1rem", height: "1rem" }}
              />
            </label>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={acceptAll} style={{ flex: 1, justifyContent: "center" }}>
          <Check size={14} />
          Acceptă toate
        </button>
        <button className="btn btn-outline" onClick={rejectAll} style={{ flex: 1, justifyContent: "center", fontSize: "0.65rem" }}>
          Refuz
        </button>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          background: "none",
          border: "none",
          color: "var(--color-gold)",
          cursor: "pointer",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          marginTop: "0.75rem",
          padding: 0,
        }}
      >
        <ChevronDown size={14} style={{ transform: showDetails ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
        {showDetails ? "Ascunde opțiuni" : "Personalizează"}
      </button>

      {showDetails && (
        <button
          className="btn btn-ghost"
          onClick={savePrefs}
          style={{ marginTop: "0.75rem", fontSize: "0.65rem" }}
        >
          Salvează preferințele
        </button>
      )}
    </div>
  );
}
