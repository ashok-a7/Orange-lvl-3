'use client';

/**
 * AnimatedBackground — the ambient motion layer mounted once in the root layout
 *
 * Composed of four cheap, independently-toggleable layers:
 *  1. A static gradient-mesh wash (pure CSS, no repaint cost)
 *  2. Three large blurred orbs that drift on a slow CSS keyframe loop
 *  3. A sparse canvas particle field ("lumens") drifting upward
 *  4. A cursor-following glow (desktop / fine-pointer only)
 *
 * Everything here is `position: fixed`, `pointer-events: none`, and sits behind
 * page content (z-index: 0). Respects `prefers-reduced-motion` and pauses all
 * rAF work when the tab is hidden.
 */

import { useEffect, useRef } from 'react';

const PARTICLE_COUNT_DESKTOP = 42;
const PARTICLE_COUNT_MOBILE = 18;

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  hue: 'violet' | 'gold' | 'cyan';
  alpha: number;
}

const HUE_COLOR: Record<Particle['hue'], string> = {
  violet: '124,92,252',
  gold: '232,166,61',
  cyan: '63,224,197',
};

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // ── Particle field ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let particles: Particle[] = [];
    let rafId = 0;
    let visible = !document.hidden;

    function makeParticles() {
      const count = window.innerWidth < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
      const hues: Particle['hue'][] = ['violet', 'gold', 'cyan'];
      particles = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.6,
        speed: 0.06 + Math.random() * 0.16,
        drift: (Math.random() - 0.5) * 0.12,
        phase: Math.random() * Math.PI * 2,
        hue: hues[Math.floor(Math.random() * hues.length)],
        alpha: 0.25 + Math.random() * 0.35,
      }));
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
    }

    function tick() {
      if (!visible) return;
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(p.phase + p.y * 0.01) * p.drift;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${HUE_COLOR[p.hue]},${p.alpha})`;
        ctx!.shadowBlur = 6;
        ctx!.shadowColor = `rgba(${HUE_COLOR[p.hue]},${p.alpha * 0.8})`;
        ctx!.fill();
      }
      rafId = requestAnimationFrame(tick);
    }

    function handleVisibility() {
      visible = !document.hidden;
      if (visible && !reduceMotion) {
        rafId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(rafId);
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    if (!reduceMotion) {
      rafId = requestAnimationFrame(tick);
    } else {
      // Draw a single static frame so the field still reads as "there".
      tick();
      visible = false;
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // ── Cursor glow (fine-pointer devices only) ─────────────────────────────
  useEffect(() => {
    const glow = cursorGlowRef.current;
    if (!glow) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.3;
    let curX = targetX;
    let curY = targetY;
    let rafId = 0;

    function onMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function loop() {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      if (glow) {
        glow.style.transform = `translate3d(${curX - 260}px, ${curY - 260}px, 0)`;
      }
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Scroll parallax (very subtle, orbs drift opposite to scroll) ───────
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY * 0.04;
        if (el) el.style.transform = `translate3d(0, ${y}px, 0)`;
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Base gradient mesh wash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 900px 600px at 12% -10%, rgba(124,92,252,0.16), transparent 60%),
            radial-gradient(ellipse 800px 700px at 92% 8%, rgba(63,224,197,0.10), transparent 60%),
            radial-gradient(ellipse 900px 800px at 50% 100%, rgba(232,166,61,0.08), transparent 65%),
            #06060F
          `,
        }}
      />

      {/* Drifting orbs + parallax wrapper */}
      <div ref={parallaxRef} style={{ position: 'absolute', inset: 0 }}>
        <div
          className="bg-orb orb-a"
          style={{
            width: 560,
            height: 560,
            top: '-12%',
            left: '-8%',
            background: 'radial-gradient(circle, rgba(124,92,252,0.32), transparent 70%)',
          }}
        />
        <div
          className="bg-orb orb-b"
          style={{
            width: 480,
            height: 480,
            top: '30%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(63,224,197,0.22), transparent 70%)',
          }}
        />
        <div
          className="bg-orb orb-c"
          style={{
            width: 620,
            height: 620,
            bottom: '-16%',
            left: '28%',
            background: 'radial-gradient(circle, rgba(232,166,61,0.18), transparent 70%)',
          }}
        />
      </div>

      {/* Particle field */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.55 }} />

      {/* Cursor-reactive glow */}
      <div
        ref={cursorGlowRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,92,252,0.10), transparent 72%)',
          willChange: 'transform',
        }}
      />

      {/* Faint top vignette so content near the nav stays legible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(6,6,15,0.4) 0%, transparent 18%)',
        }}
      />
    </div>
  );
}
