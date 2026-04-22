"use client";

import { useEffect, useRef } from "react";

/* ── Node definitions ─────────────────────────────────────────────────────── */
const NODES = [
  { label: "Python",  color: "#a78bfa", orbitRx: 155, orbitRy: 52, speed: 14, phase: 0,    type: "cube"   },
  { label: "LLMs",    color: "#38bdf8", orbitRx: 130, orbitRy: 44, speed: 18, phase: 60,   type: "cube"   },
  { label: "RAG",     color: "#c084fc", orbitRx: 170, orbitRy: 58, speed: 22, phase: 130,  type: "sphere" },
  { label: "FastAPI", color: "#34d399", orbitRx: 115, orbitRy: 38, speed: 12, phase: 200,  type: "cube"   },
  { label: "Next.js", color: "#60a5fa", orbitRx: 142, orbitRy: 48, speed: 16, phase: 270,  type: "sphere" },
  { label: "Docker",  color: "#f472b6", orbitRx: 185, orbitRy: 62, speed: 26, phase: 320,  type: "sphere" },
];

/* ── Orbital ring tilt angles ─────────────────────────────────────────────── */
const RINGS = [
  { rx: 155, ry: 52,  tiltX: 70, tiltZ: 0,   color: "#a78bfa", opacity: 0.35 },
  { rx: 130, ry: 44,  tiltX: 55, tiltZ: 30,  color: "#38bdf8", opacity: 0.30 },
  { rx: 170, ry: 58,  tiltX: 40, tiltZ: -20, color: "#c084fc", opacity: 0.28 },
  { rx: 115, ry: 38,  tiltX: 80, tiltZ: 45,  color: "#34d399", opacity: 0.25 },
  { rx: 142, ry: 48,  tiltX: 65, tiltZ: -35, color: "#60a5fa", opacity: 0.28 },
  { rx: 185, ry: 62,  tiltX: 50, tiltZ: 15,  color: "#f472b6", opacity: 0.25 },
  // decorative inner rings
  { rx: 80,  ry: 28,  tiltX: 60, tiltZ: 20,  color: "#a855f7", opacity: 0.20 },
  { rx: 100, ry: 34,  tiltX: 30, tiltZ: -60, color: "#7c3aed", opacity: 0.18 },
];

export default function TechOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const timeRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── Sizing ──────────────────────────────────────────────────────────── */
    const SIZE = canvas.parentElement!.clientWidth || 500;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const SCALE = SIZE / 520; // normalise to 520px design

    /* ── Draw an elliptical ring ─────────────────────────────────────────── */
    function drawRing(rx: number, ry: number, tiltX: number, tiltZ: number, color: string, opacity: number) {
      const rad_x = (tiltX * Math.PI) / 180;
      const rad_z = (tiltZ * Math.PI) / 180;
      ctx!.save();
      ctx!.translate(CX, CY);
      ctx!.rotate(rad_z);
      ctx!.scale(1, Math.cos(rad_x)); // perspective tilt
      ctx!.beginPath();
      ctx!.ellipse(0, 0, rx, ry * 2, 0, 0, Math.PI * 2);
      ctx!.strokeStyle = color;
      ctx!.globalAlpha = opacity;
      ctx!.lineWidth = 0.8;
      ctx!.stroke();
      ctx!.restore();
    }

    /* ── Get node position on its orbit ─────────────────────────────────── */
    function nodePos(node: (typeof NODES)[number], t: number) {
      const angleRad = ((t / node.speed) * 360 + node.phase) * (Math.PI / 180);
      const tilt = (55 + NODES.indexOf(node) * 8) * (Math.PI / 180);
      const x = CX + Math.cos(angleRad) * node.orbitRx;
      const rawY = Math.sin(angleRad) * node.orbitRy;
      const y = CY + rawY * Math.cos(tilt) * 2;
      const depth = Math.sin(angleRad); // -1 back, +1 front
      return { x, y, depth };
    }

    /* ── Draw a gizmo cube (wireframe-style) ─────────────────────────────── */
    function drawCube(x: number, y: number, size: number, color: string, rot: number, alpha: number) {
      const s = size / 2;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      // project 3 faces
      const corners = [
        [-s, -s], [s, -s], [s, s], [-s, s]
      ].map(([px, py]) => [x + px * cos - py * sin * 0.5, y + px * sin * 0.5 + py * cos]);

      ctx!.save();
      ctx!.globalAlpha = alpha * 0.6;
      ctx!.fillStyle = color;
      ctx!.beginPath();
      ctx!.moveTo(corners[0][0], corners[0][1]);
      corners.slice(1).forEach(([cx2, cy2]) => ctx!.lineTo(cx2, cy2));
      ctx!.closePath();
      ctx!.fill();
      ctx!.globalAlpha = alpha;
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // offset face for 3D illusion
      const OFF = size * 0.3;
      const corners2 = corners.map(([px, py]) => [px + OFF * 0.6, py - OFF * 0.6]);
      ctx!.beginPath();
      ctx!.moveTo(corners2[0][0], corners2[0][1]);
      corners2.slice(1).forEach(([cx2, cy2]) => ctx!.lineTo(cx2, cy2));
      ctx!.closePath();
      ctx!.globalAlpha = alpha * 0.3;
      ctx!.fill();
      ctx!.globalAlpha = alpha * 0.7;
      ctx!.stroke();

      // connecting edges
      ctx!.globalAlpha = alpha * 0.5;
      for (let i = 0; i < 4; i++) {
        ctx!.beginPath();
        ctx!.moveTo(corners[i][0], corners[i][1]);
        ctx!.lineTo(corners2[i][0], corners2[i][1]);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    /* ── Draw a glowing sphere ───────────────────────────────────────────── */
    function drawSphere(x: number, y: number, r: number, color: string, alpha: number) {
      ctx!.save();
      // outer glow
      const grd = ctx!.createRadialGradient(x, y, 0, x, y, r * 2.5);
      grd.addColorStop(0, color + "55");
      grd.addColorStop(1, color + "00");
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = grd;
      ctx!.beginPath();
      ctx!.arc(x, y, r * 2.5, 0, Math.PI * 2);
      ctx!.fill();

      // core
      const grd2 = ctx!.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
      grd2.addColorStop(0, "#ffffff");
      grd2.addColorStop(0.4, color);
      grd2.addColorStop(1, color + "88");
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = grd2;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    /* ── Draw the AI Core ────────────────────────────────────────────────── */
    function drawCore(t: number) {
      const pulse = 1 + Math.sin(t * 1.5) * 0.06;
      const coreR = 38 * SCALE * pulse;

      // Outermost halo
      for (let i = 3; i >= 1; i--) {
        const haloR = coreR * (1 + i * 0.45);
        const grd = ctx!.createRadialGradient(CX, CY, 0, CX, CY, haloR);
        grd.addColorStop(0, "rgba(168,85,247,0)");
        grd.addColorStop(0.6, `rgba(168,85,247,${0.05 / i})`);
        grd.addColorStop(1, "rgba(168,85,247,0)");
        ctx!.save();
        ctx!.globalAlpha = 1;
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(CX, CY, haloR, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // Core sphere gradient
      const grd = ctx!.createRadialGradient(CX - coreR * 0.3, CY - coreR * 0.3, 0, CX, CY, coreR);
      grd.addColorStop(0, "#c084fc");
      grd.addColorStop(0.35, "#a855f7");
      grd.addColorStop(0.7, "#7c3aed");
      grd.addColorStop(1, "#3b0764");
      ctx!.save();
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = grd;
      ctx!.beginPath();
      ctx!.arc(CX, CY, coreR, 0, Math.PI * 2);
      ctx!.fill();

      // Specular shine
      const shine = ctx!.createRadialGradient(CX - coreR * 0.35, CY - coreR * 0.35, 0, CX, CY, coreR * 0.8);
      shine.addColorStop(0, "rgba(255,255,255,0.25)");
      shine.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = shine;
      ctx!.beginPath();
      ctx!.arc(CX, CY, coreR, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      // "AI Core" label
      ctx!.save();
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = "#f3e8ff";
      ctx!.font = `bold ${Math.round(12 * SCALE)}px Inter, sans-serif`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillText("AI Core", CX, CY);
      ctx!.restore();
    }

    /* ── Draw node label ─────────────────────────────────────────────────── */
    function drawLabel(x: number, y: number, text: string, color: string, alpha: number) {
      const pad  = 6 * SCALE;
      const fSize = Math.round(10 * SCALE);
      ctx!.font = `bold ${fSize}px Inter, sans-serif`;
      const tw = ctx!.measureText(text).width;
      const bx = x - tw / 2 - pad;
      const by = y - fSize / 2 - pad * 0.6;
      const bw = tw + pad * 2;
      const bh = fSize + pad * 1.2;
      const br = bh / 2;

      ctx!.save();
      ctx!.globalAlpha = alpha * 0.75;
      ctx!.fillStyle = "#0f0a1e";
      roundRect(ctx!, bx, by, bw, bh, br);
      ctx!.fill();

      ctx!.globalAlpha = alpha * 0.5;
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 0.8;
      roundRect(ctx!, bx, by, bw, bh, br);
      ctx!.stroke();

      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = "#ffffff";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillText(text, x, y);
      ctx!.restore();
    }

    function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.arcTo(x + w, y, x + w, y + r, r);
      c.lineTo(x + w, y + h - r);
      c.arcTo(x + w, y + h, x + w - r, y + h, r);
      c.lineTo(x + r, y + h);
      c.arcTo(x, y + h, x, y + h - r, r);
      c.lineTo(x, y + r);
      c.arcTo(x, y, x + r, y, r);
      c.closePath();
    }

    /* ── Main render loop ────────────────────────────────────────────────── */
    let last = 0;
    function render(ts: number) {
      const dt = (ts - last) / 1000;
      last = ts;
      timeRef.current += dt;
      const t = timeRef.current;

      ctx!.clearRect(0, 0, SIZE, SIZE);

      // 1. Draw all orbital rings
      RINGS.forEach((ring) => {
        drawRing(ring.rx, ring.ry, ring.tiltX, ring.tiltZ, ring.color, ring.opacity);
      });

      // 2. Gather all node positions and sort by depth (back→front painter's algorithm)
      const positions = NODES.map((node) => ({ node, ...nodePos(node, t) }));
      positions.sort((a, b) => a.depth - b.depth);

      // 3. Draw back nodes first
      positions.forEach(({ node, x, y, depth }) => {
        const alpha = 0.4 + ((depth + 1) / 2) * 0.6; // fade-with-depth
        const rot   = t * (0.4 + NODES.indexOf(node) * 0.07);
        const size  = (10 + ((depth + 1) / 2) * 8) * SCALE;

        if (node.type === "cube") {
          drawCube(x, y, size, node.color, rot, alpha);
        } else {
          drawSphere(x, y, size * 0.45, node.color, alpha);
        }
        drawLabel(x, y - size * 0.9, node.label, node.color, alpha);
      });

      // 4. Draw core on top of back nodes, under front nodes
      drawCore(t);

      // 5. Front nodes drawn again (already sorted, just re-check depth)
      positions
        .filter((p) => p.depth > 0.0)
        .forEach(({ node, x, y, depth }) => {
          const alpha = 0.4 + ((depth + 1) / 2) * 0.6;
          const rot   = t * (0.4 + NODES.indexOf(node) * 0.07);
          const size  = (10 + ((depth + 1) / 2) * 8) * SCALE;
          if (node.type === "cube") {
            drawCube(x, y, size, node.color, rot, alpha);
          } else {
            drawSphere(x, y, size * 0.45, node.color, alpha);
          }
          drawLabel(x, y - size * 0.9, node.label, node.color, alpha);
        });

      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="w-full aspect-square relative" style={{ cursor: "grab" }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
