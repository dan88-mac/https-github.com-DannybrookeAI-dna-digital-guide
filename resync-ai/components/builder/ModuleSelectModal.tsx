"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORY_LABELS,
  filterModules,
  getModulePurpose,
  modulesByCategory,
  type ModuleCategory,
  type WorkflowModule,
} from "@/lib/engine/moduleCatalog";
import { getAllLibraries, getRatioHints, getRecommendedPairs } from "@/lib/engine/modulePairing";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ModuleCategory[];

interface FlatEntry {
  kind: "header" | "module";
  category?: ModuleCategory;
  mod?: WorkflowModule;
  moduleIndex?: number;
}

function ModuleDetailPanel({
  mod,
  onAdd,
  onAddKeepOpen,
  disabled,
}: {
  mod: WorkflowModule | null;
  onAdd: () => void;
  onAddKeepOpen: () => void;
  disabled?: boolean;
}) {
  if (!mod) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-zinc-500">Select a module to view details</p>
        <p className="mt-1 text-xs text-zinc-600">↑↓ to navigate · Enter to add</p>
      </div>
    );
  }

  const pairs = getRecommendedPairs(mod.id);
  const ratioHints = getRatioHints(mod.id);
  const purpose = getModulePurpose(mod);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
            style={{ background: `${mod.color}22`, color: mod.color }}
          >
            {mod.icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white">{mod.label}</h3>
            <p className="text-xs text-zinc-500">
              {CATEGORY_LABELS[mod.category]} · <span className="font-mono">{mod.id}</span>
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-zinc-300">{purpose}</p>

        {mod.uses && mod.uses.length > 0 && (
          <section className="mt-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
              Common uses
            </h4>
            <ul className="mt-1.5 space-y-1">
              {mod.uses.map((use) => (
                <li key={use} className="text-xs text-zinc-400">
                  · {use}
                </li>
              ))}
            </ul>
          </section>
        )}

        {mod.libraries && mod.libraries.length > 0 && (
          <section className="mt-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
              Libraries
            </h4>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {mod.libraries.map((lib) => (
                <span
                  key={lib}
                  className="rounded-md border border-resync-border/60 bg-resync-bg/50 px-2 py-0.5 text-[10px] text-zinc-300"
                >
                  {lib}
                </span>
              ))}
            </div>
          </section>
        )}

        {(mod.inputs?.length ?? 0) > 0 && (
          <section className="mt-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
              Inputs
            </h4>
            <ul className="mt-1.5 space-y-1">
              {(mod.inputs ?? []).map((io) => (
                <li key={io.name} className="text-xs text-zinc-400">
                  <span className="font-mono text-indigo-300">{io.name}</span>
                  <span className="text-zinc-600"> · {io.type}</span>
                  {io.description && <span className="text-zinc-500"> — {io.description}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(mod.outputs?.length ?? 0) > 0 && (
          <section className="mt-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
              Outputs
            </h4>
            <ul className="mt-1.5 space-y-1">
              {(mod.outputs ?? []).map((io) => (
                <li key={io.name} className="text-xs text-zinc-400">
                  <span className="font-mono text-emerald-300">{io.name}</span>
                  <span className="text-zinc-600"> · {io.type}</span>
                  {io.description && <span className="text-zinc-500"> — {io.description}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {mod.instructions && (
          <section className="mt-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
              Instructions
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{mod.instructions}</p>
          </section>
        )}

        {mod.codeSnippet && (
          <section className="mt-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
              Code snippet
            </h4>
            <pre className="mt-1.5 overflow-x-auto rounded-lg border border-resync-border/60 bg-resync-bg/80 p-3 font-mono text-[10px] leading-relaxed text-zinc-300">
              {mod.codeSnippet}
            </pre>
          </section>
        )}

        {pairs.length > 0 && (
          <section className="mt-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
              Pairing recommendations
            </h4>
            <ul className="mt-1.5 space-y-2">
              {pairs.map((p) => (
                <li
                  key={p.moduleId}
                  className="rounded-lg border border-resync-border/40 bg-resync-bg/30 px-2.5 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-white">{p.label}</span>
                    {p.ratio != null && (
                      <span className="text-[10px] text-zinc-500">
                        {Math.round(p.ratio * 100)}% fit
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[10px] text-zinc-500">{p.reason}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {ratioHints.length > 0 && (
          <section className="mt-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80">
              Canvas hints
            </h4>
            <ul className="mt-1.5 space-y-1">
              {ratioHints.map((hint) => (
                <li key={hint} className="text-xs text-zinc-500">
                  · {hint}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="flex shrink-0 gap-2 border-t border-resync-border/80 p-4">
        <button
          type="button"
          disabled={disabled}
          onClick={onAdd}
          className="flex-1 rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to canvas
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onAddKeepOpen}
          className="rounded-xl border border-resync-border px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add & keep open
        </button>
      </div>
    </div>
  );
}

export function ModuleSelectModal({
  open,
  onClose,
  onAddModule,
  nodeCount,
  maxNodes,
  initialModuleId,
}: {
  open: boolean;
  onClose: () => void;
  onAddModule: (moduleId: string) => void;
  nodeCount: number;
  maxNodes: number;
  initialModuleId?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<ModuleCategory>>(new Set());
  const [library, setLibrary] = useState("");
  const [scheduleOnly, setScheduleOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const atCap = nodeCount >= maxNodes;

  const libraries = useMemo(() => getAllLibraries(), []);

  const filteredModules = useMemo(
    () =>
      filterModules({
        query,
        categories: activeCategories.size > 0 ? Array.from(activeCategories) : undefined,
        library: library || undefined,
        scheduleCapableOnly: scheduleOnly || undefined,
      }),
    [query, activeCategories, library, scheduleOnly],
  );

  const flatList = useMemo((): FlatEntry[] => {
    const grouped = modulesByCategory();
    const entries: FlatEntry[] = [];
    let moduleIndex = 0;
    const filteredIds = new Set(filteredModules.map((m) => m.id));

    for (const cat of ALL_CATEGORIES) {
      const mods = (grouped[cat] ?? []).filter((m) => filteredIds.has(m.id));
      if (mods.length === 0) continue;
      entries.push({ kind: "header", category: cat });
      for (const mod of mods) {
        entries.push({ kind: "module", mod, moduleIndex });
        moduleIndex += 1;
      }
    }
    return entries;
  }, [filteredModules]);

  const moduleEntries = useMemo(
    () => flatList.filter((e): e is FlatEntry & { mod: WorkflowModule; moduleIndex: number } => e.kind === "module"),
    [flatList],
  );

  const selectedMod = useMemo(() => {
    if (selectedId) return filteredModules.find((m) => m.id === selectedId) ?? null;
    return moduleEntries[focusedIndex]?.mod ?? null;
  }, [selectedId, filteredModules, moduleEntries, focusedIndex]);

  const toggleCategory = useCallback((cat: ModuleCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const handleAdd = useCallback(
    (keepOpen: boolean) => {
      const mod = selectedMod;
      if (!mod || atCap) return;
      onAddModule(mod.id);
      if (!keepOpen) onClose();
    },
    [selectedMod, atCap, onAddModule, onClose],
  );

  useEffect(() => {
    if (!open) return;
    if (initialModuleId && filteredModules.some((m) => m.id === initialModuleId)) {
      setSelectedId(initialModuleId);
      const idx = moduleEntries.findIndex((e) => e.mod.id === initialModuleId);
      if (idx >= 0) setFocusedIndex(idx);
    } else if (moduleEntries.length > 0) {
      setSelectedId(moduleEntries[0].mod.id);
      setFocusedIndex(0);
    }
  }, [open, initialModuleId, filteredModules, moduleEntries]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (moduleEntries.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => {
          const next = Math.min(i + 1, moduleEntries.length - 1);
          setSelectedId(moduleEntries[next].mod.id);
          return next;
        });
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => {
          const next = Math.max(i - 1, 0);
          setSelectedId(moduleEntries[next].mod.id);
          return next;
        });
      }
      if (e.key === "Enter" && selectedMod) {
        e.preventDefault();
        handleAdd(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, moduleEntries, selectedMod, onClose, handleAdd]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-module-index="${focusedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-stretch justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="module-select-title"
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div className="relative z-10 flex min-h-0 w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-resync-border bg-resync-surface shadow-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-resync-border/80 px-4 py-3 sm:px-6">
          <div>
            <h2 id="module-select-title" className="text-lg font-semibold text-white">
              Module catalog
            </h2>
            <p className="text-xs text-zinc-500">
              {filteredModules.length} modules · {nodeCount}/{maxNodes} nodes on canvas
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Left filters */}
          <aside className="shrink-0 border-b border-resync-border/80 p-4 lg:w-56 lg:border-b-0 lg:border-r xl:w-64">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search modules…"
              className="w-full rounded-lg border border-resync-border/60 bg-resync-bg/50 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none"
              autoFocus
            />

            <div className="mt-3">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Library
              </label>
              <select
                value={library}
                onChange={(e) => setLibrary(e.target.value)}
                className="mt-1 w-full rounded-lg border border-resync-border/60 bg-resync-bg/50 px-2 py-1.5 text-xs text-white"
              >
                <option value="">All ecosystems</option>
                {libraries.map((lib) => (
                  <option key={lib} value={lib}>
                    {lib}
                  </option>
                ))}
              </select>
            </div>

            <label className="mt-3 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={scheduleOnly}
                onChange={(e) => setScheduleOnly(e.target.checked)}
                className="rounded border-resync-border"
              />
              <span className="text-xs text-zinc-400">Schedule-capable only</span>
            </label>

            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Categories
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ALL_CATEGORIES.map((cat) => {
                  const active = activeCategories.has(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                        active
                          ? "bg-indigo-600 text-white"
                          : "border border-resync-border/60 text-zinc-400 hover:border-indigo-500/40 hover:text-zinc-200"
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  );
                })}
              </div>
              {activeCategories.size > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategories(new Set())}
                  className="mt-2 text-[10px] text-indigo-400 hover:text-indigo-300"
                >
                  Clear filters
                </button>
              )}
            </div>
          </aside>

          {/* Center list */}
          <div
            ref={listRef}
            className="min-h-0 flex-1 overflow-y-auto border-b border-resync-border/80 lg:border-b-0 lg:border-r"
            role="listbox"
            aria-label="Module list"
          >
            {moduleEntries.length === 0 ? (
              <p className="p-8 text-center text-sm text-zinc-600">No modules match your filters</p>
            ) : (
              flatList.map((entry) => {
                if (entry.kind === "header" && entry.category) {
                  return (
                    <div
                      key={`header-${entry.category}`}
                      className="sticky top-0 z-10 border-b border-resync-border/40 bg-resync-surface/95 px-4 py-2 backdrop-blur-sm"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/90">
                        {CATEGORY_LABELS[entry.category]}
                      </p>
                    </div>
                  );
                }
                if (entry.kind !== "module" || !entry.mod) return null;
                const mod = entry.mod;
                const isFocused = entry.moduleIndex === focusedIndex;
                const purpose = getModulePurpose(mod);

                return (
                  <button
                    key={mod.id}
                    type="button"
                    data-module-index={entry.moduleIndex}
                    role="option"
                    aria-selected={isFocused}
                    onClick={() => {
                      setSelectedId(mod.id);
                      setFocusedIndex(entry.moduleIndex ?? 0);
                    }}
                    onDoubleClick={() => {
                      if (!atCap) {
                        onAddModule(mod.id);
                        onClose();
                      }
                    }}
                    className={`flex w-full items-start gap-3 border-b border-resync-border/30 px-4 py-3 text-left transition-colors ${
                      isFocused ? "bg-indigo-950/40" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base"
                      style={{ background: `${mod.color}22`, color: mod.color }}
                    >
                      {mod.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-white">{mod.label}</p>
                        <span className="shrink-0 text-[10px] text-zinc-600">
                          {CATEGORY_LABELS[mod.category]}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">{purpose}</p>
                      {(mod.libraries?.length ?? 0) > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {mod.libraries!.slice(0, 3).map((lib) => (
                            <span
                              key={lib}
                              className="rounded border border-resync-border/40 px-1.5 py-0.5 text-[9px] text-zinc-500"
                            >
                              {lib}
                            </span>
                          ))}
                          {(mod.libraries?.length ?? 0) > 3 && (
                            <span className="text-[9px] text-zinc-600">
                              +{mod.libraries!.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right detail */}
          <aside className="hidden min-h-0 w-full shrink-0 lg:flex lg:w-80 xl:w-96">
            <ModuleDetailPanel
              mod={selectedMod}
              onAdd={() => handleAdd(false)}
              onAddKeepOpen={() => handleAdd(true)}
              disabled={atCap}
            />
          </aside>
        </div>

        {atCap && (
          <p className="shrink-0 border-t border-resync-border/80 px-4 py-2 text-center text-xs text-amber-400/90">
            Node cap reached ({maxNodes}). Remove nodes to add more.
          </p>
        )}

        {/* Mobile detail + actions */}
        <div className="border-t border-resync-border/80 p-4 lg:hidden">
          {selectedMod && (
            <p className="mb-3 text-sm text-zinc-400">{getModulePurpose(selectedMod)}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={atCap || !selectedMod}
              onClick={() => handleAdd(false)}
              className="flex-1 rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              Add to canvas
            </button>
            <button
              type="button"
              disabled={atCap || !selectedMod}
              onClick={() => handleAdd(true)}
              className="rounded-xl border border-resync-border px-3 py-2 text-sm text-zinc-300 disabled:opacity-40"
            >
              Keep open
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
