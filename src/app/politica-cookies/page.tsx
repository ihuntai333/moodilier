import Link from "next/link";
import type { Metadata } from "next";
import ResetCookiesButton from "./ResetCookiesButton";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Politică cookies | Moodilier",
  description:
    "Politica de utilizare a cookie-urilor pe site-ul moodilier.ro — tipuri de cookie-uri, scopuri și cum vă puteți gestiona preferințele. Ultima actualizare: Mai 2025.",
};

const cookieCategories = [
  {
    category: "Necesare",
    labelColor: "#4ade80",
    required: true,
    description:
      "Aceste cookie-uri sunt esențiale pentru funcționarea corectă a site-ului. Fără ele, servicii de bază precum navigarea pe pagini sau accesul la zone securizate nu ar funcționa. Nu pot fi dezactivate.",
    examples: [
      {
        name: "session_id",
        provider: "moodilier.com",
        purpose: "Menține sesiunea activă a utilizatorului",
        duration: "Sesiune",
      },
      {
        name: "csrf_token",
        provider: "moodilier.com",
        purpose: "Protecție împotriva atacurilor CSRF pe formulare",
        duration: "Sesiune",
      },
      {
        name: "cookie_consent",
        provider: "moodilier.com",
        purpose: "Stochează preferințele de consimțământ cookies",
        duration: "12 luni",
      },
    ],
  },
  {
    category: "Statistici / Analytics",
    labelColor: "var(--color-gold)",
    required: false,
    description:
      "Aceste cookie-uri ne ajută să înțelegem cum interacționează vizitatorii cu site-ul nostru, colectând și raportând informații în mod anonim. Ne permit să îmbunătățim conținutul și structura site-ului.",
    examples: [
      {
        name: "_ga",
        provider: "Google Analytics",
        purpose: "Identifică utilizatori unici pentru a genera statistici de trafic",
        duration: "24 luni",
      },
      {
        name: "_ga_XXXXXXXX",
        provider: "Google Analytics",
        purpose: "Menține starea sesiunii de analiză",
        duration: "24 luni",
      },
      {
        name: "_gid",
        provider: "Google Analytics",
        purpose: "Distinge utilizatorii pentru rapoarte zilnice",
        duration: "24 ore",
      },
      {
        name: "_gat",
        provider: "Google Analytics",
        purpose: "Limitează rata de cereri către serverul Google Analytics",
        duration: "1 minut",
      },
    ],
  },
  {
    category: "Marketing",
    labelColor: "#f87171",
    required: false,
    description:
      "Aceste cookie-uri sunt utilizate pentru a urmări vizitatorii pe site-uri web și pentru a afișa reclame relevante și personalizate. Sunt setate de parteneri de publicitate terți. Dezactivarea lor nu va opri publicitatea, dar aceasta nu va mai fi personalizată.",
    examples: [
      {
        name: "_fbp",
        provider: "Meta (Facebook)",
        purpose: "Identifică browserele pentru reclame Facebook/Instagram",
        duration: "90 zile",
      },
      {
        name: "fr",
        provider: "Meta (Facebook)",
        purpose: "Oferă, măsoară și îmbunătățește relevanța reclamelor Facebook",
        duration: "90 zile",
      },
      {
        name: "IDE",
        provider: "Google DoubleClick",
        purpose: "Afișare de reclame relevante bazate pe comportamentul de navigare",
        duration: "13 luni",
      },
      {
        name: "NID",
        provider: "Google",
        purpose: "Personalizarea conținutului Google și reclamelor",
        duration: "6 luni",
      },
    ],
  },
];

export default function PoliticaCookiesPage() {
  return (
    <>
      {/* ============== PAGE HERO ============== */}
      <PageHero
        label="Legal"
        title="Politică cookies"
        bgImage="/images-scraped/cameraA_03_.jpg"
        overlayOpacity={0.78}
      />

      {/* ============== CONTENT ============== */}
      <section className="section">
        <div className="container">
          <div
            style={{
              maxWidth: "80ch",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "3rem",
            }}
          >
            {/* INTRO */}
            <div>
              <p style={{ maxWidth: "none", marginBottom: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                  }}
                >
                  Ultima actualizare: Mai 2025
                </span>
              </p>
              <p style={{ maxWidth: "none", marginBottom: "1rem" }}>
                Această politică explică ce sunt cookie-urile, ce tipuri de
                cookie-uri utilizează site-ul{" "}
                <strong style={{ color: "var(--color-fg)" }}>
                  moodilier.ro
                </strong>
                , de ce le folosim și cum vă puteți gestiona preferințele.
              </p>
              <p style={{ maxWidth: "none" }}>
                Operatorul acestui site este{" "}
                <strong style={{ color: "var(--color-fg)" }}>
                  SC Moodilier SRL
                </strong>
                , Bulevardul Basarabia 256, incinta FAUR, Sector 3, București.
                Ne puteți contacta la{" "}
                <a
                  href="mailto:ofertare@moodilier.com"
                  style={{ color: "var(--color-gold)" }}
                >
                  ofertare@moodilier.com
                </a>{" "}
                pentru orice întrebare referitoare la utilizarea cookie-urilor.
              </p>
            </div>

            {/* CE SUNT COOKIE-URILE */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                1. Ce sunt cookie-urile
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Despre cookie-uri
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1rem" }}>
                Cookie-urile sunt fișiere text de mici dimensiuni plasate pe
                dispozitivul dumneavoastră (calculator, telefon, tabletă) atunci
                când vizitați un site web. Ele permit site-ului să vă
                recunoască la vizite ulterioare, să memoreze preferințele și să
                îmbunătățească experiența de navigare.
              </p>
              <p style={{ maxWidth: "none" }}>
                Cookie-urile nu pot accesa alte informații de pe dispozitivul
                dumneavoastră și nu conțin programe malware. Pe lângă
                cookie-uri propriu-zise, putem utiliza și tehnologii similare
                precum localStorage, sessionStorage sau pixeli de urmărire.
              </p>
            </div>

            {/* CUM UTILIZAM */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                2. Cum utilizăm cookie-urile
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Scopurile utilizării
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1.25rem" }}>
                Utilizăm cookie-uri în următoarele scopuri:
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {[
                  "Funcționarea corectă și securitatea site-ului (cookie-uri necesare)",
                  "Analiza comportamentului vizitatorilor pentru a îmbunătăți site-ul (analytics)",
                  "Afișarea de conținut publicitar relevant (marketing, cu consimțământ)",
                  "Memorarea preferințelor de navigare și a setărilor alese",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      fontSize: "0.9rem",
                      color: "var(--color-fg-muted)",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "1.5rem",
                        height: "1px",
                        background: "var(--color-gold)",
                        flexShrink: 0,
                        marginTop: "0.7rem",
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CATEGORII — DETALII */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                3. Categorii de cookie-uri
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Tipuri de cookie-uri utilizate
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />

              {cookieCategories.map((cat, catIdx) => (
                <div
                  key={catIdx}
                  style={{
                    marginBottom: "2.5rem",
                    border: "1px solid var(--color-border)",
                    overflow: "hidden",
                  }}
                >
                  {/* Category header */}
                  <div
                    style={{
                      background: "var(--color-surface)",
                      padding: "1.25rem 1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "0.6rem",
                        height: "0.6rem",
                        borderRadius: "50%",
                        background: cat.labelColor,
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.2rem",
                        color: "var(--color-fg)",
                        maxWidth: "none",
                        flex: 1,
                      }}
                    >
                      {cat.category}
                    </p>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: cat.required ? "#4ade80" : "var(--color-fg-subtle)",
                        padding: "0.25rem 0.75rem",
                        border: `1px solid ${cat.required ? "#4ade80" : "var(--color-border)"}`,
                      }}
                    >
                      {cat.required ? "Întotdeauna active" : "Opționale"}
                    </span>
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      padding: "1.25rem 1.5rem",
                      borderBottom: "1px solid var(--color-border)",
                      background: "var(--color-bg-alt)",
                    }}
                  >
                    <p style={{ maxWidth: "none", fontSize: "0.875rem" }}>
                      {cat.description}
                    </p>
                  </div>

                  {/* Table */}
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.8rem",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: "var(--color-bg)",
                            borderBottom: "1px solid var(--color-border)",
                          }}
                        >
                          {["Nume cookie", "Furnizor", "Scop", "Durată"].map(
                            (h) => (
                              <th
                                key={h}
                                style={{
                                  padding: "0.75rem 1rem",
                                  textAlign: "left",
                                  fontSize: "0.65rem",
                                  letterSpacing: "0.2em",
                                  textTransform: "uppercase",
                                  color: "var(--color-gold)",
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {cat.examples.map((cookie, cIdx) => (
                          <tr
                            key={cIdx}
                            style={{
                              borderBottom: "1px solid var(--color-border)",
                              background:
                                cIdx % 2 === 0
                                  ? "var(--color-bg-alt)"
                                  : "var(--color-bg)",
                            }}
                          >
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                color: "var(--color-fg)",
                                fontFamily: "monospace",
                                fontSize: "0.78rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {cookie.name}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                color: "var(--color-fg-muted)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {cookie.provider}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                color: "var(--color-fg-muted)",
                              }}
                            >
                              {cookie.purpose}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                color: "var(--color-fg-subtle)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {cookie.duration}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* COOKIE-URI DE LA TERTI */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                4. Cookie-uri de la terți
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Servicii terțe care plasează cookie-uri
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1.5rem" }}>
                Pe lângă cookie-urile proprii, site-ul moodilier.ro utilizează
                servicii furnizate de terțe părți care pot plasa propriile
                cookie-uri pe dispozitivul dumneavoastră. Principalele servicii
                terțe utilizate sunt:
              </p>

              {/* Google Analytics */}
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderLeft: "2px solid var(--color-gold)",
                  padding: "1.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    color: "var(--color-fg)",
                    marginBottom: "0.5rem",
                    maxWidth: "none",
                  }}
                >
                  Google Analytics
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-fg-muted)",
                    marginBottom: "0.75rem",
                    maxWidth: "none",
                  }}
                >
                  Serviciu de analiză web furnizat de Google LLC (SUA). Colectează
                  date anonimizate privind comportamentul vizitatorilor (pagini
                  vizitate, durata sesiunii, sursele de trafic) pentru a ne ajuta
                  să îmbunătățim conținutul și structura site-ului. Cookie-urile
                  principale utilizate sunt <code>_ga</code>, <code>_ga_*</code>,{" "}
                  <code>_gid</code> și <code>_gat</code>.
                </p>
                <p style={{ maxWidth: "none", fontSize: "0.82rem" }}>
                  Politica de confidențialitate Google:{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-gold)" }}
                  >
                    policies.google.com/privacy
                  </a>
                  {" — "}
                  Dezactivare:{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-gold)" }}
                  >
                    Google Analytics Opt-out
                  </a>
                </p>
              </div>

              {/* Facebook Pixel */}
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderLeft: "2px solid var(--color-gold)",
                  padding: "1.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    color: "var(--color-fg)",
                    marginBottom: "0.5rem",
                    maxWidth: "none",
                  }}
                >
                  Meta Pixel (Facebook Pixel)
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-fg-muted)",
                    marginBottom: "0.75rem",
                    maxWidth: "none",
                  }}
                >
                  Instrument de urmărire furnizat de Meta Platforms, Inc. Permite
                  măsurarea eficienței campaniilor publicitare pe Facebook și
                  Instagram, retargeting-ul vizitatorilor și optimizarea
                  reclamelor. Cookie-urile principale utilizate sunt{" "}
                  <code>_fbp</code> și <code>fr</code>. Funcționează exclusiv cu
                  consimțământul dumneavoastră pentru cookie-uri de marketing.
                </p>
                <p style={{ maxWidth: "none", fontSize: "0.82rem" }}>
                  Politica de confidențialitate Meta:{" "}
                  <a
                    href="https://www.facebook.com/privacy/policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-gold)" }}
                  >
                    facebook.com/privacy/policy
                  </a>
                  {" — "}
                  Setări reclame:{" "}
                  <a
                    href="https://www.facebook.com/ads/preferences"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-gold)" }}
                  >
                    facebook.com/ads/preferences
                  </a>
                </p>
              </div>

              <p style={{ maxWidth: "none", fontSize: "0.85rem" }}>
                Transferul datelor colectate de aceste servicii în afara Spațiului
                Economic European este reglementat de mecanisme de transfer adecvate
                (Standard Contractual Clauses) conform GDPR. Puteți refuza
                cookie-urile de statistici și marketing prin bannerul de
                consimțământ afișat la prima vizită.
              </p>
            </div>

            {/* GESTIONAREA PREFERINTELOR */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                5. Preferințele dumneavoastră
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Cum vă gestionați preferințele cookie
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1rem" }}>
                La prima vizită pe site-ul nostru, vă este prezentat un banner
                de consimțământ prin care puteți accepta sau refuza categoriile
                de cookie-uri opționale. Puteți reveni oricând asupra deciziei:
              </p>

              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderLeft: "2px solid var(--color-gold)",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      color: "var(--color-fg)",
                      marginBottom: "0.25rem",
                      maxWidth: "none",
                    }}
                  >
                    Actualizați preferințele de cookies
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-fg-subtle)",
                      maxWidth: "none",
                    }}
                  >
                    Modificați sau revocați consimțământul acordat
                  </p>
                </div>
                <ResetCookiesButton />
              </div>

              <p style={{ maxWidth: "none", marginBottom: "1rem" }}>
                Puteți de asemenea să gestionați sau să ștergeți cookie-urile
                direct din browser-ul dumneavoastră. Instrucțiuni pentru
                principalele browsere:
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                {[
                  {
                    browser: "Google Chrome",
                    url: "https://support.google.com/chrome/answer/95647",
                  },
                  {
                    browser: "Mozilla Firefox",
                    url: "https://support.mozilla.org/kb/enhanced-tracking-protection-firefox-desktop",
                  },
                  {
                    browser: "Microsoft Edge",
                    url: "https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
                  },
                  {
                    browser: "Apple Safari",
                    url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac",
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "1.5rem",
                        height: "1px",
                        background: "var(--color-gold)",
                        flexShrink: 0,
                      }}
                    />
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--color-gold)" }}
                    >
                      {item.browser}
                    </a>
                  </li>
                ))}
              </ul>
              <p style={{ maxWidth: "none" }}>
                Atenție: dezactivarea anumitor cookie-uri poate afecta
                funcționarea optimă a unor pagini ale site-ului.
              </p>
            </div>

            {/* MODIFICARI */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                6. Modificări
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Actualizarea politicii de cookies
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none" }}>
                Ne rezervăm dreptul de a actualiza această politică de cookies
                oricând, pentru a reflecta modificările aduse serviciilor
                noastre sau legislației aplicabile. Data ultimei modificări este
                afișată în antetul acestei pagini. Continuarea utilizării
                site-ului după publicarea modificărilor constituie acceptul
                dumneavoastră față de noua versiune a politicii.
              </p>
            </div>

            {/* CONTACT */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                7. Contact
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Întrebări privind cookie-urile
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1.25rem" }}>
                Pentru orice întrebare sau nelămurire privind utilizarea
                cookie-urilor pe site-ul nostru, ne puteți contacta:
              </p>
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderLeft: "2px solid var(--color-gold)",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <p
                  style={{
                    maxWidth: "none",
                    marginBottom: "0.5rem",
                    color: "var(--color-fg)",
                    fontWeight: 600,
                  }}
                >
                  SC Moodilier SRL
                </p>
                <p style={{ maxWidth: "none", marginBottom: "0.5rem" }}>
                  Bulevardul Basarabia 256, incinta FAUR, Sector 3, București
                </p>
                <p style={{ maxWidth: "none" }}>
                  Email:{" "}
                  <a
                    href="mailto:ofertare@moodilier.com"
                    style={{ color: "var(--color-gold)" }}
                  >
                    ofertare@moodilier.com
                  </a>
                </p>
              </div>
              <p style={{ maxWidth: "none" }}>
                Consultați și{" "}
                <Link
                  href="/politica-de-confidentialitate"
                  style={{ color: "var(--color-gold)" }}
                >
                  Politica de confidențialitate
                </Link>{" "}
                pentru informații complete despre prelucrarea datelor cu
                caracter personal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
