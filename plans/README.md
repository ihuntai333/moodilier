# Motion plans — Moodilier

Commit at audit: `2452ddc`  
Status: **executed in-repo** (user asked „fa tot” — plans + implementation together).

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 1 | Drop frame: drop `inset` transition → `transform: scale` | HIGH | DONE |
| 2 | Remove animated `gap` on collection/CTA | HIGH | DONE |
| 3 | Cap hover image zooms to 180–220ms | HIGH | DONE |
| 4 | Gate transform hovers with `(hover: hover) and (pointer: fine)` | HIGH | DONE |
| 5 | Cookie notice reduced-motion branch | MEDIUM | DONE |
| 6 | Intro skips on `prefers-reduced-motion` | MEDIUM | DONE |
| 7 | Project CTA inside fine-pointer media query | MEDIUM | DONE |
| 8 | Compress project hover stack to ~200–280ms | MEDIUM | DONE |
| 9 | Button fill ≤250ms, underline ≤200ms | MEDIUM | DONE |
| 10 | Mobile nav CSS transition (open/close interruptible) | MEDIUM | DONE |
| 11 | Prefer `--aw-ease*` tokens over parallel beziers | MEDIUM | DONE |
| 12 | Soften benefit icon (no rotate/playful scale) | LOW | DONE |
| A | Lightbox click/swipe opacity crossfade; keyboard instant | — | DONE |
| B | Intro exit opacity fade (~280ms) | — | DONE |
| C | Cookie prefs `0fr→1fr` expand | — | DONE |
| D | Mobile nav close paired with open transition | — | DONE |

## Feel-check

1. Homepage project cards: hover feels snappy (~240ms), no layout jank on frame.
2. Touch device: no sticky zoom/lift after tap.
3. OS reduced-motion: intro skipped; cookie fades without Y travel.
4. Mobile menu: open/close retargets mid-flight.
5. Lightbox: click next fades; arrow keys snap.
