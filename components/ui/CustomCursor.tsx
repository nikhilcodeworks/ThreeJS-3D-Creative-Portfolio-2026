"use client";
import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Custom cursor: blue/cyan dot + ring, plus a Canvas 2D liquid wave trail.
// The trail (neon ribbons, comet streak, glowing particles) follows the mouse
// with a smooth delay, reacts to speed/direction, and fades when idle.
// ─────────────────────────────────────────────────────────────────────────────

type Point = { x: number; y: number; t: number };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
};

// Palette (electric blue / cyan, with a violet tail to echo the Energy Orb).
const CYAN: [number, number, number] = [34, 211, 238]; // #22D3EE
const BLUE: [number, number, number] = [59, 130, 246]; // #3B82F6
const DEEP: [number, number, number] = [37, 99, 235]; // #2563EB
const VIOLET: [number, number, number] = [139, 92, 246]; // #8B5CF6
const ICE: [number, number, number] = [224, 242, 254]; // #E0F2FE

const TRAIL_MAX_AGE = 430; // ms a trail point lives → natural fade when idle
const MAX_PARTICLES = 44;

// Three flowing ribbons with different wave character.
const RIBBONS = [
  { head: CYAN, tail: BLUE, width: 2.3, amp: 7, freq: 0.5, speed: 0.006, phase: 0.0, alpha: 0.95 },
  { head: BLUE, tail: VIOLET, width: 1.5, amp: 11, freq: 0.38, speed: 0.0085, phase: 2.1, alpha: 0.7 },
  { head: CYAN, tail: DEEP, width: 1.0, amp: 5, freq: 0.72, speed: 0.005, phase: 4.2, alpha: 0.55 },
];

const rgba = (c: [number, number, number], a: number) =>
  `rgba(${c[0]},${c[1]},${c[2]},${a})`;

const lerpRGB = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip entirely on touch devices (no hover cursor there).
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let mouseX = window.innerWidth / 2,
      mouseY = window.innerHeight / 2;
    let ringX = mouseX,
      ringY = mouseY;
    let headX = mouseX,
      headY = mouseY;
    let prevHeadX = mouseX,
      prevHeadY = mouseY;
    let speed = 0;
    let raf = 0;
    let lastTime = 0;
    let W = window.innerWidth;
    let H = window.innerHeight;

    const trail: Point[] = [];
    const particles: Particle[] = [];

    // ── Canvas sizing (DPR-aware, capped for performance) ──
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows instantly; label sits below the pointer.
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      label.style.transform = `translate(${mouseX}px, ${mouseY + 70}px)`;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // ── Smooth stroked path through midpoints ──
    const strokeSmooth = (path: { x: number; y: number }[]) => {
      ctx!.beginPath();
      ctx!.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length - 1; i++) {
        const xc = (path[i].x + path[i + 1].x) / 2;
        const yc = (path[i].y + path[i + 1].y) / 2;
        ctx!.quadraticCurveTo(path[i].x, path[i].y, xc, yc);
      }
      const lastP = path[path.length - 1];
      ctx!.lineTo(lastP.x, lastP.y);
      ctx!.stroke();
    };

    const drawRibbon = (
      path: { x: number; y: number; a: number }[],
      ribbon: (typeof RIBBONS)[number]
    ) => {
      if (path.length < 2) return;
      const c = ctx!;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.globalCompositeOperation = "lighter";

      // Glow pass — one wide, low-alpha stroke over the whole ribbon.
      c.globalAlpha = 1;
      c.strokeStyle = rgba(ribbon.head, 0.1);
      c.lineWidth = ribbon.width * 3.2;
      strokeSmooth(path);

      // Core pass — per-segment taper + colour shift (head → tail).
      for (let i = 0; i < path.length - 1; i++) {
        const p0 = path[i];
        const p1 = path[i + 1];
        const a = Math.min(p0.a, p1.a);
        const col = lerpRGB(ribbon.tail, ribbon.head, a);
        c.globalAlpha = a * ribbon.alpha;
        c.strokeStyle = rgba(col, 1);
        c.lineWidth = Math.max(0.4, ribbon.width * (0.3 + 0.7 * a));
        c.beginPath();
        c.moveTo(p0.x, p0.y);
        c.lineTo(p1.x, p1.y);
        c.stroke();
      }
      c.globalAlpha = 1;
      c.globalCompositeOperation = "source-over";
    };

    const drawTrail = (now: number) => {
      // Collect live points with freshness (1 = newest).
      const pts: { x: number; y: number; a: number }[] = [];
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        const age = (now - p.t) / TRAIL_MAX_AGE;
        if (age >= 1) continue;
        pts.push({ x: p.x, y: p.y, a: 1 - age });
      }
      if (pts.length < 2) return;

      for (let r = 0; r < RIBBONS.length; r++) {
        const ribbon = RIBBONS[r];
        const path: { x: number; y: number; a: number }[] = [];
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const prev = pts[Math.max(0, i - 1)];
          const next = pts[Math.min(pts.length - 1, i + 1)];
          const tx = next.x - prev.x;
          const ty = next.y - prev.y;
          const len = Math.hypot(tx, ty) || 1;
          const nx = -ty / len;
          const ny = tx / len;
          const wave =
            Math.sin(i * ribbon.freq - now * ribbon.speed + ribbon.phase) *
            ribbon.amp *
            (0.3 + p.a);
          path.push({ x: p.x + nx * wave, y: p.y + ny * wave, a: p.a });
        }
        drawRibbon(path, ribbon);
      }
    };

    const drawComet = () => {
      if (!ctx || trail.length === 0) return;
      const head = trail[trail.length - 1];
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 16);
      g.addColorStop(0, rgba(ICE, 0.85));
      g.addColorStop(0.35, rgba(CYAN, 0.35));
      g.addColorStop(1, rgba(CYAN, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    };

    const spawnParticles = (dt: number) => {
      if (speed < 0.6) return;
      const chance = Math.min(0.9, speed / 26) * dt * 60;
      while (Math.random() < chance && particles.length < MAX_PARTICLES) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 0.6 + 0.2;
        particles.push({
          x: headX,
          y: headY,
          vx: Math.cos(ang) * spd - (headX - prevHeadX) * 0.05,
          vy: Math.sin(ang) * spd - (headY - prevHeadY) * 0.05,
          life: 0,
          maxLife: 420 + Math.random() * 380,
          size: Math.random() * 1.6 + 0.8,
        });
      }
    };

    const drawParticles = (dt: number) => {
      if (!ctx) return;
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt * 1000;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        const a = 1 - p.life / p.maxLife;
        const col = lerpRGB(VIOLET, CYAN, a);
        // Soft glow halo.
        ctx.fillStyle = rgba(col, 0.18 * a);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
        // Bright core.
        ctx.fillStyle = rgba(col, 0.9 * a);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);

      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
      lastTime = now;

      // Ring eases toward the pointer (unchanged behaviour).
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

      if (reduceMotion || !ctx) return;

      // Head follows with a slightly softer ease → trailing ribbon delay.
      const prevX = headX;
      const prevY = headY;
      headX = lerp(headX, mouseX, 0.28);
      headY = lerp(headY, mouseY, 0.28);
      const inst = Math.hypot(headX - prevX, headY - prevY);
      speed = lerp(speed, inst, 0.2);

      // Record a point only when the head actually moved (idle → fades out).
      const lastPt = trail[trail.length - 1];
      if (!lastPt || Math.hypot(headX - lastPt.x, headY - lastPt.y) > 1) {
        trail.push({ x: headX, y: headY, t: now });
      }
      // Drop expired points.
      while (trail.length && now - trail[0].t > TRAIL_MAX_AGE) trail.shift();

      ctx.clearRect(0, 0, W, H);
      drawTrail(now);
      drawComet();
      spawnParticles(dt);
      drawParticles(dt);

      prevHeadX = headX;
      prevHeadY = headY;
    };

    animate(0);
    window.addEventListener("mousemove", onMouseMove);

    // ── Hover state handlers (recoloured to blue) ──
    const handleEnterLink = () => {
      dot.classList.add("cursor-blue");
      ring.classList.add("cursor-hover");
      label.textContent = "OPEN";
      label.classList.add("visible");
    };
    const handleLeaveLink = () => {
      dot.classList.remove("cursor-blue");
      ring.classList.remove("cursor-hover");
      label.classList.remove("visible");
    };
    const handleEnterProject = () => {
      dot.classList.add("cursor-blue");
      ring.classList.add("cursor-project");
      label.textContent = "VIEW →";
      label.classList.add("visible");
    };
    const handleLeaveProject = () => {
      dot.classList.remove("cursor-blue");
      ring.classList.remove("cursor-project");
      label.classList.remove("visible");
    };
    const handleEnterText = () => {
      dot.classList.add("cursor-blue");
      ring.classList.add("cursor-blue");
    };
    const handleLeaveText = () => {
      dot.classList.remove("cursor-blue");
      ring.classList.remove("cursor-blue");
    };

    const addListeners = () => {
      document
        .querySelectorAll("a, button, .magnetic-btn")
        .forEach((el) => {
          el.addEventListener("mouseenter", handleEnterLink);
          el.addEventListener("mouseleave", handleLeaveLink);
        });

      document.querySelectorAll(".project-row").forEach((el) => {
        el.addEventListener("mouseenter", handleEnterProject);
        el.addEventListener("mouseleave", handleLeaveProject);
      });

      document
        .querySelectorAll("p, h1, h2, h3, h4, h5, h6, .line-wrap, .skill-item, .contact-link, .timeline-item, .section-desc, .project-tag")
        .forEach((el) => {
          el.addEventListener("mouseenter", handleEnterText);
          el.addEventListener("mouseleave", handleLeaveText);
        });
    };

    // Add after a short delay to catch dynamic elements.
    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  );
}
