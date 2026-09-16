import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-seo";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";

export const metadata: Metadata = pageMetadata({
  path: "/nota-legala",
  title: "Notă legală",
  description:
    "Notă legală Moodilier — identificare societate, condiții de utilizare și proprietate intelectuală.",
});

const sections = [
  {
    id: "identificare",
    number: "01",
    title: "Identificarea societății",
    paragraphs: [
      "Site-ul este publicat și administrat de SC Moodilier SRL — Societate cu Răspundere Limitată, sediu social: Bulevardul Basarabia 256, incinta FAUR, Sector 3, București, România.",
      "Telefon: (+40) 729 555 431 · E-mail: ofertare@moodilier.com",
      "SC Moodilier SRL este înregistrată în Registrul Comerțului de pe lângă Tribunalul București și este plătitoare de TVA conform reglementărilor fiscale române în vigoare.",
    ],
    list: [
      "Denumire: SC Moodilier SRL",
      "Formă juridică: Societate cu Răspundere Limitată",
      "Sediu: Bulevardul Basarabia 256, incinta FAUR, Sector 3, București",
      "Telefon: (+40) 729 555 431",
      "E-mail: ofertare@moodilier.com",
    ],
  },
  {
    id: "utilizare",
    number: "02",
    title: "Condiții de utilizare a site-ului",
    paragraphs: [
      "Accesarea și utilizarea site-ului implică acceptul necondiționat al prezentei note legale. Dacă nu sunteți de acord, vă rugăm să încetați utilizarea site-ului.",
      "Site-ul este destinat prezentării serviciilor SC Moodilier SRL și facilitării contactului cu potențialii clienți. Este interzisă utilizarea în scopuri ilegale, frauduloase sau care aduc atingere drepturilor terților.",
      "SC Moodilier SRL depune eforturi rezonabile pentru a menține site-ul disponibil, dar nu garantează disponibilitatea continuă.",
    ],
    list: null as string[] | null,
  },
  {
    id: "proprietate",
    number: "03",
    title: "Proprietate intelectuală",
    paragraphs: [
      "Întreg conținutul site-ului — texte, fotografii, imagini, logo-uri, elemente de interfață, structură — este protejat de Legea nr. 8/1996 privind drepturile de autor.",
      "Marca „Moodilier” și logo-ul asociat aparțin SC Moodilier SRL. Utilizarea fără acordul prealabil scris este interzisă.",
    ],
    list: [
      "Reproducerea comercială a conținutului fără acord",
      "Modificarea sau crearea de opere derivate",
      "Utilizarea pe alte site-uri sau platforme",
      "Descărcarea masivă (scraping) prin mijloace automate",
    ],
  },
  {
    id: "raspundere",
    number: "04",
    title: "Limitarea răspunderii",
    paragraphs: [
      "Informațiile de pe site sunt furnizate cu titlu informativ și pot fi modificate fără notificare. SC Moodilier SRL nu garantează că sunt complete, exacte sau actuale permanent.",
      "Site-ul poate conține linkuri către site-uri terțe. SC Moodilier SRL nu controlează și nu răspunde pentru conținutul sau politicile acelor site-uri.",
      "SC Moodilier SRL nu va fi responsabilă pentru daune directe sau indirecte rezultate din utilizarea sau imposibilitatea utilizării site-ului.",
    ],
    list: null,
  },
  {
    id: "date",
    number: "05",
    title: "Protecția datelor cu caracter personal",
    paragraphs: [
      "SC Moodilier SRL prelucrează datele cu caracter personal în conformitate cu GDPR (Regulamentul UE 2016/679) și legislația națională de implementare.",
      "Datele colectate prin formulare sunt utilizate exclusiv în scopul furnizării serviciilor solicitate. Aveți dreptul de acces, rectificare, ștergere, portabilitate, restricționare și opoziție — scrieți la ofertare@moodilier.com. Aveți dreptul de a depune plângere la ANSPDCP.",
    ],
    list: null,
  },
  {
    id: "jurisdictie",
    number: "06",
    title: "Jurisdicție și lege aplicabilă",
    paragraphs: [
      "Prezenta notă legală este guvernată de legislația română. Litigiile legate de utilizarea site-ului sunt de competența instanțelor din Municipiul București.",
      "SC Moodilier SRL își rezervă dreptul de a modifica prezenta notă legală. Versiunea actualizată este publicată pe site cu data ultimei actualizări.",
    ],
    list: null,
  },
];

export default function NotaLegalaPage() {
  return (
    <>
      <SitePageHero
        label="Legal"
        title="Notă legală"
        subtitle="Identificarea societății, condiții de utilizare, proprietate intelectuală și limitarea răspunderii."
        bgImage="/brand/pages/nota-legala.jpg"
        overlayOpacity={0.6}
      />

      <section className="aw-page-section">
        <div className="aw-container">
          <div className="aw-prose">
            <div>
              <p className="aw-prose-meta">Ultima actualizare: Mai 2025</p>
              <p>
                Prezenta notă legală reglementează accesul și utilizarea site-ului Moodilier,
                administrat de SC Moodilier SRL.
              </p>
            </div>

            {sections.map((s) => (
              <div key={s.id} id={s.id}>
                <p className="aw-prose-meta">
                  {s.number}. {s.title}
                </p>
                <h3>{s.title}</h3>
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
                {s.list && (
                  <ul>
                    {s.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteCTA
        title="Contact"
        body="Pentru întrebări legale sau solicitări de ofertă, suntem la dispoziția dumneavoastră."
        primaryLabel="Contactează-ne"
        secondaryLabel="Termeni și condiții"
        secondaryHref="/termeni-si-conditii"
      />
    </>
  );
}
