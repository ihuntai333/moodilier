import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Politică de confidențialitate | Moodilier",
  description:
    "Politica de confidențialitate a SC Moodilier SRL — informații privind prelucrarea datelor cu caracter personal conform GDPR.",
};

export default function PoliticaConfidentialitateePage() {
  return (
    <>
      {/* ============== PAGE HERO ============== */}
      <PageHero
        label="Legal"
        title="Politică de confidențialitate"
        bgImage="/images-scraped/living_06_.jpg"
        overlayOpacity={0.78}
      />

      {/* ============== CONTENT ============== */}
      <section className="section">
        <div className="container">
          <div
            style={{
              maxWidth: "75ch",
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
                SC Moodilier SRL, cu sediul în Bulevardul Basarabia 256, incinta
                FAUR, Sector 3, București, România, înregistrată la Registrul
                Comerțului, vă informează cu privire la modul în care prelucrăm
                datele dumneavoastră cu caracter personal, în conformitate cu
                Regulamentul (UE) 2016/679 al Parlamentului European și al
                Consiliului (GDPR).
              </p>
              <p style={{ maxWidth: "none" }}>
                Vă rugăm să citiți cu atenție prezenta politică înainte de a
                utiliza site-ul nostru sau de a transmite date prin formularul
                de contact.
              </p>
            </div>

            {/* 1. CINE SUNTEM */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                1. Cine suntem
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Operatorul de date
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderLeft: "2px solid var(--color-gold)",
                  padding: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                <p style={{ maxWidth: "none", marginBottom: "0.5rem" }}>
                  <strong style={{ color: "var(--color-fg)" }}>
                    SC Moodilier SRL
                  </strong>
                </p>
                <p style={{ maxWidth: "none", marginBottom: "0.5rem" }}>
                  Bulevardul Basarabia 256, incinta FAUR, Sector 3, București,
                  România
                </p>
                <p style={{ maxWidth: "none", marginBottom: "0.5rem" }}>
                  Email:{" "}
                  <a
                    href="mailto:ofertare@moodilier.com"
                    style={{ color: "var(--color-gold)" }}
                  >
                    ofertare@moodilier.com
                  </a>
                </p>
                <p style={{ maxWidth: "none", marginBottom: "0.5rem" }}>
                  Telefon:{" "}
                  <a
                    href="tel:+40729555431"
                    style={{ color: "var(--color-gold)" }}
                  >
                    (+40) 729 555 431
                  </a>
                </p>
                <p style={{ maxWidth: "none" }}>
                  Website:{" "}
                  <a
                    href="https://www.moodilier.ro"
                    style={{ color: "var(--color-gold)" }}
                  >
                    www.moodilier.ro
                  </a>
                </p>
              </div>
              <p style={{ maxWidth: "none" }}>
                SC Moodilier SRL acționează în calitate de operator al datelor
                cu caracter personal colectate prin intermediul site-ului și al
                altor canale de comunicare.
              </p>
            </div>

            {/* 2. CE DATE COLECTAM */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                2. Date colectate
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Ce date cu caracter personal colectăm
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1rem" }}>
                Colectăm doar datele strict necesare pentru scopurile
                menționate. Acestea pot include:
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  marginBottom: "1rem",
                }}
              >
                {[
                  "Nume și prenume",
                  "Adresă de e-mail",
                  "Număr de telefon",
                  "Adresă (pentru livrare sau vizită la domiciliu, când este cazul)",
                  "Mesajul transmis prin formularul de contact",
                  "Date tehnice de navigare (adresă IP, browser, durata sesiunii) — prin cookies",
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
              <p style={{ maxWidth: "none" }}>
                Nu colectăm date sensibile (date privind sănătatea, origine
                etnică, opinii politice, date biometrice etc.).
              </p>
            </div>

            {/* 3. SCOPUL COLECTARII */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                3. Scopul prelucrării
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                De ce prelucrăm datele dumneavoastră
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                {[
                  {
                    title: "Răspuns la solicitări",
                    desc: "Prelucrăm datele pentru a răspunde la cererile de ofertă, întrebările și mesajele transmise prin formularul de contact sau telefon.",
                    basis: "Consimțământ / Interes legitim",
                  },
                  {
                    title: "Executarea contractului",
                    desc: "Datele sunt necesare pentru gestionarea comenzilor, emiterea de oferte, coordonarea proiectelor și comunicarea pe parcursul colaborării.",
                    basis: "Executarea contractului",
                  },
                  {
                    title: "Obligații legale",
                    desc: "Prelucrăm datele necesare emiterii documentelor fiscale (facturi, chitanțe) și îndeplinirii obligațiilor contabile și fiscale.",
                    basis: "Obligație legală",
                  },
                  {
                    title: "Marketing și comunicare",
                    desc: "Cu acordul dumneavoastră explicit, putem transmite newslettere sau informații despre noutățile Moodilier. Vă puteți dezabona oricând.",
                    basis: "Consimțământ",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      padding: "1.5rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.1rem",
                        color: "var(--color-fg)",
                        marginBottom: "0.75rem",
                        maxWidth: "none",
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--color-fg-muted)",
                        marginBottom: "0.75rem",
                        maxWidth: "none",
                      }}
                    >
                      {item.desc}
                    </p>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--color-gold)",
                        maxWidth: "none",
                      }}
                    >
                      Temei: {item.basis}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. DURATA STOCARII */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                4. Durata stocării
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Cât timp păstrăm datele
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1rem" }}>
                Datele cu caracter personal sunt păstrate doar atât timp cât
                este necesar pentru îndeplinirea scopurilor pentru care au fost
                colectate sau cât impun obligațiile legale:
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
                  "Date de contact și corespondență: maxim 3 ani de la ultima interacțiune",
                  "Date fiscale (facturi, contracte): 10 ani conform legislației fiscale române",
                  "Date de marketing (cu consimțământ): până la retragerea consimțământului",
                  "Cookie-uri și date tehnice: conform politicii cookies (de obicei 30–365 zile)",
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

            {/* 5. DESTINATARII DATELOR */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                5. Destinatari
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Cu cine partajăm datele dumneavoastră
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1rem" }}>
                Nu vindem și nu cedăm datele dumneavoastră cu caracter personal
                terților în scopuri comerciale proprii. Datele pot fi
                partajate, în măsura necesară, cu:
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
                  "Furnizori de servicii IT (hosting, email, CRM) cu care am încheiat acorduri de prelucrare conform GDPR",
                  "Contabili și auditori, în vederea îndeplinirii obligațiilor legale",
                  "Autorități publice, atunci când suntem obligați prin lege",
                  "Transportatori sau parteneri de montaj, exclusiv pentru executarea comenzii",
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
              <p style={{ maxWidth: "none", marginTop: "1rem" }}>
                Nu transferăm date în afara Spațiului Economic European fără
                garanții adecvate conform GDPR.
              </p>
            </div>

            {/* 6. DREPTURILE TALE */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                6. Drepturile dumneavoastră
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Drepturile GDPR
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1.25rem" }}>
                Conform GDPR, beneficiați de următoarele drepturi în legătură
                cu datele dumneavoastră cu caracter personal:
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    drept: "Dreptul de acces",
                    desc: "Puteți solicita o copie a datelor pe care le prelucrăm despre dumneavoastră.",
                  },
                  {
                    drept: "Dreptul la rectificare",
                    desc: "Puteți solicita corectarea datelor inexacte sau completarea datelor incomplete.",
                  },
                  {
                    drept: "Dreptul la ștergere",
                    desc: "Puteți solicita ștergerea datelor în condițiile prevăzute de GDPR (\"dreptul de a fi uitat\").",
                  },
                  {
                    drept: "Dreptul la restricționare",
                    desc: "Puteți solicita limitarea prelucrării datelor dumneavoastră în anumite situații.",
                  },
                  {
                    drept: "Dreptul la portabilitate",
                    desc: "Puteți primi datele furnizate într-un format structurat, utilizat în mod curent.",
                  },
                  {
                    drept: "Dreptul la opoziție",
                    desc: "Vă puteți opune prelucrării datelor în scopuri de marketing direct sau bazate pe interes legitim.",
                  },
                  {
                    drept: "Retragerea consimțământului",
                    desc: "Acolo unde prelucrarea se bazează pe consimțământ, îl puteți retrage oricând fără consecințe.",
                  },
                  {
                    drept: "Dreptul de a depune plângere",
                    desc: "Puteți depune o plângere la Autoritatea Națională de Supraveghere (ANSPDCP) — www.dataprotection.ro.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderTop: "2px solid var(--color-gold-dark)",
                      padding: "1.25rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--color-fg)",
                        marginBottom: "0.5rem",
                        maxWidth: "none",
                      }}
                    >
                      {item.drept}
                    </p>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--color-fg-subtle)",
                        maxWidth: "none",
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <p style={{ maxWidth: "none", marginTop: "1.5rem" }}>
                Pentru exercitarea oricăruia dintre aceste drepturi, ne puteți
                contacta la adresa de e-mail{" "}
                <a
                  href="mailto:ofertare@moodilier.com"
                  style={{ color: "var(--color-gold)" }}
                >
                  ofertare@moodilier.com
                </a>
                . Vom răspunde în termen de maxim 30 de zile calendaristice.
              </p>
            </div>

            {/* 7. COOKIE-URI */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                7. Cookie-uri
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Utilizarea cookie-urilor
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1rem" }}>
                Site-ul nostru utilizează cookie-uri și tehnologii similare
                pentru funcționarea corectă a paginilor, analiza traficului și,
                cu consimțământul dumneavoastră, pentru publicitate
                personalizată. Puteți gestiona preferințele privind cookie-urile
                în orice moment.
              </p>
              <p style={{ maxWidth: "none" }}>
                Consultați{" "}
                <Link
                  href="/politica-cookies"
                  style={{ color: "var(--color-gold)" }}
                >
                  Politica noastră de cookies
                </Link>{" "}
                pentru detalii complete privind tipurile de cookie-uri utilizate
                și durata de stocare a acestora.
              </p>
            </div>

            {/* 8. SECURITATE */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                8. Securitate
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Securitatea datelor
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1rem" }}>
                Implementăm măsuri tehnice și organizatorice adecvate pentru
                protejarea datelor dumneavoastră împotriva accesului
                neautorizat, pierderii, distrugerii sau divulgării. Site-ul
                utilizează conexiune HTTPS criptată.
              </p>
              <p style={{ maxWidth: "none" }}>
                Accesul la datele cu caracter personal este restricționat
                exclusiv personalului autorizat, care are obligația
                confidențialității.
              </p>
            </div>

            {/* 9. MODIFICARI */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                9. Modificări
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Actualizarea politicii
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none" }}>
                Această politică poate fi actualizată periodic pentru a reflecta
                modificările legislative sau schimbările în practicile noastre
                de prelucrare. Versiunea actualizată va fi publicată pe această
                pagină cu data revizuirii. Vă recomandăm să consultați periodic
                această pagină.
              </p>
            </div>

            {/* 10. CONTACT DPO */}
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>
                10. Contact
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-fg)",
                }}
              >
                Date de contact și responsabil cu protecția datelor
              </h3>
              <span className="gold-line" style={{ marginTop: 0 }} />
              <p style={{ maxWidth: "none", marginBottom: "1.25rem" }}>
                Pentru orice întrebare, solicitare sau plângere privind
                prelucrarea datelor cu caracter personal, ne puteți contacta:
              </p>
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderLeft: "2px solid var(--color-gold)",
                  padding: "1.5rem",
                }}
              >
                <p
                  style={{
                    maxWidth: "none",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "var(--color-fg)",
                  }}
                >
                  SC Moodilier SRL — Responsabil Protecția Datelor
                </p>
                <p style={{ maxWidth: "none", marginBottom: "0.5rem" }}>
                  Adresă: Bulevardul Basarabia 256, incinta FAUR, Sector 3,
                  București
                </p>
                <p style={{ maxWidth: "none", marginBottom: "0.5rem" }}>
                  Email:{" "}
                  <a
                    href="mailto:ofertare@moodilier.com"
                    style={{ color: "var(--color-gold)" }}
                  >
                    ofertare@moodilier.com
                  </a>
                </p>
                <p style={{ maxWidth: "none" }}>
                  Autoritate de supraveghere:{" "}
                  <a
                    href="https://www.dataprotection.ro"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-gold)" }}
                  >
                    ANSPDCP — www.dataprotection.ro
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
