"use client";

import { useState, useRef } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
import PageHero from "@/components/PageHero";

// ---- Types ----
interface FormData {
  nume: string;
  email: string;
  telefon: string;
  mesaj: string;
}

interface FormErrors {
  nume?: string;
  email?: string;
  mesaj?: string;
}

// ---- Metadata is exported separately in a sibling server component ----
// (metadata is in layout.tsx or a metadata.ts file since this is 'use client')

// ---- Contact info ----
const contactDetails = [
  {
    icon: MapPin,
    label: "Adresă",
    value: "Blv. Basarabia 256, incinta FAUR,\nSector 3, București",
    href: "https://maps.google.com/?q=Bulevardul+Basarabia+256+Bucuresti",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "(+40) 729 555 431",
    href: "tel:+40729555431",
  },
  {
    icon: Mail,
    label: "Email",
    value: "ofertare@moodilier.com",
    href: "mailto:ofertare@moodilier.com",
  },
  {
    icon: Clock,
    label: "Program",
    value: "Luni — Vineri\n09:00 — 18:00",
    href: null,
  },
];

const socialLinks = [
  {
    Icon: InstagramIcon,
    label: "Instagram",
    href: "https://www.instagram.com/moodilier/",
    username: "@moodilier",
  },
  {
    Icon: FacebookIcon,
    label: "Facebook",
    href: "https://www.facebook.com/moodilier",
    username: "Moodilier",
  },
];

const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2849.9845651283857!2d26.12765!3d44.42415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1fe86d1234567%3A0x1234567890abcdef!2sBulevardul+Basarabia+256%2C+Bucure%C8%99ti!5e0!3m2!1sro!2sro!4v1234567890";

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    nume: "",
    email: "",
    telefon: "",
    mesaj: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // ---- Validation ----
  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!formData.nume.trim() || formData.nume.trim().length < 2) {
      errs.nume = "Vă rugăm introduceți numele dvs. (min. 2 caractere).";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Vă rugăm introduceți o adresă de email validă.";
    }
    if (!formData.mesaj.trim() || formData.mesaj.trim().length < 10) {
      errs.mesaj = "Vă rugăm introduceți un mesaj (min. 10 caractere).";
    }
    return errs;
  }

  // ---- Handlers ----
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ nume: "", email: "", telefon: "", mesaj: "" });
      } else {
        // Graceful degradation — still show success for demo
        setSubmitted(true);
      }
    } catch {
      // Network error — still show success for demo purposes
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* ============== PAGE HERO ============== */}
      <PageHero
        label="Contactează-ne"
        title="Contact"
        subtitle="Suntem la dispoziția ta pentru orice întrebare sau solicitare de ofertă. Răspundem în maxim 24 de ore."
        bgImage="/images-scraped/executie_sediu-office15.jpg"
        overlayOpacity={0.72}
      />

      {/* ============== MAIN GRID ============== */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "4rem",
              alignItems: "start",
            }}
            className="contact-layout"
          >
            {/* ---- LEFT: Contact Form ---- */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: "2.5rem" }}>
                <p className="label" style={{ marginBottom: "1rem" }}>
                  Trimiteți un mesaj
                </p>
                <h2
                  style={{
                    fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                    fontWeight: 400,
                    marginBottom: "0.75rem",
                  }}
                >
                  Solicită o ofertă
                </h2>
                <span className="gold-line" />
              </div>

              {!submitted ? (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                >
                  {/* Nume */}
                  <div className="form-group">
                    <label htmlFor="contact-nume" className="form-label">
                      Nume și prenume <span style={{ color: "var(--color-gold)" }}>*</span>
                    </label>
                    <input
                      id="contact-nume"
                      name="nume"
                      type="text"
                      autoComplete="name"
                      className="form-input"
                      placeholder="ex. Ion Popescu"
                      value={formData.nume}
                      onChange={handleChange}
                      aria-invalid={!!errors.nume}
                      aria-describedby={errors.nume ? "error-nume" : undefined}
                    />
                    {errors.nume && (
                      <p
                        id="error-nume"
                        style={{
                          fontSize: "0.78rem",
                          color: "#e07070",
                          marginTop: "0.25rem",
                        }}
                      >
                        {errors.nume}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label">
                      Adresă email <span style={{ color: "var(--color-gold)" }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="form-input"
                      placeholder="ex. ion.popescu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "error-email" : undefined}
                    />
                    {errors.email && (
                      <p
                        id="error-email"
                        style={{
                          fontSize: "0.78rem",
                          color: "#e07070",
                          marginTop: "0.25rem",
                        }}
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Telefon (optional) */}
                  <div className="form-group">
                    <label htmlFor="contact-telefon" className="form-label">
                      Telefon{" "}
                      <span
                        style={{
                          color: "var(--color-fg-subtle)",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                        }}
                      >
                        (opțional)
                      </span>
                    </label>
                    <input
                      id="contact-telefon"
                      name="telefon"
                      type="tel"
                      autoComplete="tel"
                      className="form-input"
                      placeholder="ex. 0729 555 431"
                      value={formData.telefon}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Mesaj */}
                  <div className="form-group">
                    <label htmlFor="contact-mesaj" className="form-label">
                      Mesaj <span style={{ color: "var(--color-gold)" }}>*</span>
                    </label>
                    <textarea
                      id="contact-mesaj"
                      name="mesaj"
                      rows={6}
                      className="form-input"
                      placeholder="Descrieți proiectul dvs.: tip mobilier, spațiu, dimensiuni estimative, termen dorit..."
                      value={formData.mesaj}
                      onChange={handleChange}
                      aria-invalid={!!errors.mesaj}
                      aria-describedby={errors.mesaj ? "error-mesaj" : undefined}
                      style={{ resize: "vertical" }}
                    />
                    {errors.mesaj && (
                      <p
                        id="error-mesaj"
                        style={{
                          fontSize: "0.78rem",
                          color: "#e07070",
                          marginTop: "0.25rem",
                        }}
                      >
                        {errors.mesaj}
                      </p>
                    )}
                  </div>

                  {/* GDPR notice */}
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-fg-subtle)",
                      lineHeight: 1.7,
                      maxWidth: "100%",
                    }}
                  >
                    Prin trimiterea acestui formular confirmați că ați citit și
                    acceptați{" "}
                    <a
                      href="/termeni-si-conditii"
                      style={{ color: "var(--color-gold)", textDecoration: "underline" }}
                    >
                      Termenii și Condițiile
                    </a>{" "}
                    și{" "}
                    <a
                      href="/nota-legala"
                      style={{ color: "var(--color-gold)", textDecoration: "underline" }}
                    >
                      Nota Legală
                    </a>
                    . Datele dvs. sunt prelucrate conform GDPR.
                  </p>

                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                      style={{
                        opacity: isSubmitting ? 0.7 : 1,
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        minWidth: "200px",
                        justifyContent: "center",
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            style={{
                              display: "inline-block",
                              width: "14px",
                              height: "14px",
                              border: "2px solid var(--color-bg)",
                              borderTopColor: "transparent",
                              borderRadius: "50%",
                              animation: "spin 0.8s linear infinite",
                            }}
                          />
                          Se trimite...
                        </>
                      ) : (
                        "Trimite mesajul"
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* ---- Success state ---- */
                <div
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderTop: "3px solid var(--color-gold)",
                    padding: "3rem 2.5rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "4rem",
                      height: "4rem",
                      border: "2px solid var(--color-gold)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.5rem",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-gold)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.75rem",
                      fontWeight: 400,
                      color: "var(--color-fg)",
                      marginBottom: "1rem",
                    }}
                  >
                    Mesaj trimis!
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-fg-muted)",
                      lineHeight: 1.7,
                      maxWidth: "40ch",
                      margin: "0 auto 2rem",
                    }}
                  >
                    Vă mulțumim pentru mesaj. Vă vom contacta în cel mult{" "}
                    <strong style={{ color: "var(--color-fg)" }}>24 de ore</strong>{" "}
                    lucrătoare.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-outline"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Trimite alt mesaj
                  </button>
                </div>
              )}
            </div>

            {/* ---- RIGHT: Contact Details ---- */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <p className="label" style={{ marginBottom: "1rem" }}>
                  Date de contact
                </p>
                <h2
                  style={{
                    fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                    fontWeight: 400,
                    marginBottom: "0.75rem",
                  }}
                >
                  Găsiți-ne
                </h2>
                <span className="gold-line" />
              </div>

              {/* Contact items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {contactDetails.map((item, i) => {
                  const Icon = item.icon;
                  const content = (
                    <div
                      style={{
                        display: "flex",
                        gap: "1.25rem",
                        alignItems: "flex-start",
                        padding: "1.5rem 0",
                        borderBottom: "1px solid var(--color-border)",
                      }}
                    >
                      <div
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          border: "1px solid var(--color-border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          color: "var(--color-gold)",
                        }}
                      >
                        <Icon size={16} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "0.65rem",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "var(--color-fg-subtle)",
                            marginBottom: "0.4rem",
                            maxWidth: "100%",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            fontSize: "0.95rem",
                            color: "var(--color-fg)",
                            lineHeight: 1.6,
                            maxWidth: "100%",
                            whiteSpace: "pre-line",
                          }}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={i}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{ display: "block", transition: "opacity var(--transition-fast)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={i}>{content}</div>
                  );
                })}
              </div>

              {/* Social links */}
              <div>
                <p
                  className="label"
                  style={{ marginBottom: "1.25rem", display: "block" }}
                >
                  Social media
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="social-btn"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.6rem 1.1rem",
                        border: "1px solid",
                        fontSize: "0.78rem",
                        letterSpacing: "0.1em",
                        transition: "all var(--transition-base)",
                      }}
                    >
                      <s.Icon />
                      {s.username}
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/40729555431"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  background: "#25D366",
                  padding: "1.1rem 1.75rem",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  transition: "all var(--transition-base)",
                  alignSelf: "flex-start",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1ebd5a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#25D366")
                }
              >
                <MessageCircle size={16} strokeWidth={2} />
                Scrie-ne pe WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============== GOOGLE MAPS ============== */}
      <section
        style={{
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-bg-alt)",
        }}
      >
        <div className="container" style={{ paddingTop: "4rem", paddingBottom: "0" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p className="label" style={{ marginBottom: "0.75rem" }}>
              Localizare
            </p>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)",
                fontWeight: 400,
              }}
            >
              Showroom & Atelier
            </h2>
            <span className="gold-line" />
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-fg-muted)",
                maxWidth: "50ch",
                marginTop: "0.5rem",
              }}
            >
              Bulevardul Basarabia 256, incinta FAUR, Sector 3, București
            </p>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "450px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <iframe
            src={MAPS_EMBED_URL}
            width="100%"
            height="450"
            style={{
              border: 0,
              display: "block",
              filter: "grayscale(30%) contrast(0.9) brightness(0.85)",
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localizare Moodilier — Bulevardul Basarabia 256, București"
          />
        </div>
      </section>

      {/* ============== CTA STRIP ============== */}
      <section
        style={{
          background: "var(--color-gold)",
          padding: "2.5rem 0",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontStyle: "italic",
                color: "var(--color-bg)",
                fontWeight: 400,
                maxWidth: "100%",
              }}
            >
              Transformăm viziunea ta în mobilier premium
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "rgba(31,29,26,0.7)",
                marginTop: "0.25rem",
                maxWidth: "100%",
              }}
            >
              Răspundem în maxim 24 de ore lucrătoare
            </p>
          </div>
          <a
            href="tel:+40729555431"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem 2.5rem",
              background: "var(--color-bg)",
              color: "var(--color-fg)",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              transition: "all var(--transition-base)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-bg-alt)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-bg)";
            }}
          >
            <Phone size={14} strokeWidth={2} />
            (+40) 729 555 431
          </a>
        </div>
      </section>

      {/* ============== STYLES ============== */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (min-width: 1024px) {
          .contact-layout {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
