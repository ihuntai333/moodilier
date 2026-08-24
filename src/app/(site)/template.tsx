import type { ReactNode } from "react";

/** Pass-through — avoid remount animations that stack and feel chaotic on fast clicks. */
export default function SitePageTransition({ children }: { children: ReactNode }) {
  return children;
}
