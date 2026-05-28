"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle, AlertCircle } from "lucide-react";

interface Settings {
  ga4Id: string;
  pixelId: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  siteTitle: string;
  metaDescription: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "#0f0e0d",
  border: "1px solid #2a2724",
  borderRadius: "4px",
  color: "#e8e0d5",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 150ms ease",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9a9088",
  letterSpacing: "0.05em",
  marginBottom: "0.5rem",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.65rem",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "#5a5450",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid #2a2724",
        marginBottom: "1.25rem",
      }}
    >
      {children}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    ga4Id: "",
    pixelId: "",
    phone: "",
    email: "",
    address: "",
    instagram: "",
    facebook: "",
    whatsapp: "",
    siteTitle: "",
    metaDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function setField(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Eroare la salvare.");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Eroare de conexiune.");
    } finally {
      setSaving(false);
    }
  }

  function focusInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    (e.target as HTMLElement).style.borderColor = "#c9a984";
  }
  function blurInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    (e.target as HTMLElement).style.borderColor = "#2a2724";
  }

  if (loading) {
    return (
      <div style={{ padding: "2.5rem 2rem", color: "#6a6460", fontSize: "0.875rem" }}>
        Se încarcă setările...
      </div>
    );
  }

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: "720px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 500,
            color: "#e8e0d5",
            marginBottom: "0.25rem",
          }}
        >
          Setări
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#6a6460", maxWidth: "none" }}>
          Configurați informațiile generale și integrările site-ului.
        </p>
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.875rem 1rem",
            background: "rgba(224,112,112,0.1)",
            border: "1px solid rgba(224,112,112,0.3)",
            borderRadius: "6px",
            color: "#e07070",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.875rem 1rem",
            background: "rgba(109,191,138,0.1)",
            border: "1px solid rgba(109,191,138,0.3)",
            borderRadius: "6px",
            color: "#6dbf8a",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          <CheckCircle size={16} />
          Setările au fost salvate cu succes!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Analytics */}
        <div
          style={{
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "8px",
            padding: "1.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <SectionTitle>Google Analytics &amp; Facebook Pixel</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>
                GA4 Measurement ID
                <span style={{ marginLeft: "0.5rem", color: "#4a4540", fontWeight: 400 }}>
                  (ex. G-XXXXXXXXXX)
                </span>
              </label>
              <input
                type="text"
                value={settings.ga4Id}
                onChange={(e) => setField("ga4Id", e.target.value)}
                placeholder="G-XXXXXXXXXX"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
              <p style={{ fontSize: "0.75rem", color: "#4a4540", marginTop: "0.4rem" }}>
                Lasă gol pentru a dezactiva Google Analytics.
              </p>
            </div>
            <div>
              <label style={labelStyle}>
                Facebook Pixel ID
                <span style={{ marginLeft: "0.5rem", color: "#4a4540", fontWeight: 400 }}>
                  (ex. 1234567890123456)
                </span>
              </label>
              <input
                type="text"
                value={settings.pixelId}
                onChange={(e) => setField("pixelId", e.target.value)}
                placeholder="1234567890123456"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
              <p style={{ fontSize: "0.75rem", color: "#4a4540", marginTop: "0.4rem" }}>
                Găsești ID-ul în Meta Business → Events Manager → Pixel → Settings.
                Lasă gol pentru a dezactiva.
              </p>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div
          style={{
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "8px",
            padding: "1.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <SectionTitle>SEO și Metadate</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Titlu site</label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setField("siteTitle", e.target.value)}
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
            <div>
              <label style={labelStyle}>Meta descriere</label>
              <textarea
                value={settings.metaDescription}
                onChange={(e) => setField("metaDescription", e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div
          style={{
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "8px",
            padding: "1.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <SectionTitle>Informații de Contact</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Telefon</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="(+40) 729 555 431"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="ofertare@moodilier.com"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
            <div>
              <label style={labelStyle}>Adresă</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="Blv. Basarabia 256..."
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
            <div>
              <label style={labelStyle}>
                WhatsApp
                <span style={{ marginLeft: "0.5rem", color: "#4a4540", fontWeight: 400 }}>
                  (număr internațional fără +)
                </span>
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setField("whatsapp", e.target.value)}
                placeholder="40729555431"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
          </div>
        </div>

        {/* Social */}
        <div
          style={{
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "8px",
            padding: "1.75rem",
            marginBottom: "2rem",
          }}
        >
          <SectionTitle>Rețele Sociale</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Instagram URL</label>
              <input
                type="url"
                value={settings.instagram}
                onChange={(e) => setField("instagram", e.target.value)}
                placeholder="https://www.instagram.com/moodilier/"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
            <div>
              <label style={labelStyle}>Facebook URL</label>
              <input
                type="url"
                value={settings.facebook}
                onChange={(e) => setField("facebook", e.target.value)}
                placeholder="https://www.facebook.com/moodilier"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.875rem 2rem",
            background: saving ? "#8a7a64" : "#c9a984",
            color: "#0f0e0d",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          <Save size={15} />
          {saving ? "Se salvează..." : "Salvează Setările"}
        </button>
      </form>
    </div>
  );
}
