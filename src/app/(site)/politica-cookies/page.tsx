import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-seo";
import Link from "next/link";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import ResetCookiesButton from "./ResetCookiesButton";

export const metadata: Metadata = pageMetadata({
  path: "/politica-cookies",
  title: "Politică cookies",
  description:
    "Politica de cookies Moodilier — tipuri de cookie-uri și preferințe.",
});

const categories = [
  {
    category: "Necesare",
    required: true,
    description:
      "Esențiale pentru funcționarea site-ului (sesiune, securitate, consimțământ). Nu pot fi dezactivate.",
    examples: ["session_id", "csrf_token", "cookie_consent"],
  },
  {
    category: "Statistici / Analytics",
    required: false,
    description:
      "Ne ajută să înțelegem cum interacționează vizitatorii cu site-ul, în mod anonim, pentru a îmbunătăți conținutul.",
    examples: ["_ga", "_gid", "_gat"],
  },
  {
    category: "Marketing",
    required: false,
    description:
      "Utilizate pentru a afișa reclame relevante. Dezactivarea nu oprește publicitatea, dar o face mai puțin personalizată.",
    examples: ["_fbp", "_gcl_au"],
  },
];

export default function PoliticaCookiesPage() {
  return (
    <>
      <SitePageHero
        label="Legal"
        title="Politică cookies"
        subtitle="Ce cookie-uri folosim, de ce și cum vă puteți gestiona preferințele."
        bgImage="/images-scraped/living_01_.jpg"
        overlayOpacity={0.6}
      />

      <section className="aw-page-section">
        <div className="aw-container">
          <div className="aw-prose">
            <div>
              <p className="aw-prose-meta">Ultima actualizare: Mai 2025</p>
              <p>
                Acest site folosește cookie-uri pentru a asigura funcționarea corectă, a analiza
                traficul și, cu acordul dumneavoastră, a personaliza experiența. Continuând
                navigarea după acceptarea bannerului, sunteți de acord cu utilizarea cookie-urilor
                conform acestei politici.
              </p>
            </div>

            <div>
              <p className="aw-prose-meta">Ce sunt cookie-urile</p>
              <h3>Definiție</h3>
              <p>
                Cookie-urile sunt fișiere text de mici dimensiuni stocate pe dispozitivul
                dumneavoastră când vizitați un site. Pot fi „de sesiune” (șterse la închiderea
                browserului) sau „persistente” (rămân până la expirare sau ștergere).
              </p>
            </div>

            {categories.map((c) => (
              <div key={c.category}>
                <p className="aw-prose-meta">
                  {c.required ? "Obligatorii" : "Opționale"} — {c.category}
                </p>
                <h3>{c.category}</h3>
                <p>{c.description}</p>
                <ul>
                  {c.examples.map((ex) => (
                    <li key={ex}>
                      <code>{ex}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="aw-prose-meta">Gestionare</p>
              <h3>Cum gestionați preferințele</h3>
              <p>
                Puteți reseta consimțământul cookie-urilor și redeschide bannerul de preferințe:
              </p>
              <div style={{ marginTop: "1.25rem" }}>
                <ResetCookiesButton />
              </div>
              <p style={{ marginTop: "1.5rem" }}>
                De asemenea, puteți bloca sau șterge cookie-urile din setările browserului. Mai
                multe despre date personale:{" "}
                <Link href="/politica-de-confidentialitate">
                  Politica de confidențialitate
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteCTA
        title="Întrebări?"
        body="Pentru clarificări privind cookie-urile sau confidențialitatea, contactați-ne."
        primaryLabel="Contactează-ne"
        secondaryLabel="Confidențialitate"
        secondaryHref="/politica-de-confidentialitate"
      />
    </>
  );
}
