import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";

export const metadata = {
  title: "Despre noi | Admin Moodilier",
};

export default function AdminDespreStubPage() {
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

      <p className="adm-eyebrow">Pagini · Despre noi</p>
      <h1 className="adm-title">Despre noi</h1>
      <p className="adm-subtitle" style={{ marginBottom: "1.75rem" }}>
        Editorul pentru pagina Despre noi nu este încă disponibil în admin.
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
          Conținutul paginii Despre noi este încă în cod. Un stub de editor va
          fi înlocuit cu un formular dedicat. Până atunci, editează homepage-ul
          sau proiectele din zonele deja disponibile.
        </p>
        <div className="adm-actions">
          <Link href="/admin/pagini/homepage" className="adm-btn adm-btn-primary">
            Editează Homepage
          </Link>
          <Link href="/despre-noi" className="adm-btn adm-btn-ghost">
            Vezi pagina live
          </Link>
        </div>
      </div>
    </div>
  );
}
