import type { GraphEdge, GraphNode, GraphScale } from "@/lib/engine/ideaToCanvas";

export interface StudioDesign {
  id: string;
  idea: string;
  scale: GraphScale;
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  summary: string;
  priceCents?: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "resync-studio-designs-v1";

function generateId(): string {
  return `design-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadStudioDesigns(): StudioDesign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StudioDesign[];
  } catch {
    return [];
  }
}

export function saveStudioDesign(design: StudioDesign): void {
  if (typeof window === "undefined") return;
  const existing = loadStudioDesigns();
  const idx = existing.findIndex((d) => d.id === design.id);
  if (idx >= 0) {
    existing[idx] = design;
  } else {
    existing.unshift(design);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 20)));
}

export function createStudioDesign(input: {
  idea: string;
  scale: GraphScale;
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  summary: string;
  priceCents?: number;
  id?: string;
}): StudioDesign {
  const now = new Date().toISOString();
  return {
    id: input.id ?? generateId(),
    idea: input.idea,
    scale: input.scale,
    graph: input.graph,
    summary: input.summary,
    priceCents: input.priceCents,
    createdAt: now,
    updatedAt: now,
  };
}

export function getStudioDesign(id: string): StudioDesign | null {
  return loadStudioDesigns().find((d) => d.id === id) ?? null;
}
