"use client";

import { useEffect } from "react";
import { killSmoothScroll } from "@/lib/smooth-scroll";

/**
 * Homepage motion — GSAP ScrollTrigger reveals for sections + portfolio.
 * Tuned lighter on mobile / reduced-motion.
 */
export default function FrontpageAwardsClient() {
  useEffect(() => {
    const root = document.getElementById("aw-home");
    if (!root) return;

    killSmoothScroll();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isMobile = window.matchMedia("(max-width: 700px)").matches;

    if (reduce) {
      root.querySelectorAll(".aw-reveal, .aw-project-reveal, .aw-clip").forEach((el) => {
        el.classList.add("is-in");
      });
      return;
    }

    const awardsRoot = document.querySelector<HTMLElement>(".awards-root");
    awardsRoot?.classList.add("aw-anim", "aw-motion");

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    const yReveal = isMobile ? 14 : 22;
    const dur = isMobile ? 0.55 : 0.7;
    const staggerCard = isMobile ? 0.04 : 0.055;

    const splitLines = (el: HTMLElement) => {
      if (el.dataset.split === "1") return;
      const html = el.innerHTML;
      const parts = html.split(/<br\s*\/?>/i);
      el.innerHTML = parts
        .map(
          (part) =>
            `<span class="aw-line"><span class="aw-line-inner">${part.trim()}</span></span>`
        )
        .join("");
      el.dataset.split = "1";
    };

    const waitForIntro = () =>
      new Promise<void>((resolve) => {
        if (!document.querySelector(".aw-intro")) {
          resolve();
          return;
        }

        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          window.removeEventListener("aw-intro-done", finish);
          window.clearTimeout(timer);
          resolve();
        };
        window.addEventListener("aw-intro-done", finish);
        const timer = window.setTimeout(finish, 4000);
      });

    const boot = async () => {
      await waitForIntro();
      if (cancelled) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      root.querySelectorAll<HTMLElement>("[data-split-lines]").forEach(splitLines);

      const video = root.querySelector<HTMLVideoElement>(".aw-hero-video");
      video?.play().catch(() => {});

      ctx = gsap.context(() => {
        const heroLines = root.querySelectorAll(".aw-hero-copy .aw-line-inner");
        const heroBits = root.querySelectorAll(
          ".aw-hero-copy .aw-label, .aw-hero-copy .aw-body, .aw-hero-copy .aw-hero-ctas"
        );
        const heroMedia = root.querySelector(".aw-hero-slides");
        const heroInner = root.querySelector(".aw-hero-slide.is-on");
        const videoLed = Boolean(
          root.querySelector(".aw-hero-slide.is-on .aw-hero-video") ||
            root.querySelector(".aw-hero-video")
        );

        gsap.set(heroBits, { opacity: 0, y: videoLed ? 18 : 28 });
        gsap.set(heroLines, { yPercent: videoLed ? 100 : 110 });

        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (videoLed) {
          // Don't clip/scale video — keeps playback stable and avoids “chaotic photos”
          if (heroMedia) gsap.set(heroMedia, { clearProps: "clipPath" });
          if (heroInner) gsap.set(heroInner, { clearProps: "scale" });
          heroTl
            .to(heroLines, { yPercent: 0, duration: 0.7, stagger: 0.06 }, 0.05)
            .to(heroBits, { opacity: 1, y: 0, duration: 0.55, stagger: 0.05 }, 0.12);
        } else {
          if (heroMedia) gsap.set(heroMedia, { clipPath: "inset(100% 0 0 0)" });
          if (heroInner) gsap.set(heroInner, { scale: isMobile ? 1.06 : 1.1 });
          heroTl
            .to(heroMedia, { clipPath: "inset(0% 0 0 0)", duration: isMobile ? 0.65 : 0.75 }, 0.02)
            .to(heroInner, { scale: 1, duration: 0.85, ease: "power2.out" }, 0.02)
            .to(heroLines, { yPercent: 0, duration: 0.7, stagger: 0.06 }, 0.15)
            .to(heroBits, { opacity: 1, y: 0, duration: 0.55, stagger: 0.05 }, 0.22);
        }

        root.querySelectorAll(".aw-hero-copy .aw-reveal").forEach((el) => {
          el.classList.add("is-in");
        });

        if (heroInner && !isMobile && !videoLed) {
          gsap.to(heroInner, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: root.querySelector(".aw-hero"),
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        /* ── Generic section reveals (skip grid cards handled by batch) ── */
        root.querySelectorAll<HTMLElement>(".aw-reveal").forEach((el) => {
          if (el.closest(".aw-hero-copy")) return;
          if (
            el.matches(
              ".aw-benefit, .aw-service, .aw-step, .aw-supplier, .aw-project-reveal"
            )
          ) {
            return;
          }
          if (el.hasAttribute("data-split-lines")) {
            gsap.set(el, { opacity: 1, y: 0 });
            el.classList.add("is-in");
            return;
          }
          const delay = Number(el.dataset.delay ?? 0);
          gsap.fromTo(
            el,
            { opacity: 0, y: yReveal },
            {
              opacity: 1,
              y: 0,
              duration: dur,
              delay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                toggleActions: "play none none none",
                once: true,
              },
              onStart: () => el.classList.add("is-in"),
            }
          );
        });

        /* ── Portfolio cards — staggered clip + rise ── */
        const projects = root.querySelectorAll<HTMLElement>(".aw-project-reveal");
        if (projects.length) {
          gsap.set(projects, {
            opacity: 0,
            y: isMobile ? 18 : 28,
            clipPath: "inset(8% 0% 0% 0%)",
          });
          gsap.set(
            Array.from(projects).map((p) => p.querySelector(".aw-project-meta")),
            { opacity: 0, y: 10 }
          );

          ScrollTrigger.batch(projects, {
            start: "top 94%",
            once: true,
            onEnter: (batch) => {
              const cards = batch as HTMLElement[];
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: isMobile ? 0.55 : 0.7,
                stagger: staggerCard,
                ease: "power3.out",
                overwrite: "auto",
                onStart: function () {
                  cards.forEach((c) => c.classList.add("is-in"));
                },
              });
              const metas = cards
                .map((c) => c.querySelector(".aw-project-meta"))
                .filter(Boolean);
              gsap.to(metas, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: staggerCard,
                delay: 0.18,
                ease: "power2.out",
              });
              const imgs = cards
                .map((c) => c.querySelector(".aw-project-img, .aw-project-media img"))
                .filter(Boolean);
              gsap.fromTo(
                imgs,
                { scale: 1.12 },
                {
                  scale: 1,
                  duration: isMobile ? 1 : 1.35,
                  stagger: staggerCard,
                  ease: "power3.out",
                }
              );
            },
          });
        }

        /* ── Benefits / services / steps — batch cascade ── */
        (
          [
            [".aw-benefits-grid .aw-benefit", 0.08],
            [".aw-services-grid .aw-service", 0.09],
            [".aw-steps .aw-step", 0.06],
            [".aw-suppliers-grid .aw-supplier", 0.04],
          ] as const
        ).forEach(([sel, st]) => {
          const items = root.querySelectorAll<HTMLElement>(sel);
          if (!items.length) return;
          // already have aw-reveal; enrich with slight scale if not yet animated strongly
          ScrollTrigger.batch(items, {
            start: "top 93%",
            once: true,
            onEnter: (batch) => {
              gsap.fromTo(
                batch,
                { opacity: 0, y: yReveal * 0.85 },
                {
                  opacity: 1,
                  y: 0,
                  duration: dur,
                  stagger: isMobile ? st * 0.75 : st,
                  ease: "power3.out",
                  overwrite: "auto",
                  onStart: () => {
                    (batch as HTMLElement[]).forEach((el) => el.classList.add("is-in"));
                  },
                }
              );
            },
          });
        });

        root.querySelectorAll<HTMLElement>(".aw-clip").forEach((el) => {
          if (el.closest(".aw-hero")) return;
          const media = el.querySelector(".aw-clip-media") || el;
          gsap.fromTo(
            media,
            { clipPath: "inset(100% 0 0 0)", scale: 1.08 },
            {
              clipPath: "inset(0% 0 0 0)",
              scale: 1,
              duration: isMobile ? 0.95 : 1.15,
              ease: "power4.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
                once: true,
              },
              onStart: () => el.classList.add("is-in"),
            }
          );
        });

        root.querySelectorAll<HTMLElement>("[data-split-lines]:not(.aw-h1)").forEach((el) => {
          const inners = el.querySelectorAll(".aw-line-inner");
          if (!inners.length) return;
          gsap.set(inners, { yPercent: 110 });
          gsap.to(inners, {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.07,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          });
        });

        /* CTA background photos */
        const ctaShots = root.querySelectorAll<HTMLElement>(".aw-cta-bg-shot");
        if (ctaShots.length) {
          gsap.fromTo(
            ctaShots,
            { opacity: 0, y: 24, scale: 1.04 },
            {
              opacity: isMobile ? 0.14 : 0.22,
              y: 0,
              scale: 1,
              duration: 1.1,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: root.querySelector(".aw-cta"),
                start: "top 85%",
                once: true,
              },
            }
          );
        }

        if (finePointer) {
          root.querySelectorAll<HTMLElement>(".aw-collection-card").forEach((card) => {
            const media = card.querySelector<HTMLElement>(".aw-collection-media");
            const onMove = (e: MouseEvent) => {
              const r = card.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5;
              const py = (e.clientY - r.top) / r.height - 0.5;
              gsap.to(card, {
                rotateY: px * 6,
                rotateX: -py * 6,
                transformPerspective: 800,
                duration: 0.4,
                ease: "power2.out",
              });
              if (media) {
                gsap.to(media, { x: px * 10, y: py * 10, duration: 0.4, ease: "power2.out" });
              }
            };
            const onLeave = () => {
              gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
              if (media) gsap.to(media, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
            };
            card.addEventListener("mousemove", onMove);
            card.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
              card.removeEventListener("mousemove", onMove);
              card.removeEventListener("mouseleave", onLeave);
            });
          });
        }

        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const raw = el.dataset.count || "0";
          const suffix = el.dataset.suffix || "";
          const prefix = el.dataset.prefix || "";
          const target = parseFloat(raw.replace(/[^\d.]/g, "")) || 0;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
            onUpdate: () => {
              const v = raw.includes(".") ? obj.val.toFixed(0) : Math.round(obj.val);
              el.textContent = `${prefix}${v}${suffix}`;
            },
          });
        });

        const processLine = root.querySelector<HTMLElement>(".aw-process-line");
        if (processLine && !isMobile) {
          gsap.fromTo(
            processLine,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: root.querySelector(".aw-steps"),
                start: "top 75%",
                end: "bottom 40%",
                scrub: true,
              },
            }
          );
        }

        const marquee = root.querySelector<HTMLElement>(".aw-marquee-track");
        if (marquee) {
          ScrollTrigger.create({
            onUpdate: (self) => {
              marquee.classList.toggle("is-reverse", self.direction === -1);
            },
          });
        }

        // Soft hover lift on project cards (desktop)
        if (finePointer) {
          projects.forEach((card) => {
            const media = card.querySelector<HTMLElement>(".aw-project-media");
            const onEnter = () => {
              gsap.to(card, { y: -4, duration: 0.45, ease: "power2.out" });
              if (media) {
                gsap.to(media.querySelector("img"), {
                  scale: 1.05,
                  duration: 0.9,
                  ease: "power2.out",
                });
              }
            };
            const onLeave = () => {
              gsap.to(card, { y: 0, duration: 0.55, ease: "power3.out" });
              if (media) {
                gsap.to(media.querySelector("img"), {
                  scale: 1,
                  duration: 0.9,
                  ease: "power3.out",
                });
              }
            };
            card.addEventListener("mouseenter", onEnter);
            card.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
              card.removeEventListener("mouseenter", onEnter);
              card.removeEventListener("mouseleave", onLeave);
            });
          });
        }

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, root);
    };

    boot();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      ctx?.revert();
      killSmoothScroll();
      awardsRoot?.classList.remove(
        "aw-anim",
        "aw-motion",
        "aw-cursor-on",
        "aw-cursor-grow",
        "aw-cursor-view"
      );
    };
  }, []);

  return null;
}
