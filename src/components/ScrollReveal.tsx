"use client";
import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    // Strategy: elements are ALWAYS visible by default.
    // We only ADD an animation class when they enter the viewport.
    // This means no element can ever be "stuck invisible".

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class — element plays the reveal animation
            entry.target.classList.add("revealed");
            // Stop observing once revealed
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -20px 0px" }
    );

    const observeAll = () => {
      document.querySelectorAll(".reveal:not(.revealed)").forEach((el) => {
        // If already in viewport on load, reveal immediately without animation
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add("revealed", "no-anim");
        } else {
          observer.observe(el);
        }
      });
    };

    observeAll();

    // Re-check after hydration completes (for client-rendered content)
    const t1 = setTimeout(observeAll, 300);
    const t2 = setTimeout(observeAll, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
    };
  }, []);

  return null;
}
