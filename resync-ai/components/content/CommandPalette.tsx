"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CONTENT_REGISTRY, type ContentEntry } from "@/lib/content/registry";
import { cn } from "@/lib/utils";

function score(entry: ContentEntry, q: string): number {
  const query = q.toLowerCase().trim();
  if (!query) return 0;
  const title = entry.title.toLowerCase();
  const hay = `${title} ${entry.description.toLowerCase()} ${entry.keywords.join(" ")}`;
  if (title === query) return 100;
  if (title.startsWith(query)) return 80;
  if (title.includes(query)) return 60;
  if (hay.includes(query)) return 40;
  // loose token match
  const tokens = query.split(/\s+/);
  if (tokens.every((t) => hay.includes(t))) return 20;
  return 0;
}

/**
 * Global command palette. Opens with ⌘K / Ctrl-K (or the header search button
 * dispatching the `resync:open-command` event) and fuzzy-searches every content
 * destination in the registry.
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("resync:open-command", onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resync:open-command", onOpen as EventListener);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return CONTENT_REGISTRY.slice(0, 8);
    }
    return CONTENT_REGISTRY.map((e) => ({ e, s: score(e, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 10)
      .map((r) => r.e);
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function go(entry: ContentEntry) {
    setOpen(false);
    router.push(entry.href);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = results[active];
      if (entry) go(entry);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search Resync AI"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-resync-border bg-resync-surface/95 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-resync-border/60 px-4">
          <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search pages, docs, features…"
            className="w-full bg-transparent py-4 text-sm text-white placeholder:text-zinc-500 outline-none"
          />
          <kbd className="hidden rounded border border-resync-border px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 sm:inline">
            ESC
          </kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-zinc-500">No results for “{query}”.</li>
          )}
          {results.map((entry, i) => (
            <li key={entry.href}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(entry)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition",
                  i === active ? "bg-cyan-500/10" : "hover:bg-white/5"
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{entry.title}</span>
                  <span className="block truncate text-xs text-zinc-500">{entry.description}</span>
                </span>
                <span className="shrink-0 rounded-full border border-resync-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                  {entry.group}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
