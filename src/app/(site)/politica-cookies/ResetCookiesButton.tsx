"use client";

export default function ResetCookiesButton() {
  return (
    <button
      type="button"
      className="aw-btn aw-btn-outline-dark aw-btn-fill"
      onClick={() => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cookie_consent");
          window.location.reload();
        }
      }}
    >
      Gestionează preferințele
    </button>
  );
}
