"use client";

import { useEffect, useRef } from "react";
import { AnimatedSection } from "@/components/marketing/ShowcaseAnimations";

type PipelineStage = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
};

const STAGES: PipelineStage[] = [
  { label: "Ingest", x: 40, y: 140, w: 100, h: 50, color: "rgba(34,211,238,0.6)" },
  { label: "Normalize", x: 180, y: 80, w: 110, h: 50, color: "rgba(45,212,191,0.6)" },
  { label: "Enrich", x: 180, y: 200, w: 110, h: 50, color: "rgba(45,212,191,0.5)" },
  { label: "Route", x: 340, y: 140, w: 100, h: 50, color: "rgba(99,102,241,0.6)" },
  { label: "Heal", x: 480, y: 80, w: 100, h: 50, color: "rgba(129,140,248,0.6)" },
  { label: "Emit", x: 480, y: 200, w: 100, h: 50, color: "rgba(129,140,248,0.5)" },
  { label: "Observe", x: 620, y: 140, w: 110, h: 50, color: "rgba(34,211,238,0.5)" },
];

const CONNECTIONS = [
  [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6],
  [1, 4], [2, 5], // failover lanes
];

export function MonsterCanvasTeaser() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let raf = 0;
    let start = performance.now();
    let w = 0;
    let h = 0;

    const packets = CONNECTIONS.map((_, i) => ({
      conn: i,
      t: Math.random(),
      speed: 0.08 + Math.random() * 0.12,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const scaleX = () => w / 780;
    const scaleY = () => h / 300;

    const loop = (now: number) => {
      const time = (now - start) / 1000;
      const sx = scaleX();
      const sy = scaleY();

      ctx.fillStyle = "#06060e";
      ctx.fillRect(0, 0, w, h);

      // ambient grid
      ctx.strokeStyle = "rgba(34, 211, 238, 0.03)";
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // connections
      for (let ci = 0; ci < CONNECTIONS.length; ci++) {
        const [a, b] = CONNECTIONS[ci];
        const sa = STAGES[a];
        const sb = STAGES[b];
        const x1 = (sa.x + sa.w / 2) * sx;
        const y1 = (sa.y + sa.h / 2) * sy;
        const x2 = (sb.x + sb.w / 2) * sx;
        const y2 = (sb.y + sb.h / 2) * sy;

        const isFailover = ci >= 6;
        ctx.strokeStyle = isFailover
          ? "rgba(129, 140, 248, 0.15)"
          : "rgba(34, 211, 238, 0.2)";
        ctx.lineWidth = isFailover ? 1 : 1.5;
        ctx.setLineDash(isFailover ? [4, 4] : []);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);

        const pkt = packets[ci];
        pkt.t += pkt.speed * 0.005;
        if (pkt.t > 1) pkt.t = 0;
        const px = x1 + (x2 - x1) * pkt.t;
        const py = y1 + (y2 - y1) * pkt.t;
        ctx.fillStyle = isFailover ? "rgba(129,140,248,0.7)" : "rgba(34,211,238,0.9)";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // stages
      for (const s of STAGES) {
        const x = s.x * sx;
        const y = s.y * sy;
        const sw = s.w * sx;
        const sh = s.h * sy;

        const pulse = 0.5 + Math.sin(time * 2 + s.x * 0.01) * 0.5;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8 + pulse * 6;
        ctx.fillStyle = "rgba(12, 12, 18, 0.95)";
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, y, sw, sh, 8);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.font = `${11 * Math.min(sx, 1.2)}px var(--font-dm-sans), sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.textAlign = "center";
        ctx.fillText(s.label, x + sw / 2, y + sh / 2 + 4);
      }

      // scan
      const scanY = ((time * 0.05) % 1) * h;
      const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, "rgba(34, 211, 238, 0.04)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 20, w, 40);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <AnimatedSection animation="parallaxDrift" className="relative py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-indigo-400/70">
            Enterprise canvas
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Monster pipelines, same builder
          </h2>
          <p className="mt-3 text-zinc-400">
            Multi-stage ingestion, parallel enrichment lanes, and automatic failover routing—
            all visible on one macro canvas. Built for ops teams who need the full picture.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-indigo-500/20 bg-resync-surface/40 shadow-2xl shadow-indigo-950/30">
          <div className="flex items-center gap-3 border-b border-resync-border/60 px-5 py-3">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-glow-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Live enterprise pipeline · 7 stages · 2 failover lanes
            </span>
          </div>
          <div className="relative h-64 md:h-80">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-resync-bg/30 via-transparent to-resync-bg/30" />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
