import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Termeni și condiții | Moodilier",
  description:
    "Termenii și condițiile de utilizare ale site-ului și serviciilor SC Moodilier SRL — mobilier premium la comandă din București.",
};

const sections = [
  {
    id: "servicii",
    number: "I",
    title: "Servicii oferite",
    content: [
      "SC Moodilier SRL, cu sediul social în Municipiul București, oferă servicii de proiectare, producție și montaj de mobilier premium la comandă, inclusiv: bucătării, dressinguri, livinguri, dormitoare, spații comerciale, recepții, birouri și showroom-uri.",
      "Serviciile sunt furnizate exclusiv pe teritoriul României, cu excepția cazurilor expres convenite în scris cu Clientul. Moodilier SRL furnizează, de asemenea, servicii de design interior, consultanță, importul și comercializarea de mobilier premium de la producători din Italia, Danemarca și Grecia prin intermediul platformei Moodilier Store.",
      "Societatea îşi rezervă dreptul de a modifica, extinde sau restrânge gama de servicii, cu notificare prealabilă a Clienților afectați, în măsura în care contractele individuale nu prevăd altfel.",
    ],
  },
  {
    id: "oferte",
    number: "II",
    title: "Oferte și prețuri",
    content: [
      "Toate ofertele emise de SC Moodilier SRL sunt personalizate, bazate pe specificațiile tehnice, materialele și finisajele alese de Client. Oferta este valabilă 30 de zile calendaristice de la data emiterii, dacă nu se specifică altfel în documentul de ofertă.",
      "Prețurile includ TVA-ul legal în vigoare și se exprimă în LEI (RON), dacă nu există o convenție scrisă contrară. Orice modificare solicitată de Client după acceptarea ofertei poate genera costuri suplimentare, care vor fi comunicate și aprobate în scris înainte de a fi aplicate.",
      "Avansul standard solicitat pentru demararea unui proiect este de minimum 50% din valoarea totală a contractului. Restul sumei se achită conform graficului de plată agreat contractual. SC Moodilier SRL nu garantează disponibilitatea stocului de materiale sau furnizorilor terți și poate revizui prețul ofertei în cazul unor variații semnificative de cost survenite între momentul ofertării și momentul semnării contractului.",
      "Reducerile și promoțiile aplicate nu sunt cumulative, dacă nu se specifică în mod expres altfel.",
    ],
  },
  {
    id: "executie",
    number: "III",
    title: "Execuție și livrare",
    content: [
      "Termenele de execuție sunt estimate și comunicate la momentul semnării contractului. Acestea se calculează de la data plății avansului și finalizării proiectului tehnic aprobat de Client. SC Moodilier SRL depune toate eforturile rezonabile pentru respectarea termenelor comunicate.",
      "Termenele de execuție se pot prelungi justificat în cazul: (a) întârzierilor în aprobarea proiectului tehnic de către Client; (b) solicitărilor de modificare a specificațiilor tehnice pe parcursul execuției; (c) forței majore sau evenimentelor imprevizibile (greve, întreruperi ale lanțului de aprovizionare, calamități naturale, restricții legale); (d) întârzierilor în plata tranșelor contractuale.",
      "Livrarea și montajul se efectuează la adresa indicată de Client, în intervalul orar convenit. Clientul are obligația de a asigura accesul liber la spațiu și condițiile tehnice necesare montajului (electricitate, iluminat adecvat, spațiu de depozitare temporară a materialelor). Costul transportului poate fi inclus în prețul contractului sau facturat separat, conform specificațiilor din ofertă.",
      "La finalizarea lucrărilor, se întocmește un proces-verbal de recepție semnat de ambele părți. Eventualele neconformități minore se remediază în termenul agreat. Utilizarea mobilierului montat înainte de semnarea procesului-verbal de recepție implică acceptul tacit al Clientului cu privire la starea generală a lucrării.",
    ],
  },
  {
    id: "garantii",
    number: "IV",
    title: "Garanții",
    content: [
      "SC Moodilier SRL acordă o garanție de 24 de luni pentru toate produsele fabricate în atelierul propriu, calculată de la data semnării procesului-verbal de recepție, în conformitate cu prevederile Legii nr. 449/2003 privind vânzarea produselor și garanțiile asociate acestora, republicată.",
      "Garanția acoperă defectele de fabricație și de material apărute în condiții normale de utilizare. Sunt excluse din garanție: (a) deteriorările cauzate de utilizarea necorespunzătoare sau nerespectarea instrucțiunilor de întreținere; (b) intervenții sau modificări efectuate de terți neautorizați; (c) deteriorări cauzate de factori externi (umezeală excesivă, expunere la razele UV directe, produse chimice agresive, temperaturi extreme); (d) uzura normală a pieselor mobile și a accesoriilor (balamale, glisiere, mânere).",
      "Mobilierul importat prin Moodilier Store beneficiază de garanția producătorului, ale cărei condiții sunt comunicate la momentul achiziției. Solicitările în garanție se adresează în scris la adresa de e-mail ofertare@moodilier.com, cu descrierea defecțiunii și fotografii relevante.",
    ],
  },
  {
    id: "proprietate",
    number: "V",
    title: "Proprietate intelectuală",
    content: [
      "Toate proiectele tehnice, randările 3D, planurile de amenajare, conceptele de design și materialele grafice elaborate de SC Moodilier SRL sunt proprietatea exclusivă a societății și sunt protejate de Legea nr. 8/1996 privind drepturile de autor și drepturile conexe.",
      "Clientul dobândește dreptul de utilizare a proiectelor tehnice exclusiv în scopul execuției comenzii care face obiectul contractului. Este interzisă reproducerea, distribuirea, cesionarea sau utilizarea acestora în orice alt scop fără acordul prealabil scris al SC Moodilier SRL.",
      "Conținutul site-ului moodilier.ro — inclusiv fotografii, texte, logo-uri, grafică, elemente de design și structura paginilor — este protejat de drepturile de autor. Orice reproducere, distribuire sau utilizare neautorizată este strict interzisă și se poate constitui în infracțiune conform legislației române și europene aplicabile.",
    ],
  },
  {
    id: "raspundere",
    number: "VI",
    title: "Limitarea răspunderii",
    content: [
      "SC Moodilier SRL nu poate fi ținută răspunzătoare pentru daune indirecte, incidentale sau consecvente rezultate din utilizarea serviciilor sale sau din întârzieri cauzate de forță majoră sau de terți furnizori.",
      "Răspunderea totală a SC Moodilier SRL față de Client, indiferent de temeiul juridic invocat, nu poate depăși valoarea contractuală a lucrărilor sau produselor care fac obiectul reclamației.",
      "SC Moodilier SRL nu garantează că informațiile prezentate pe site sunt exhaustive sau actualizate permanent și nu răspunde pentru erorile tehnice sau întreruperile de acces la site cauzate de factori externi (probleme de hosting, atacuri cibernetice, forță majoră).",
    ],
  },
  {
    id: "lege",
    number: "VII",
    title: "Lege aplicabilă și jurisdicție",
    content: [
      "Prezentele Termeni și Condiții sunt guvernate de legislația română în vigoare, incluzând dar fără a se limita la: Codul Civil, Legea nr. 449/2003 privind vânzarea produselor și garanțiile asociate, OUG nr. 34/2014 privind drepturile consumatorilor, GDPR (Regulamentul UE 2016/679) și legislația națională de implementare.",
      "Orice litigiu decurgând din sau în legătură cu prezentele condiții va fi soluționat pe cale amiabilă. În cazul în care soluționarea amiabilă nu este posibilă, competența aparține instanțelor judecătorești competente din Municipiul București.",
      "Consumatorii persoane fizice au, de asemenea, dreptul de a apela la platforma europeană de soluționare online a litigiilor: https://ec.europa.eu/consumers/odr/.",
      "SC Moodilier SRL își rezervă dreptul de a modifica prezentele Termeni și Condiții în orice moment, cu publicarea versiunii actualizate pe site-ul moodilier.ro. Continuarea utilizării serviciilor după publicarea modificărilor constituie acceptul tacit al noilor condiții.",
    ],
  },
];

export default function TermeniSiConditiiPage() {
  const lastUpdated = "Mai 2025";

  return (
    <>
      {/* ============== PAGE HERO ============== */}
      <PageHero
        label="Legal"
        title="Termeni și condiții"
        bgImage="/images-scraped/living_01_.jpg"
        overlayOpacity={0.78}
      />

      {/* ============== TABLE OF CONTENTS ============== */}
      <section
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-alt)",
          padding: "2.5rem 0",
        }}
      >
        <div className="container">
          <p
            className="label"
            style={{ marginBottom: "1.25rem", display: "block" }}
          >
            Cuprins
          </p>
          <nav>
            <ol
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "0.5rem 2rem",
                listStyle: "none",
              }}
            >
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.8rem",
                      color: "var(--color-fg-muted)",
                      padding: "0.375rem 0",
                      transition: "color var(--transition-base)",
                      borderBottom: "1px solid transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--color-gold)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-fg-muted)")
                    }
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-gold)",
                        fontSize: "0.9rem",
                        minWidth: "1.5rem",
                      }}
                    >
                      {s.number}.
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* ============== INTRO ============== */}
      <section style={{ padding: "4rem 0 0" }}>
        <div className="container">
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderLeft: "3px solid var(--color-gold)",
              padding: "2rem 2.5rem",
              maxWidth: "800px",
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-fg-muted)",
                lineHeight: 1.8,
                maxWidth: "100%",
              }}
            >
              Vă rugăm să citiți cu atenție prezentele Termeni și Condiții
              înainte de a utiliza serviciile SC Moodilier SRL. Prin plasarea
              unei comenzi, semnarea unui contract sau utilizarea continuă a
              site-ului{" "}
              <strong style={{ color: "var(--color-fg)" }}>
                moodilier.ro
              </strong>
              , confirmați că ați citit, înțeles și acceptat în totalitate
              prezentele condiții. Dacă nu sunteți de acord cu oricare dintre
              prevederi, vă rugăm să nu utilizați serviciile noastre.
            </p>
          </div>
        </div>
      </section>

      {/* ============== SECTIONS ============== */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4rem",
              maxWidth: "800px",
            }}
          >
            {sections.map((sec, idx) => (
              <article key={sec.id} id={sec.id}>
                {/* Section header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1.5rem",
                    marginBottom: "1.75rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "3rem",
                      fontWeight: 300,
                      color: "var(--color-border-alt)",
                      lineHeight: 1,
                      flexShrink: 0,
                      marginTop: "0.25rem",
                    }}
                  >
                    {sec.number}
                  </span>
                  <div>
                    <h2
                      style={{
                        fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                        fontWeight: 400,
                        color: "var(--color-fg)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {sec.title}
                    </h2>
                    <span
                      style={{
                        display: "block",
                        width: "2rem",
                        height: "1px",
                        background: "var(--color-gold)",
                      }}
                    />
                  </div>
                </div>

                {/* Section body */}
                <div
                  style={{
                    paddingLeft: "4.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {sec.content.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-fg-muted)",
                        lineHeight: 1.9,
                        maxWidth: "100%",
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {/* Separator */}
                {idx < sections.length - 1 && (
                  <div
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      marginTop: "4rem",
                    }}
                  />
                )}
              </article>
            ))}
          </div>

          {/* Footer note */}
          <div
            style={{
              marginTop: "5rem",
              paddingTop: "3rem",
              borderTop: "1px solid var(--color-border)",
              maxWidth: "800px",
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--color-fg-subtle)",
                lineHeight: 1.8,
                maxWidth: "100%",
              }}
            >
              <strong style={{ color: "var(--color-fg-muted)" }}>
                SC Moodilier SRL
              </strong>{" "}
              — Sediu social: Bulevardul Basarabia 256, incinta FAUR, Sector 3,
              București | E-mail:{" "}
              <a
                href="mailto:ofertare@moodilier.com"
                style={{ color: "var(--color-gold)" }}
              >
                ofertare@moodilier.com
              </a>{" "}
              | Tel:{" "}
              <a
                href="tel:+40729555431"
                style={{ color: "var(--color-gold)" }}
              >
                (+40) 729 555 431
              </a>{" "}
              | Web:{" "}
              <a
                href="https://moodilier.ro"
                style={{ color: "var(--color-gold)" }}
              >
                moodilier.ro
              </a>
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--color-fg-subtle)",
                lineHeight: 1.8,
                maxWidth: "100%",
                marginTop: "0.75rem",
              }}
            >
              Prezentele Termeni și Condiții sunt valabile începând cu data de{" "}
              <strong style={{ color: "var(--color-fg-muted)" }}>
                {lastUpdated}
              </strong>
              . Versiunile anterioare sunt disponibile la cerere.
            </p>
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section
        className="cta-section"
        style={{ padding: "5rem 0" }}
      >
        <div
          className="container"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <p className="label" style={{ marginBottom: "1.5rem" }}>
            Aveți întrebări?
          </p>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3vw, 3rem)",
              marginBottom: "1.25rem",
            }}
          >
            Suntem la dispoziția dvs.
          </h2>
          <p
            style={{
              maxWidth: "50ch",
              margin: "0 auto 2.5rem",
              color: "var(--color-fg-muted)",
            }}
          >
            Dacă aveți întrebări legate de termenii și condițiile noastre sau
            doriți clarificări suplimentare, nu ezitați să ne contactați.
          </p>
          <a href="/contact" className="btn btn-primary">
            Contactați-ne
          </a>
        </div>
      </section>
    </>
  );
}
