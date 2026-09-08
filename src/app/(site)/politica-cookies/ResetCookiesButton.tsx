"use client";

export default function ResetCookiesButton() {
  return (
    <button
      type="button"
      className="aw-btn aw-btn-outline aw-btn-fill"
      onClick={() => {
        if (typeof window === "undefined") return;
        localStorage.removeItem("moodilier-cookie-consent");
        localStorage.removeItem("cookie_consent");
        window.location.reload();
      }}
    >
      Gestionează preferințele
    </button>
  );
}
