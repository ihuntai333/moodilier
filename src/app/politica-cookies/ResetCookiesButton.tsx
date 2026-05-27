"use client";

export default function ResetCookiesButton() {
  return (
    <button
      type="button"
      className="btn btn-outline"
      style={{ cursor: "pointer" }}
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
