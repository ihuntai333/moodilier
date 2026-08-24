import type { Metadata } from "next";
import Link from "next/link";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";

export const metadata: Metadata = {
  title: "Politică de confidențialitate | Moodilier",
  description:
    "Politica de confidențialitate a SC Moodilier SRL — informații privind prelucrarea datelor cu caracter personal conform GDPR.",
};

export default function PoliticaConfidentialitatePage() {
  return (
    <>
      <SitePageHero
        label="Legal"
        title="Politică de confidențialitate"
        subtitle="Cum prelucrăm datele dumneavoastră cu caracter personal, în conformitate cu GDPR."
        bgImage="/images-scraped/living_06_.jpg"
        overlayOpacity={0.6}
      />

      <section className="aw-page-section">
        <div className="aw-container">
          <div className="aw-prose">
            <div>
              <p className="aw-prose-meta">Ultima actualizare: Mai 2025</p>
              <p>
                SC Moodilier SRL, cu sediul în Bulevardul Basarabia 256, incinta FAUR, Sector 3,
                București, România, vă informează cu privire la modul în care prelucrăm datele
                dumneavoastră cu caracter personal, în conformitate cu Regulamentul (UE) 2016/679
                (GDPR).
              </p>
            </div>

            <div>
              <p className="aw-prose-meta">1. Cine suntem</p>
              <h3>Operatorul de date</h3>
              <p>
                <strong>SC Moodilier SRL</strong>
                <br />
                Bulevardul Basarabia 256, incinta FAUR, Sector 3, București, România
                <br />
                Email: <a href="mailto:ofertare@moodilier.com">ofertare@moodilier.com</a>
                <br />
                Telefon: <a href="tel:+40729555431">(+40) 729 555 431</a>
              </p>
              <p>
                SC Moodilier SRL acționează în calitate de operator al datelor cu caracter personal
                colectate prin intermediul site-ului și al altor canale de comunicare.
              </p>
            </div>

            <div>
              <p className="aw-prose-meta">2. Date colectate</p>
              <h3>Ce date cu caracter personal colectăm</h3>
              <p>Colectăm doar datele strict necesare pentru scopurile menționate:</p>
              <ul>
                <li>Nume și prenume</li>
                <li>Adresă de e-mail</li>
                <li>Număr de telefon</li>
                <li>Adresă (pentru livrare sau vizită, când este cazul)</li>
                <li>Mesajul transmis prin formularul de contact</li>
                <li>Date tehnice de navigare (IP, browser, sesiune) — prin cookies</li>
              </ul>
              <p>
                Nu colectăm date sensibile (sănătate, origine etnică, opinii politice, date
                biometrice etc.).
              </p>
            </div>

            <div>
              <p className="aw-prose-meta">3. Scopul prelucrării</p>
              <h3>De ce prelucrăm datele</h3>
              <ul>
                <li>Răspunsul la solicitările de ofertă și mesajele de contact</li>
                <li>Executarea contractelor de proiectare, producție și montaj</li>
                <li>Comunicări legate de proiect (măsurători, termene, livrare)</li>
                <li>Îmbunătățirea site-ului și a serviciilor (analytics, cu consimțământ)</li>
                <li>Respectarea obligațiilor legale (contabilitate, garanții)</li>
              </ul>
            </div>

            <div>
              <p className="aw-prose-meta">4. Temei juridic</p>
              <h3>Baza legală a prelucrării</h3>
              <p>
                Prelucrăm datele pe baza: consimțământului (formular, cookies non-esențiale),
                executării unui contract sau a demersurilor precontractuale, interesului legitim
                (securitate, îmbunătățirea serviciilor) și obligațiilor legale.
              </p>
            </div>

            <div>
              <p className="aw-prose-meta">5. Partajare</p>
              <h3>Cu cine partajăm datele</h3>
              <p>
                Nu vindem date personale. Putem partaja date cu furnizori de servicii (hosting,
                email, analytics) care acționează ca împuterniciți, sau cu autorități când legea o
                cere. Transferurile în afara SEE se fac doar cu garanții adecvate.
              </p>
            </div>

            <div>
              <p className="aw-prose-meta">6. Drepturile dvs.</p>
              <h3>Drepturi GDPR</h3>
              <ul>
                <li>Dreptul de acces</li>
                <li>Dreptul la rectificare</li>
                <li>Dreptul la ștergere („dreptul de a fi uitat”)</li>
                <li>Dreptul la restricționarea prelucrării</li>
                <li>Dreptul la portabilitate</li>
                <li>Dreptul de opoziție</li>
                <li>Dreptul de a retrage consimțământul</li>
                <li>Dreptul de a depune plângere la ANSPDCP</li>
              </ul>
              <p>
                Pentru exercitarea drepturilor:{" "}
                <a href="mailto:ofertare@moodilier.com">ofertare@moodilier.com</a>. Răspundem în
                maxim 30 de zile.
              </p>
            </div>

            <div>
              <p className="aw-prose-meta">7. Cookies</p>
              <h3>Fișiere cookie</h3>
              <p>
                Detaliile privind tipurile de cookie-uri, scopurile și gestionarea preferințelor
                sunt disponibile în{" "}
                <Link href="/politica-cookies">Politica de cookies</Link>.
              </p>
            </div>

            <div>
              <p className="aw-prose-meta">8. Actualizări</p>
              <h3>Modificări ale politicii</h3>
              <p>
                Putem actualiza această politică periodic. Versiunea curentă este publicată pe
                această pagină, cu data ultimei actualizări.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteCTA
        title="Întrebări despre date?"
        body="Ne puteți contacta oricând pentru clarificări privind prelucrarea datelor personale."
        primaryLabel="Contactează-ne"
        secondaryLabel="Politica cookies"
        secondaryHref="/politica-cookies"
      />
    </>
  );
}
