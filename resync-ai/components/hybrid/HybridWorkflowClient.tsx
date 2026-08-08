"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MatrixCanvas } from "@/components/hybrid/MatrixCanvas";
import { FindMeBeeper } from "@/components/hybrid/FindMeBeeper";
import { RunnerTerminal } from "@/components/hybrid/RunnerTerminal";
import type { FindMeDot, HybridStreamEvent, PathHop } from "@/lib/hybrid/types";
import { getBuiltImplementations } from "@/lib/hybrid/builtCatalog";

const STATIC_CATALOG = getBuiltImplementations();

export function HybridWorkflowClient() {
  const [executionId] = useState(() => crypto.randomUUID());
  const [hops, setHops] = useState<PathHop[]>([]);
  const [dots, setDots] = useState<FindMeDot[]>([]);
  const [terminal, setTerminal] = useState<string[]>([
    `[${new Date().toISOString()}] Hybrid matrix runner ready.`,
    "Type: run — start SSE assembly line",
  ]);
  const [running, setRunning] = useState(false);
  const [clientIp, setClientIp] = useState("—");
  const [frequencyHz, setFrequencyHz] = useState(2.4e9);
  const [geo, setGeo] = useState<{ latitude?: number; longitude?: number }>({});
  const [aiOverview, setAiOverview] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setTerminal((t) => [
          ...t,
          `[${new Date().toISOString()}] Geolocation: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        ]);
      },
      () => {
        setTerminal((t) => [...t, `[${new Date().toISOString()}] Geolocation denied — using host hints only.`]);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const append = useCallback((line: string) => {
    setTerminal((t) => [...t.slice(-120), line]);
  }, []);

  const handleEvent = useCallback(
    (ev: HybridStreamEvent) => {
      const ts = ev.timestampUtc ?? new Date().toISOString();
      if (ev.type === "path_hop") {
        const hop = ev as unknown as PathHop;
        setHops((h) => [...h.slice(-24), hop]);
        if (hop.frequencyHz) setFrequencyHz(hop.frequencyHz);
        append(`[${ts}] HOP ${hop.hop} ${hop.nodeType} ${hop.from} → ${hop.to} (${hop.latencyMs}ms)`);
      } else if (ev.type === "find_me" && Array.isArray(ev.dots)) {
        setDots(ev.dots as FindMeDot[]);
      } else if (ev.event) {
        append(`[${ts}] ${ev.moduleId ?? "module"} · ${ev.event}`);
      } else if (ev.type === "summary") {
        append(`[${ts}] Assembly complete · execution ${String(ev.executionId ?? executionId)}`);
        setAiOverview(buildOverview(ev));
      }
    },
    [append, executionId]
  );

  const startStream = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setHops([]);
    append(`[${new Date().toISOString()}] Starting SSE pipeline ${executionId}`);

    const params = new URLSearchParams({ executionId });
    const es = new EventSource(`/api/hybrid/stream?${params.toString()}`);

    es.onmessage = (msg) => {
      try {
        const ev = JSON.parse(msg.data) as HybridStreamEvent;
        handleEvent(ev);
      } catch {
        append(`[${new Date().toISOString()}] Malformed event`);
      }
    };
    es.onerror = () => {
      es.close();
      setRunning(false);
      append(`[${new Date().toISOString()}] Stream closed`);
    };

    setTimeout(() => {
      es.close();
      setRunning(false);
    }, 45_000);
  }, [running, executionId, append, handleEvent]);

  const onCommand = useCallback(
    async (cmd: string) => {
      append(`matrix> ${cmd}`);
      const lower = cmd.toLowerCase();
      if (lower === "run" || lower.startsWith("run ")) {
        await startStream();
        return;
      }
      if (lower === "list" || lower.includes("implementations")) {
        append(`[${new Date().toISOString()}] Built implementations: ${STATIC_CATALOG.length}`);
        STATIC_CATALOG.slice(0, 8).forEach((item) =>
          append(`  · ${item.id} ${item.name} (${item.runtime})`)
        );
        return;
      }
      if (lower.startsWith("call ")) {
        const name = cmd.slice(5).trim();
        append(`[${new Date().toISOString()}] Function call queued: ${name} (use Python runner for live invoke)`);
        return;
      }
      append(`Unknown command. Try: run | list | call geo.resolve`);
    },
    [append, startStream]
  );

  useEffect(() => {
    fetch("/api/hybrid/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ executionId, clientGeo: geo }),
    })
      .then((r) => r.json())
      .then(() => {
        setClientIp(typeof window !== "undefined" ? window.location.hostname : "local");
      })
      .catch(() => undefined);
  }, [executionId, geo]);

  const catalogRows = useMemo(() => STATIC_CATALOG, []);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-24">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Hybrid quantumised multimodal workflow
        </h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Live assembly line across Python, PowerShell, and web runtimes — stamped telemetry, path hops,
          find-me scrape beeper, and Cursor-ready overview interpretation.
        </p>
        <p className="mt-2 font-mono text-xs text-indigo-300">executionId: {executionId}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <MatrixCanvas hops={hops} findMeDots={dots} frequencyHz={frequencyHz} clientIp={clientIp} />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={running}
              onClick={() => void startStream()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {running ? "Streaming…" : "Run live pipeline"}
            </button>
            <button
              type="button"
              onClick={() => {
                void fetch("/api/hybrid/find-me", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    executionId,
                    url: window.location.href,
                    folder: "/library/frontend",
                    latitude: geo.latitude,
                    longitude: geo.longitude,
                    label: "manual-beeper",
                  }),
                }).then(async (r) => {
                  const dot = (await r.json()) as FindMeDot;
                  setDots((d) => [dot, ...d].slice(0, 10));
                  append(`[${dot.timestampUtc}] Find-me ping registered`);
                });
              }}
              className="rounded-lg border border-amber-500/40 px-4 py-2 text-sm text-amber-200"
            >
              Ping find-me token
            </button>
          </div>
          <RunnerTerminal lines={terminal} onCommand={(c) => void onCommand(c)} />
        </div>

        <aside className="space-y-6">
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Find-me GPS beeper
            </h2>
            <FindMeBeeper dots={dots} />
          </section>
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Cursor AI overview
            </h2>
            <p className="rounded-lg border border-resync-border/60 bg-white/5 p-3 text-sm text-slate-300">
              {aiOverview ||
                "Run the pipeline to generate a live geological + network reallowing summary for agent interpretation (/api/agent/chat can extend this)."}
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Built implementations ({catalogRows.length})
            </h2>
            <ul className="max-h-64 overflow-y-auto space-y-2 text-xs text-slate-400">
              {catalogRows.map((item) => (
                <li key={item.id} className="rounded border border-resync-border/40 px-2 py-1">
                  <span className="text-indigo-300">{item.name}</span>
                  <div>{item.runtime} · step {item.assemblyStep}</div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function buildOverview(summary: HybridStreamEvent): string {
  const steps = Array.isArray(summary.steps) ? summary.steps.length : 0;
  const trace = Array.isArray(summary.pathTrace) ? summary.pathTrace.length : 0;
  return `Runner AI live overview: completed ${steps} assembly modules with ${trace} network hops. Geological reallowing map aligns client GPS with domain connector ingress; secrets scrubbed at each hop. Mode: ${String(summary.mode ?? "python-runner")}. Ready for Cursor agent deep-dive.`;
}
