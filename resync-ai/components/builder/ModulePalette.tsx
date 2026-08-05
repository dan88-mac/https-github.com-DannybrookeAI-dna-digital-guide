"use client";

import { useMemo, useState } from "react";
import {
  MODULE_CATALOG,
  modulesByCategory,
  type ModuleCategory,
  type WorkflowModule,
} from "@/lib/engine/moduleCatalog";

const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  trigger: "Triggers",
  vision: "Vision",
  voice: "Voice",
  text: "Text / LLM",
  http: "HTTP",
  transform: "Transform",
  condition: "Conditions",
  selfHeal: "Self-heal",
  webhook: "Webhooks",
  human: "Human loop",
  delay: "Delay",
  commerce: "Commerce",
  devops: "DevOps",
  data: "Data",
  security: "Security",
  integrate: "Integrations",
};

function ModuleItem({
  mod,
  onAdd,
  disabled,
}: {
  mod: WorkflowModule;
  onAdd: (moduleId: string) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onAdd(mod.id)}
      className="flex w-full items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors hover:border-resync-border/60 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm"
        style={{ background: `${mod.color}22`, color: mod.color }}
      >
        {mod.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-white">{mod.label}</p>
        <p className="truncate text-[10px] text-zinc-500">{mod.description}</p>
      </div>
    </button>
  );
}

export function ModulePalette({
  onAddModule,
  nodeCount,
  maxNodes,
}: {
  onAddModule: (moduleId: string) => void;
  nodeCount: number;
  maxNodes: number;
}) {
  const [query, setQuery] = useState("");
  const atCap = nodeCount >= maxNodes;

  const grouped = useMemo(() => modulesByCategory(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return grouped;
    const result = {} as Record<ModuleCategory, WorkflowModule[]>;
    for (const [cat, mods] of Object.entries(grouped) as [ModuleCategory, WorkflowModule[]][]) {
      const hits = mods.filter(
        (m) =>
          m.label.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q),
      );
      if (hits.length) result[cat] = hits;
    }
    return result;
  }, [grouped, query]);

  const categories = Object.keys(filtered) as ModuleCategory[];

  return (
    <aside className="glass flex h-full w-full flex-col overflow-hidden rounded-xl lg:w-56 xl:w-64">
      <div className="border-b border-resync-border/80 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Modules</h3>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search catalog…"
          className="mt-2 w-full rounded-lg border border-resync-border/60 bg-resync-bg/50 px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none"
        />
        <p className="mt-1.5 text-[10px] text-zinc-500">
          {nodeCount}/{maxNodes} nodes · {MODULE_CATALOG.length} modules
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {categories.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-zinc-600">No modules match</p>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="mb-3">
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
                {CATEGORY_LABELS[cat]}
              </p>
              <div className="space-y-0.5">
                {(filtered[cat] ?? []).map((mod) => (
                  <ModuleItem
                    key={mod.id}
                    mod={mod}
                    onAdd={onAddModule}
                    disabled={atCap}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {atCap && (
        <p className="border-t border-resync-border/80 px-3 py-2 text-[10px] text-amber-400/90">
          Node cap reached ({maxNodes}). Remove nodes to add more.
        </p>
      )}
    </aside>
  );
}
