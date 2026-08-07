"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { streamNotifications, type NotifyLevel } from "@/lib/admin/notificationsStream";
import { ContextInfo } from "@/components/ui/ContextInfo";

const LEVEL_STYLE: Record<NotifyLevel, string> = {
  info: "border-cyan-500/30 text-cyan-200",
  success: "border-emerald-500/30 text-emerald-200",
  warn: "border-amber-500/40 text-amber-200",
  critical: "border-rose-500/40 text-rose-200",
};

export default function AdminNotificationsPage() {
  const [tick, setTick] = useState(0);
  const [live, setLive] = useState(true);
  const items = streamNotifications(tick);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2500);
    return () => window.clearInterval(id);
  }, [live]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/70">
            Admin · Notifications
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            Streaming focus dash
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            Detailed live telemetry: security blocks, cron outcomes, curator drafts, sales follow-ups.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLive((v) => !v)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              live
                ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
                : "border border-resync-border text-zinc-300"
            }`}
          >
            {live ? "Stream ON" : "Stream OFF"}
          </button>
          <Link
            href="/admin/analytics"
            className="rounded-xl border border-resync-border px-4 py-2 text-sm text-zinc-300"
          >
            Analytics
          </Link>
          <Link href="/admin/agents" className="rounded-xl border border-resync-border px-4 py-2 text-sm text-zinc-300">
            Agents
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <ContextInfo title="Areas of focus" tone="violet">
          critical → security · warn → auth/billing · info → fleet/marketing · success → cron clean.
        </ContextInfo>
      </div>

      <ul className="mt-8 space-y-3">
        {items.map((n) => (
          <li
            key={n.id}
            className={`rounded-2xl border bg-resync-surface/25 px-4 py-3 ${LEVEL_STYLE[n.level]}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
                  {n.level} · {n.focus}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{n.title}</p>
                <p className="mt-1 text-xs text-zinc-400">{n.detail}</p>
              </div>
              <time className="text-[10px] text-zinc-500">
                {new Date(n.at).toLocaleTimeString()}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
