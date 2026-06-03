"use client";
import { useEffect } from "react";

/**
 * PageRevealAnimations — GSAP ScrollTrigger reveals for inner pages.
 * Add to any page to animate .reveal elements on scroll.
 * Also animates .page-hero-content children with staggered entry.
 */
export default function PageRevealAnimations() {
  useEffect(() => {
    // Scroll to top instantly on page mount (fixes prev/next project navigation)
    window.scrollTo({ top: 0, behavior: "instant" });

    let dead = false;
    const boot = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);

      /* Hero children stagger */
      const heroChildren = document.querySelectorAll<HTMLElement>(
        ".page-hero-content > *, .page-hero-inner > *"
      );
      if (heroChildren.length) {
        gsap.from(heroChildren, {
          y: 36, opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.2,
        });
      }

      /* Scroll reveals */
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        let delay = 0;
        if (el.classList.contains("reveal-delay-1")) delay = 0.1;
        if (el.classList.contains("reveal-delay-2")) delay = 0.2;
        if (el.classList.contains("reveal-delay-3")) delay = 0.32;
        if (el.classList.contains("reveal-delay-4")) delay = 0.45;
        if (el.classList.contains("reveal-delay-5")) delay = 0.58;
        el.style.animation = "none";
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0,
            duration: 1.1,
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

      /* Section images: subtle scale-in */
      document.querySelectorAll<HTMLElement>(".section img, .gallery-mosaic-item, .about-image-wrap").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.04, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 1.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
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
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.killAll());
    };
  }, []);
  return null;
}
