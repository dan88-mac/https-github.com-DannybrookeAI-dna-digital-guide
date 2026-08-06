"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Edge, Node } from "@xyflow/react";
import { handleWorkerMessage } from "@/workers/nodeGraphLogic";
import { getModule } from "@/lib/engine/moduleCatalog";

export type DemoLogEntry = {
  id: string;
  nodeId: string;
  label: string;
  status: "pending" | "running" | "success" | "error";
  message: string;
  durationMs?: number;
};

function statusChip(status: DemoLogEntry["status"]) {
  const styles = {
    pending: "bg-zinc-800 text-zinc-400",
    running: "bg-indigo-950 text-indigo-300 animate-pulse",
    success: "bg-emerald-950/80 text-emerald-400",
    error: "bg-red-950/80 text-red-400",
  };
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${styles[status]}`}>
      {status}
    </span>
  );
}

export function DemoPlayground({
  nodes,
  edges,
  runSignal = 0,
}: {
  nodes: Node[];
  edges: Edge[];
  runSignal?: number;
}) {
  const [logs, setLogs] = useState<DemoLogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const abortRef = useRef(false);

  const runDemo = useCallback(async () => {
    if (running || nodes.length === 0) return;
    abortRef.current = false;
    setRunning(true);

    const graph = {
      nodes: nodes.map((n) => ({ id: n.id })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    };

    const orderResult = handleWorkerMessage({ type: "ORDER", graph });
    const order =
      orderResult.ok && orderResult.order
        ? orderResult.order
        : nodes.map((n) => n.id);

    const initial: DemoLogEntry[] = order.map((nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      const data = node?.data as { label?: string; nodeType?: string } | undefined;
      const nodeType = data?.nodeType ?? node?.type ?? "step";
      const mod = getModule(nodeType);
      return {
        id: `log-${nodeId}`,
        nodeId,
        label: data?.label ?? mod?.label ?? nodeId,
        status: "pending" as const,
        message: "Waiting…",
      };
    });
    setLogs(initial);

    for (let i = 0; i < order.length; i++) {
      if (abortRef.current) break;
      const nodeId = order[i];
      const node = nodes.find((n) => n.id === nodeId);
      const data = node?.data as { label?: string; nodeType?: string } | undefined;
      const nodeType = data?.nodeType ?? node?.type ?? "step";
      const mod = getModule(nodeType);
      const latency = 300 + Math.random() * 900;

      setLogs((prev) =>
        prev.map((e) =>
          e.nodeId === nodeId ? { ...e, status: "running", message: "Executing…" } : e,
        ),
      );

      await new Promise((r) => setTimeout(r, latency));

      if (abortRef.current) break;

      const failChance = nodeType.startsWith("http") ? 0.12 : 0.04;
      const failed = Math.random() < failChance;
      const healed =
        failed &&
        nodeType.startsWith("http") &&
        order.slice(i + 1).some((id) => {
          const n = nodes.find((x) => x.id === id);
          const t = (n?.data as { nodeType?: string })?.nodeType ?? n?.type;
          return t?.startsWith("selfHeal");
        });

      setLogs((prev) =>
        prev.map((e) =>
          e.nodeId === nodeId
            ? {
                ...e,
                status: failed && !healed ? "error" : "success",
                durationMs: Math.round(latency),
                message: failed
                  ? healed
                    ? `Recovered via self-heal (${mod?.icon ?? "🩹"})`
                    : `Failed — ${mod?.category ?? "module"} error simulated`
                  : `Completed ${mod?.label ?? nodeType} in ${Math.round(latency)}ms`,
              }
            : e,
        ),
      );
    }

    setRunning(false);
  }, [nodes, edges, running]);

  useEffect(() => {
    if (runSignal > 0 && nodes.length > 0) {
      void runDemo();
    }
  }, [runSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopDemo = () => {
    abortRef.current = true;
    setRunning(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    void runDemo();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`m-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
          dragOver
            ? "border-indigo-500/60 bg-indigo-950/30"
            : "border-resync-border/60 bg-resync-bg/30"
        }`}
      >
        <p className="text-sm text-zinc-400">Drop a payload to simulate execution</p>
        <p className="mt-1 text-[10px] text-zinc-600">or use Run demo from the toolbar</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={running || nodes.length === 0}
            onClick={() => void runDemo()}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
          >
            {running ? "Running…" : "Run simulation"}
          </button>
          {running && (
            <button
              type="button"
              onClick={stopDemo}
              className="rounded-lg border border-resync-border px-3 py-1.5 text-xs text-zinc-400"
            >
              Stop
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto border-t border-resync-border/80 px-4 pb-4">
        <p className="sticky top-0 bg-resync-surface/90 py-2 text-[10px] uppercase tracking-wider text-zinc-500">
          Execution log
        </p>
        {logs.length === 0 ? (
          <p className="text-xs text-zinc-600">Topological walk will appear here</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-resync-border/50 bg-resync-bg/40 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-medium text-white">{entry.label}</span>
                  {statusChip(entry.status)}
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">{entry.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
