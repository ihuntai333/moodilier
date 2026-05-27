import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Notă legală | Moodilier",
  description:
    "Notă legală — identificarea societății, condiții de utilizare a site-ului, proprietate intelectuală și limitarea răspunderii. SC Moodilier SRL, București.",
};

const legalSections = [
  {
    id: "identificare",
    number: "01",
    title: "Identificarea societății",
    subsections: [
      {
        subtitle: null,
        paragraphs: [
          "Site-ul moodilier.ro este publicat și administrat de:",
        ],
        list: [
          "Denumire: SC Moodilier SRL",
          "Formă juridică: Societate cu Răspundere Limitată",
          "Sediu social: Bulevardul Basarabia 256, incinta FAUR, Sector 3, București, România",
          "CUI: RO12345678",
          "Nr. Reg. Com.: J40/1234/2015",
          "Capital social: 200 RON",
          "Telefon: (+40) 729 555 431",
          "E-mail: ofertare@moodilier.com",
          "Site: https://moodilier.ro",
        ],
      },
      {
        subtitle: null,
        paragraphs: [
          "SC Moodilier SRL este înregistrată în Registrul Comerțului de pe lângă Tribunalul București și este plătitoare de TVA conform reglementărilor fiscale române în vigoare.",
        ],
        list: null,
      },
    ],
  },
  {
    id: "utilizare",
    number: "02",
    title: "Condiții de utilizare a site-ului",
    subsections: [
      {
        subtitle: "Acceptul condițiilor",
        paragraphs: [
          "Accesarea și utilizarea site-ului moodilier.ro implică acceptul necondiționat al prezentei note legale. În cazul în care nu sunteți de acord cu aceste condiții, vă rugăm să încetați utilizarea site-ului.",
        ],
        list: null,
      },
      {
        subtitle: "Scop și utilizare permisă",
        paragraphs: [
          "Site-ul moodilier.ro este destinat exclusiv prezentării serviciilor SC Moodilier SRL și facilitării contactului cu potențialii clienți. Utilizatorii sunt de acord să nu utilizeze site-ul în scopuri ilegale, frauduloase sau care aduc atingere drepturilor terților.",
          "Este interzisă orice tentativă de acces neautorizat la sistemele informatice ale site-ului, perturbarea funcționării sale, transmiterea de conținut malițios sau utilizarea sa în scopuri de spam.",
        ],
        list: null,
      },
      {
        subtitle: "Disponibilitate",
        paragraphs: [
          "SC Moodilier SRL depune eforturi rezonabile pentru a menține site-ul disponibil și funcțional, dar nu garantează disponibilitatea continuă a acestuia. Site-ul poate fi temporar indisponibil din motive tehnice sau de mentenanță, fără notificare prealabilă.",
        ],
        list: null,
      },
    ],
  },
  {
    id: "proprietate",
    number: "03",
    title: "Proprietate intelectuală",
    subsections: [
      {
        subtitle: null,
        paragraphs: [
          "Întreg conținutul prezentului site — inclusiv, dar fără a se limita la: texte, fotografii, imagini, grafice, logo-uri, ilustrații, elemente de interfață, cod sursă, structura paginilor și baze de date — este protejat de legislația privind drepturile de autor în vigoare în România (Legea nr. 8/1996) și în Uniunea Europeană.",
          `Marca \u201EMoodilier\u201D și logo-ul asociat sunt mărci înregistrate/în curs de înregistrare, aparținând SC Moodilier SRL. Utilizarea acestora fără acordul prealabil scris al societății este interzisă.`,
        ],
        list: null,
      },
      {
        subtitle: "Utilizare permisă",
        paragraphs: [
          "Este permisă reproducerea sau tipărirea unor fragmente ale site-ului exclusiv pentru uz personal și necomercial, cu menținerea intactă a tuturor mențiunilor privind drepturile de autor.",
        ],
        list: null,
      },
      {
        subtitle: "Utilizare interzisă",
        paragraphs: [
          "Fără acordul prealabil scris al SC Moodilier SRL, este interzisă:",
        ],
        list: [
          "Reproducerea, distribuirea sau publicarea conținutului site-ului în scopuri comerciale",
          "Modificarea, adaptarea sau crearea de opere derivate din conținut",
          "Utilizarea conținutului pe alte site-uri sau platforme digitale",
          "Descărcarea masivă de conținut (scraping) prin mijloace automate",
        ],
      },
    ],
  },
  {
    id: "raspundere",
    number: "04",
    title: "Limitarea răspunderii",
    subsections: [
      {
        subtitle: "Acuratețea informațiilor",
        paragraphs: [
          "Informațiile prezentate pe site sunt furnizate cu titlu informativ și pot fi modificate fără notificare prealabilă. SC Moodilier SRL nu garantează că informațiile sunt complete, exacte, actuale sau adaptate unui scop particular.",
        ],
        list: null,
      },
      {
        subtitle: "Linkuri externe",
        paragraphs: [
          "Site-ul poate conține linkuri către site-uri terțe. SC Moodilier SRL nu controlează și nu este responsabilă pentru conținutul, politicile de confidențialitate sau practicile acelor site-uri. Includerea unui link nu implică o recomandare sau un parteneriat cu acel site.",
        ],
        list: null,
      },
      {
        subtitle: "Daune",
        paragraphs: [
          "SC Moodilier SRL nu va fi responsabilă pentru nicio daună directă, indirectă, incidentală, specială sau consecventă rezultată din: utilizarea sau imposibilitatea utilizării site-ului, accesul neautorizat la datele utilizatorilor, erori sau omisiuni în conținutul site-ului, sau orice altă cauză legată de site.",
        ],
        list: null,
      },
    ],
  },
  {
    id: "date",
    number: "05",
    title: "Protecția datelor cu caracter personal",
    subsections: [
      {
        subtitle: null,
        paragraphs: [
          "SC Moodilier SRL prelucrează datele cu caracter personal în conformitate cu Regulamentul General privind Protecția Datelor (GDPR — Regulamentul UE 2016/679) și legislația națională de implementare.",
          "Datele colectate prin intermediul formularelor de contact sau al altor mecanisme ale site-ului sunt utilizate exclusiv în scopul furnizării serviciilor solicitate și nu sunt partajate cu terți fără consimțământul explicit al persoanelor vizate, cu excepția obligațiilor legale.",
          "Aveți dreptul de acces, rectificare, ștergere, portabilitate, restricționare a prelucrării și opoziție față de prelucrare. Puteți exercita aceste drepturi scriindu-ne la: ofertare@moodilier.com. Aveți, de asemenea, dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).",
        ],
        list: null,
      },
    ],
  },
  {
    id: "jurisdictie",
    number: "06",
    title: "Jurisdicție și lege aplicabilă",
    subsections: [
      {
        subtitle: null,
        paragraphs: [
          "Prezenta notă legală este guvernată de și interpretată în conformitate cu legislația română în vigoare. Orice litigiu care decurge din sau este legat de utilizarea site-ului moodilier.ro va fi supus jurisdicției exclusive a instanțelor competente din Municipiul București, România.",
          "SC Moodilier SRL operează în România și în Uniunea Europeană și respectă reglementările europene aplicabile, inclusiv Directiva privind serviciile societății informaționale (2000/31/CE), Directiva privind drepturile consumatorilor și GDPR.",
          "SC Moodilier SRL își rezervă dreptul de a modifica prezenta notă legală în orice moment. Versiunea actualizată va fi publicată pe site cu menționarea datei ultimei actualizări.",
        ],
        list: null,
      },
    ],
  },
];

export default function NotaLegalaPage() {
  const lastUpdated = "Mai 2025";

  return (
    <>
      {/* ============== PAGE HERO ============== */}
      <PageHero
        label="Legal"
        title="Notă legală"
        bgImage="/images-scraped/Mogosoaia_01.jpg"
        overlayOpacity={0.78}
      />

      {/* ============== INTRO NOTICE ============== */}
      <section
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-alt)",
          padding: "3rem 0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2px",
              background: "var(--color-border)",
              maxWidth: "900px",
            }}
          >
            {[
              { label: "Societate", value: "SC Moodilier SRL" },
              { label: "Formă juridică", value: "Societate cu Răspundere Limitată" },
              { label: "Sediu", value: "Sector 3, București, România" },
              { label: "Jurisdicție", value: "România · Uniunea Europeană" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--color-surface)",
                  padding: "1.5rem 2rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                    marginBottom: "0.5rem",
                    maxWidth: "100%",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--color-fg)",
                    fontWeight: 500,
                    maxWidth: "100%",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== LEGAL SECTIONS ============== */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: "800px", display: "flex", flexDirection: "column", gap: "5rem" }}>
            {legalSections.map((sec, secIdx) => (
              <article key={sec.id} id={sec.id}>
                {/* Section number + title */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    marginBottom: "2rem",
                    paddingBottom: "1.25rem",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2.5rem",
                      fontWeight: 300,
                      color: "var(--color-border-alt)",
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {sec.number}
                  </span>
                  <h2
                    style={{
                      fontSize: "clamp(1.2rem, 2vw, 1.75rem)",
                      fontWeight: 400,
                      color: "var(--color-fg)",
                    }}
                  >
                    {sec.title}
                  </h2>
                </div>

                {/* Subsections */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                  {sec.subsections.map((sub, subIdx) => (
                    <div key={subIdx}>
                      {sub.subtitle && (
                        <h3
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "var(--color-gold)",
                            marginBottom: "0.75rem",
                          }}
                        >
                          {sub.subtitle}
                        </h3>
                      )}
                      {sub.paragraphs.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          style={{
                            fontSize: "0.9rem",
                            color: "var(--color-fg-muted)",
                            lineHeight: 1.9,
                            maxWidth: "100%",
                            marginBottom: "0.75rem",
                          }}
                        >
                          {para}
                        </p>
                      ))}
                      {sub.list && (
                        <ul
                          style={{
                            marginTop: "0.75rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            paddingLeft: "0",
                            listStyle: "none",
                          }}
                        >
                          {sub.list.map((item, iIdx) => (
                            <li
                              key={iIdx}
                              style={{
                                display: "flex",
                                gap: "0.75rem",
                                alignItems: "flex-start",
                                fontSize: "0.875rem",
                                color: "var(--color-fg-muted)",
                                lineHeight: 1.7,
                              }}
                            >
                              <span
                                style={{
                                  color: "var(--color-gold)",
                                  flexShrink: 0,
                                  marginTop: "0.4rem",
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  background: "var(--color-gold)",
                                  display: "inline-block",
                                }}
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Bottom note */}
          <div
            style={{
              marginTop: "5rem",
              paddingTop: "3rem",
              borderTop: "1px solid var(--color-border)",
              maxWidth: "800px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/termeni-si-conditii"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-gold)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                → Termeni și Condiții
              </a>
              <a
                href="/contact"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-fg-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                → Contactați-ne
              </a>
            </div>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--color-fg-subtle)",
                marginTop: "1.5rem",
                lineHeight: 1.8,
                maxWidth: "100%",
              }}
            >
              © {new Date().getFullYear()} SC Moodilier SRL — Toate drepturile
              rezervate. Conținutul acestui site este protejat de legislația
              privind dreptul de autor.
            </p>
            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--color-fg-subtle)",
                marginTop: "0.5rem",
                letterSpacing: "0.1em",
              }}
            >
              Ultima actualizare: {lastUpdated}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
