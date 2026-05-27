"use client";
import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    // Step 1: Mark body so CSS knows JS is running — this enables the hide state
    // Small delay so first paint is always fully visible
    const markTimer = setTimeout(() => {
      document.body.classList.add("js-loaded");
    }, 100);

    // Step 2: Set up IntersectionObserver to reveal elements
    const createObserver = () => {
      return new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
      );
    };

    let observer: IntersectionObserver;

    const observeAll = () => {
      if (observer) observer.disconnect();
      observer = createObserver();
      document.querySelectorAll(".reveal").forEach((el) => {
        observer.observe(el);
      });
    };

    // Run immediately, then again after React finishes hydrating
    observeAll();
    const t1 = setTimeout(observeAll, 200);
    const t2 = setTimeout(observeAll, 600);

    return () => {
      clearTimeout(markTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      if (observer) observer.disconnect();
      document.body.classList.remove("js-loaded");
    };
  }, []);

  return null;
}
