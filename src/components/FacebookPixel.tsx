"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

interface Props {
  pixelId: string;
}

export default function FacebookPixel({ pixelId }: Props) {
  const pathname = usePathname();

  // Track PageView on every route change
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}
