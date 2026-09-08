import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagină negăsită",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div>
        <p
          style={{
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#b8972e",
            fontSize: 12,
            marginBottom: 12,
          }}
        >
          404
        </p>
        <h1 style={{ fontSize: "1.75rem", marginBottom: 12 }}>
          Pagina nu există
        </h1>
        <p style={{ opacity: 0.7, marginBottom: 28, maxWidth: 420, marginInline: "auto" }}>
          Linkul poate fi vechi sau greșit. Continuă din meniu sau din pagina
          principală.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="aw-btn aw-btn-primary">
            Acasă
          </Link>
          <Link href="/proiecte" className="aw-btn-ghost">
            Proiecte
          </Link>
          <Link href="/contact" className="aw-btn-ghost">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
