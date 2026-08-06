"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  filterModules,
  getModulePurpose,
  MODULE_CATALOG,
  type ModuleCategory,
  type WorkflowModule,
} from "@/lib/engine/moduleCatalog";
import { getAllLibraries, getRatioHints, getRecommendedPairs } from "@/lib/engine/modulePairing";
import { AgentHelpIcon } from "@/components/agent/AgentHelpIcon";
import { CodeSidePanel } from "@/components/builder/CodeSidePanel";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ModuleCategory[];

function ModuleCard({
  mod,
  expanded,
  onToggle,
}: {
  mod: WorkflowModule;
  expanded: boolean;
  onToggle: () => void;
}) {
  const purpose = getModulePurpose(mod);
  const pairs = expanded ? getRecommendedPairs(mod.id) : [];
  const hints = expanded ? getRatioHints(mod.id) : [];

  return (
    <article className="glass overflow-hidden rounded-xl transition-shadow hover:shadow-lg hover:shadow-indigo-950/20">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left"
        aria-expanded={expanded}
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
          style={{ background: `${mod.color}22`, color: mod.color }}
        >
          {mod.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white">{mod.label}</h3>
            <span className="rounded-full border border-resync-border/60 px-2 py-0.5 text-[10px] text-zinc-500">
              {CATEGORY_LABELS[mod.category]}
            </span>
            {mod.scheduleCapable && (
              <span className="rounded-full bg-amber-950/50 px-2 py-0.5 text-[10px] text-amber-400">
                Scheduled
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">{purpose}</p>
          {(mod.libraries?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {mod.libraries!.map((lib) => (
                <span
                  key={lib}
                  className="rounded border border-resync-border/40 px-1.5 py-0.5 text-[9px] text-zinc-500"
                >
                  {lib}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="shrink-0 text-zinc-600">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="border-t border-resync-border/60 px-4 pb-4 pt-3">
          {mod.uses && mod.uses.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
                Uses
              </p>
              <p className="mt-1 text-xs text-zinc-400">{mod.uses.join(" · ")}</p>
            </div>
          )}

          {mod.instructions && (
            <p className="mb-3 text-xs leading-relaxed text-zinc-500">{mod.instructions}</p>
          )}

          {mod.codeSnippet && (
            <pre className="mb-3 overflow-x-auto rounded-lg border border-resync-border/60 bg-resync-bg/80 p-3 font-mono text-[10px] text-zinc-400">
              {mod.codeSnippet}
            </pre>
          )}

          {pairs.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
                Pairs well with
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {pairs.slice(0, 4).map((p) => (
                  <span
                    key={p.moduleId}
                    className="rounded-md border border-resync-border/40 bg-resync-bg/40 px-2 py-1 text-[10px] text-zinc-300"
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hints.length > 0 && (
            <ul className="mb-4 space-y-1">
              {hints.map((h) => (
                <li key={h} className="text-[10px] text-zinc-600">
                  · {h}
                </li>
              ))}
            </ul>
          )}

          <Link
            href={`/builder?addModule=${mod.id}`}
            className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
          >
            Use in builder
          </Link>
        </div>
      )}
    </article>
  );
}

export function MultimodalCatalogClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ModuleCategory | "">("");
  const [library, setLibrary] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const libraries = useMemo(() => getAllLibraries(), []);

  const modules = useMemo(
    () =>
      filterModules({
        query,
        categories: category ? [category] : undefined,
        library: library || undefined,
      }),
    [query, category, library],
  );

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Resync catalog
        </p>
        <h1 className="mt-2 inline-flex items-center justify-center gap-2 font-display text-3xl font-bold text-white sm:text-4xl">
          Multimodal function library
          <AgentHelpIcon
            size="md"
            prompt="Help me pick one multimodal module — ask what I'm building first"
          />
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          Browse {MODULE_CATALOG.length} workflow modules spanning vision, voice, text, commerce,
          DevOps, and integrations. Each function ships with pairing hints and canvas guidance —
          add any module directly to the builder.
        </p>
        <Link
          href="/builder"
          className="mt-6 inline-flex rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-900/30 hover:bg-indigo-500"
        >
          Open builder
        </Link>
      </section>

      <section className="glass mb-6 rounded-xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Search
            </label>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, tag, or library…"
              className="mt-1 w-full rounded-lg border border-resync-border/60 bg-resync-bg/50 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none"
            />
          </div>
          <div className="sm:w-44">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ModuleCategory | "")}
              className="mt-1 w-full rounded-lg border border-resync-border/60 bg-resync-bg/50 px-2 py-2 text-sm text-white"
            >
              <option value="">All categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-44">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Library
            </label>
            <select
              value={library}
              onChange={(e) => setLibrary(e.target.value)}
              className="mt-1 w-full rounded-lg border border-resync-border/60 bg-resync-bg/50 px-2 py-2 text-sm text-white"
            >
              <option value="">All ecosystems</option>
              {libraries.map((lib) => (
                <option key={lib} value={lib}>
                  {lib}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-1 rounded-lg border border-resync-border/60 p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`rounded-md px-3 py-1.5 text-xs ${
                view === "grid" ? "bg-indigo-600 text-white" : "text-zinc-400"
              }`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`rounded-md px-3 py-1.5 text-xs ${
                view === "list" ? "bg-indigo-600 text-white" : "text-zinc-400"
              }`}
            >
              List
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Showing {modules.length} of {MODULE_CATALOG.length} modules
        </p>
      </section>

      {modules.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-600">No modules match your filters.</p>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-3"
          }
        >
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              expanded={expandedId === mod.id}
              onToggle={() => toggleExpand(mod.id)}
            />
          ))}
        </div>
      )}

      <section className="mt-12 grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-white">Live code side panel</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Sketch updates as you filter — copy or download for your canvas.
          </p>
        </div>
        <CodeSidePanel modules={modules.slice(0, 12)} />
      </section>

      <section className="mt-12 rounded-xl border border-resync-border/60 bg-resync-bg/30 p-6 text-center">
        <h2 className="text-lg font-semibold text-white">Ready to compose?</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Open the builder and use{" "}
          <code className="rounded bg-resync-surface px-1.5 py-0.5 font-mono text-xs text-indigo-300">
            ?addModule=moduleId
          </code>{" "}
          to auto-place a module, or browse the full catalog from the palette.
        </p>
        <Link
          href="/builder"
          className="mt-4 inline-flex rounded-lg border border-indigo-500/40 px-5 py-2 text-sm text-indigo-300 hover:bg-indigo-950/40"
        >
          Go to builder
        </Link>
      </section>
    </div>
  );
}
