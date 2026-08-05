"use client";

import {
  Background,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
import { builderNodeTypes } from "@/components/builder/nodeTypes";
import type { GraphEdge, GraphNode } from "@/lib/engine/ideaToCanvas";

function toFlowNodes(nodes: GraphNode[]): Node[] {
  return nodes.map((n) => ({
    id: n.id,
    type: n.type in builderNodeTypes ? n.type : "default",
    position: n.position,
    data: { label: n.data?.label ?? n.type, nodeType: n.type },
  }));
}

function toFlowEdges(edges: GraphEdge[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
  }));
}

export function GraphPreview({
  nodes,
  edges,
  compact = false,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  compact?: boolean;
}) {
  const flowNodes = useMemo(() => toFlowNodes(nodes), [nodes]);
  const flowEdges = useMemo(() => toFlowEdges(edges), [edges]);

  if (nodes.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-resync-border text-sm text-zinc-500">
        Generate a workflow from your idea to preview the graph
      </div>
    );
  }

  if (compact && nodes.length > 12) {
    return <CircuitSvg nodes={nodes} edges={edges} />;
  }

  return (
    <div className={`rounded-xl border border-resync-border bg-resync-bg/50 ${compact ? "h-56" : "h-72"}`}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={builderNodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        preventScrolling
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} color="#1a1a28" />
      </ReactFlow>
    </div>
  );
}

function CircuitSvg({
  nodes,
  edges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}) {
  const width = 600;
  const height = 200;
  const xs = nodes.map((n) => n.position.x);
  const ys = nodes.map((n) => n.position.y);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 1);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 1);
  const scaleX = (x: number) => 40 + ((x - minX) / (maxX - minX || 1)) * (width - 80);
  const scaleY = (y: number) => 30 + ((y - minY) / (maxY - minY || 1)) * (height - 60);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full rounded-xl border border-resync-border bg-resync-bg/50">
      {edges.map((e) => {
        const s = nodeMap.get(e.source);
        const t = nodeMap.get(e.target);
        if (!s || !t) return null;
        return (
          <line
            key={e.id}
            x1={scaleX(s.position.x)}
            y1={scaleY(s.position.y)}
            x2={scaleX(t.position.x)}
            y2={scaleY(t.position.y)}
            stroke="#6366f1"
            strokeOpacity={0.4}
            strokeWidth={1.5}
          />
        );
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle
            cx={scaleX(n.position.x)}
            cy={scaleY(n.position.y)}
            r={8}
            fill="#6366f1"
            fillOpacity={0.3}
            stroke="#818cf8"
            strokeWidth={1}
          />
        </g>
      ))}
    </svg>
  );
}
