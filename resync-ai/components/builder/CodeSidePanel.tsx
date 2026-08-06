"use client";

import { useMemo } from "react";
import type { WorkflowModule } from "@/lib/engine/moduleCatalog";

interface CodeSidePanelProps {
  modules: Array<Pick<WorkflowModule, "id" | "label" | "category" | "libraries" | "purpose">>;
  open?: boolean;
}

/** Live generated workflow sketch as modules are added. */
export function CodeSidePanel({ modules, open = true }: CodeSidePanelProps) {
  const code = useMemo(() => {
    const lines = [
      "// Resync AI — generated workflow sketch",
      `// Modules: ${modules.length}`,
      "export const workflow = {",
      "  nodes: [",
      ...modules.map(
        (m, i) =>
          `    { id: "n${i + 1}", type: "${m.id}", label: ${JSON.stringify(m.label)}, category: "${m.category}" },`,
      ),
      "  ],",
      "  meta: {",
      `    libraries: ${JSON.stringify([...new Set(modules.flatMap((m) => m.libraries ?? []))].slice(0, 12))},`,
      "  },",
      "};",
      "",
      ...modules.slice(0, 8).map((m) => `// ${m.label}: ${m.purpose}`),
    ];
    return lines.join("\n");
  }, [modules]);

  if (!open) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* ignore */
    }
  }

  function download() {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resync-workflow.js";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <aside className="flex h-full min-h-[280px] flex-col rounded-2xl border border-resync-border/80 bg-black/40">
      <div className="flex items-center justify-between border-b border-resync-border/60 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Generated code
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-resync-border px-2 py-1 text-[11px] text-zinc-300 hover:text-white"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={download}
            className="rounded-md border border-cyan-500/40 px-2 py-1 text-[11px] text-cyan-300 hover:bg-cyan-950/40"
          >
            Download
          </button>
        </div>
      </div>
      <pre className="flex-1 overflow-auto p-3 font-mono text-[11px] leading-relaxed text-cyan-100/90">
        <code>
          {modules.length === 0 ? "// Add modules to generate code…" : code}
        </code>
      </pre>
    </aside>
  );
}
