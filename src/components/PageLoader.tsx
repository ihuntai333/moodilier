"use client";

/**
 * PageLoader — dark overlay that fades out on mount.
 * Pure CSS animation, pointer-events: none → doesn't block LCP.
 * Safe to use in server component pages (client boundary isolated here).
 */
const CSS = `
.pg-loader {
  position: fixed; inset: 0; z-index: 9000;
  background: #0b0907;
  pointer-events: none;
  animation: pgFadeOut .8s cubic-bezier(.76, 0, .24, 1) .1s both;
}
@keyframes pgFadeOut { to { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .pg-loader { animation: none; opacity: 0; }
}
`;

export default function PageLoader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg-loader" aria-hidden="true" />
    </>
  );
}
