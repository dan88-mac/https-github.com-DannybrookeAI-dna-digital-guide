"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminDesignPage() {
  const [title, setTitle] = useState("Resync heal loop");
  const [body, setBody] = useState("Self-healing multimodal workflows for teams who ship.");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/70">Admin</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white">Design canvas</h1>
      <p className="mt-3 text-sm text-zinc-400">
        Mini preview for agent-assisted creatives. Prompt edits here; publish still requires approval.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-xs text-zinc-500">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-resync-border bg-resync-bg px-3 py-2 text-sm text-white"
          />
          <label className="block text-xs text-zinc-500">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-resync-border bg-resync-bg px-3 py-2 text-sm text-white"
          />
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-resync-surface via-resync-bg to-indigo-950/50 p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/70">Preview</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-white">{title}</h2>
          <p className="mt-3 text-sm text-zinc-400">{body}</p>
          <div className="mt-6 flex gap-2">
            <span className="rounded-lg bg-cyan-600/80 px-3 py-1.5 text-xs text-white">Open Builder</span>
            <span className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-zinc-300">Pricing</span>
          </div>
        </div>
      </div>
      <Link href="/admin/agents" className="mt-8 inline-block text-sm text-cyan-300">
        ← Agent fleet
      </Link>
    </div>
  );
}
