"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedSection } from "@/components/marketing/ShowcaseAnimations";
import {
  createNodeNetwork,
  drawNodeNetwork,
  tickNetwork,
  type NetworkEdge,
  type NetworkNode,
} from "@/components/marketing/canvas/nodeNetwork";

type ShowcasePlayerProps = {
  title: string;
  subtitle: string;
  variant: "workflow" | "circuit";
};

function ShowcasePlayer({ title, subtitle, variant }: ShowcasePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const nodesRef = useRef<NetworkNode[]>([]);
  const edgesRef = useRef<NetworkEdge[]>([]);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let raf = 0;
    let start = performance.now();
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = variant === "workflow" ? 18 : 24;
      const net = createNodeNetwork({
        nodeCount: count,
        width: w,
        height: h,
        seed: variant === "workflow" ? 13 : 99,
      });
      nodesRef.current = net.nodes;
      edgesRef.current = net.edges;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const loop = (now: number) => {
      const time = (now - start) / 1000;
      const isPaused = pausedRef.current;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      if (!isPaused) tickNetwork(nodes, w, h, false);

      if (variant === "circuit") {
        ctx.fillStyle = "#06060e";
        ctx.fillRect(0, 0, w, h);
        drawCircuitOverlay(ctx, w, h, time, isPaused);
      }

      drawNodeNetwork(ctx, nodes, edges, time, {
        paused: isPaused,
        glow: true,
        showLabels: variant === "workflow",
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [variant]);

  return (
    <div className="group overflow-hidden rounded-2xl border border-resync-border/80 bg-resync-surface/80 shadow-2xl shadow-black/40">
      {/* Player chrome */}
      <div className="flex items-center justify-between border-b border-resync-border/60 bg-black/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Resync Showcase
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label={paused ? "Play" : "Pause"}
          >
            {paused ? "Play" : "Pause"}
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>

      <div className="relative aspect-video w-full bg-[#06060e]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="pointer-events-none absolute bottom-3 left-4 right-4">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-zinc-400">{subtitle}</p>
        </div>
        {paused && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-sm">
              <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function drawCircuitOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  paused: boolean
) {
  const t = paused ? 0 : time;
  ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
  ctx.lineWidth = 1;

  const paths = [
    { x1: 0, y1: h * 0.3, x2: w * 0.4, y2: h * 0.3, x3: w * 0.4, y3: h * 0.7, x4: w, y4: h * 0.7 },
    { x1: 0, y1: h * 0.7, x2: w * 0.6, y2: h * 0.7, x3: w * 0.6, y3: h * 0.2, x4: w, y4: h * 0.2 },
  ];

  for (const p of paths) {
    ctx.beginPath();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(p.x2, p.y2);
    ctx.lineTo(p.x3, p.y3);
    ctx.lineTo(p.x4, p.y4);
    ctx.stroke();

    const progress = ((t * 0.2) % 1);
    const segments = [
      { x: p.x1 + (p.x2 - p.x1) * progress, y: p.y1 },
      { x: p.x2 + (p.x3 - p.x2) * progress, y: p.y2 + (p.y3 - p.y2) * progress },
    ];
    for (const s of segments) {
      ctx.fillStyle = "rgba(129, 140, 248, 0.8)";
      ctx.beginPath();
      ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function FeatureVideoShowcase() {
  return (
    <AnimatedSection animation="fadeRise" className="mx-auto max-w-6xl px-4 py-24">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/70">
          Product showcases
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
          See the canvas in motion
        </h2>
        <p className="mt-3 text-zinc-400">
          Two live previews of Resync&apos;s multimodal workflow engine—nodes routing data,
          circuits self-healing under load. No pre-rendered footage required.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <ShowcasePlayer
          variant="workflow"
          title="Multimodal node routing"
          subtitle="Packets flow between ingest, transform, and emit stages"
        />
        <ShowcasePlayer
          variant="circuit"
          title="Self-healing circuitry"
          subtitle="Circuit paths reroute when upstream modules fail"
        />
      </div>
    </AnimatedSection>
  );
}
