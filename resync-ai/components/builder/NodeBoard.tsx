"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { handleWorkerMessage } from "@/workers/nodeGraphLogic";
import { triggerHaptic } from "@/lib/mobile/nativePlugins";
import { ConsoleOutput } from "@/components/builder/ConsoleOutput";
import { CodeExportModal } from "@/components/builder/CodeExportModal";
import { builderNodeTypes } from "@/components/builder/nodeTypes";

const initialNodes: Node[] = [
  {
    id: "start",
    type: "httpRequest", // align with library union
    position: { x: 120, y: 120 },
    data: { label: "HTTP Request", nodeType: "httpRequest" },
  },
];

export function NodeBoard({ templateSlug }: { templateSlug?: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [showExport, setShowExport] = useState(false);
  const [validation, setValidation] = useState<string | null>(null);

  const nodeTypes = useMemo(() => builderNodeTypes, []);

  useEffect(() => {
    if (!templateSlug) return;
    setLogs((l) => [...l, `Loaded template: ${templateSlug}`]);
  }, [templateSlug]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
      void triggerHaptic("light");
    },
    [setEdges]
  );

  const validateGraph = useCallback(() => {
    const graph = {
      nodes: nodes.map((n) => ({ id: n.id })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    };
    const result = handleWorkerMessage({ type: "VALIDATE", graph });
    if (!result.ok) {
      setValidation(result.errors.join("; "));
      setLogs((l) => [...l, `Validation failed: ${result.errors.join(", ")}`]);
    } else {
      setValidation(null);
      const order = handleWorkerMessage({ type: "ORDER", graph });
      if (order.ok && order.order) {
        setLogs((l) => [...l, `Execution order: ${order.order?.join(" → ")}`]);
      }
    }
  }, [nodes, edges]);

  const addNode = () => {
    const id = `node-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "selfHeal",
        position: { x: 80 + nds.length * 40, y: 200 },
        data: { label: "Self-heal step", nodeType: "selfHeal" },
      },
    ]);
    void triggerHaptic("medium");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      <div className="glass relative flex-1 overflow-hidden rounded-2xl">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={16} color="#1a1a28" />
          <MiniMap pannable zoomable />
          <Controls />
        </ReactFlow>
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addNode}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white"
          >
            Add node
          </button>
          <button
            type="button"
            onClick={validateGraph}
            className="rounded-lg border border-resync-border px-3 py-1.5 text-xs text-white"
          >
            Validate
          </button>
          <button
            type="button"
            onClick={() => setShowExport(true)}
            className="rounded-lg border border-resync-border px-3 py-1.5 text-xs text-white"
          >
            Export code
          </button>
        </div>
        {validation && (
          <p className="absolute bottom-4 left-4 rounded-lg bg-red-950/80 px-3 py-2 text-xs text-red-200">
            {validation}
          </p>
        )}
      </div>
      <ConsoleOutput logs={logs} onClear={() => setLogs([])} />
      <CodeExportModal
        open={showExport}
        onClose={() => setShowExport(false)}
        slug="my-workflow"
        name="My Workflow"
        graph={{
          nodes: nodes.map((n) => ({
            id: n.id,
            type: (n.data as { nodeType?: string }).nodeType ?? "httpRequest",
            position: n.position,
            data: n.data as Record<string, unknown>,
          })),
          edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
        }}
      />
    </div>
  );
}
