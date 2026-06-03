"use client";

/**
 * PageLoader — dark overlay that fades out slowly on mount.
 * Stays opaque long enough for the hero blur animation to start underneath.
 * Pure CSS — pointer-events: none → doesn't block LCP.
 */
const CSS = `
.pg-loader {
  position: fixed; inset: 0; z-index: 9000;
  background: #0b0907;
  pointer-events: none;
  animation: pgFadeOut 1.1s cubic-bezier(.6, 0, .3, 1) .3s both;
}
@keyframes pgFadeOut {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}
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
