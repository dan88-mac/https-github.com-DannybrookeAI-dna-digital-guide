export type WorkerMessage =
  | { type: "VALIDATE"; graph: GraphPayload }
  | { type: "ORDER"; graph: GraphPayload };

export type WorkerResponse =
  | { ok: true; order?: string[]; errors?: string[] }
  | { ok: false; errors: string[] };

export interface GraphPayload {
  nodes: { id: string }[];
  edges: { source: string; target: string }[];
}

function detectCycle(graph: GraphPayload): string | null {
  const adj = new Map<string, string[]>();
  for (const n of graph.nodes) adj.set(n.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function dfs(node: string): boolean {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const next of adj.get(node) ?? []) {
      if (dfs(next)) return true;
    }
    visiting.delete(node);
    visited.add(node);
    return false;
  }

  for (const n of graph.nodes) {
    if (dfs(n.id)) return `Cycle detected at node ${n.id}`;
  }
  return null;
}

function topologicalOrder(graph: GraphPayload): string[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of graph.nodes) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  }
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  }
  const queue = Array.from(inDegree.entries())
    .filter(([, d]) => d === 0)
    .map(([id]) => id);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const next of adj.get(id) ?? []) {
      const d = (inDegree.get(next) ?? 1) - 1;
      inDegree.set(next, d);
      if (d === 0) queue.push(next);
    }
  }
  return order.length === graph.nodes.length ? order : [];
}

export function handleWorkerMessage(msg: WorkerMessage): WorkerResponse {
  const graph = msg.graph;
  const errors: string[] = [];
  if (graph.nodes.length === 0) errors.push("Graph has no nodes");
  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  for (const e of graph.edges) {
    if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) {
      errors.push(`Edge references missing node: ${e.source} -> ${e.target}`);
    }
  }
  const cycle = detectCycle(graph);
  if (cycle) errors.push(cycle);

  if (msg.type === "VALIDATE") {
    return errors.length ? { ok: false, errors } : { ok: true, errors: [] };
  }

  if (errors.length) return { ok: false, errors };
  const order = topologicalOrder(graph);
  if (order.length !== graph.nodes.length) {
    return { ok: false, errors: ["Could not produce topological order"] };
  }
  return { ok: true, order };
}
