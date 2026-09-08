"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#0a0a0a",
        color: "#f5f5f5",
        fontFamily: "system-ui, sans-serif",
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
          Eroare
        </p>
        <h1 style={{ fontSize: "1.75rem", marginBottom: 12 }}>
          Ceva nu a mers cum trebuie
        </h1>
        <p style={{ opacity: 0.7, marginBottom: 28, maxWidth: 420 }}>
          Pagina nu a putut fi încărcată. Poți reîncerca sau reveni la pagina
          principală.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#b8972e",
              color: "#0a0a0a",
              border: 0,
              padding: "10px 18px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reîncearcă
          </button>
          <Link
            href="/"
            style={{
              color: "#f5f5f5",
              padding: "10px 18px",
              border: "1px solid rgba(255,255,255,0.25)",
              textDecoration: "none",
            }}
          >
            Acasă
          </Link>
        </div>
      </div>
    </main>
  );
}
