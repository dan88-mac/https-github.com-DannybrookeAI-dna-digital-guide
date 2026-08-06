"use client";

import type { Node } from "@xyflow/react";
import { getModule } from "@/lib/engine/moduleCatalog";

export function NodeInspector({
  node,
  onUpdate,
}: {
  node: Node | null;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}) {
  if (!node) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-zinc-500">Select a node on the canvas</p>
        <p className="mt-1 text-xs text-zinc-600">Click any module to inspect and edit its config</p>
      </div>
    );
  }

  const data = node.data as Record<string, unknown>;
  const nodeType = (data.nodeType as string) ?? node.type ?? "httpRequest";
  const mod = getModule(nodeType);
  const label = (data.label as string) ?? "";
  const dataJson = JSON.stringify(
    Object.fromEntries(Object.entries(data).filter(([k]) => k !== "label")),
    null,
    2,
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-resync-border/80 p-4">
        <div className="flex items-center gap-2">
          {mod && (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
              style={{ background: `${mod.color}22`, color: mod.color }}
            >
              {mod.icon}
            </span>
          )}
          <div>
            <p className="text-sm font-medium text-white">{mod?.label ?? nodeType}</p>
            <p className="text-[10px] text-zinc-500">{node.id}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <label className="block">
          <span className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">Label</span>
          <input
            type="text"
            value={label}
            onChange={(e) => onUpdate(node.id, { ...data, label: e.target.value })}
            className="w-full rounded-lg border border-resync-border/60 bg-resync-bg/50 px-3 py-2 text-sm text-white focus:border-indigo-500/50 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">
            Data (JSON)
          </span>
          <textarea
            rows={12}
            defaultValue={dataJson}
            key={`${node.id}-${dataJson.length}`}
            onBlur={(e) => {
              try {
                const parsed = JSON.parse(e.target.value) as Record<string, unknown>;
                onUpdate(node.id, { ...parsed, label, nodeType });
              } catch {
                /* keep previous data on invalid JSON */
              }
            }}
            className="w-full resize-none rounded-lg border border-resync-border/60 bg-resync-bg/50 px-3 py-2 font-mono text-xs text-zinc-300 focus:border-indigo-500/50 focus:outline-none"
          />
        </label>
        {mod && (
          <p className="text-xs leading-relaxed text-zinc-500">{mod.description}</p>
        )}
      </div>
    </div>
  );
}
