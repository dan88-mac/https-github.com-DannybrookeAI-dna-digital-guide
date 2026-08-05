"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { getModule } from "@/lib/engine/moduleCatalog";

function NodeCardComponent({ data, selected }: NodeProps) {
  const nodeType = (data as { nodeType?: string }).nodeType ?? "httpRequest";
  const label = (data as { label?: string }).label ?? "Node";
  const mod = getModule(nodeType);
  const color = mod?.color ?? "#6366f1";
  const icon = mod?.icon ?? "◆";
  const category = mod?.category ?? "step";

  return (
    <div
      className={`min-w-[168px] rounded-xl border px-3.5 py-3 shadow-lg backdrop-blur-md transition-shadow ${
        selected ? "ring-2 ring-indigo-400/60" : ""
      }`}
      style={{
        borderColor: `${color}66`,
        background: `linear-gradient(135deg, ${color}18 0%, rgba(12,12,18,0.85) 55%, rgba(12,12,18,0.92) 100%)`,
        boxShadow: selected
          ? `0 0 24px ${color}33, 0 8px 32px rgba(0,0,0,0.4)`
          : `0 4px 20px ${color}1a, 0 8px 32px rgba(0,0,0,0.35)`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-2 !border-resync-bg"
        style={{ background: color }}
      />
      <div className="flex items-start gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base"
          style={{ background: `${color}28`, color }}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] uppercase tracking-wider text-zinc-500">{category}</p>
          <p className="truncate text-sm font-medium text-white">{label}</p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-2 !border-resync-bg"
        style={{ background: color }}
      />
    </div>
  );
}

export const NodeCard = memo(NodeCardComponent);
