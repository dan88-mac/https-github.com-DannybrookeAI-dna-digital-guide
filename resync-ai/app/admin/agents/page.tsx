"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AGENT_SKILLS, FLEET_AGENTS, thoughtStream, type AgentId } from "@/lib/agents/fleet";

export default function AdminAgentsPage() {
  const [active, setActive] = useState<AgentId>("overseer");
  const [autonomous, setAutonomous] = useState(false);
  const [tick, setTick] = useState(0);
  const [colWidth, setColWidth] = useState(42);
  const agent = useMemo(() => FLEET_AGENTS.find((a) => a.id === active)!, [active]);

  useEffect(() => {
    if (!autonomous) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1200);
    return () => window.clearInterval(id);
  }, [autonomous]);

  const stream = thoughtStream(agent, tick);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/70">Admin</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">Agent fleet console</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            Hermes-styled ops agents propose updates under human approval. Thin panels, live telemetry,
            letter-by-letter thought streams. Secrets never appear here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/security"
            className="rounded-xl border border-resync-border px-4 py-2 text-sm text-zinc-300 hover:text-white"
          >
            Secure inspect
          </Link>
          <Link
            href="/admin/design"
            className="rounded-xl border border-resync-border px-4 py-2 text-sm text-zinc-300 hover:text-white"
          >
            Design canvas
          </Link>
          <button
            type="button"
            onClick={() => setAutonomous((v) => !v)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              autonomous
                ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
                : "border border-cyan-500/40 text-cyan-300"
            }`}
          >
            {autonomous ? "Autonomy ON" : "Autonomy OFF"}
          </button>
        </div>
      </div>

      <label className="mt-8 flex items-center gap-3 text-xs text-zinc-400">
        Panel width
        <input
          type="range"
          min={28}
          max={60}
          value={colWidth}
          onChange={(e) => setColWidth(Number(e.target.value))}
          className="w-48"
        />
      </label>

      <div className="mt-6 grid gap-4 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-2">
          {FLEET_AGENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setActive(a.id)}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm ${
                active === a.id
                  ? "border-cyan-500/40 bg-cyan-950/30 text-white"
                  : "border-resync-border/70 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>{a.name}</span>
              <span
                className={`h-2 w-2 rounded-full ${
                  autonomous && active === a.id ? "bg-cyan-400 animate-pulse" : "bg-zinc-600"
                }`}
              />
            </button>
          ))}
        </nav>

        <section
          className="rounded-2xl border border-resync-border/80 bg-resync-surface/30 p-5"
          style={{ minHeight: 360 }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div style={{ maxWidth: `${colWidth}rem` }}>
              <h2 className="font-display text-xl font-semibold text-white">{agent.name}</h2>
              <p className="mt-1 text-sm text-zinc-400">{agent.job}</p>
            </div>
            <p className="rounded-full border border-resync-border px-3 py-1 text-[11px] uppercase tracking-wider text-zinc-400">
              {autonomous ? "running" : "idle"} · tick {tick}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-dashed border-resync-border/80 bg-black/20 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Thought stream
              </p>
              <p className="mt-3 min-h-[120px] font-mono text-xs leading-relaxed text-cyan-100/90">
                {stream}
                {autonomous && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-cyan-300" />}
              </p>
            </div>
            <div className="rounded-xl border border-resync-border/80 bg-black/20 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Skills ({agent.skillIds.length})
              </p>
              <ul className="mt-3 space-y-2 text-xs text-zinc-300">
                {agent.skillIds.map((id) => {
                  const s = AGENT_SKILLS.find((x) => x.id === id);
                  return (
                    <li key={id} className="flex gap-2">
                      <span className="text-cyan-400">▹</span>
                      <span>
                        <strong className="text-white">{s?.name}</strong> — {s?.purpose}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <p className="mt-6 text-xs text-zinc-500">
            Status report: proposals require admin approval. Memory kinds: working / reverse / future
            (versioned JSON). Overseer narrates site health for production upgrades.
          </p>
        </section>
      </div>

      <section className="mt-10">
        <h3 className="text-sm font-semibold text-white">All 25 skills</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AGENT_SKILLS.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border border-resync-border/60 bg-resync-surface/20 px-3 py-2 text-xs text-zinc-400"
            >
              <span className="font-medium text-zinc-200">{s.name}</span>
              <span className="mt-0.5 block">{s.purpose}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
