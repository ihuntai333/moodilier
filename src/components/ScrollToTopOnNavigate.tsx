"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Force window to top on every App Router navigation.
 * html { scroll-behavior: smooth } otherwise leaves you mid-page
 * when coming from a scrolled frontpage link (e.g. → /proiecte).
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Next may restore scroll after paint — nudge again
    const t0 = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    const t1 = window.setTimeout(() => {
      window.scrollTo(0, 0);
      html.style.scrollBehavior = prev;
    }, 50);

    return () => {
      cancelAnimationFrame(t0);
      clearTimeout(t1);
      html.style.scrollBehavior = prev;
    };
  }, [pathname]);

  return null;
}
