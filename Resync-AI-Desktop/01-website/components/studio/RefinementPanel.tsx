"use client";

import Link from "next/link";
import type { RefinementResult } from "@/lib/engine/refinementCalculator";

export function RefinementPanel({ refinement }: { refinement: RefinementResult | null }) {
  if (!refinement) {
    return (
      <div className="studio-panel glass rounded-2xl p-6">
        <h3 className="font-semibold text-white">Refinement score</h3>
        <p className="mt-2 text-sm text-zinc-500">Generate a workflow to see refinement metrics</p>
      </div>
    );
  }

  const metrics = [
    { label: "Node diversity", value: refinement.metrics.nodeDiversity },
    { label: "Connectivity", value: refinement.metrics.connectivity },
    { label: "Heal coverage", value: refinement.metrics.healCoverage },
    { label: "Purpose fit", value: refinement.metrics.purposeFit },
    { label: "Real-world fixes", value: refinement.metrics.realWorldFixes },
  ];

  return (
    <div className="studio-panel glass rounded-2xl p-6" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Refinement score</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-indigo-300">{refinement.grade}</span>
          <span className="text-lg text-zinc-400">{refinement.score}/100</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">{m.label}</span>
              <span className="text-zinc-400">{Math.round(m.value)}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {refinement.recommendations.length > 0 && (
        <ul className="mt-4 space-y-1 border-t border-resync-border pt-4">
          {refinement.recommendations.slice(0, 4).map((r) => (
            <li key={r} className="text-xs text-amber-300/80">
              → {r}
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/overview-score"
        className="mt-4 block rounded-lg border border-indigo-500/30 bg-indigo-950/20 px-3 py-2 text-center text-xs font-medium text-indigo-300 hover:bg-indigo-950/40"
      >
        Deeper overview integrity blueprint →
      </Link>
    </div>
  );
}
