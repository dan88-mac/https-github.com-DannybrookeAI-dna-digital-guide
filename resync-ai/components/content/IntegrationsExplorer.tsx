"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  INTEGRATIONS,
  INTEGRATION_CATEGORIES,
  type IntegrationCategory,
} from "@/lib/content/integrations";
import { Pill } from "@/components/content/ContentKit";

const STATUS_TONE = {
  available: "green",
  beta: "amber",
  planned: "neutral",
} as const;

export function IntegrationsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<IntegrationCategory | "All">("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return INTEGRATIONS.filter((i) => {
      const matchesCat = category === "All" || i.category === category;
      const matchesQuery = !q || i.name.toLowerCase().includes(q) || i.blurb.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("All")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              category === "All"
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                : "border-resync-border text-zinc-400 hover:text-white"
            )}
          >
            All
          </button>
          {INTEGRATION_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                category === c
                  ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                  : "border-resync-border text-zinc-400 hover:text-white"
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search integrations…"
          className="w-full rounded-xl border border-resync-border bg-resync-bg/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-500/60 md:w-64"
        />
      </div>

      <p className="mt-6 text-sm text-zinc-500">
        {filtered.length} integration{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((i) => (
          <div
            key={i.name}
            className="rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-5 transition hover:border-cyan-500/40 hover:bg-resync-surface/70"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 font-display text-sm font-bold text-white">
                {i.name.slice(0, 2)}
              </div>
              <Pill tone={STATUS_TONE[i.status]}>{i.status}</Pill>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">{i.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">{i.blurb}</p>
            <p className="mt-3 text-[11px] uppercase tracking-wider text-zinc-600">{i.category}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-resync-border p-10 text-center text-sm text-zinc-500">
          No integrations match your search.
        </div>
      )}
    </div>
  );
}
