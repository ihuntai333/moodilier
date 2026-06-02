"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/* ══════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════ */
const STYLES = `
.fp5 {
  --gold: #c9a984; --gold2: #e8d5b7;
  --bg: #0a0806;
  --fg: #ede5da; --fg2: #7a6e62;
  --sans: 'Inter', sans-serif; --serif: 'Cormorant Garamond', serif;
  background: var(--bg); color: var(--fg);
  font-family: var(--sans); overflow-x: clip;
}
.fp5 * { box-sizing: border-box; margin: 0; padding: 0; }
.fp5 a { text-decoration: none; color: inherit; }

/* Canvas sits fixed behind everything */
.fp5-canvas {
  position: fixed; top: 0; left: 0;
  width: 100vw; height: 100vh;
  pointer-events: none; z-index: 0;
}

/* Sections overlay the canvas */
.fp5-section {
  position: relative; z-index: 1;
  height: 100vh; display: flex;
  align-items: center;
  padding: 0 8vw;
}
.fp5-section:nth-child(even) { justify-content: flex-end; }

/* Section content box */
.fp5-box { max-width: 520px; }
.fp5-tag {
  font-size: .58rem; letter-spacing: .45em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 1.4rem; display: block;
}
.fp5-h {
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(3rem, 7vw, 6.5rem);
  line-height: .88; letter-spacing: -.025em; margin-bottom: 1.5rem;
}
.fp5-h em { font-style: italic; color: var(--gold); }
.fp5-p {
  font-size: .85rem; line-height: 1.9; color: var(--fg2);
  margin-bottom: 2rem; max-width: 42ch;
}
.fp5-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
.fp5-btn-p {
  padding: .85rem 2rem; background: var(--gold); color: #0a0806;
  font-size: .6rem; letter-spacing: .22em; text-transform: uppercase;
  transition: background .3s;
}
.fp5-btn-p:hover { background: var(--gold2); }
.fp5-btn-o {
  padding: .85rem 2rem; border: 1px solid rgba(201,169,132,.3);
  color: var(--gold); font-size: .6rem; letter-spacing: .22em;
  text-transform: uppercase; transition: all .3s;
}
.fp5-btn-o:hover { background: var(--gold); color: #0a0806; }

/* Services list inside section */
.fp5-services {
  display: grid; grid-template-columns: 1fr 1fr; gap: .8rem 2rem;
  margin-bottom: 2rem;
}
.fp5-svc-item {
  font-size: .75rem; color: var(--fg2); line-height: 1.6;
  padding-left: 1rem; border-left: 1px solid rgba(201,169,132,.25);
}
.fp5-svc-item strong { color: var(--fg); display: block; margin-bottom: .1rem; font-weight: 400; }

/* Stats row */
.fp5-stats {
  display: flex; gap: 2.5rem; margin-bottom: 2rem; flex-wrap: wrap;
}
.fp5-stat__n {
  font-family: var(--serif); font-size: 2.5rem; font-weight: 300;
  color: var(--gold); line-height: 1;
}
.fp5-stat__l {
  font-size: .52rem; letter-spacing: .25em; text-transform: uppercase;
  color: var(--fg2); margin-top: .2rem;
}

/* Gold divider */
.fp5-divider {
  width: 50px; height: 1px; background: var(--gold);
  margin-bottom: 1.5rem;
}

/* Scroll indicator on section 1 */
.fp5-scroll {
  position: absolute; bottom: 3rem; left: 50%;
  transform: translateX(-50%); z-index: 2;
  display: flex; flex-direction: column; align-items: center; gap: .6rem;
}
.fp5-scroll span {
  font-size: .5rem; letter-spacing: .4em; text-transform: uppercase;
  color: var(--gold); opacity: .7;
}
.fp5-scroll-line {
  width: 1px; height: 44px; background: var(--gold);
  transform-origin: top;
  animation: fp5LineGrow 1s ease 1.6s both, fp5LinePulse 2s ease 2.6s infinite;
}
@keyframes fp5LineGrow  { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes fp5LinePulse { 0%,100% { opacity: 1; } 50% { opacity: .2; } }

/* Hero title entrance */
.fp5-hero-tag {
  opacity: 0; transform: translateY(10px);
  animation: fp5FUp .7s ease .3s both;
}
.fp5-hero-h {
  opacity: 0; transform: translateY(36px) scale(.97);
  animation: fp5FUp 1.1s cubic-bezier(.16,1,.3,1) .5s both;
}
.fp5-hero-p {
  opacity: 0; transform: translateY(20px);
  animation: fp5FUp .8s ease .9s both;
}
.fp5-hero-btns {
  opacity: 0; transform: translateY(18px);
  animation: fp5FUp .8s ease 1.1s both;
}
@keyframes fp5FUp {
  from { opacity: 0; transform: translateY(22px) scale(.97); }
  to   { opacity: 1; transform: none; }
}

/* Footer */
.fp5-footer {
  position: relative; z-index: 1;
  background: #050403; padding: 2rem 4rem;
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid rgba(201,169,132,.08);
}
.fp5-footer__logo { font-family: var(--serif); font-size: 1rem; font-weight: 300; letter-spacing: .2em; color: var(--fg2); }
.fp5-footer__copy { font-size: .52rem; color: rgba(237,229,218,.18); }
.fp5-footer__back { font-size: .52rem; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }

@media (max-width: 700px) {
  .fp5-section { padding: 0 6vw; }
  .fp5-services { grid-template-columns: 1fr; }
  .fp5-footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem; }
}
@media (prefers-reduced-motion: reduce) {
  .fp5-hero-tag, .fp5-hero-h, .fp5-hero-p, .fp5-hero-btns,
  .fp5-scroll-line { animation: none; opacity: 1; transform: none; }
}
`;

/* ══════════════════════════════════════════════════════════════
   THREE.JS SCENE
══════════════════════════════════════════════════════════════ */
function useThreeScene(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId = 0;
    let cleanupFn: (() => void) | null = null;

    /* Dynamically import Three.js (client-only) */
    import("three").then((THREE) => {
      /* ── Scene setup ── */
      const scene = new THREE.Scene();

      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      /* ── Gold material ── */
      const goldMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c9a984"),
        metalness: 0.85,
        roughness: 0.15,
        wireframe: false,
      });
      const wireMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#c9a984"),
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });

      /* ── Section meshes ── */
      const DIST = 4; // vertical distance between objects

      const mesh1 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.75, 0.28, 120, 18), goldMat);
      const mesh2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), goldMat);
      const mesh3 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.35, 20, 80), goldMat);

      const wire1 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.75, 0.28, 120, 18), wireMat);
      const wire2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), wireMat);
      const wire3 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.35, 20, 80), wireMat);

      // Position: alternate left/right
      [mesh1, wire1].forEach(m => { m.position.set(2.2, -DIST * 0, 0); });
      [mesh2, wire2].forEach(m => { m.position.set(-2.2, -DIST * 1, 0); });
      [mesh3, wire3].forEach(m => { m.position.set(2.2, -DIST * 2, 0); });

      const sectionMeshes = [mesh1, mesh2, mesh3];
      scene.add(mesh1, mesh2, mesh3, wire1, wire2, wire3);

      /* ── Particles ── */
      const PARTICLE_COUNT = 1400;
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 1] = DIST * 0.5 - Math.random() * DIST * 3.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: new THREE.Color("#c9a984"),
        size: 0.022,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
      });
      scene.add(new THREE.Points(particleGeo, particleMat));

      /* ── Lights ── */
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(new THREE.Color("#e8d5b7"), 2.5);
      dirLight.position.set(3, 3, 2);
      scene.add(dirLight);

      const fillLight = new THREE.DirectionalLight(new THREE.Color("#c9a984"), 0.8);
      fillLight.position.set(-3, -1, -2);
      scene.add(fillLight);

      /* ── Camera group (for parallax) ── */
      const cameraGroup = new THREE.Group();
      scene.add(cameraGroup);
      const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
      camera.position.z = 6;
      cameraGroup.add(camera);

      /* ── Renderer ── */
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      /* ── Scroll tracking ── */
      let scrollY = window.scrollY;
      let currentSection = 0;

      // GSAP-like section transition: rotate mesh when section changes
      const sectionRotations: { x: number; y: number }[] = [
        { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
      ];

      const onScroll = () => {
        scrollY = window.scrollY;
        const newSection = Math.round(scrollY / sizes.height);
        if (newSection !== currentSection) {
          currentSection = newSection;
          if (currentSection < 3) {
            // Trigger a rotation burst
            sectionRotations[currentSection].x += Math.PI * 0.4;
            sectionRotations[currentSection].y += Math.PI * 0.6;
          }
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      /* ── Mouse parallax ── */
      const cursor = { x: 0, y: 0 };
      const onMouseMove = (e: MouseEvent) => {
        cursor.x = e.clientX / sizes.width - 0.5;
        cursor.y = -(e.clientY / sizes.height - 0.5);
      };
      window.addEventListener("mousemove", onMouseMove);

      /* ── Resize ── */
      const onResize = () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };
      window.addEventListener("resize", onResize);

      /* ── Animation loop ── */
      const clock = new THREE.Clock();
      let prevTime = 0;

      const tick = () => {
        const elapsed = clock.getElapsedTime();
        const delta = elapsed - prevTime;
        prevTime = elapsed;

        // Camera follows scroll
        camera.position.y = (-scrollY / sizes.height) * DIST;

        // Mouse parallax (smooth lerp)
        const pX = cursor.x * 0.6;
        const pY = cursor.y * 0.6;
        cameraGroup.position.x += (pX - cameraGroup.position.x) * 3 * delta;
        cameraGroup.position.y += (pY - cameraGroup.position.y) * 3 * delta;

        // Rotate meshes
        sectionMeshes.forEach((mesh, i) => {
          mesh.rotation.x += delta * 0.08;
          mesh.rotation.y += delta * 0.1;

          // Smooth out the section burst rotation
          mesh.rotation.x += sectionRotations[i].x * delta * 4;
          mesh.rotation.y += sectionRotations[i].y * delta * 4;
          sectionRotations[i].x *= 0.88;
          sectionRotations[i].y *= 0.88;
        });

        // Particle drift
        particleMat.opacity = 0.35 + Math.sin(elapsed * 0.5) * 0.15;

        renderer.render(scene, camera);
        animFrameId = requestAnimationFrame(tick);
      };
      tick();

      /* ── Cleanup ── */
      cleanupFn = () => {
        cancelAnimationFrame(animFrameId);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        goldMat.dispose();
        wireMat.dispose();
        particleMat.dispose();
        particleGeo.dispose();
      };
    });

    return () => {
      cancelAnimationFrame(animFrameId);
      if (cleanupFn) cleanupFn();
    };
  }, [canvasRef]);
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function FrontPageV5() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useThreeScene(canvasRef);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="fp5">
        {/* Three.js canvas — fixed, behind all content */}
        <canvas ref={canvasRef} className="fp5-canvas" />

        {/* ═══ SECTION 1 — HERO ═══ */}
        <section className="fp5-section">
          <div className="fp5-box">
            <span className="fp5-tag fp5-hero-tag">✦ Mobilier premium la comandă · București</span>
            <h1 className="fp5-h fp5-hero-h">
              The Art of<br /><em>Custom</em><br />Furniture
            </h1>
            <div className="fp5-divider" />
            <p className="fp5-p fp5-hero-p">
              La Moodilier transformăm viziunile de design în piese de mobilier premium la comandă —
              create cu precizie, finisate cu pasiune, livrate la perfecțiune.
            </p>
            <div className="fp5-btns fp5-hero-btns">
              <Link href="/proiecte" className="fp5-btn-p">Descoperă proiectele →</Link>
              <Link href="/contact" className="fp5-btn-o">Solicită ofertă</Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="fp5-scroll">
            <span>Scroll</span>
            <div className="fp5-scroll-line" />
          </div>
        </section>

        {/* ═══ SECTION 2 — SERVICII + STATS ═══ */}
        <section className="fp5-section">
          <div className="fp5-box">
            <span className="fp5-tag">Ce oferim</span>
            <h2 className="fp5-h">
              Servicii<br /><em>complete</em>
            </h2>
            <div className="fp5-divider" />
            <div className="fp5-services">
              <div className="fp5-svc-item">
                <strong>Proiectare 3D</strong>
                Concept și vizualizare completă
              </div>
              <div className="fp5-svc-item">
                <strong>Mobilier la comandă</strong>
                Bucătării, dressinguri, dormitoare
              </div>
              <div className="fp5-svc-item">
                <strong>Spații comerciale</strong>
                Office, recepții, showroom-uri
              </div>
              <div className="fp5-svc-item">
                <strong>Moodilier Store</strong>
                Import premium Italia & Danemarca
              </div>
            </div>
            <div className="fp5-stats">
              <div>
                <div className="fp5-stat__n">10+</div>
                <div className="fp5-stat__l">Ani experiență</div>
              </div>
              <div>
                <div className="fp5-stat__n">200+</div>
                <div className="fp5-stat__l">Proiecte</div>
              </div>
              <div>
                <div className="fp5-stat__n">100%</div>
                <div className="fp5-stat__l">Execuție proprie</div>
              </div>
            </div>
            <div className="fp5-btns">
              <Link href="/servicii" className="fp5-btn-o">Toate serviciile →</Link>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 3 — CTA ═══ */}
        <section className="fp5-section">
          <div className="fp5-box">
            <span className="fp5-tag">Hai să construim împreună</span>
            <h2 className="fp5-h">
              Viziunea ta.<br /><em>Execuția</em><br />noastră.
            </h2>
            <div className="fp5-divider" />
            <p className="fp5-p">
              De la primul concept până la montajul final — suntem alături de tine
              la fiecare pas. Solicită o consultație gratuită astăzi.
            </p>
            <div className="fp5-btns">
              <Link href="/contact" className="fp5-btn-p">Solicită ofertă gratuită →</Link>
              <Link href="/proiecte" className="fp5-btn-o">Vezi portofoliul</Link>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="fp5-footer">
          <span className="fp5-footer__logo">MOODILIER</span>
          <span className="fp5-footer__copy">© 2025 SC Moodilier SRL · București</span>
          <Link href="/" className="fp5-footer__back">← Site principal</Link>
        </footer>
      </div>
    </>
  );
}
