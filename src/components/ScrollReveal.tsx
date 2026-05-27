"use client";
import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    // ─── Force-reveal elements already in viewport ─────────────────────────────
    // This runs synchronously BEFORE js-loaded is added, so there's no flash.
    const forceRevealVisible = () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Element is (at least partially) in viewport
        if (rect.top < window.innerHeight + 50 && rect.bottom > -50) {
          el.classList.add("revealed");
        }
      });
    };

    // ─── IntersectionObserver for scroll-triggered reveals ─────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // stop watching once revealed
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -30px 0px" }
    );

    const observeAll = () => {
      document.querySelectorAll(".reveal:not(.revealed)").forEach((el) => {
        observer.observe(el);
      });
    };

    // ─── Execution order ────────────────────────────────────────────────────────
    // 1. Force-reveal what's already in viewport (synchronous)
    forceRevealVisible();

    // 2. Observe remaining elements for scroll
    observeAll();

    // 3. Add js-loaded AFTER reveals are applied → no flash
    const markTimer = setTimeout(() => {
      document.body.classList.add("js-loaded");
    }, 50);

    // 4. Re-observe after React hydration finishes (for dynamic lists)
    const t1 = setTimeout(() => {
      forceRevealVisible();
      observeAll();
    }, 400);

    const t2 = setTimeout(() => {
      forceRevealVisible();
      observeAll();
    }, 900);

    return () => {
      clearTimeout(markTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
      document.body.classList.remove("js-loaded");
    };
  }, []);

  return null;
}
