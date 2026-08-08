"use client";

import { useEffect, useRef } from "react";
import type { FindMeDot, PathHop } from "@/lib/hybrid/types";

interface MatrixCanvasProps {
  hops: PathHop[];
  findMeDots: FindMeDot[];
  frequencyHz: number;
  clientIp: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
}

export function MatrixCanvas({ hops, findMeDots, frequencyHz, clientIp }: MatrixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let t0 = performance.now();
    const nodes: Node[] = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      hue: 200 + Math.random() * 80,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      const dt = (now - t0) / 1000;
      t0 = now;
      ctx.fillStyle = "rgba(2, 4, 12, 0.35)";
      ctx.fillRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx * (1 + frequencyHz / 6e9);
        n.y += n.vy * (1 + frequencyHz / 6e9);
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
      }

      ctx.strokeStyle = "rgba(99, 102, 241, 0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 0.22) {
            ctx.globalAlpha = 1 - d / 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      hops.slice(-8).forEach((hop, idx) => {
        const px = ((idx + 1) / 9) * w * 0.85 + w * 0.05;
        const py = h * 0.25 + (idx % 3) * 28;
        ctx.fillStyle = hop.nodeType === "satellite" ? "#f472b6" : "#38bdf8";
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillText(`${hop.nodeType} ${hop.latencyMs}ms`, px + 8, py + 4);
      });

      findMeDots.slice(0, 3).forEach((dot, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(now / 200 + i);
        const fx = w * 0.72;
        const fy = h * (0.55 + i * 0.12);
        ctx.strokeStyle = `rgba(250, 204, 21, ${0.4 + pulse * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(fx, fy, 10 + pulse * 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(fx, fy, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText(`IP ${clientIp} · ${Math.round(1 / Math.max(dt, 0.001))} fps`, 12, h - 14);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [hops, findMeDots, frequencyHz, clientIp]);

  return (
    <canvas
      ref={canvasRef}
      className="h-[min(420px,50vh)] w-full rounded-xl border border-resync-border/80 bg-black/40"
      aria-label="Live matrix circuitry canvas"
    />
  );
}
