"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  createNodeNetwork,
  drawNodeNetwork,
  tickNetwork,
  type NetworkEdge,
  type NetworkNode,
} from "@/components/marketing/canvas/nodeNetwork";
import { FoldingChipBackdrop, VisionQuoteBand } from "@/components/marketing/FoldingChipBackdrop";
import { ContextInfo } from "@/components/ui/ContextInfo";

export function HeroImmersive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const nodesRef = useRef<NetworkNode[]>([]);
  const edgesRef = useRef<NetworkEdge[]>([]);

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const net = createNodeNetwork({ nodeCount: 28, width: w, height: h, seed: 7 });
      nodesRef.current = net.nodes;
      edgesRef.current = net.edges;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const loop = (now: number) => {
      const time = (now - start) / 1000;
      const scrollFactor = Math.min(scrollRef.current / 600, 1);
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      for (const n of nodes) {
        n.vx *= 1 - scrollFactor * 0.3;
        n.vy *= 1 - scrollFactor * 0.3;
      }

      tickNetwork(nodes, w, h, false);
      drawNodeNetwork(ctx, nodes, edges, time, { glow: true, showLabels: scrollFactor > 0.2 });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-80"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-resync-bg/20 via-transparent to-resync-bg" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(34,211,238,0.08),transparent_60%)]" />
      <FoldingChipBackdrop />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-28">
        <p className="animate-fade-rise font-mono text-xs uppercase tracking-[0.35em] text-cyan-400/80">
          Resync AI
          <ContextInfo title="What is Resync?">
            Self-healing multimodal workflows — Community $0, Builder $39, Pro $129. Agents propose;
            humans approve.
          </ContextInfo>
        </p>

        <h1 className="animate-fade-rise mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-white [animation-delay:120ms] md:text-7xl lg:text-8xl">
          Workflows that{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-400 bg-clip-text text-transparent">
            heal in production
          </span>
        </h1>

        <VisionQuoteBand />

        <p className="animate-fade-rise mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 [animation-delay:240ms] md:text-xl">
          Build multimodal automation on a living canvas—self-repairing nodes, exportable code,
          and a studio built for teams who ship again and again.
        </p>

        <div className="animate-fade-rise mt-10 flex flex-wrap gap-4 [animation-delay:360ms]">
          <Link
            href="/builder"
            className="animate-glow-pulse rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-900/30 transition hover:brightness-110"
          >
            Open the builder
          </Link>
          <Link
            href="/studio"
            className="rounded-xl border border-cyan-500/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-cyan-400/50 hover:bg-white/10"
          >
            Explore studio
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-parallax-drift">
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
          <svg className="h-5 w-5 animate-drop-down" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
