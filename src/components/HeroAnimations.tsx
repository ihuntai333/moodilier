"use client";

import { useEffect } from "react";

/**
 * HeroAnimations — replaces the CSS blur/IO system on the main page.
 * Uses GSAP + Lenis exactly like frontpage-v6:
 *   • Hero image: scale-in + parallax on scroll
 *   • Hero text: staggered y+opacity reveal (no blur)
 *   • Scroll reveals: GSAP ScrollTrigger for all .reveal elements
 *   • Lenis smooth scroll (desktop only)
 */
export default function HeroAnimations() {
  useEffect(() => {
    // Immediately neutralise CSS animation system for .reveal elements
    // so GSAP inline styles take full control (no conflict with revealCinematic)
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      el.style.animation = "none";
    });

    let lenis: InstanceType<typeof import("lenis").default> | null = null;
    let dead = false;

    const boot = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);

      /* ── Smooth scroll — desktop only ── */
      if (!window.matchMedia("(hover: none)").matches) {
        lenis = new Lenis({
          duration: 1.3,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        lenis.on("scroll", () => ScrollTrigger.update());
        gsap.ticker.add((t: number) => lenis?.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      /* ── Hero image: scale + fade in ── */
      gsap.from(".hero-bg img", {
        scale: 1.07,
        opacity: 0.65,
        duration: 1.9,
        ease: "power3.out",
        delay: 0.08,
      });

      /* ── Hero bg parallax on scroll ── */
      gsap.to(".hero-bg", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* ── Hero text: staggered reveal (translateY + opacity) ── */
      gsap.from(".hero-tagline", {
        y: 38, opacity: 0, duration: 1, ease: "power3.out", delay: 0.22,
      });
      gsap.from(".hero-title", {
        y: 48, opacity: 0, duration: 1.1, ease: "power3.out", delay: 0.36,
      });
      gsap.from(".hero-subtitle", {
        y: 32, opacity: 0, duration: 0.95, ease: "power3.out", delay: 0.52,
      });
      gsap.from(".hero-content > div:last-child", {
        y: 24, opacity: 0, duration: 0.9, ease: "power2.out", delay: 0.65,
      });
      gsap.from(".scroll-indicator", {
        y: 14, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.82,
      });

      /* ── Scroll reveals: GSAP ScrollTrigger ── */
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        let delay = 0;
        if (el.classList.contains("reveal-delay-1")) delay = 0.1;
        if (el.classList.contains("reveal-delay-2")) delay = 0.2;
        if (el.classList.contains("reveal-delay-3")) delay = 0.3;
        if (el.classList.contains("reveal-delay-4")) delay = 0.42;
        if (el.classList.contains("reveal-delay-5")) delay = 0.55;

        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "power3.out",
            delay,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      ScrollTrigger.refresh();
    };

    boot();

    return () => {
      dead = true;
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) =>
        ScrollTrigger.killAll()
      );
      lenis?.destroy();
    };
  }, []);

  return null;
}
