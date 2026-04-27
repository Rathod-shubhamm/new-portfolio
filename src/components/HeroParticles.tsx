"use client";

/**
 * HeroParticles — high-performance cursor trail particle system
 *
 * Features:
 *  - Object-pool (pre-allocated, zero GC pressure)
 *  - Velocity-based spawn density (fast = more particles)
 *  - Frame-delta-normalized physics (stays smooth at any FPS)
 *  - Organic jitter + Perlin-like directional drift
 *  - Theme-aware color via CSS --foreground variable
 *  - Pauses when tab is hidden (Visibility API)
 *  - Respects prefers-reduced-motion
 *  - Responsive density scaling based on viewport area
 */

import { useEffect, useRef } from "react";

// ─── Tuneable parameters ────────────────────────────────────────────────────

const CONFIG = {
  /** Hard cap on pool size — never exceeds this regardless of screen size */
  maxPoolSize: 1400,
  /** Base pool size for a 1440×820 viewport */
  basePoolSize: 900,
  /** Particles per pixel of cursor travel (base rate) */
  spawnDensity: 0.9,
  /** Extra particles proportional to speed (px/frame) */
  spawnSpeedCoeff: 0.032,
  /** Hard cap per spawn cycle */
  maxSpawnPerFrame: 40,
  /** Minimum cursor delta before spawning (avoids jitter-spamming) */
  minSpawnDelta: 0.8,
  /** Smallest particle radius (px) */
  minRadius: 0.35,
  /** Largest particle radius (px) */
  maxRadius: 2.1,
  /** Minimum particle lifetime (ms) */
  minLife: 480,
  /** Maximum particle lifetime (ms) */
  maxLife: 1050,
  /** Velocity drag per frame (1 = no drag, 0 = instant stop) */
  drag: 0.905,
  /** Per-frame random velocity nudge — organic feel */
  jitter: 0.09,
  /** Initial speed multiplier applied at spawn */
  spawnSpeedScale: 1.6,
  /** Lerp amount for smoothed pointer position (0 = no lag, 1 = no movement) */
  pointerEase: 0.16,
  /** Opacity at full life */
  maxAlpha: 0.58,
  /** Easing power for fade-out curve (1 = linear, 2 = quadratic) */
  fadePower: 1.55,
  /** Radius of the bloom glow around large particles */
  glowRadius: 3.5,
  /** How many ms of cursor stillness before spawning stops */
  idleTimeout: 130,
} as const;

// ─── Particle (pool node) ────────────────────────────────────────────────────

class Particle {
  active = false;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  radius = 1;
  initialRadius = 1;
  life = 0;       // remaining life in ms
  maxLife = 1;    // total life in ms
  rotation = 0;
  spin = 0;
  /** Secondary drift direction gives each particle a unique arc */
  driftAngle = 0;
  driftStrength = 0;

  /** Recycle a pool slot — called by ParticleSystem.spawn() */
  reset(
    x: number,
    y: number,
    vx: number,
    vy: number,
    radius: number,
    life: number
  ) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.initialRadius = radius;
    this.life = life;
    this.maxLife = life;
    this.rotation = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.07;
    this.driftAngle = Math.random() * Math.PI * 2;
    this.driftStrength = Math.random() * 0.04;
  }

  /**
   * Physics update — frame-delta normalised so behaviour is identical at
   * 30 FPS, 60 FPS or 144 FPS.
   * @param dt  Number of 16.67 ms ticks elapsed (1.0 = exactly 60 FPS)
   */
  update(dt: number) {
    if (!this.active) return;

    this.life -= dt * 16.67;
    if (this.life <= 0) {
      this.active = false;
      return;
    }

    // Organic jitter — perpendicular nudge creates natural-looking drift
    this.driftAngle += (Math.random() - 0.5) * 0.18 * dt;
    this.vx += Math.cos(this.driftAngle) * this.driftStrength * dt;
    this.vy += Math.sin(this.driftAngle) * this.driftStrength * dt;

    // Additional noise kick
    this.vx += (Math.random() - 0.5) * CONFIG.jitter * dt;
    this.vy += (Math.random() - 0.5) * CONFIG.jitter * dt;

    // Drag (frame-rate independent)
    const dragFactor = Math.pow(CONFIG.drag, dt);
    this.vx *= dragFactor;
    this.vy *= dragFactor;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.spin * dt;
  }

  /**
   * Draw the particle onto ctx.
   * We set fillStyle once per batch in ParticleSystem.draw() for perf.
   */
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;

    const progress = Math.max(0, this.life / this.maxLife);
    // Ease-out fade: full opacity early, sharp drop at end
    const alpha = Math.pow(progress, CONFIG.fadePower) * CONFIG.maxAlpha;
    // Particles shrink as they age — size follows a different curve for variety
    const radius = this.initialRadius * (0.15 + progress * 0.85);

    if (alpha < 0.004 || radius < 0.05) return;

    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── Particle system (manages pool) ─────────────────────────────────────────

class ParticleSystem {
  private pool: Particle[];
  private head = 0; // ring-buffer write head
  readonly poolSize: number;

  constructor(poolSize: number) {
    this.poolSize = poolSize;
    this.pool = Array.from({ length: poolSize }, () => new Particle());
  }

  /**
   * Spawn particles along the path from (x0,y0) → (x1,y1).
   * Count scales with distance and cursor speed.
   */
  spawnPath(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    speed: number
  ) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    if (dist < CONFIG.minSpawnDelta) return;

    const base = dist * CONFIG.spawnDensity;
    const extra = speed * CONFIG.spawnSpeedCoeff;
    const count = Math.min(
      Math.round(base + extra),
      CONFIG.maxSpawnPerFrame
    );

    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      this._spawnOne(lerp(x0, x1, t), lerp(y0, y1, t), speed);
    }
  }

  private _spawnOne(x: number, y: number, speed: number) {
    const slot = this.pool[this.head];
    this.head = (this.head + 1) % this.poolSize;

    const angle = Math.random() * Math.PI * 2;
    const speedFactor = Math.min(speed * 0.022, 1.6);
    const drift = (0.2 + Math.random() * 0.8 + speedFactor) * CONFIG.spawnSpeedScale;

    const radius =
      CONFIG.minRadius +
      Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
    const life =
      CONFIG.minLife +
      Math.random() * (CONFIG.maxLife - CONFIG.minLife);

    slot.reset(
      x + (Math.random() - 0.5) * 6,
      y + (Math.random() - 0.5) * 6,
      Math.cos(angle) * drift + (Math.random() - 0.5) * speedFactor,
      Math.sin(angle) * drift + (Math.random() - 0.5) * speedFactor,
      radius,
      life
    );
  }

  update(dt: number) {
    for (const p of this.pool) {
      if (p.active) p.update(dt);
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    for (const p of this.pool) {
      if (p.active) p.draw(ctx);
    }
    ctx.globalAlpha = 1;
  }
}

// ─── Utilities ───────────────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Read --foreground from computed styles and convert to rgb() for canvas */
function getForegroundColor(): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--foreground")
    .trim();
  // --foreground is a hex value like #f9f8f4 or #111111
  if (raw.startsWith("#")) {
    const r = parseInt(raw.slice(1, 3), 16);
    const g = parseInt(raw.slice(3, 5), 16);
    const b = parseInt(raw.slice(5, 7), 16);
    return `rgb(${r},${g},${b})`;
  }
  return raw || "rgb(17,17,17)";
}

// ─── React component ─────────────────────────────────────────────────────────

export type HeroParticlesProps = {
  className?: string;
};

export default function HeroParticles({ className = "" }: HeroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    // Bail early for reduced-motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // ── State ────────────────────────────────────────────────────────────────

    let W = 1, H = 1, dpr = 1;
    let raf = 0;
    let lastFrameAt = performance.now();
    let tabVisible = !document.hidden;

    // Smoothed pointer position (lerped)
    const ptr = { x: -9999, y: -9999 };
    // Raw target from mousemove
    const target = { x: -9999, y: -9999, prevX: -9999, prevY: -9999 };
    let ptrActive = false;
    let lastMoveAt = 0;

    // Particle color — refreshed on theme change
    let particleColor = getForegroundColor();

    let system: ParticleSystem | null = null;

    // ── Canvas sync ──────────────────────────────────────────────────────────

    const syncCanvas = () => {
      const rect = parent.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale pool to viewport — smaller screens get fewer particles
      const areaRatio = clamp((W * H) / (1440 * 820), 0.5, 1.3);
      const poolSize = Math.round(
        clamp(CONFIG.basePoolSize * areaRatio, 300, CONFIG.maxPoolSize)
      );
      system = new ParticleSystem(poolSize);
    };

    // ── Pointer tracking ─────────────────────────────────────────────────────

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only track if inside the hero canvas bounds
      if (x < 0 || x > W || y < 0 || y > H) {
        ptrActive = false;
        return;
      }

      target.prevX = target.x;
      target.prevY = target.y;
      target.x = x;
      target.y = y;
      lastMoveAt = performance.now();

      if (!ptrActive) {
        // Snap on first entry so we don't get a huge trail from -9999
        ptr.x = x;
        ptr.y = y;
      }
      ptrActive = true;
    };

    const onPointerLeave = () => {
      ptrActive = false;
    };

    // ── Visibility API — pause when tab is hidden ────────────────────────────

    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) {
        lastFrameAt = performance.now();
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    // ── Theme observer — refresh color when dark/light class toggled ─────────

    const themeObserver = new MutationObserver(() => {
      particleColor = getForegroundColor();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ── Animation loop ───────────────────────────────────────────────────────

    const loop = (now: number) => {
      if (!tabVisible) return;

      // Frame-delta normalised to 60 FPS (1.0 = exactly 60 FPS)
      const dt = clamp((now - lastFrameAt) / 16.67, 0.5, 3.5);
      lastFrameAt = now;

      ctx.clearRect(0, 0, W, H);

      if (system) {
        const idleMs = now - lastMoveAt;

        if (ptrActive && idleMs < CONFIG.idleTimeout) {
          const prevX = ptr.x;
          const prevY = ptr.y;

          // Lerp smoothed pointer towards raw target
          ptr.x = lerp(ptr.x, target.x, CONFIG.pointerEase);
          ptr.y = lerp(ptr.y, target.y, CONFIG.pointerEase);

          const speed = Math.hypot(
            target.x - target.prevX,
            target.y - target.prevY
          );

          system.spawnPath(prevX, prevY, ptr.x, ptr.y, speed);
        }

        system.update(dt);
        system.draw(ctx, particleColor);
      }

      raf = requestAnimationFrame(loop);
    };

    // ── Bootstrap ────────────────────────────────────────────────────────────

    const resizeObserver = new ResizeObserver(syncCanvas);
    resizeObserver.observe(parent);
    syncCanvas();

    // Track pointer on the window so the trail works even during fast sweeps
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    parent.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(loop);

    // ── Cleanup ───────────────────────────────────────────────────────────────

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      parent.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      system = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
