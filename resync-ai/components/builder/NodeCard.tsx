"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

function NodeCardComponent({ data }: NodeProps) {
  const label = (data as { label?: string }).label ?? "Node";
  const nodeType = (data as { nodeType?: string }).nodeType ?? "step";

  return (
    <div className="min-w-[160px] rounded-xl border border-indigo-500/40 bg-resync-surface px-4 py-3 shadow-lg shadow-indigo-950/30">
      <Handle type="target" position={Position.Left} className="!bg-indigo-400" />
      <p className="text-[10px] uppercase tracking-wider text-indigo-400">{nodeType}</p>
      <p className="text-sm font-medium text-white">{label}</p>
      <Handle type="source" position={Position.Right} className="!bg-indigo-400" />
    </div>
  );
}

export const NodeCard = memo(NodeCardComponent);
