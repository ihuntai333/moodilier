"use client";

import { useEffect, useRef, useState } from "react";
import { Save, CheckCircle, AlertCircle, Plus, Trash2, Upload, X } from "lucide-react";
import {
  DEFAULT_FOOTER_LEGAL,
  DEFAULT_FOOTER_MENU,
  DEFAULT_HEADER_MENU,
  DEFAULT_HERO_SLIDES,
  DEFAULT_INTRO_IMAGES,
  SETTINGS_STRING_DEFAULTS,
  type HeroSlide,
  type NavLink,
} from "@/lib/site-settings";
import HeroSliderEditor from "@/components/admin/HeroSliderEditor";

type FlatSettings = Record<string, string>;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "#0f0e0d",
  border: "1px solid #2a2724",
  borderRadius: "4px",
  color: "#e8e0d5",
  fontSize: "0.875rem",
  outline: "none",
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

function parseMenu(raw: string, fallback: NavLink[]): NavLink[] {
  try {
    const parsed = JSON.parse(raw || "[]") as NavLink[];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* ignore */
  }
  return fallback.map((l) => ({ ...l }));
}

function MenuEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: NavLink[];
  onChange: (next: NavLink[]) => void;
}) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <label style={{ ...labelStyle, marginBottom: 0 }}>{title}</label>
        <button
          type="button"
          className="adm-btn adm-btn-ghost"
          style={{ fontSize: "0.75rem", padding: "0.35rem 0.6rem" }}
          onClick={() => onChange([...items, { label: "Link nou", href: "/" }])}
        >
          <Plus size={13} /> Adaugă
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr auto",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <input
              style={inputStyle}
              value={item.label}
              placeholder="Etichetă"
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], label: e.target.value };
                onChange(next);
              }}
            />
            <input
              style={inputStyle}
              value={item.href}
              placeholder="/pagina"
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], href: e.target.value };
                onChange(next);
              }}
            />
            <button
              type="button"
              aria-label="Șterge"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              style={{
                background: "transparent",
                border: "1px solid #2a2724",
                borderRadius: 4,
                color: "#e07070",
                padding: "0.65rem",
                cursor: "pointer",
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<FlatSettings>({ ...SETTINGS_STRING_DEFAULTS });
  const [headerMenu, setHeaderMenu] = useState<NavLink[]>(DEFAULT_HEADER_MENU);
  const [footerMenu, setFooterMenu] = useState<NavLink[]>(DEFAULT_FOOTER_MENU);
  const [footerLegal, setFooterLegal] = useState<NavLink[]>(DEFAULT_FOOTER_LEGAL);
  const [introImages, setIntroImages] = useState<string[]>(DEFAULT_INTRO_IMAGES);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(
    DEFAULT_HERO_SLIDES.map((s) => ({ ...s }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingIntro, setUploadingIntro] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [testingMail, setTestingMail] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const introLogoInputRef = useRef<HTMLInputElement>(null);
  const introImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: FlatSettings) => {
        setSettings({ ...SETTINGS_STRING_DEFAULTS, ...data });
        setHeaderMenu(parseMenu(data.headerMenu, DEFAULT_HEADER_MENU));
        setFooterMenu(parseMenu(data.footerMenu, DEFAULT_FOOTER_MENU));
        setFooterLegal(parseMenu(data.footerLegal, DEFAULT_FOOTER_LEGAL));
        try {
          const imgs = JSON.parse(data.introImages || "[]") as string[];
          setIntroImages(
            Array.isArray(imgs) && imgs.length
              ? imgs.filter(Boolean).slice(0, 8)
              : DEFAULT_INTRO_IMAGES
          );
        } catch {
          setIntroImages(DEFAULT_INTRO_IMAGES);
        }
        try {
          const slides = JSON.parse(data.heroSlides || "[]") as HeroSlide[];
          setHeroSlides(
            Array.isArray(slides) && slides.length
              ? slides
              : DEFAULT_HERO_SLIDES.map((s) => ({ ...s }))
          );
        } catch {
          setHeroSlides(DEFAULT_HERO_SLIDES.map((s) => ({ ...s })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data: { smtpConfigured?: boolean }) => {
        setSmtpConfigured(Boolean(data.smtpConfigured));
      })
      .catch(() => {});
  }, []);

  async function testContactEmail() {
    setTestingMail(true);
    setError("");
    try {
      const res = await fetch("/api/admin/contact-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: settings.contactNotifyEmail || settings.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Test eșuat");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test email eșuat");
    } finally {
      setTestingMail(false);
    }
  }

  function setField(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadLogo(file: File, field: "logoUrl" | "introLogoUrl" = "logoUrl") {
    setUploadingLogo(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("slug", "branding");
      formData.append("images", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload eșuat");
      const url = data.urls?.[0] || data.paths?.[0];
      if (!url) throw new Error("URL logo lipsă");
      setField(field, url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload logo eșuat");
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
      if (introLogoInputRef.current) introLogoInputRef.current.value = "";
    }
  }

  async function uploadIntroImages(files: FileList) {
    if (!files.length) return;
    setUploadingIntro(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("slug", "intro");
      Array.from(files).slice(0, 8).forEach((f) => formData.append("images", f));
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload eșuat");
      const urls: string[] = data.paths || data.urls || [];
      if (!urls.length) throw new Error("Nicio imagine încărcată");
      setIntroImages((prev) => [...prev, ...urls].slice(0, 8));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload imagini intro eșuat");
    } finally {
      setUploadingIntro(false);
      if (introImageInputRef.current) introImageInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const payload: FlatSettings = {
      ...settings,
      headerMenu: JSON.stringify(headerMenu),
      footerMenu: JSON.stringify(footerMenu),
      footerLegal: JSON.stringify(footerLegal),
      introImages: JSON.stringify(introImages),
      heroSlides: JSON.stringify(heroSlides),
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  if (loading) {
    return (
      <div className="adm-page adm-page--narrow">
        <p className="adm-subtitle">Se încarcă setările...</p>
      </div>
    );
  }

  return (
    <div className="adm-page adm-page--narrow">
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="adm-title">Setări</h1>
        <p className="adm-subtitle">
          Logo, meniuri, contact, SEO și integrări — apar pe site după salvare.
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
          Setările au fost salvate.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Branding + menus */}
        <div
          style={{
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "8px",
            padding: "1.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <SectionTitle>Branding · Header · Footer</SectionTitle>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Nume brand (header)</label>
              <input
                style={inputStyle}
                value={settings.brandName || ""}
                onChange={(e) => setField("brandName", e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Logo</label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadLogo(file);
                }}
              />
              {settings.logoUrl ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.75rem",
                    padding: "0.75rem",
                    border: "1px solid #2a2724",
                    borderRadius: 6,
                    background: "#0f0e0d",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.logoUrl}
                    alt="Logo"
                    style={{ maxHeight: 48, maxWidth: 180, objectFit: "contain" }}
                  />
                  <button
                    type="button"
                    onClick={() => setField("logoUrl", "")}
                    style={{
                      marginLeft: "auto",
                      background: "transparent",
                      border: "none",
                      color: "#e07070",
                      cursor: "pointer",
                    }}
                    aria-label="Elimină logo"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                disabled={uploadingLogo}
                onClick={() => logoInputRef.current?.click()}
              >
                <Upload size={14} />
                {uploadingLogo ? "Se încarcă..." : settings.logoUrl ? "Înlocuiește logo" : "Încarcă logo"}
              </button>
              <p style={{ fontSize: "0.75rem", color: "#4a4540", marginTop: "0.5rem" }}>
                PNG / SVG / WebP. Dacă lipsește, apare textul brandului.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={labelStyle}>Text buton CTA header</label>
                <input
                  style={inputStyle}
                  value={settings.ctaLabel || ""}
                  onChange={(e) => setField("ctaLabel", e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Link CTA header</label>
                <input
                  style={inputStyle}
                  value={settings.ctaHref || ""}
                  onChange={(e) => setField("ctaHref", e.target.value)}
                />
              </div>
            </div>

            <MenuEditor title="Meniu header" items={headerMenu} onChange={setHeaderMenu} />

            <div>
              <label style={labelStyle}>Brand footer</label>
              <input
                style={inputStyle}
                value={settings.footerBrand || ""}
                onChange={(e) => setField("footerBrand", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Tagline footer (opțional)</label>
              <input
                style={inputStyle}
                value={settings.footerTagline || ""}
                onChange={(e) => setField("footerTagline", e.target.value)}
                placeholder="The Art of Custom Furniture"
              />
            </div>

            <MenuEditor title="Meniu footer" items={footerMenu} onChange={setFooterMenu} />
            <MenuEditor title="Linkuri legale footer" items={footerLegal} onChange={setFooterLegal} />
          </div>
        </div>

        {/* Intro loader */}
        <div
          style={{
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "8px",
            padding: "1.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <SectionTitle>Loader intro (homepage)</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                color: "#e8e0d5",
                fontSize: "0.875rem",
              }}
            >
              <input
                type="checkbox"
                checked={settings.introEnabled !== "0"}
                onChange={(e) => setField("introEnabled", e.target.checked ? "1" : "0")}
              />
              Activează loader-ul la prima vizită din sesiune
            </label>

            <div>
              <label style={labelStyle}>Logo în loader (opțional)</label>
              <input
                ref={introLogoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadLogo(file, "introLogoUrl");
                }}
              />
              {settings.introLogoUrl ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.75rem",
                    padding: "0.75rem",
                    border: "1px solid #2a2724",
                    borderRadius: 6,
                    background: "#0f0e0d",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.introLogoUrl}
                    alt="Intro logo"
                    style={{ maxHeight: 48, maxWidth: 180, objectFit: "contain" }}
                  />
                  <button
                    type="button"
                    onClick={() => setField("introLogoUrl", "")}
                    style={{
                      marginLeft: "auto",
                      background: "transparent",
                      border: "none",
                      color: "#e07070",
                      cursor: "pointer",
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                disabled={uploadingLogo}
                onClick={() => introLogoInputRef.current?.click()}
              >
                <Upload size={14} />
                {uploadingLogo ? "Se încarcă..." : "Încarcă logo intro"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={labelStyle}>
                  Nume brand în loader (doar dacă lipsește logo-ul)
                </label>
                <input
                  style={inputStyle}
                  value={settings.introBrandName || ""}
                  onChange={(e) => setField("introBrandName", e.target.value)}
                  placeholder="Gol = doar logo"
                />
              </div>
              <div>
                <label style={labelStyle}>Eyebrow</label>
                <input
                  style={inputStyle}
                  value={settings.introEyebrow || ""}
                  onChange={(e) => setField("introEyebrow", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Tagline</label>
              <input
                style={inputStyle}
                value={settings.introTagline || ""}
                onChange={(e) => setField("introTagline", e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Imagini loader (max. 8)</label>
              <input
                ref={introImageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                hidden
                onChange={(e) => {
                  if (e.target.files?.length) void uploadIntroImages(e.target.files);
                }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                {introImages.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    style={{
                      position: "relative",
                      aspectRatio: "1",
                      borderRadius: 4,
                      overflow: "hidden",
                      border: "1px solid #2a2724",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => setIntroImages((prev) => prev.filter((_, idx) => idx !== i))}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "rgba(0,0,0,.7)",
                        border: "none",
                        color: "#fff",
                        borderRadius: 3,
                        cursor: "pointer",
                        padding: 2,
                        lineHeight: 0,
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  disabled={uploadingIntro || introImages.length >= 8}
                  onClick={() => introImageInputRef.current?.click()}
                >
                  <Upload size={14} />
                  {uploadingIntro ? "Se încarcă..." : "Adaugă imagini"}
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-ghost"
                  onClick={() => setIntroImages([...DEFAULT_INTRO_IMAGES])}
                >
                  Resetează default
                </button>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#4a4540", marginTop: "0.5rem" }}>
                Pentru a revedea loader-ul: deschide site-ul într-o fereastră privată sau șterge
                sessionStorage key <code>moodilier-intro-seen</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Hero slider */}
        <div
          style={{
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "8px",
            padding: "1.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <SectionTitle>Hero homepage — slider video / imagini</SectionTitle>
          <HeroSliderEditor
            slides={heroSlides}
            defaultDurationSec={Math.max(
              2,
              Number(settings.heroDefaultDurationSec) || 6
            )}
            onChange={setHeroSlides}
            onDefaultDurationChange={(sec) =>
              setField("heroDefaultDurationSec", String(sec))
            }
            onError={setError}
          />
        </div>

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
          <SectionTitle>Google Analytics &amp; Meta Pixel</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>GA4 Measurement ID</label>
              <input
                style={inputStyle}
                value={settings.ga4Id || ""}
                placeholder="G-XXXXXXXXXX"
                onChange={(e) => setField("ga4Id", e.target.value)}
              />
              <p style={{ fontSize: "0.75rem", color: "#4a4540", marginTop: "0.5rem" }}>
                Se încarcă doar după consimțământul „Statistici”. Format obligatoriu: G-…
              </p>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                color: "#e8e0d5",
                fontSize: "0.875rem",
              }}
            >
              <input
                type="checkbox"
                checked={settings.pixelEnabled !== "0"}
                onChange={(e) =>
                  setField("pixelEnabled", e.target.checked ? "1" : "0")
                }
              />
              Activează Meta Pixel (Facebook / Instagram ads)
            </label>

            <div>
              <label style={labelStyle}>Facebook Pixel ID</label>
              <input
                style={{
                  ...inputStyle,
                  opacity: settings.pixelEnabled === "0" ? 0.5 : 1,
                }}
                value={settings.pixelId || ""}
                placeholder="1234567890123456"
                disabled={settings.pixelEnabled === "0"}
                onChange={(e) => setField("pixelId", e.target.value.replace(/\D/g, ""))}
              />
              <p style={{ fontSize: "0.75rem", color: "#4a4540", marginTop: "0.5rem" }}>
                Doar cifre. Se încarcă după consimțământul „Marketing”. Poți păstra ID-ul
                și opri pixel-ul din checkbox.
              </p>
            </div>

            {(
              [
                ["googleSiteVerification", "Google Search Console", "abc123..."],
                ["facebookDomainVerification", "Facebook Domain Verification", "abc123..."],
              ] as const
            ).map(([key, label, ph]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  style={inputStyle}
                  value={settings[key] || ""}
                  placeholder={ph}
                  onChange={(e) => setField(key, e.target.value)}
                />
              </div>
            ))}
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
                style={inputStyle}
                value={settings.siteTitle || ""}
                onChange={(e) => setField("siteTitle", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Meta descriere</label>
              <textarea
                value={settings.metaDescription || ""}
                onChange={(e) => setField("metaDescription", e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>
          </div>
        </div>

        {/* Contact */}
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
            {(
              [
                ["phone", "Telefon"],
                ["email", "Email"],
                ["address", "Adresă"],
                ["whatsapp", "WhatsApp (fără +)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  style={inputStyle}
                  value={settings[key] || ""}
                  onChange={(e) => setField(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Contact form security + config */}
        <div
          style={{
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "8px",
            padding: "1.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <SectionTitle>Formular contact · verificare</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                color: "#e8e0d5",
                fontSize: "0.875rem",
              }}
            >
              <input
                type="checkbox"
                checked={settings.contactFormEnabled !== "0"}
                onChange={(e) =>
                  setField("contactFormEnabled", e.target.checked ? "1" : "0")
                }
              />
              Formular activ pe site
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                color: "#e8e0d5",
                fontSize: "0.875rem",
              }}
            >
              <input
                type="checkbox"
                checked={settings.contactRequirePhone === "1"}
                onChange={(e) =>
                  setField("contactRequirePhone", e.target.checked ? "1" : "0")
                }
              />
              Telefon obligatoriu
            </label>

            <div>
              <label style={labelStyle}>Email notificări (unde ajung mesajele)</label>
              <input
                style={inputStyle}
                type="email"
                value={settings.contactNotifyEmail || ""}
                onChange={(e) => setField("contactNotifyEmail", e.target.value)}
                placeholder="ofertare@moodilier.com"
              />
            </div>

            <div>
              <label style={labelStyle}>Mesaj de succes (după trimitere)</label>
              <textarea
                rows={2}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                value={settings.contactSuccessMessage || ""}
                onChange={(e) => setField("contactSuccessMessage", e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Program (afișat pe /contact)</label>
              <textarea
                rows={2}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                value={settings.contactHours || ""}
                onChange={(e) => setField("contactHours", e.target.value)}
                placeholder={"Luni — Vineri\n09:00 — 18:00"}
              />
            </div>

            <div>
              <label style={labelStyle}>Google Maps embed URL (opțional)</label>
              <input
                style={inputStyle}
                value={settings.contactMapEmbedUrl || ""}
                onChange={(e) => setField("contactMapEmbedUrl", e.target.value)}
                placeholder="https://www.google.com/maps/embed?..."
              />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem 1rem",
                background: "#0f0e0d",
                border: "1px solid #2a2724",
                borderRadius: 6,
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  color: smtpConfigured ? "#6dbf8a" : "#e07070",
                }}
              >
                SMTP: {smtpConfigured ? "configurat" : "neconfigurat (SMTP_* în env)"}
              </span>
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                disabled={testingMail || !smtpConfigured}
                onClick={() => void testContactEmail()}
                style={{ marginLeft: "auto", fontSize: "0.75rem" }}
              >
                {testingMail ? "Se trimite..." : "Trimite email de test"}
              </button>
            </div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#6a6460" }}>
              Protecții active: rate limit, honeypot, timp minim pe formular, verificare
              origin, limite lungime câmpuri. Mesajele apar în Admin → Mesaje.
            </p>
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
            {(
              [
                ["instagram", "Instagram URL"],
                ["facebook", "Facebook URL"],
                ["tiktok", "TikTok URL"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="url"
                  style={inputStyle}
                  value={settings[key] || ""}
                  onChange={(e) => setField(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.9rem 1.5rem",
            background: saving ? "#3a3530" : "#c9a984",
            color: "#0f0e0d",
            border: "none",
            borderRadius: 4,
            fontWeight: 600,
            cursor: saving ? "wait" : "pointer",
            fontFamily: "inherit",
          }}
        >
          <Save size={16} />
          {saving ? "Se salvează..." : "Salvează setările"}
        </button>
      </form>
    </div>
  );
}
