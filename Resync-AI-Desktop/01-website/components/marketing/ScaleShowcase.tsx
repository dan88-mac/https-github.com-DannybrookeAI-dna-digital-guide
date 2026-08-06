"use client";

import { useMemo, useState } from "react";
import { AnimatedSection } from "@/components/marketing/ShowcaseAnimations";
import { cn } from "@/lib/utils";

type ScaleLevel = "small" | "medium" | "monster";

const SCALE_LABELS: Record<ScaleLevel, string> = {
  small: "Starter flow",
  medium: "Team pipeline",
  monster: "Enterprise mesh",
};

const SCALE_DESCRIPTIONS: Record<ScaleLevel, string> = {
  small: "3 nodes · single trigger · one output",
  medium: "12 nodes · branching logic · observability hooks",
  monster: "40+ nodes · multi-region · failover lanes",
};

function WorkflowSVG({ level }: { level: ScaleLevel }) {
  const config = useMemo(() => {
    switch (level) {
      case "small":
        return { nodes: 3, rows: 1, spacing: 120, packetCount: 2 };
      case "medium":
        return { nodes: 12, rows: 3, spacing: 70, packetCount: 6 };
      case "monster":
        return { nodes: 28, rows: 5, spacing: 45, packetCount: 14 };
    }
  }, [level]);

  const nodes = useMemo(() => {
    const result: { x: number; y: number; id: number }[] = [];
    const perRow = Math.ceil(config.nodes / config.rows);
    let id = 0;
    for (let r = 0; r < config.rows && id < config.nodes; r++) {
      const count = Math.min(perRow, config.nodes - id);
      const rowWidth = (count - 1) * config.spacing;
      const startX = 400 - rowWidth / 2;
      for (let c = 0; c < count && id < config.nodes; c++) {
        result.push({
          id,
          x: startX + c * config.spacing,
          y: 80 + r * (level === "monster" ? 55 : 70),
        });
        id++;
      }
    }
    return result;
  }, [config, level]);

  const edges = useMemo(() => {
    const e: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      if (level === "small" || i % 3 !== 2) {
        e.push({
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[i + 1]?.x ?? nodes[i].x + 40,
          y2: nodes[i + 1]?.y ?? nodes[i].y,
          delay: (i * 0.15) % 2,
        });
      }
      if (level === "monster" && i % 4 === 0 && nodes[i + 4]) {
        e.push({
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[i + 4].x,
          y2: nodes[i + 4].y,
          delay: (i * 0.1) % 2,
        });
      }
    }
    return e;
  }, [nodes, level]);

  return (
    <svg
      viewBox="0 0 800 320"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.3)" />
          <stop offset="100%" stopColor="rgba(99,102,241,0.4)" />
        </linearGradient>
        <filter id="node-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* circuit board traces */}
      <rect x="20" y="20" width="760" height="280" rx="12" fill="rgba(12,12,18,0.8)" stroke="rgba(34,211,238,0.1)" />

      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke="url(#circuit-grad)"
          strokeWidth={level === "monster" ? 1 : 1.5}
          className="animate-circuit-flow"
          style={{ animationDelay: `${e.delay}s` }}
        />
      ))}

      {nodes.map((n) => (
        <g key={n.id} filter="url(#node-glow)">
          <rect
            x={n.x - (level === "monster" ? 10 : 14)}
            y={n.y - (level === "monster" ? 10 : 14)}
            width={level === "monster" ? 20 : 28}
            height={level === "monster" ? 20 : 28}
            rx={level === "monster" ? 4 : 6}
            fill="rgba(6,6,14,0.9)"
            stroke="rgba(34,211,238,0.5)"
            strokeWidth="1"
            className="animate-glow-pulse"
            style={{ animationDelay: `${(n.id * 0.08) % 1.5}s` }}
          />
          <circle cx={n.x} cy={n.y} r={level === "monster" ? 3 : 4} fill="rgba(34,211,238,0.9)" />
        </g>
      ))}

      {/* data packets */}
      {Array.from({ length: config.packetCount }).map((_, i) => (
        <circle
          key={`pkt-${i}`}
          r={level === "monster" ? 2 : 3}
          fill="rgba(129,140,248,0.9)"
          className="animate-pan"
          style={{
            animationDelay: `${i * 0.4}s`,
            transform: `translate(${60 + (i * 50) % 680}px, ${140 + (i % 3) * 20}px)`,
          }}
        />
      ))}
    </svg>
  );
}

export function ScaleShowcase() {
  const [value, setValue] = useState(50);

  const level: ScaleLevel = value < 34 ? "small" : value < 67 ? "medium" : "monster";

  return (
    <AnimatedSection
      animation="revealWipe"
      className="relative mx-auto max-w-6xl px-4 py-24"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            Scale on demand
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            From a single trigger to an enterprise mesh
          </h2>
          <p className="mt-3 text-zinc-400">
            Drag the slider to see how Resync&apos;s canvas expands—same mental model, whether
            you&apos;re wiring three nodes or orchestrating a multi-region pipeline.
          </p>

          <div className="mt-10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Small</span>
              <span className="font-mono text-cyan-400">{SCALE_LABELS[level]}</span>
              <span className="text-zinc-500">Monster</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-resync-border accent-cyan-500"
              aria-label="Workflow scale"
            />
            <p className="mt-2 font-mono text-xs text-zinc-500">{SCALE_DESCRIPTIONS[level]}</p>
          </div>
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-resync-border/80 bg-resync-surface/60 transition-all duration-700",
            level === "monster" && "shadow-[0_0_60px_rgba(34,211,238,0.08)]"
          )}
        >
          <div className="border-b border-resync-border/60 px-4 py-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Workflow preview · {SCALE_LABELS[level]}
            </span>
          </div>
          <div
            className={cn(
              "transition-all duration-700",
              level === "small" && "h-48",
              level === "medium" && "h-64",
              level === "monster" && "h-80"
            )}
          >
            <WorkflowSVG level={level} />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
