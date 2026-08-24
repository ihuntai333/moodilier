import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";

export const metadata = {
  title: "Servicii | Admin Moodilier",
};

export default function AdminServiciiStubPage() {
  return (
    <div className="adm-page adm-page--narrow">
      <Link
        href="/admin/pagini"
        className="adm-nav-link adm-nav-link--muted"
        style={{ display: "inline-flex", padding: "0.35rem 0", marginBottom: "1rem" }}
      >
        <ArrowLeft size={15} strokeWidth={1.5} />
        Înapoi la Pagini
      </Link>

      <p className="adm-eyebrow">Pagini · Servicii</p>
      <h1 className="adm-title">Servicii</h1>
      <p className="adm-subtitle" style={{ marginBottom: "1.75rem" }}>
        Editorul pentru pagina Servicii nu este încă disponibil în admin.
      </p>

      <div className="adm-card adm-card--pad-lg" style={{ marginBottom: "1.25rem" }}>
        <div
          className="adm-page-card-icon"
          style={{ marginBottom: "1rem" }}
        >
          <Code2 size={20} strokeWidth={1.5} />
        </div>
        <h2 className="adm-page-card-title">Conținut în cod</h2>
        <p className="adm-page-card-desc">
          Texttele și layout-ul paginii Servicii sunt definite în fișierele
          aplicației (Next.js). Un editor CMS dedicat va apărea aici. Până
          atunci, modificările se fac prin dezvoltare.
        </p>
        <div className="adm-actions">
          <Link href="/admin/pagini/homepage" className="adm-btn adm-btn-primary">
            Editează Homepage
          </Link>
          <Link href="/servicii" className="adm-btn adm-btn-ghost">
            Vezi pagina live
          </Link>
        </div>
      </div>
    </div>
  );
}
