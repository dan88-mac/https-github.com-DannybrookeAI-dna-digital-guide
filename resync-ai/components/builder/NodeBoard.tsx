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
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { handleWorkerMessage } from "@/workers/nodeGraphLogic";
import { triggerHaptic } from "@/lib/mobile/nativePlugins";
import { CodeExportModal } from "@/components/builder/CodeExportModal";
import { builderNodeTypes } from "@/components/builder/nodeTypes";
import { IdeaPromptBar } from "@/components/builder/IdeaPromptBar";
import { ScaleSlider } from "@/components/builder/ScaleSlider";
import { ModulePalette } from "@/components/builder/ModulePalette";
import { NodeInspector } from "@/components/builder/NodeInspector";
import { RefinementPanel } from "@/components/builder/RefinementPanel";
import { DemoPlayground } from "@/components/builder/DemoPlayground";
import { translateIdeaToGraph, type GraphScale } from "@/lib/engine/ideaToCanvas";
import { getModule } from "@/lib/engine/moduleCatalog";
import { COMMUNITY_TEMPLATES } from "@/lib/community/content";
import { parseWorkflowNodeType } from "@/schemas/workflow";

const MAX_NODES = 50;
const DRAFT_KEY = "resync-workflow-draft";
const DEFAULT_IDEA =
  "Automate ecommerce checkout with inventory checks, payment processing, and order notifications";

type RightTab = "inspector" | "refinement" | "demo";

interface DraftPayload {
  idea: string;
  scale: GraphScale;
  nodes: Node[];
  edges: Edge[];
  summary?: string;
}

function graphToFlow(graph: {
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;
  }>;
  edges: Array<{ id: string; source: string; target: string; sourceHandle?: string; targetHandle?: string }>;
}): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = graph.nodes.slice(0, MAX_NODES).map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: { ...n.data, nodeType: n.type },
  }));
  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges: Edge[] = graph.edges
    .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
    .map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
    }));
  return { nodes, edges };
}

const initialFlow = graphToFlow({
  nodes: [
    {
      id: "node-1",
      type: "trigger",
      position: { x: 80, y: 120 },
      data: { label: "Manual Trigger", nodeType: "trigger" },
    },
  ],
  edges: [],
});

export function NodeBoard({ templateSlug }: { templateSlug?: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialFlow.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [idea, setIdea] = useState(DEFAULT_IDEA);
  const [scale, setScale] = useState<GraphScale>("small");
  const [summary, setSummary] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<RightTab>("inspector");
  const [showExport, setShowExport] = useState(false);
  const [validation, setValidation] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [demoTrigger, setDemoTrigger] = useState(0);

  const nodeTypes = useMemo(() => builderNodeTypes, []);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const applyGraph = useCallback(
    (nextNodes: Node[], nextEdges: Edge[], nextSummary?: string) => {
      setNodes(nextNodes.slice(0, MAX_NODES));
      setEdges(nextEdges);
      if (nextSummary) setSummary(nextSummary);
      setSelectedNodeId(null);
      setValidation(null);
    },
    [setNodes, setEdges],
  );

  useEffect(() => {
    if (templateSlug) {
      const tpl = COMMUNITY_TEMPLATES.find((t) => t.slug === templateSlug);
      if (tpl) {
        const flow = graphToFlow(tpl.graph);
        applyGraph(flow.nodes, flow.edges, `Loaded template: ${tpl.name}`);
        setIdea(tpl.description);
        return;
      }
    }

    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as DraftPayload;
        if (draft.nodes?.length) {
          applyGraph(draft.nodes, draft.edges ?? [], "Restored draft from local storage");
          if (draft.idea) setIdea(draft.idea);
          if (draft.scale) setScale(draft.scale);
        }
      }
    } catch {
      /* ignore corrupt draft */
    }
  }, [templateSlug, applyGraph]);

  const generateFromIdea = useCallback(
    (ideaText?: string, scaleOverride?: GraphScale) => {
      const text = (ideaText ?? idea).trim() || DEFAULT_IDEA;
      const result = translateIdeaToGraph(
        text,
        scaleOverride !== undefined ? { scale: scaleOverride } : undefined,
      );
      const flow = graphToFlow({ nodes: result.nodes, edges: result.edges });
      applyGraph(flow.nodes, flow.edges, result.summary);
      setScale(result.scale);
      void triggerHaptic("medium");
    },
    [idea, applyGraph],
  );

  const handleScaleChange = useCallback(
    (nextScale: GraphScale) => {
      setScale(nextScale);
      generateFromIdea(idea.trim() || DEFAULT_IDEA, nextScale);
    },
    [idea, generateFromIdea],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
      void triggerHaptic("light");
    },
    [setEdges],
  );

  const addModuleNode = useCallback(
    (moduleId: string) => {
      if (nodes.length >= MAX_NODES) return;
      const mod = getModule(moduleId);
      const id = `node-${Date.now()}`;
      setNodes((nds) => [
        ...nds,
        {
          id,
          type: moduleId,
          position: { x: 120 + (nds.length % 6) * 48, y: 80 + Math.floor(nds.length / 6) * 100 },
          data: {
            ...mod?.defaultData,
            label: mod?.label ?? moduleId,
            nodeType: moduleId,
          },
        },
      ]);
      void triggerHaptic("light");
    },
    [nodes.length, setNodes],
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...data, nodeType: data.nodeType ?? n.type } } : n)),
      );
    },
    [setNodes],
  );

  const validateGraph = useCallback(() => {
    const graph = {
      nodes: nodes.map((n) => ({ id: n.id })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    };
    const result = handleWorkerMessage({ type: "VALIDATE", graph });
    if (!result.ok) {
      setValidation(result.errors.join("; "));
    } else {
      setValidation(null);
      const order = handleWorkerMessage({ type: "ORDER", graph });
      if (order.ok && order.order) {
        setSummary(`Valid graph · execution order: ${order.order.length} steps`);
      }
    }
    void triggerHaptic("light");
  }, [nodes, edges]);

  const saveDraft = useCallback(() => {
    const payload: DraftPayload = { idea, scale, nodes, edges, summary: summary ?? undefined };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    setSaveToast("Draft saved");
    setTimeout(() => setSaveToast(null), 2000);
    void triggerHaptic("light");
  }, [idea, scale, nodes, edges, summary]);

  const runDemo = useCallback(() => {
    setRightTab("demo");
    setDemoTrigger((n) => n + 1);
    void triggerHaptic("medium");
  }, []);

  const workflowGraph = useMemo(
    () => ({
      nodes: nodes.map((n) => ({
        id: n.id,
        type: parseWorkflowNodeType((n.data as { nodeType?: string }).nodeType ?? n.type),
        position: n.position,
        data: n.data as Record<string, unknown>,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? undefined,
        targetHandle: e.targetHandle ?? undefined,
      })),
    }),
    [nodes, edges],
  );

  const tabs: { id: RightTab; label: string }[] = [
    { id: "inspector", label: "Inspector" },
    { id: "refinement", label: "Refinement" },
    { id: "demo", label: "Demo" },
  ];

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-3">
      <div className="flex flex-col gap-2">
        <IdeaPromptBar
          idea={idea}
          onIdeaChange={setIdea}
          onGenerate={() => generateFromIdea()}
          summary={summary}
        />
        <div className="flex flex-wrap items-center gap-2">
          <ScaleSlider value={scale} onChange={handleScaleChange} />
          <div className="flex flex-1 flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={validateGraph}
              className="rounded-lg border border-resync-border/80 bg-resync-surface/50 px-3 py-1.5 text-xs text-white backdrop-blur-md hover:bg-white/5"
            >
              Validate
            </button>
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-lg border border-resync-border/80 bg-resync-surface/50 px-3 py-1.5 text-xs text-white backdrop-blur-md hover:bg-white/5"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowExport(true)}
              className="rounded-lg border border-resync-border/80 bg-resync-surface/50 px-3 py-1.5 text-xs text-white backdrop-blur-md hover:bg-white/5"
            >
              Export
            </button>
            <button
              type="button"
              onClick={runDemo}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
            >
              Run demo
            </button>
          </div>
        </div>
        {(validation || saveToast) && (
          <div className="flex gap-2 text-xs">
            {validation && (
              <p className="rounded-lg bg-red-950/60 px-3 py-1.5 text-red-200">{validation}</p>
            )}
            {saveToast && (
              <p className="rounded-lg bg-emerald-950/60 px-3 py-1.5 text-emerald-300">{saveToast}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        <ModulePalette onAddModule={addModuleNode} nodeCount={nodes.length} maxNodes={MAX_NODES} />

        <div className="glass relative min-h-[320px] min-w-0 flex-1 overflow-hidden rounded-xl">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onSelectionChange={({ nodes: sel }) => {
              setSelectedNodeId(sel[0]?.id ?? null);
            }}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={20} color="#1a1a28" />
            <MiniMap
              pannable
              zoomable
              className="!bg-resync-surface/80 !backdrop-blur-md"
              nodeColor={(n) => {
                const t = (n.data as { nodeType?: string })?.nodeType ?? n.type;
                return getModule(t as string)?.color ?? "#6366f1";
              }}
            />
            <Controls className="!border-resync-border/80 !bg-resync-surface/80 !backdrop-blur-md [&>button]:!border-resync-border/60 [&>button]:!bg-resync-bg/80 [&>button]:!fill-zinc-300" />
          </ReactFlow>
        </div>

        <aside className="glass flex h-72 w-full shrink-0 flex-col overflow-hidden rounded-xl lg:h-auto lg:w-72 xl:w-80">
          <div className="flex border-b border-resync-border/80">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRightTab(tab.id)}
                className={`flex-1 px-2 py-2.5 text-[11px] font-medium transition-colors sm:text-xs ${
                  rightTab === tab.id
                    ? "border-b-2 border-indigo-500 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            {rightTab === "inspector" && (
              <NodeInspector node={selectedNode} onUpdate={updateNodeData} />
            )}
            {rightTab === "refinement" && <RefinementPanel nodes={nodes} edges={edges} />}
            {rightTab === "demo" && (
              <DemoPlayground nodes={nodes} edges={edges} runSignal={demoTrigger} />
            )}
          </div>
        </aside>
      </div>

      <CodeExportModal
        open={showExport}
        onClose={() => setShowExport(false)}
        slug="my-workflow"
        name="My Workflow"
        graph={workflowGraph}
      />
    </div>
  );
}
