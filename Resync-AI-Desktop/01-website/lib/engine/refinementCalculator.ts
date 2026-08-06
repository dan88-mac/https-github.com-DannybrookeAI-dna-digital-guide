import { isValidModuleId } from "./moduleCatalog";

export interface RefinementMetrics {
  nodeDiversity: number;
  connectivity: number;
  healCoverage: number;
  purposeFit: number;
  realWorldFixes: number;
}

export interface RefinementResult {
  score: number;
  grade: string;
  metrics: RefinementMetrics;
  recommendations: string[];
}

interface GraphInput {
  nodes: Array<{ id: string; type: string; data?: Record<string, unknown> }>;
  edges: Array<{ id: string; source: string; target: string; sourceHandle?: string }>;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function scoreToGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function computeNodeDiversity(graph: GraphInput): number {
  if (graph.nodes.length === 0) return 0;
  const types = new Set(graph.nodes.map((n) => n.type));
  const uniqueRatio = types.size / graph.nodes.length;
  const catalogBonus = graph.nodes.filter((n) => isValidModuleId(n.type)).length / graph.nodes.length;
  return clamp(uniqueRatio * 60 + catalogBonus * 40);
}

function computeConnectivity(graph: GraphInput): number {
  const nodeCount = graph.nodes.length;
  if (nodeCount <= 1) return nodeCount === 1 ? 50 : 0;

  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  const validEdges = graph.edges.filter(
    (e) => nodeIds.has(e.source) && nodeIds.has(e.target),
  );
  const edgeCount = validEdges.length;
  const minEdges = nodeCount - 1;
  const maxUsefulEdges = nodeCount * (nodeCount - 1);

  if (edgeCount < minEdges) {
    return clamp((edgeCount / minEdges) * 40);
  }

  const coverage = minEdges / edgeCount <= 1 ? edgeCount / minEdges : 1;
  const density = edgeCount / maxUsefulEdges;
  const idealDensity = 0.15;
  const densityScore = 1 - Math.abs(density - idealDensity) / idealDensity;

  const adjacency = new Map<string, Set<string>>();
  for (const n of graph.nodes) adjacency.set(n.id, new Set());
  for (const e of validEdges) {
    adjacency.get(e.source)?.add(e.target);
    adjacency.get(e.target)?.add(e.source);
  }
  const reachable = new Set<string>();
  const start = graph.nodes[0]?.id;
  if (start) {
    const queue = [start];
    while (queue.length > 0) {
      const cur = queue.shift()!;
      if (reachable.has(cur)) continue;
      reachable.add(cur);
      for (const next of adjacency.get(cur) ?? []) {
        if (!reachable.has(next)) queue.push(next);
      }
    }
  }
  const reachRatio = reachable.size / nodeCount;

  return clamp(coverage * 30 + densityScore * 30 + reachRatio * 40);
}

function computeHealCoverage(graph: GraphInput): number {
  const httpNodes = graph.nodes.filter((n) => n.type.startsWith("http"));
  const healNodes = graph.nodes.filter((n) => n.type.startsWith("selfHeal"));
  if (httpNodes.length === 0) {
    return healNodes.length > 0 ? 70 : 50;
  }

  const httpIds = new Set(httpNodes.map((n) => n.id));
  const healedHttp = new Set<string>();
  for (const e of graph.edges) {
    if (e.sourceHandle === "error" && httpIds.has(e.source)) {
      const targetNode = graph.nodes.find((n) => n.id === e.target);
      if (targetNode?.type.startsWith("selfHeal")) {
        healedHttp.add(e.source);
      }
    }
  }

  const directHealParents = new Set(
    graph.edges
      .filter((e) => {
        const target = graph.nodes.find((n) => n.id === e.target);
        return target?.type.startsWith("selfHeal");
      })
      .map((e) => e.source),
  );
  for (const id of directHealParents) {
    if (httpIds.has(id)) healedHttp.add(id);
  }

  const ratio = healedHttp.size / httpNodes.length;
  const healPresence = Math.min(healNodes.length / Math.max(httpNodes.length, 1), 1);
  return clamp(ratio * 70 + healPresence * 30);
}

function computePurposeFit(graph: GraphInput): number {
  if (graph.nodes.length === 0) return 0;

  const hasTrigger = graph.nodes.some((n) => n.type.startsWith("trigger"));
  const hasOutput = graph.nodes.some(
    (n) =>
      n.type.startsWith("webhook") ||
      n.type.startsWith("integrate") ||
      n.type.startsWith("commerce_notify") ||
      n.type === "data_store",
  );
  const hasTransform = graph.nodes.some((n) => n.type.startsWith("transform"));
  const hasCondition = graph.nodes.some((n) => n.type.startsWith("condition"));

  let score = 30;
  if (hasTrigger) score += 20;
  if (hasOutput) score += 20;
  if (hasTransform) score += 15;
  if (hasCondition) score += 15;

  const labeled = graph.nodes.filter((n) => {
    const label = n.data?.label;
    return typeof label === "string" && label.length > 0;
  });
  score += (labeled.length / graph.nodes.length) * 10;

  return clamp(score);
}

function computeRealWorldFixes(graph: GraphInput): { score: number; recommendations: string[] } {
  let score = 60;
  const recommendations: string[] = [];

  const duplicateIds = graph.nodes.length - new Set(graph.nodes.map((n) => n.id)).size;
  if (duplicateIds > 0) {
    score -= duplicateIds * 10;
    recommendations.push("Remove duplicate node IDs");
  }

  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  const danglingEdges = graph.edges.filter(
    (e) => !nodeIds.has(e.source) || !nodeIds.has(e.target),
  );
  if (danglingEdges.length > 0) {
    score -= danglingEdges.length * 5;
    recommendations.push("Fix edges referencing missing nodes");
  }

  const emptyLabels = graph.nodes.filter((n) => !n.data?.label);
  if (emptyLabels.length > graph.nodes.length * 0.3) {
    score -= 10;
    recommendations.push("Add labels to nodes for clarity");
  }

  const unknownTypes = graph.nodes.filter((n) => !isValidModuleId(n.type));
  if (unknownTypes.length > 0) {
    score -= unknownTypes.length * 3;
    recommendations.push("Replace unknown module types with catalog modules");
  }

  if (graph.nodes.length > 50) {
    score -= 15;
    recommendations.push("Graph exceeds 50 nodes — consider splitting into sub-workflows");
  }

  const isolated = graph.nodes.filter((n) => {
    const connected = graph.edges.some((e) => e.source === n.id || e.target === n.id);
    return !connected && graph.nodes.length > 1;
  });
  if (isolated.length > 0) {
    score -= isolated.length * 8;
    recommendations.push("Connect isolated nodes or remove unused nodes");
  }

  return { score: clamp(score), recommendations };
}

function buildRecommendations(
  metrics: RefinementMetrics,
  graph: GraphInput,
  existing: string[],
): string[] {
  const recs = [...existing];

  if (metrics.nodeDiversity < 50) {
    recs.push("Increase module variety — reuse of the same type limits flexibility");
  }
  if (metrics.connectivity < 60) {
    recs.push("Improve graph connectivity — ensure all nodes are reachable from the trigger");
  }
  if (metrics.healCoverage < 60) {
    const httpCount = graph.nodes.filter((n) => n.type.startsWith("http")).length;
    if (httpCount > 0) {
      recs.push("Add selfHeal nodes on HTTP failure paths for production resilience");
    }
  }
  if (metrics.purposeFit < 70) {
    if (!graph.nodes.some((n) => n.type.startsWith("trigger"))) {
      recs.push("Add a trigger node at the start of the workflow");
    }
    recs.push("Ensure the workflow has clear input (trigger) and output (webhook/integration) nodes");
  }
  if (!graph.nodes.some((n) => n.type.startsWith("human"))) {
    recs.push("Consider human-in-the-loop steps for high-stakes decisions");
  }

  return [...new Set(recs)];
}

export function calculateModelRefinement(graph: GraphInput): RefinementResult {
  const nodeDiversity = computeNodeDiversity(graph);
  const connectivity = computeConnectivity(graph);
  const healCoverage = computeHealCoverage(graph);
  const purposeFit = computePurposeFit(graph);

  const { score: realWorldFixes, recommendations: fixRecs } = computeRealWorldFixes(graph);

  const metrics: RefinementMetrics = {
    nodeDiversity,
    connectivity,
    healCoverage,
    purposeFit,
    realWorldFixes,
  };

  const weighted =
    nodeDiversity * 0.2 +
    connectivity * 0.25 +
    healCoverage * 0.25 +
    purposeFit * 0.2 +
    realWorldFixes * 0.1;

  const score = clamp(Math.round(weighted));
  const recommendations = buildRecommendations(metrics, graph, fixRecs);

  return {
    score,
    grade: scoreToGrade(score),
    metrics,
    recommendations,
  };
}
