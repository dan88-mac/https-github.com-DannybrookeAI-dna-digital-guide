export interface GlossaryTerm {
  term: string;
  definition: string;
  related?: string[];
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Self-healing",
    definition:
      "The runtime's ability to recover from a failed step by patching a schema, calling an allow-listed fallback, or aborting safely — driven by LLM tool calling under policy limits.",
    related: ["Circuit breaker", "Fallback endpoint"],
  },
  {
    term: "Refinement score",
    definition:
      "A 0–100 quality score for a workflow, weighing logic quality, completeness, efficiency, and best practices. Higher scores rank better in the marketplace.",
    related: ["Marketplace"],
  },
  {
    term: "Circuit breaker",
    definition:
      "A safeguard that stops calling a failing org+endpoint pair after repeated failures within a window, preventing cascading errors and wasted credits.",
    related: ["Self-healing"],
  },
  {
    term: "Fallback endpoint",
    definition:
      "An alternate URL the self-heal runtime may call when a primary step fails. In production these are allow-listed and private-IP ranges are blocked.",
    related: ["Self-healing"],
  },
  {
    term: "Node",
    definition:
      "A single unit of work on the canvas — an HTTP request, transform, condition, AI step, or integration. Nodes are wired together into a graph.",
    related: ["Graph", "Node reference"],
  },
  {
    term: "Graph",
    definition:
      "The directed set of nodes and edges that defines a workflow. The graph worker validates it (no cycles, no orphans) and computes execution order.",
    related: ["Node", "Topological sort"],
  },
  {
    term: "Topological sort",
    definition:
      "The ordering the graph worker computes so each node runs only after its dependencies — the backbone of deterministic execution.",
    related: ["Graph"],
  },
  {
    term: "Credit",
    definition:
      "The metered unit consumed by AI generations and self-heal attempts. Plans set a monthly credit limit tracked per organization.",
    related: ["Metered billing"],
  },
  {
    term: "Metered billing",
    definition:
      "Usage-based billing where credits are counted per organization and reset or scale with your subscription tier.",
    related: ["Credit"],
  },
  {
    term: "Multimodal",
    definition:
      "Working across data types — vision, text, and speech — within a single workflow, such as OCR → summarize → notify.",
    related: ["Node reference"],
  },
  {
    term: "Codegen export",
    definition:
      "Generating runnable Next.js artifacts (API route, hook, runner UI, env template, README) from a validated workflow graph.",
  },
  {
    term: "Telemetry",
    definition:
      "The structured trace of every execution step — level, message, and payload — persisted for dashboards, debugging, and audit.",
  },
  {
    term: "Row-level security (RLS)",
    definition:
      "Postgres policies that scope every row to an organization, guaranteeing one tenant can never read another's data.",
    related: ["Organization"],
  },
  {
    term: "Organization",
    definition:
      "The multi-tenant boundary. Members, workflows, usage, and billing all belong to an organization.",
    related: ["Row-level security (RLS)"],
  },
];

export function glossaryByLetter(): Record<string, GlossaryTerm[]> {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
  return sorted.reduce(
    (acc, t) => {
      const letter = t.term[0].toUpperCase();
      (acc[letter] ||= []).push(t);
      return acc;
    },
    {} as Record<string, GlossaryTerm[]>
  );
}
