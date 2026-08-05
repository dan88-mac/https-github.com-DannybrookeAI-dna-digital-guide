"use client";

import { useEffect, useState } from "react";
import type { GraphNode } from "@/lib/engine/ideaToCanvas";

interface SimStep {
  nodeId: string;
  label: string;
  status: "pending" | "active" | "done" | "healed";
  message: string;
}

export function DemoPreviewPanel({ nodes }: { nodes: GraphNode[] }) {
  const [steps, setSteps] = useState<SimStep[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setSteps(
      nodes.map((n, i) => ({
        nodeId: n.id,
        label: (typeof n.data?.label === "string" ? n.data.label : n.type) as string,
        status: "pending" as const,
        message:
          i === 0
            ? "Trigger received — starting workflow"
            : n.type.startsWith("selfHeal")
              ? "Monitoring for failures…"
              : `Processing via ${n.type}`,
      })),
    );
    setActiveIdx(-1);
  }, [nodes]);

  function runSimulation() {
    if (nodes.length === 0 || running) return;
    setRunning(true);
    setSteps((s) => s.map((st) => ({ ...st, status: "pending" })));
    setActiveIdx(0);

    let idx = 0;
    const interval = setInterval(() => {
      setSteps((prev) =>
        prev.map((st, i) => {
          if (i < idx) return { ...st, status: st.status === "healed" ? "healed" : "done" };
          if (i === idx) {
            const isHeal = nodes[i]?.type.startsWith("selfHeal");
            const simulateHeal = isHeal || (nodes[i]?.type.startsWith("http") && Math.random() > 0.7);
            return {
              ...st,
              status: simulateHeal && isHeal ? "healed" : "active",
              message:
                simulateHeal && isHeal
                  ? "Self-heal triggered — schema patched, retrying"
                  : st.message,
            };
          }
          return st;
        }),
      );

      if (idx >= nodes.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setSteps((prev) => prev.map((st) => ({ ...st, status: "done" })));
          setRunning(false);
        }, 600);
        return;
      }
      idx++;
      setActiveIdx(idx);
    }, 800);
  }

  if (nodes.length === 0) {
    return (
      <div className="studio-panel glass rounded-2xl p-6">
        <h3 className="font-semibold text-white">Demo preview</h3>
        <p className="mt-2 text-sm text-zinc-500">
          Step through a simulation of how your workflow runs in production
        </p>
      </div>
    );
  }

  return (
    <div className="studio-panel glass rounded-2xl p-6" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Demo preview</h3>
        <button
          type="button"
          onClick={runSimulation}
          disabled={running}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {running ? "Running…" : "Run simulation"}
        </button>
      </div>

      <ol className="mt-4 space-y-2">
        {steps.map((step, i) => (
          <li
            key={step.nodeId}
            className={`flex items-start gap-3 rounded-xl p-3 text-sm transition-all duration-300 ${
              step.status === "active"
                ? "bg-indigo-500/15 ring-1 ring-indigo-500/30"
                : step.status === "healed"
                  ? "bg-emerald-500/10"
                  : step.status === "done"
                    ? "bg-white/5 opacity-70"
                    : "opacity-40"
            }`}
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                step.status === "active"
                  ? "bg-indigo-500 text-white"
                  : step.status === "healed"
                    ? "bg-emerald-500 text-white"
                    : step.status === "done"
                      ? "bg-zinc-600 text-zinc-300"
                      : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-white">{step.label}</p>
              <p className="mt-0.5 text-xs text-zinc-400">{step.message}</p>
            </div>
          </li>
        ))}
      </ol>

      {activeIdx >= 0 && (
        <p className="mt-3 text-xs text-indigo-300/70">
          Simulating step {activeIdx + 1} of {nodes.length}…
        </p>
      )}
    </div>
  );
}
