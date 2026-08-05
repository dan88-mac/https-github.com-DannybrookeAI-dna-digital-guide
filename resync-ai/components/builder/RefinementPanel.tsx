"use client";

import { useMemo } from "react";
import type { Edge, Node } from "@xyflow/react";
import { calculateModelRefinement } from "@/lib/engine/refinementCalculator";

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px]">
        <span className="text-zinc-500">{label}</span>
        <span className="text-zinc-400">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-resync-border/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function RefinementPanel({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const result = useMemo(() => {
    const graph = {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: (n.data as { nodeType?: string }).nodeType ?? n.type ?? "httpRequest",
        data: n.data as Record<string, unknown>,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? undefined,
      })),
    };
    return calculateModelRefinement(graph);
  }, [nodes, edges]);

  const gradeColor =
    result.grade === "A"
      ? "text-emerald-400"
      : result.grade === "B"
        ? "text-indigo-300"
        : result.grade === "C"
          ? "text-amber-400"
          : "text-red-400";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-resync-border/80 p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Refinement score</p>
            <p className="text-3xl font-bold text-white">{result.score}</p>
          </div>
          <span className={`text-4xl font-bold ${gradeColor}`}>{result.grade}</span>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="space-y-3">
          <MetricBar label="Node diversity" value={result.metrics.nodeDiversity} />
          <MetricBar label="Connectivity" value={result.metrics.connectivity} />
          <MetricBar label="Heal coverage" value={result.metrics.healCoverage} />
          <MetricBar label="Purpose fit" value={result.metrics.purposeFit} />
          <MetricBar label="Production readiness" value={result.metrics.realWorldFixes} />
        </div>
        {result.recommendations.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Recommendations</p>
            <ul className="space-y-1.5">
              {result.recommendations.map((rec) => (
                <li
                  key={rec}
                  className="rounded-lg border border-resync-border/50 bg-resync-bg/40 px-2.5 py-2 text-xs text-zinc-400"
                >
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
