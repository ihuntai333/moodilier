"use client";

import { useEffect } from "react";
import { killSmoothScroll } from "@/lib/smooth-scroll";

/**
 * Homepage scroll reveals — progressive, once-per-element, organic ease-out.
 * Purpose: prevent jarring pop-in + delight on a rare marketing surface.
 */
export default function FrontpageAwardsClient() {
  useEffect(() => {
    const root = document.getElementById("aw-home");
    if (!root) return;

    killSmoothScroll();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root
        .querySelectorAll(".aw-reveal, .aw-project-reveal, .aw-clip")
        .forEach((el) => el.classList.add("is-in"));
      return;
    }

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    const waitForIntro = () =>
      new Promise<void>((resolve) => {
        const html = document.documentElement;
        if (html.classList.contains("aw-intro-done")) {
          resolve();
          return;
        }
        // Head script / loader set pending — wait for finish event
        if (
          html.classList.contains("aw-intro-pending") ||
          document.querySelector(".aw-intro")
        ) {
          let done = false;
          const finish = () => {
            if (done) return;
            done = true;
            window.removeEventListener("aw-intro-done", finish);
            window.clearTimeout(timer);
            resolve();
          };
          window.addEventListener("aw-intro-done", finish);
          const timer = window.setTimeout(finish, 2800);
          return;
        }
        resolve();
      });

    const boot = async () => {
      await waitForIntro();
      if (cancelled) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const awardsRoot = document.querySelector<HTMLElement>(".awards-root");
      awardsRoot?.classList.add("aw-anim", "aw-motion");

      const ease = "power3.out";
      const isMobile = window.matchMedia("(max-width: 700px)").matches;
      const yReveal = isMobile ? 28 : 40;
      const dur = isMobile ? 0.7 : 0.85;

      ctx = gsap.context(() => {
        // Hero copy: soft entrance after intro (not scroll)
        const heroBits = root.querySelectorAll<HTMLElement>(
          ".aw-hero-copy .aw-label, .aw-hero-copy .aw-h1, .aw-hero-copy .aw-body, .aw-hero-copy .aw-hero-ctas"
        );
        if (heroBits.length) {
          gsap.fromTo(
            heroBits,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.09,
              ease,
              delay: 0.05,
              onComplete: () => {
                heroBits.forEach((el) => el.classList.add("is-in"));
              },
            }
          );
        }

        const revealOne = (
          el: HTMLElement,
          opts?: { y?: number; delay?: number }
        ) => {
          if (el.closest(".aw-hero-copy")) return;
          const delay = opts?.delay ?? Number(el.dataset.delay || 0);
          gsap.fromTo(
            el,
            { opacity: 0, y: opts?.y ?? yReveal },
            {
              opacity: 1,
              y: 0,
              duration: dur,
              delay: Math.min(delay, 0.35),
              ease,
              scrollTrigger: {
                trigger: el,
                start: "top 86%",
                end: "top 40%",
                toggleActions: "play none none none",
                once: true,
              },
              onStart: () => el.classList.add("is-in"),
            }
          );
        };

        // Section heads, bodies, feet — each on its own scroll beat
        root.querySelectorAll<HTMLElement>(".aw-reveal").forEach((el) => {
          if (
            el.matches(
              ".aw-benefit, .aw-service, .aw-step, .aw-supplier, .aw-project-reveal"
            )
          ) {
            return;
          }
          revealOne(el);
        });

        // Grids: batch as they enter, with a breathing stagger
        (
          [
            [".aw-benefits-grid .aw-benefit", 0.08],
            [".aw-portfolio-grid .aw-project-reveal", 0.1],
            [".aw-services-grid .aw-service", 0.09],
            [".aw-steps .aw-step", 0.07],
            [".aw-suppliers-grid .aw-supplier", 0.05],
          ] as const
        ).forEach(([sel, stagger]) => {
          const items = root.querySelectorAll<HTMLElement>(sel);
          if (!items.length) return;
          ScrollTrigger.batch(items, {
            start: "top 88%",
            once: true,
            interval: 0.12,
            batchMax: isMobile ? 2 : 3,
            onEnter: (batch) => {
              gsap.fromTo(
                batch,
                { opacity: 0, y: yReveal * 0.85 },
                {
                  opacity: 1,
                  y: 0,
                  duration: dur,
                  stagger,
                  ease,
                  overwrite: "auto",
                  onStart: () => {
                    (batch as HTMLElement[]).forEach((c) =>
                      c.classList.add("is-in")
                    );
                  },
                }
              );
            },
          });
        });
      }, root);

      // Refresh after layout / fonts settle
      requestAnimationFrame(() => ScrollTrigger.refresh());
      window.setTimeout(() => ScrollTrigger.refresh(), 400);
    };

    void boot();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
