"use client";
import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    // Trigger when element enters 80px from bottom of viewport
    // so the animation plays AS the element scrolls into view, not after.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    const observeAll = () => {
      document.querySelectorAll(".reveal:not(.revealed)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Only skip animation for elements fully visible on initial load
        // (top AND bottom both inside viewport)
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          el.classList.add("revealed", "no-anim");
        } else {
          observer.observe(el);
        }
      });
    };

    observeAll();
    const t1 = setTimeout(observeAll, 300);
    const t2 = setTimeout(observeAll, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
    };
  }, []);

  return null;
}
