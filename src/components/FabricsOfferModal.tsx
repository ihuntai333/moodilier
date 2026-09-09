"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const FABRICS_PHONE = "0737 145 451";
const FABRICS_EMAIL = "draperii@moodilier.com";

export default function FabricsOfferModal({ open, onClose }: Props) {
  const titleId = useId();
  const openedAt = useRef(Date.now());
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    openedAt.current = Date.now();
    setDone(false);
    setError("");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 40);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nume,
          email,
          telefon,
          mesaj,
          website,
          company: "",
          topic: "draperii",
          _t: openedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Nu am putut trimite cererea. Încearcă din nou.");
        return;
      }
      setDone(true);
      setNume("");
      setEmail("");
      setTelefon("");
      setMesaj("");
    } catch {
      setError("Eroare de rețea. Încearcă din nou.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="aw-fabrics-modal" role="presentation" onClick={onClose}>
      <div
        className="aw-fabrics-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="aw-fabrics-close" onClick={onClose} aria-label="Închide">
          <X size={18} strokeWidth={1.5} />
        </button>

        <header className="aw-fabrics-head">
          <p className="aw-label">Perdele și draperii</p>
          <h2 id={titleId} className="aw-h2">
            Solicită ofertă
          </h2>
          <p className="aw-fabrics-lead">
            Perdele, draperii, sisteme de umbrire, sine electrice și storuri romane.
          </p>
        </header>

        <div className="aw-fabrics-contacts" aria-label="Contact draperii">
          <a className="aw-fabrics-contact" href={`tel:${FABRICS_PHONE.replace(/\s/g, "")}`}>
            <span className="aw-fabrics-contact-label">Telefon</span>
            <span className="aw-fabrics-contact-value">{FABRICS_PHONE}</span>
          </a>
          <a className="aw-fabrics-contact" href={`mailto:${FABRICS_EMAIL}`}>
            <span className="aw-fabrics-contact-label">Email</span>
            <span className="aw-fabrics-contact-value">{FABRICS_EMAIL}</span>
          </a>
        </div>

        {done ? (
          <div className="aw-fabrics-done">
            <p>Mulțumim. Cererea pentru perdele și draperii a fost trimisă.</p>
            <button type="button" className="aw-btn aw-btn-primary aw-btn-fill" onClick={onClose}>
              Închide
            </button>
          </div>
        ) : (
          <form className="aw-fabrics-form" onSubmit={submit}>
            <input
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="aw-hp"
              aria-hidden
            />

            <div className="aw-fabrics-row">
              <label>
                <span>Nume *</span>
                <input
                  ref={firstFieldRef}
                  required
                  value={nume}
                  onChange={(e) => setNume(e.target.value)}
                  placeholder="Nume și prenume"
                  autoComplete="name"
                />
              </label>
              <label>
                <span>Email *</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplu.ro"
                  autoComplete="email"
                />
              </label>
            </div>

            <label>
              <span>Telefon</span>
              <input
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder={FABRICS_PHONE}
                autoComplete="tel"
                inputMode="tel"
              />
            </label>

            <label>
              <span>Mesaj *</span>
              <textarea
                required
                rows={2}
                value={mesaj}
                onChange={(e) => setMesaj(e.target.value)}
                placeholder="Spațiu, tip umbrire, dimensiuni estimative…"
              />
            </label>

            {error ? <p className="aw-fabrics-error">{error}</p> : null}

            <button
              type="submit"
              className="aw-btn aw-btn-primary aw-btn-fill aw-fabrics-submit"
              disabled={busy}
            >
              {busy ? "Se trimite…" : "Trimite cererea"}
              {!busy ? <ArrowRight size={14} /> : null}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
