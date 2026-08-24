type LenisLike = {
  destroy: () => void;
  stop?: () => void;
};

declare global {
  interface Window {
    __moodilierLenis?: LenisLike | null;
  }
}

/** Tear down Lenis / GSAP scroll hijack so App Router navigation stays instant. */
export function killSmoothScroll() {
  if (typeof window === "undefined") return;

  try {
    window.__moodilierLenis?.stop?.();
    window.__moodilierLenis?.destroy?.();
  } catch {
    /* ignore */
  }
  window.__moodilierLenis = null;

  document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-scrolling");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("height");
  document.body.style.removeProperty("position");
}

export function registerSmoothScroll(instance: LenisLike | null) {
  if (typeof window === "undefined") return;
  window.__moodilierLenis = instance;
}
