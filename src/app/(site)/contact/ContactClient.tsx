"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import type { ContactFormSettings } from "@/lib/contact-settings";

interface FormData {
  nume: string;
  email: string;
  telefon: string;
  mesaj: string;
  website: string;
  company: string;
}

interface FormErrors {
  nume?: string;
  email?: string;
  telefon?: string;
  mesaj?: string;
  form?: string;
}

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

function waHref(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

export default function ContactClient({
  settings,
}: {
  settings: ContactFormSettings;
}) {
  const [formData, setFormData] = useState<FormData>({
    nume: "",
    email: "",
    telefon: "",
    mesaj: "",
    website: "",
    company: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState(settings.successMessage);
  const openedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const contactDetails = [
    {
      icon: MapPin,
      label: "Adresă",
      value: settings.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`,
    },
    {
      icon: Phone,
      label: "Telefon",
      value: settings.phone,
      href: telHref(settings.phone) || null,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: Clock,
      label: "Program",
      value: settings.hours,
      href: null as string | null,
    },
  ];

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!formData.nume.trim() || formData.nume.trim().length < 2) {
      errs.nume = "Vă rugăm introduceți numele dvs. (min. 2 caractere).";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Vă rugăm introduceți o adresă de email validă.";
    }
    if (settings.requirePhone && formData.telefon.trim().length < 6) {
      errs.telefon = "Telefonul este obligatoriu.";
    }
    if (!formData.mesaj.trim() || formData.mesaj.trim().length < 10) {
      errs.mesaj = "Vă rugăm introduceți un mesaj (min. 10 caractere).";
    }
    return errs;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!settings.enabled) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nume: formData.nume,
          email: formData.email,
          telefon: formData.telefon,
          mesaj: formData.mesaj,
          website: formData.website,
          company: formData.company,
          topic: "mobilier",
          _t: openedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        setErrors({
          form: data.error || "Nu am putut trimite mesajul. Încercați din nou.",
        });
        return;
      }

      setSuccessMsg(data.message || settings.successMessage);
      setSubmitted(true);
      setFormData({
        nume: "",
        email: "",
        telefon: "",
        mesaj: "",
        website: "",
        company: "",
      });
      openedAt.current = Date.now();
    } catch {
      setErrors({
        form: "Eroare de conexiune. Verificați internetul și încercați din nou.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="aw-page-section">
        <div className="aw-container">
          <div className="aw-contact-layout">
            <div>
              <p
                className="aw-label"
                style={{ textAlign: "left", width: "auto", marginBottom: "0.85rem" }}
              >
                Trimiteți un mesaj
              </p>
              <h2 className="aw-h2" style={{ marginBottom: "1.75rem", maxWidth: "12ch" }}>
                Solicită o ofertă
              </h2>

              {!settings.enabled ? (
                <p className="aw-body">
                  Formularul de contact este temporar dezactivat. Ne poți contacta telefonic
                  sau pe WhatsApp.
                </p>
              ) : !submitted ? (
                <form ref={formRef} onSubmit={handleSubmit} noValidate className="aw-form">
                  {/* Honeypot fields — hidden from humans */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "-10000px",
                      top: "auto",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                    }}
                  >
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="nope"
                      value={formData.website}
                      onChange={handleChange}
                    />
                    <label htmlFor="contact-company">Company</label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="nope"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="aw-form-group">
                    <label htmlFor="contact-nume" className="aw-form-label">
                      Nume și prenume *
                    </label>
                    <input
                      id="contact-nume"
                      name="nume"
                      type="text"
                      autoComplete="name"
                      maxLength={120}
                      className="aw-form-input"
                      placeholder="ex. Ion Popescu"
                      value={formData.nume}
                      onChange={handleChange}
                      aria-invalid={!!errors.nume}
                    />
                    {errors.nume ? <p className="aw-form-error">{errors.nume}</p> : null}
                  </div>

                  <div className="aw-form-group">
                    <label htmlFor="contact-email" className="aw-form-label">
                      Adresă email *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={200}
                      className="aw-form-input"
                      placeholder="ex. ion.popescu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email ? <p className="aw-form-error">{errors.email}</p> : null}
                  </div>

                  <div className="aw-form-group">
                    <label htmlFor="contact-telefon" className="aw-form-label">
                      Telefon {settings.requirePhone ? "*" : <em>(opțional)</em>}
                    </label>
                    <input
                      id="contact-telefon"
                      name="telefon"
                      type="tel"
                      autoComplete="tel"
                      maxLength={40}
                      className="aw-form-input"
                      placeholder="ex. 0729 555 431"
                      value={formData.telefon}
                      onChange={handleChange}
                      aria-invalid={!!errors.telefon}
                    />
                    {errors.telefon ? (
                      <p className="aw-form-error">{errors.telefon}</p>
                    ) : null}
                  </div>

                  <div className="aw-form-group">
                    <label htmlFor="contact-mesaj" className="aw-form-label">
                      Mesaj *
                    </label>
                    <textarea
                      id="contact-mesaj"
                      name="mesaj"
                      rows={6}
                      maxLength={4000}
                      className="aw-form-input"
                      placeholder="Descrieți proiectul: tip mobilier, spațiu, dimensiuni estimative, termen dorit..."
                      value={formData.mesaj}
                      onChange={handleChange}
                      aria-invalid={!!errors.mesaj}
                    />
                    {errors.mesaj ? <p className="aw-form-error">{errors.mesaj}</p> : null}
                  </div>

                  {errors.form ? <p className="aw-form-error">{errors.form}</p> : null}

                  <p className="aw-form-note">
                    Prin trimiterea acestui formular confirmați că ați citit și acceptați{" "}
                    <a href="/termeni-si-conditii">Termenii și Condițiile</a> și{" "}
                    <a href="/nota-legala">Nota Legală</a>. Datele dvs. sunt prelucrate conform
                    GDPR.
                  </p>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="aw-btn aw-btn-primary aw-btn-fill"
                      style={{
                        opacity: isSubmitting ? 0.7 : 1,
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                      }}
                    >
                      {isSubmitting ? "Se trimite..." : "Trimite mesajul"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="aw-form-success">
                  <h3 className="aw-h3" style={{ marginBottom: "1rem" }}>
                    Mesaj trimis!
                  </h3>
                  <p className="aw-body" style={{ margin: "0 auto 1.75rem", maxWidth: "36ch" }}>
                    {successMsg}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="aw-btn aw-btn-outline-dark aw-btn-fill"
                  >
                    Trimite alt mesaj
                  </button>
                </div>
              )}
            </div>

            <div>
              <p
                className="aw-label"
                style={{ textAlign: "left", width: "auto", marginBottom: "0.85rem" }}
              >
                Date de contact
              </p>
              <h2 className="aw-h2" style={{ marginBottom: "1.75rem", maxWidth: "10ch" }}>
                Găsiți-ne
              </h2>

              <div>
                {contactDetails.map((item) => {
                  const Icon = item.icon;
                  const inner = (
                    <div className="aw-contact-item">
                      <div className="aw-contact-item-icon">
                        <Icon size={16} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="aw-label">{item.label}</p>
                        <p className="aw-body" style={{ whiteSpace: "pre-line", margin: 0 }}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={item.label}>{inner}</div>
                  );
                })}
              </div>

              <a
                href={waHref(settings.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="aw-btn aw-btn-primary aw-btn-fill"
                style={{ marginTop: "2rem" }}
              >
                <MessageCircle size={14} strokeWidth={2} />
                Scrie-ne pe WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {settings.mapEmbedUrl ? (
        <section className="aw-page-section aw-page-section--gray" style={{ paddingBottom: 0 }}>
          <div className="aw-container" style={{ marginBottom: "2rem" }}>
            <p
              className="aw-label"
              style={{ textAlign: "left", width: "auto", marginBottom: "0.75rem" }}
            >
              Localizare
            </p>
            <h2 className="aw-h2" style={{ maxWidth: "16ch" }}>
              Atelier
            </h2>
            <p className="aw-body" style={{ marginTop: "0.75rem" }}>
              {settings.address}
            </p>
          </div>
          <div className="aw-map-wrap">
            <iframe
              src={settings.mapEmbedUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Localizare Moodilier — ${settings.address}`}
            />
          </div>
        </section>
      ) : null}
    </>
  );
}
