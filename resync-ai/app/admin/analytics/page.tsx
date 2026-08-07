"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getAnalyticsSnapshot } from "@/lib/admin/analyticsMock";
import { ContextInfo } from "@/components/ui/ContextInfo";

export default function AdminAnalyticsPage() {
  const [refresh, setRefresh] = useState(0);
  const snap = useMemo(() => getAnalyticsSnapshot(), [refresh]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/70">
            Admin · Analytics
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            Live site telemetry
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            Visits, pending subscribers, completed flows, and funnel focus. Wire Supabase rollups to
            replace the deterministic day-seed preview.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRefresh((n) => n + 1)}
            className="rounded-xl border border-cyan-500/40 px-4 py-2 text-sm text-cyan-300"
          >
            Refresh
          </button>
          <Link
            href="/admin/notifications"
            className="rounded-xl border border-resync-border px-4 py-2 text-sm text-zinc-300"
          >
            Notifications
          </Link>
          <Link href="/admin/agents" className="rounded-xl border border-resync-border px-4 py-2 text-sm text-zinc-300">
            Agents
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <ContextInfo title="How to verify production" tone="cyan">
          Check Vercel Analytics / Supabase dashboards, Stripe customers, and{" "}
          <code className="text-cyan-200">/api/health</code>. This panel mirrors Overseer’s
          analytics_rollups skill.
        </ContextInfo>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Visits (24h)", value: snap.visits24h.toLocaleString() },
          { label: "Unique visitors", value: snap.uniqueVisitors24h.toLocaleString() },
          { label: "Pending subscribers", value: String(snap.pendingSubscribers) },
          { label: "Completed flows", value: snap.completedFlows.toLocaleString() },
          { label: "Active sessions", value: String(snap.activeSessions) },
          {
            label: "Heal success",
            value: `${Math.round(snap.healSuccessRate * 100)}%`,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-resync-border/80 bg-resync-surface/30 p-5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-resync-border/80 bg-black/25 p-5">
          <h2 className="text-sm font-semibold text-white">Top paths</h2>
          <ul className="mt-4 space-y-3">
            {snap.topPaths.map((p) => (
              <li key={p.path} className="flex items-center justify-between text-sm">
                <code className="text-cyan-300/90">{p.path}</code>
                <span className="text-zinc-400">{p.hits}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-resync-border/80 bg-black/25 p-5">
          <h2 className="text-sm font-semibold text-white">Subscribe funnel</h2>
          <ul className="mt-4 space-y-3">
            {snap.funnel.map((f) => (
              <li key={f.stage}>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>{f.stage}</span>
                  <span>{f.count}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-indigo-500"
                    style={{
                      width: `${Math.min(100, (f.count / snap.funnel[0].count) * 100)}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-6 text-xs text-zinc-500">Snapshot · {snap.checkedAt}</p>
    </div>
  );
}
