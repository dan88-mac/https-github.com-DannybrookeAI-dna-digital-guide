"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  TOOLS,
  TOOL_CATEGORIES,
  type Tool,
  type ToolCategory,
  type ToolOpts,
} from "@/lib/tools/logic";
import { cn } from "@/lib/utils";

function defaultOpts(tool: Tool): ToolOpts {
  const o: ToolOpts = {};
  for (const opt of tool.options ?? []) o[opt.key] = opt.default;
  return o;
}

export function ToolboxClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory | "All">("All");
  const [selectedId, setSelectedId] = useState<string>(TOOLS[0].id);
  const [input, setInput] = useState<string>(TOOLS[0].sample ?? "");
  const [opts, setOpts] = useState<ToolOpts>(defaultOpts(TOOLS[0]));
  const [output, setOutput] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [copied, setCopied] = useState(false);
  const runIdRef = useRef(0);

  const tool = useMemo(() => TOOLS.find((t) => t.id === selectedId) ?? TOOLS[0], [selectedId]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return TOOLS.filter((t) => {
      const matchesCat = category === "All" || t.category === category;
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  // When the selected tool changes, reset input + options.
  useEffect(() => {
    setInput(tool.sample ?? "");
    setOpts(defaultOpts(tool));
    setOutput("");
    setIsError(false);
  }, [tool]);

  // Live-run transform tools whenever input or options change.
  useEffect(() => {
    if (tool.kind !== "transform") return;
    const id = ++runIdRef.current;
    (async () => {
      try {
        const result = await tool.run(input, opts);
        if (runIdRef.current === id) {
          setOutput(result);
          setIsError(false);
        }
      } catch (e) {
        if (runIdRef.current === id) {
          setOutput(e instanceof Error ? e.message : String(e));
          setIsError(true);
        }
      }
    })();
  }, [tool, input, opts]);

  async function runGenerate() {
    const id = ++runIdRef.current;
    try {
      const result = await tool.run(input, opts);
      if (runIdRef.current === id) {
        setOutput(result);
        setIsError(false);
      }
    } catch (e) {
      setOutput(e instanceof Error ? e.message : String(e));
      setIsError(true);
    }
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  function setOpt(key: string, value: string | number | boolean) {
    setOpts((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Tool list */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 100+ tools…"
          className="w-full rounded-xl border border-resync-border bg-resync-bg/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-500/60"
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategory("All")}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs transition",
              category === "All"
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                : "border-resync-border text-zinc-400 hover:text-white"
            )}
          >
            All
          </button>
          {TOOL_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition",
                category === c
                  ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                  : "border-resync-border text-zinc-400 hover:text-white"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs text-zinc-500">{filtered.length} tools</p>

        <div className="mt-2 max-h-[60vh] space-y-1 overflow-y-auto pr-1">
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left transition",
                t.id === selectedId
                  ? "border-cyan-500/40 bg-cyan-500/10"
                  : "border-transparent hover:border-resync-border hover:bg-white/5"
              )}
            >
              <span className="block text-sm font-medium text-white">{t.name}</span>
              <span className="block truncate text-xs text-zinc-500">{t.description}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="rounded-lg border border-dashed border-resync-border p-4 text-center text-xs text-zinc-500">
              No tools match “{query}”.
            </p>
          )}
        </div>
      </div>

      {/* Runner */}
      <div className="rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-white">{tool.name}</h2>
              <span className="rounded-full border border-resync-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                {tool.category}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{tool.description}</p>
          </div>
        </div>

        {(tool.options?.length ?? 0) > 0 && (
          <div className="mt-5 flex flex-wrap gap-4 rounded-xl border border-resync-border/60 bg-resync-bg/40 p-4">
            {tool.options!.map((opt) => (
              <label key={opt.key} className="flex items-center gap-2 text-sm text-zinc-300">
                <span>{opt.label}</span>
                {opt.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(opts[opt.key])}
                    onChange={(e) => setOpt(opt.key, e.target.checked)}
                    className="h-4 w-4 accent-cyan-500"
                  />
                ) : opt.type === "number" ? (
                  <input
                    type="number"
                    min={opt.min}
                    max={opt.max}
                    value={Number(opts[opt.key])}
                    onChange={(e) => setOpt(opt.key, Number(e.target.value))}
                    className="w-24 rounded-lg border border-resync-border bg-resync-bg/60 px-2 py-1 text-sm text-white outline-none focus:border-cyan-500/60"
                  />
                ) : (
                  <input
                    type="text"
                    value={String(opts[opt.key])}
                    onChange={(e) => setOpt(opt.key, e.target.value)}
                    className="w-40 rounded-lg border border-resync-border bg-resync-bg/60 px-2 py-1 text-sm text-white outline-none focus:border-cyan-500/60"
                  />
                )}
              </label>
            ))}
          </div>
        )}

        {tool.kind === "transform" && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-zinc-500">Input</label>
              {tool.sample && (
                <button
                  type="button"
                  onClick={() => setInput(tool.sample ?? "")}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Load sample
                </button>
              )}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              spellCheck={false}
              className="w-full resize-y rounded-xl border border-resync-border bg-resync-bg/60 p-4 font-mono text-sm text-white outline-none transition focus:border-cyan-500/60"
            />
          </div>
        )}

        {tool.kind === "generate" && (
          <div className="mt-5">
            <button
              type="button"
              onClick={runGenerate}
              className="rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Generate
            </button>
          </div>
        )}

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs uppercase tracking-wider text-zinc-500">Output</label>
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              className="text-xs text-cyan-400 transition hover:text-cyan-300 disabled:opacity-40"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <pre
            className={cn(
              "min-h-[6rem] w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl border p-4 font-mono text-sm",
              isError
                ? "border-rose-500/40 bg-rose-500/5 text-rose-300"
                : "border-resync-border bg-resync-bg/60 text-cyan-100"
            )}
          >
            {output || (tool.kind === "generate" ? "Click Generate…" : "Output appears here…")}
          </pre>
        </div>
      </div>
    </div>
  );
}
