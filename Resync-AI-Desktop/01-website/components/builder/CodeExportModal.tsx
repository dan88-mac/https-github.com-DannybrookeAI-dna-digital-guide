"use client";

import { generateNextjsExport } from "@/lib/codegen/generateNextjs";
import type { WorkflowGraph } from "@/schemas/workflow";

export function CodeExportModal({
  open,
  onClose,
  slug,
  name,
  graph,
}: {
  open: boolean;
  onClose: () => void;
  slug: string;
  name: string;
  graph: WorkflowGraph;
}) {
  if (!open) return null;

  const { files } = generateNextjsExport(slug, name, graph);

  function downloadAll() {
    const bundle = files.map((f) => `# ${f.path}\n${f.content}`).join("\n\n---\n\n");
    const blob = new Blob([bundle], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resync-export-${slug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="glass max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-resync-border px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Export production code</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="max-h-96 overflow-auto p-6">
          <ul className="space-y-2 text-sm text-zinc-400">
            {files.map((f) => (
              <li key={f.path} className="font-mono text-indigo-300">
                {f.path}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3 border-t border-resync-border px-6 py-4">
          <button
            type="button"
            onClick={downloadAll}
            className="flex-1 rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white"
          >
            Download bundle
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-resync-border px-4 py-2 text-sm text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
