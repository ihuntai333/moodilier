import Link from "next/link";
import { ArrowLeft, Eye, Info, Check } from "lucide-react";

export const metadata = {
  title: "Homepage | Admin Moodilier",
};

const tips = [
  "Proiectele featured apar pe homepage — marchează-le din Proiecte.",
  "Logo, meniu header/footer și contact se editează din Setări.",
  "Video hover + hero: încarcă video pe fiecare proiect.",
  "Textele hero/secțiuni fixe se pot ajusta din codul paginii (site curat, performant).",
];

export default function AdminHomepagePage() {
  return (
    <div className="adm-page adm-page--narrow">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/admin/pagini"
          className="adm-nav-link adm-nav-link--muted"
          style={{ display: "inline-flex", padding: "0.35rem 0", marginBottom: "1rem" }}
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          Înapoi la Pagini
        </Link>
        <p className="adm-eyebrow">Pagini · Homepage</p>
        <h1 className="adm-title">Homepage</h1>
        <p className="adm-subtitle">
          Homepage-ul live e optimizat pentru viteză și SEO. Conținutul dinamic
          (proiecte, logo, meniuri) vine din admin.
        </p>
      </div>

      <div className="adm-hero-cta">
        <div>
          <h2 className="adm-page-card-title" style={{ marginBottom: "0.5rem" }}>
            Vezi live
          </h2>
          <p className="adm-page-card-desc" style={{ marginBottom: 0 }}>
            Deschide site-ul public pentru a verifica homepage-ul după modificări.
          </p>
        </div>
        <div className="adm-hero-cta-actions">
          <Link href="/" className="adm-btn adm-btn-primary adm-btn-lg">
            <Eye size={16} />
            Vezi homepage live
          </Link>
          <Link href="/admin/proiecte" className="adm-btn adm-btn-secondary adm-btn-lg">
            Gestionează proiecte
          </Link>
        </div>
      </div>

      <div className="adm-tip" style={{ marginBottom: "1.5rem" }}>
        <div className="adm-tip-icon">
          <Info size={18} strokeWidth={1.75} />
        </div>
        <div className="adm-tip-body">
          <h2 className="adm-tip-title">Ce controlezi din admin</h2>
          <p className="adm-tip-text">
            Portofoliul de pe homepage, branding-ul și analytics. Salvează din{" "}
            <Link href="/admin/setari">Setări</Link> și{" "}
            <Link href="/admin/proiecte">Proiecte</Link> — cache-ul se actualizează
            automat (~60s).
          </p>
        </div>
      </div>

      <div className="adm-card adm-card--pad-lg">
        <div className="adm-section-label">Checklist</div>
        <ul className="adm-checklist">
          {tips.map((item) => (
            <li key={item}>
              <span className="adm-checklist-mark">
                <Check size={11} strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
