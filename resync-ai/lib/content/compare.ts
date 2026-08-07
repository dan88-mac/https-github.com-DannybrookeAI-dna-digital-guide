export interface CompareColumn {
  name: string;
  highlight?: boolean;
}

export interface CompareRow {
  feature: string;
  values: (boolean | string)[];
}

export const COMPARE_COLUMNS: CompareColumn[] = [
  { name: "Resync AI", highlight: true },
  { name: "Generic iPaaS" },
  { name: "Code-only" },
];

export const COMPARE_ROWS: CompareRow[] = [
  { feature: "Visual multimodal canvas", values: [true, true, false] },
  { feature: "LLM self-healing runtime", values: [true, false, false] },
  { feature: "Circuit breakers & backoff", values: [true, "Partial", "DIY"] },
  { feature: "Generate workflow from a prompt", values: [true, false, false] },
  { feature: "Export production Next.js code", values: [true, false, "DIY"] },
  { feature: "Marketplace with payouts", values: [true, false, false] },
  { feature: "Refinement quality scoring", values: [true, false, false] },
  { feature: "Row-level multi-tenant security", values: [true, "Varies", "DIY"] },
  { feature: "Metered credits & tiers", values: [true, true, "DIY"] },
  { feature: "Offline edit queue (PWA)", values: [true, false, false] },
  { feature: "Human-in-the-loop approvals", values: [true, "Partial", "DIY"] },
  { feature: "Transparent telemetry & audit log", values: [true, "Partial", "DIY"] },
];

export const COMPARE_SUMMARY =
  "Generic iPaaS tools connect apps but leave resilience to you. Code-only stacks give control at the cost of everything you have to build and maintain. Resync AI combines a visual multimodal canvas with a self-healing runtime and production code export.";
