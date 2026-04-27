"use client";

/**
 * SandParticleText — three-force fluid displacement particle text
 *
 * The cursor applies THREE simultaneous forces inside its influence radius:
 *
 *   A. Weak radial push      — keeps particles from stacking at cursor centre
 *   B. Strong directional    — particles dragged along cursor travel direction
 *   C. Perpendicular swirl   — 90° to cursor direction, creates fluid vortex
 *
 * Together they produce smear-streaks that flow with the cursor and smoothly
 * reform into the original text — not a radial explosion.
 *
 * Physics (per frame):
 *   forces → vx/vy  →  damping  →  spring return  →  clamp  →  integrate
 */

import { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";

// ─── Tuneable constants ────────────────────────────────────────────────────────
//  Adjust these to change feel without touching any logic.

const CFG = {
  // ── Sampling ──────────────────────────────────────────────────────────────
  stepNormal: 3,           // pixel stride when sampling text mask (normal)
  stepCompact: 4,          // pixel stride (compact)
  maxParticles: 15000,     // hard cap (uniform-stride thinned if exceeded)

  // ── Cursor influence ──────────────────────────────────────────────────────
  radius: 80,              // px — total influence zone
  /** Cursor velocity smoothing (lerp per frame). Lower = heavier/smoother. */
  velocitySmoothing: 0.22,

  // ── Force magnitudes ──────────────────────────────────────────────────────
  /** A — Weak radial outward push (clears the cursor zone) */
  radialStrength: 1.0,
  /** B — Directional: particles dragged along cursor velocity */
  directionalStrength: 3.5,
  /** C — Perpendicular swirl: vortex / liquid streak */
  swirlStrength: 1.8,
  /** How much cursor speed amplifies all forces (multiplicative) */
  speedAmplitude: 0.10,
  /** Minimum cursor speed (px/frame) before directional forces kick in */
  minSpeed: 0.8,

  // ── Physics ───────────────────────────────────────────────────────────────
  damping: 0.92,           // slightly more coasting for smoother return
  stiffness: 0.015,        // soft spring — letters hold shape, particles drift back gently
  /** Max particle speed (px/frame) — prevents chaotic explosion */
  maxSpeed: 10,
  /** Tiny per-frame noise keeping at-rest particles from looking frozen */
  noiseAmp: 0.04,

  // ── Rendering ─────────────────────────────────────────────────────────────
  dotRadiusNormal: 1.05,
  dotRadiusCompact: 0.82,
  /** Dot radius grows by this factor per px of displacement */
  dispSizeGain: 0.015,
  maxSizeBoost: 1.8,        // cap: never grow larger than base × this
  baseAlpha: 0.90,
  dispAlphaGain: 0.006,
} as const;

// ─── Smooth falloff ────────────────────────────────────────────────────────────
// f(t) = (1-t)²(1+2t)   — cubic Hermite, smooth S-curve from 1→0

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

// ─── Particle ──────────────────────────────────────────────────────────────────

class FluidParticle {
  x: number;   // current position
  y: number;
  ox: number;  // origin (text pixel)
  oy: number;
  vx = 0;      // velocity
  vy = 0;
  /** Unique noise phase prevents synchronised jitter across the field */
  readonly nPhase: number;

  constructor(x: number, y: number) {
    this.x = x; this.ox = x;
    this.y = y; this.oy = y;
    this.nPhase = Math.random() * Math.PI * 2;
  }

  /**
   * Apply three-component force field from cursor.
   *
   * @param cx   cursor X (canvas-space)
   * @param cy   cursor Y (canvas-space)
   * @param cvx  smoothed cursor velocity X (px/frame)
   * @param cvy  smoothed cursor velocity Y (px/frame)
   */
  applyForces(cx: number, cy: number, cvx: number, cvy: number) {
    // Vector from cursor to this particle
    const dx = this.x - cx;
    const dy = this.y - cy;
    const distSq = dx * dx + dy * dy;
    if (distSq >= CFG.radius * CFG.radius) return;

    const dist = Math.sqrt(distSq) || 0.001;
    const ndx = dx / dist;                  // radial unit vector (outward)
    const ndy = dy / dist;

    // Falloff: 1 at centre, 0 at edge — smooth cubic curve
    const falloff = smoothstep(1 - dist / CFG.radius);

    // ── Cursor speed factor ──────────────────────────────────────────────────
    const speed = Math.hypot(cvx, cvy);
    const speedFactor = 1 + speed * CFG.speedAmplitude;

    // ── A. Weak radial push ──────────────────────────────────────────────────
    this.vx += ndx * CFG.radialStrength * falloff;
    this.vy += ndy * CFG.radialStrength * falloff;

    // Only apply B & C when the cursor is actually moving
    if (speed > CFG.minSpeed) {
      // Normalised cursor velocity direction
      const invSpeed = 1 / speed;
      const cdx = cvx * invSpeed;   // cursor direction unit vector
      const cdy = cvy * invSpeed;

      // ── B. Strong directional ─────────────────────────────────────────────
      //  Particles near cursor get dragged along its travel direction.
      //  Project the radial direction onto cursor direction for a dot-product
      //  blend — particles directly behind cursor get maximum drag.
      const alignment = Math.max(0, -(ndx * cdx + ndy * cdy)); // 0–1
      const dirStrength = CFG.directionalStrength * falloff * speedFactor;

      this.vx += cdx * dirStrength * (0.4 + alignment * 0.6);
      this.vy += cdy * dirStrength * (0.4 + alignment * 0.6);

      // ── C. Perpendicular swirl ────────────────────────────────────────────
      //  90° CW rotation of cursor direction: (cx, cy) → (cy, -cx)
      //  Creates the liquid vortex / side-smear characteristic.
      const swirlStrength = CFG.swirlStrength * falloff * speedFactor;
      this.vx += cdy * swirlStrength;
      this.vy += (-cdx) * swirlStrength;
    }
  }

  /**
   * Spring + damping + noise + velocity clamp + integrate.
   * @param frame  monotonic frame counter for noise phase offset
   */
  update(frame: number) {
    // Spring pull toward origin
    this.vx += (this.ox - this.x) * CFG.stiffness;
    this.vy += (this.oy - this.y) * CFG.stiffness;

    // Damping
    this.vx *= CFG.damping;
    this.vy *= CFG.damping;

    // Organic noise (phase-shifted per particle)
    const angle = this.nPhase + frame * 0.016;
    this.vx += Math.cos(angle) * CFG.noiseAmp;
    this.vy += Math.sin(angle) * CFG.noiseAmp;

    // Velocity clamp — prevents chaotic explosion at very high cursor speeds
    const spd = Math.hypot(this.vx, this.vy);
    if (spd > CFG.maxSpeed) {
      const inv = CFG.maxSpeed / spd;
      this.vx *= inv;
      this.vy *= inv;
    }

    // Integrate
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D, baseRadius: number) {
    const ddx = this.x - this.ox;
    const ddy = this.y - this.oy;
    const disp = Math.sqrt(ddx * ddx + ddy * ddy);

    const r = Math.min(
      baseRadius + disp * CFG.dispSizeGain,
      baseRadius * CFG.maxSizeBoost
    );
    const a = Math.min(CFG.baseAlpha + disp * CFG.dispAlphaGain, 1);

    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── Utility ───────────────────────────────────────────────────────────────────

function getThemeColor(variable: string): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  if (raw.startsWith("#") && raw.length >= 7) {
    const r = parseInt(raw.slice(1, 3), 16);
    const g = parseInt(raw.slice(3, 5), 16);
    const b = parseInt(raw.slice(5, 7), 16);
    return `rgb(${r},${g},${b})`;
  }
  return raw || "rgb(17,17,17)";
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// ─── Component ─────────────────────────────────────────────────────────────────

type SandParticleTextProps = {
  text?: string;
  className?: string;
  compact?: boolean;
  fontScale?: number;
  invertColor?: boolean;
};

export default function SandParticleText({
  text = "Shubham\nRathod",
  className = "",
  compact = false,
  fontScale,
  invertColor = false,
}: SandParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resolvedFontScale = fontScale ?? (compact ? 0.22 : 0.18);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    const srcCanvas = document.createElement("canvas");
    const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || !srcCtx) return;

    let W = 1, H = 1, dpr = 1;
    let raf = 0;
    let frame = 0;
    let particles: FluidParticle[] = [];
    let particleColor = getThemeColor(invertColor ? "--background" : "--foreground");

    // ── Pointer state ─────────────────────────────────────────────────────────
    // We track raw position + smoothed velocity separately so forces feel heavy.

    const rawPtr = { x: -9999, y: -9999, active: false };
    const smdVel = { vx: 0, vy: 0 };   // smoothed (lerped) velocity
    const prevRaw = { x: -9999, y: -9999 };

    // ── Build text mask → particles ───────────────────────────────────────────

    const buildParticles = () => {
      const rect = parent.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particleColor = getThemeColor(invertColor ? "--background" : "--foreground");

      // Draw text into offscreen canvas (white on transparent — only alpha used)
      srcCanvas.width = W;
      srcCanvas.height = H;
      srcCtx.clearRect(0, 0, W, H);
      srcCtx.fillStyle = "#ffffff";
      srcCtx.textAlign = "center";
      srcCtx.textBaseline = "middle";

      const lines = text.split("\n");
      const hPad = Math.max(compact ? 28 : 42, W * (compact ? 0.08 : 0.10));
      const vPad = Math.max(compact ? 24 : 34, H * 0.08);
      const availW = Math.max(1, W - hPad * 2);
      const availH = Math.max(1, H - vPad * 2);
      let fontSize = Math.min(W * resolvedFontScale, compact ? 128 : 230);

      const applyFont = () => {
        srcCtx.font = `900 ${fontSize}px Syne, Arial Black, sans-serif`;
      };
      applyFont();

      const measW = Math.max(...lines.map((l) => srcCtx.measureText(l).width), 1);
      if (measW > availW) { fontSize *= availW / measW; applyFont(); }

      let lineH = fontSize * (compact ? 0.92 : 0.9);
      const totalH = lineH * lines.length;
      if (totalH > availH) {
        fontSize *= availH / totalH;
        applyFont();
        lineH = fontSize * (compact ? 0.92 : 0.9);
      }

      const startY = H / 2 - ((lines.length - 1) * lineH) / 2;
      lines.forEach((line, i) => srcCtx.fillText(line, W / 2, startY + i * lineH));

      // Sample pixel alpha → collect origins
      const px = srcCtx.getImageData(0, 0, W, H).data;
      const step = compact ? CFG.stepCompact : CFG.stepNormal;
      const sampled: [number, number][] = [];

      for (let py = 0; py < H; py += step) {
        for (let pxIdx = 0; pxIdx < W; pxIdx += step) {
          if (px[(py * W + pxIdx) * 4 + 3] > 60) {
            sampled.push([pxIdx, py]);
          }
        }
      }

      // Thin uniformly to maxParticles
      let origins = sampled;
      if (sampled.length > CFG.maxParticles) {
        const stride = sampled.length / CFG.maxParticles;
        origins = Array.from({ length: CFG.maxParticles }, (_, i) =>
          sampled[Math.floor(i * stride)]
        );
      }

      // Reuse instances if count matches — avoids GC churn on resize
      if (particles.length !== origins.length) {
        particles = origins.map(([x, y]) => new FluidParticle(x, y));
      } else {
        for (let i = 0; i < particles.length; i++) {
          particles[i].ox = origins[i][0];
          particles[i].oy = origins[i][1];
        }
      }
    };

    // ── Animation loop ────────────────────────────────────────────────────────

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = particleColor;

      const baseR = compact ? CFG.dotRadiusCompact : CFG.dotRadiusNormal;

      // Smooth cursor velocity (lerped each frame — feels heavier/more fluid)
      if (rawPtr.active) {
        const rawVx = rawPtr.x - prevRaw.x;
        const rawVy = rawPtr.y - prevRaw.y;
        smdVel.vx = lerp(smdVel.vx, rawVx, CFG.velocitySmoothing);
        smdVel.vy = lerp(smdVel.vy, rawVy, CFG.velocitySmoothing);
      } else {
        // Decay velocity so last-frame swirl doesn't cut off abruptly
        smdVel.vx *= 0.85;
        smdVel.vy *= 0.85;
      }

      for (const p of particles) {
        if (rawPtr.active) {
          p.applyForces(rawPtr.x, rawPtr.y, smdVel.vx, smdVel.vy);
        }
        p.update(frame);
        p.draw(ctx, baseR);
      }

      ctx.globalAlpha = 1;
      frame++;
      raf = requestAnimationFrame(animate);
    };

    // ── Pointer tracking ──────────────────────────────────────────────────────

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Keep prevRaw in sync before updating rawPtr
      prevRaw.x = rawPtr.x === -9999 ? x : rawPtr.x;
      prevRaw.y = rawPtr.y === -9999 ? y : rawPtr.y;

      rawPtr.x = x;
      rawPtr.y = y;
      // Extend active zone slightly past edge so swirl fades gracefully
      rawPtr.active =
        x >= -CFG.radius && x <= W + CFG.radius &&
        y >= -CFG.radius && y <= H + CFG.radius;
    };

    const onPointerLeave = () => {
      rawPtr.active = false;
    };

    // ── Theme observer ────────────────────────────────────────────────────────

    const themeObserver = new MutationObserver(() => {
      particleColor = getThemeColor(invertColor ? "--background" : "--foreground");
      buildParticles();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ── Bootstrap ─────────────────────────────────────────────────────────────

    const resizeObserver = new ResizeObserver(buildParticles);
    resizeObserver.observe(parent);
    buildParticles();
    animate();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [compact, resolvedFontScale, text]);

  return (
    <canvas
      ref={canvasRef}
      className={`sand-particle-canvas ${className}`}
      aria-label={`${text.replace("\n", " ")} particle text`}
    />
  );
}
