"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const FABRICS_PHONE = "0737 145 451";
const FABRICS_EMAIL = "draperii@moodilier.com";

export default function FabricsOfferModal({ open, onClose }: Props) {
  const titleId = useId();
  const openedAt = useRef(Date.now());
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
    return () => {
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
          topic: "fabrics",
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
          <X size={18} />
        </button>

        <p className="aw-label">Moodilier Fabrics</p>
        <h2 id={titleId} className="aw-h2">
          Solicită ofertă draperii
        </h2>
        <p className="aw-body" style={{ marginBottom: "1.25rem" }}>
          Perdele, draperii, sisteme de umbrire, sine electrice și storuri romane.
        </p>

        <div className="aw-fabrics-contacts">
          <a href={`tel:${FABRICS_PHONE.replace(/\s/g, "")}`}>{FABRICS_PHONE}</a>
          <a href={`mailto:${FABRICS_EMAIL}`}>{FABRICS_EMAIL}</a>
        </div>

        {done ? (
          <p className="aw-body" style={{ marginTop: "1.25rem" }}>
            Mulțumim! Cererea pentru draperii a fost trimisă. Te contactăm în curând.
          </p>
        ) : (
          <form className="aw-fabrics-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="fabrics-website">
              Website
            </label>
            <input
              id="fabrics-website"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="aw-hp"
              aria-hidden
            />
            <label>
              Nume *
              <input
                required
                value={nume}
                onChange={(e) => setNume(e.target.value)}
                placeholder="Nume și prenume"
              />
            </label>
            <label>
              Email *
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplu.ro"
              />
            </label>
            <label>
              Telefon
              <input
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder={FABRICS_PHONE}
              />
            </label>
            <label>
              Mesaj *
              <textarea
                required
                rows={4}
                value={mesaj}
                onChange={(e) => setMesaj(e.target.value)}
                placeholder="Descrie spațiul, tipul de umbrire dorit, dimensiuni estimative..."
              />
            </label>
            {error ? <p className="aw-fabrics-error">{error}</p> : null}
            <button type="submit" className="aw-btn aw-btn-primary aw-btn-fill" disabled={busy}>
              {busy ? "Se trimite…" : "Trimite cererea"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
