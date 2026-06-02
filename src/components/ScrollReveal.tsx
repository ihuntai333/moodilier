"use client";
import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    // Trigger early (when element is barely visible) so the 0.15s base delay
    // + animation play while element is actively scrolling into view.
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
        threshold: 0.05,           // fire when 5% visible
        rootMargin: "0px 0px -30px 0px", // 30px into viewport
      }
    );

    const observeAll = () => {
      document.querySelectorAll(".reveal:not(.revealed)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Only skip animation for elements fully inside viewport on load
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
