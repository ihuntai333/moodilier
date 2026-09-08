import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-seo";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";

export const metadata: Metadata = pageMetadata({
  path: "/termeni-si-conditii",
  title: "Termeni și condiții",
  description:
    "Termeni și condiții Moodilier pentru utilizarea site-ului și a serviciilor de mobilier la comandă.",
});

const sections = [
  {
    id: "servicii",
    number: "I",
    title: "Servicii oferite",
    content: [
      "SC Moodilier SRL, cu sediul social în Municipiul București, oferă servicii de proiectare, producție și montaj de mobilier premium la comandă, inclusiv: bucătării, dressinguri, livinguri, dormitoare, spații comerciale, recepții și birouri.",
      "Serviciile sunt furnizate exclusiv pe teritoriul României, cu excepția cazurilor expres convenite în scris cu Clientul. Moodilier SRL furnizează, de asemenea, servicii de design interior, consultanță și Moodilier Fabrics (perdele, draperii și sisteme de umbrire).",
      "Societatea își rezervă dreptul de a modifica, extinde sau restrânge gama de servicii, cu notificare prealabilă a Clienților afectați, în măsura în care contractele individuale nu prevăd altfel.",
    ],
  },
  {
    id: "oferte",
    number: "II",
    title: "Oferte și prețuri",
    content: [
      "Toate ofertele emise de SC Moodilier SRL sunt personalizate, bazate pe specificațiile tehnice, materialele și finisajele alese de Client. Oferta este valabilă 30 de zile calendaristice de la data emiterii, dacă nu se specifică altfel.",
      "Prețurile includ TVA-ul legal în vigoare și se exprimă în LEI (RON), dacă nu există o convenție scrisă contrară. Orice modificare solicitată după acceptarea ofertei poate genera costuri suplimentare, comunicate și aprobate în scris.",
      "Avansul standard solicitat pentru demararea unui proiect este de minimum 50% din valoarea totală a contractului. Restul sumei se achită conform graficului de plată agreat contractual.",
    ],
  },
  {
    id: "executie",
    number: "III",
    title: "Execuție și livrare",
    content: [
      "Termenele de execuție sunt estimate și comunicate la momentul semnării contractului. Acestea se calculează de la data plății avansului și finalizării proiectului tehnic aprobat de Client.",
      "Termenele se pot prelungi justificat în cazul întârzierilor în aprobarea proiectului, modificărilor pe parcurs, forței majore sau întârzierilor de plată.",
      "Livrarea și montajul se efectuează la adresa indicată de Client. La finalizare se întocmește un proces-verbal de recepție semnat de ambele părți.",
    ],
  },
  {
    id: "garantii",
    number: "IV",
    title: "Garanții",
    content: [
      "SC Moodilier SRL acordă o garanție de 24 de luni pentru produsele fabricate în atelierul propriu, calculată de la data semnării procesului-verbal de recepție.",
      "Garanția acoperă defectele de fabricație și de material apărute în condiții normale de utilizare. Sunt excluse deteriorările din utilizare necorespunzătoare, intervenții neautorizate sau factori externi.",
      "Produsele și montajele Moodilier Fabrics beneficiază de garanția aplicabilă tipului de sistem. Solicitările în garanție se adresează la draperii@moodilier.com.",
    ],
  },
  {
    id: "proprietate",
    number: "V",
    title: "Proprietate intelectuală",
    content: [
      "Toate proiectele tehnice, randările 3D, planurile de amenajare și materialele grafice elaborate de SC Moodilier SRL sunt proprietatea exclusivă a societății.",
      "Clientul dobândește dreptul de utilizare a proiectelor exclusiv în scopul execuției comenzii. Este interzisă reproducerea sau cesionarea fără acord scris.",
      "Conținutul site-ului — fotografii, texte, logo-uri, grafică — este protejat de drepturile de autor.",
    ],
  },
  {
    id: "raspundere",
    number: "VI",
    title: "Limitarea răspunderii",
    content: [
      "SC Moodilier SRL nu poate fi ținută răspunzătoare pentru daune indirecte, incidentale sau consecvente rezultate din utilizarea serviciilor sau din întârzieri cauzate de forță majoră sau terți.",
      "Răspunderea totală față de Client nu poate depăși valoarea contractuală a lucrărilor sau produselor care fac obiectul reclamației.",
    ],
  },
  {
    id: "lege",
    number: "VII",
    title: "Lege aplicabilă și jurisdicție",
    content: [
      "Prezentele Termeni și Condiții sunt guvernate de legislația română în vigoare, inclusiv GDPR (Regulamentul UE 2016/679).",
      "Orice litigiu va fi soluționat pe cale amiabilă; în caz contrar, competența aparține instanțelor din Municipiul București.",
      "Consumatorii persoane fizice pot apela la platforma europeană ODR: https://ec.europa.eu/consumers/odr/.",
    ],
  },
];

export default function TermeniSiConditiiPage() {
  return (
    <>
      <SitePageHero
        label="Legal"
        title="Termeni și condiții"
        subtitle="Condițiile de utilizare ale site-ului și serviciilor SC Moodilier SRL."
        bgImage="/images-scraped/living_01_.jpg"
        overlayOpacity={0.6}
      />

      <section className="aw-page-section">
        <div className="aw-container">
          <div className="aw-prose">
            <div>
              <p className="aw-prose-meta">Ultima actualizare: Mai 2025</p>
              <p>
                Vă rugăm să citiți cu atenție prezentele Termeni și Condiții înainte de a utiliza
                site-ul sau de a contracta serviciile SC Moodilier SRL. Continuarea utilizării
                constituie acceptul acestor condiții.
              </p>
            </div>

            {sections.map((s) => (
              <div key={s.id} id={s.id}>
                <p className="aw-prose-meta">
                  {s.number}. {s.title}
                </p>
                <h3>{s.title}</h3>
                {s.content.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteCTA
        title="Întrebări?"
        body="Pentru clarificări privind termenii contractuali, scrieți-ne — răspundem prompt."
        primaryLabel="Contactează-ne"
        secondaryLabel="Politica de confidențialitate"
        secondaryHref="/politica-de-confidentialitate"
      />
    </>
  );
}
