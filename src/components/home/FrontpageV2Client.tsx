"use client";

import { useEffect } from "react";
import { killSmoothScroll } from "@/lib/smooth-scroll";

/**
 * Lightweight motion for frontpage-v2 — content visible first; soft below-fold only.
 */
export default function FrontpageV2Client() {
  useEffect(() => {
    const root = document.getElementById("aw-home-v2");
    if (!root) return;

    killSmoothScroll();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root.querySelectorAll(".aw-reveal, .aw-clip").forEach((el) => el.classList.add("is-in"));
      return;
    }

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    const boot = async () => {
      await new Promise<void>((r) => {
        const w = window as Window & {
          requestIdleCallback?: (cb: () => void) => number;
        };
        if (typeof w.requestIdleCallback === "function") {
          w.requestIdleCallback(() => r());
        } else {
          window.setTimeout(() => r(), 120);
        }
      });
      if (cancelled) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const awardsRoot = document.querySelector<HTMLElement>(".awards-root");
      awardsRoot?.classList.add("aw-anim", "aw-motion");

      const video = root.querySelector<HTMLVideoElement>(".aw-hero-video");
      video?.play().catch(() => {});

      // Hero copy stays visible — never blank the first paint
      root
        .querySelectorAll(
          ".aw-hero-copy .aw-reveal, .aw-hero-copy .aw-label, .aw-hero-copy .aw-brand-mark, .aw-hero-copy .aw-h1, .aw-hero-copy .aw-body, .aw-hero-copy .aw-hero-ctas"
        )
        .forEach((el) => {
          el.classList.add("is-in");
          (el as HTMLElement).style.opacity = "1";
          (el as HTMLElement).style.transform = "none";
        });

      const isMobile = window.matchMedia("(max-width: 700px)").matches;
      const y = isMobile ? 10 : 14;

      ctx = gsap.context(() => {
        root.querySelectorAll<HTMLElement>(".aw-reveal").forEach((el) => {
          if (el.closest(".aw-hero-copy")) return;
          gsap.fromTo(
            el,
            { opacity: 0.01, y },
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 94%",
                toggleActions: "play none none none",
                once: true,
              },
              onStart: () => el.classList.add("is-in"),
            }
          );
        });
      }, root);
    };

    void boot();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
