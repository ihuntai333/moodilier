"use client";

import { useEffect } from "react";
import { killSmoothScroll } from "@/lib/smooth-scroll";

/**
 * Lightweight motion for frontpage-v2 (no intro wait, native scroll).
 */
export default function FrontpageV2Client() {
  useEffect(() => {
    const root = document.getElementById("aw-home-v2");
    if (!root) return;

    killSmoothScroll();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root.querySelectorAll(".aw-reveal").forEach((el) => el.classList.add("is-in"));
      root.querySelectorAll(".aw-clip").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const awardsRoot = document.querySelector<HTMLElement>(".awards-root");
    awardsRoot?.classList.add("aw-anim", "aw-motion");

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    const boot = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const video = root.querySelector<HTMLVideoElement>(".aw-hero-video");
      video?.play().catch(() => {});

      ctx = gsap.context(() => {
        const heroBits = root.querySelectorAll(
          ".aw-hero-copy .aw-label, .aw-hero-copy .aw-brand-mark, .aw-hero-copy .aw-h1, .aw-hero-copy .aw-body, .aw-hero-copy .aw-hero-ctas"
        );
        const heroMedia = root.querySelector(".aw-hero-media");
        const heroInner = root.querySelector(".aw-hero-media-inner");

        gsap.set(heroBits, { opacity: 0, y: 36 });
        if (heroMedia) gsap.set(heroMedia, { clipPath: "inset(100% 0 0 0)" });
        if (heroInner) gsap.set(heroInner, { scale: 1.18 });

        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to(heroMedia, { clipPath: "inset(0% 0 0 0)", duration: 1.15 }, 0.05)
          .to(heroInner, { scale: 1, duration: 1.4, ease: "power3.out" }, 0.05)
          .to(heroBits, { opacity: 1, y: 0, duration: 0.85, stagger: 0.07 }, 0.35);

        root.querySelectorAll(".aw-hero-copy .aw-reveal").forEach((el) => {
          el.classList.add("is-in");
        });

        if (heroInner) {
          gsap.to(heroInner, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: root.querySelector(".aw-hero"),
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        root.querySelectorAll<HTMLElement>(".aw-reveal").forEach((el) => {
          if (el.closest(".aw-hero-copy")) return;
          const delay = Number(el.dataset.delay ?? 0);
          gsap.fromTo(
            el,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              delay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true,
              },
              onStart: () => el.classList.add("is-in"),
            }
          );
        });

        root.querySelectorAll<HTMLElement>(".aw-clip").forEach((el) => {
          if (el.closest(".aw-hero")) return;
          const media = el.querySelector(".aw-clip-media") || el;
          gsap.fromTo(
            media,
            { clipPath: "inset(100% 0 0 0)", scale: 1.06 },
            {
              clipPath: "inset(0% 0 0 0)",
              scale: 1,
              duration: 1.1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: el,
                start: "top 84%",
                once: true,
              },
              onStart: () => el.classList.add("is-in"),
            }
          );
        });

        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const raw = el.dataset.count || "0";
          const suffix = el.dataset.suffix || "";
          const prefix = el.dataset.prefix || "";
          const target = parseFloat(raw.replace(/[^\d.]/g, "")) || 0;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
            },
          });
        });

        ScrollTrigger.refresh();
      }, root);
    };

    boot();

    return () => {
      cancelled = true;
      ctx?.revert();
      killSmoothScroll();
      awardsRoot?.classList.remove("aw-anim", "aw-motion");
    };
  }, []);

  return null;
}
