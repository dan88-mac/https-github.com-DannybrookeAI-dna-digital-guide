import { handleWorkerMessage } from "@/workers/nodeGraphLogic";
import { isValidModuleId, getModule } from "./moduleCatalog";
import { getRecommendedPairs } from "./modulePairing";

export interface OverviewGraphInput {
  nodes: Array<{ id: string; type: string; data?: Record<string, unknown> }>;
  edges: Array<{ id: string; source: string; target: string; sourceHandle?: string }>;
}

export interface OverviewBlueprint {
  title: string;
  sections: Array<{ heading: string; body: string }>;
  engineerNotes: string[];
}

export interface OverviewScoreResult {
  overall: number;
  grade: string;
  pillars: Record<string, number>;
  findings: string[];
  blueprint: OverviewBlueprint;
  eligible: boolean;
}

const MODALITY_PREFIXES = ["vision", "voice", "text"];
const OPS_MODULE_PREFIXES = ["trigger_schedule", "delay", "human", "devops", "security_audit"];
const SCHEDULE_OPS_IDS = new Set([
  "trigger_schedule",
  "delay",
  "humanApprove",
  "devops_deploy",
  "devops_scale",
  "devops_rollback",
  "security_audit",
]);

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function scoreToGrade(score: number): string {
  if (score >= 92) return "A+";
  if (score >= 85) return "A";
  if (score >= 78) return "B+";
  if (score >= 70) return "B";
  if (score >= 62) return "C+";
  if (score >= 55) return "C";
  if (score >= 45) return "D";
  return "F";
}

function computeStructuralIntegrity(graph: OverviewGraphInput): { score: number; findings: string[] } {
  const findings: string[] = [];
  if (graph.nodes.length === 0) {
    return { score: 0, findings: ["Graph has no nodes — cannot assess structural integrity"] };
  }

  const workerGraph = {
    nodes: graph.nodes.map((n) => ({ id: n.id })),
    edges: graph.edges.map((e) => ({ source: e.source, target: e.target })),
  };
  const validation = handleWorkerMessage({ type: "VALIDATE", graph: workerGraph });
  let score = 100;

  if (!validation.ok) {
    score -= validation.errors.length * 15;
    findings.push(...validation.errors.map((e) => `Structural: ${e}`));
  }

  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  const validEdges = graph.edges.filter(
    (e) => nodeIds.has(e.source) && nodeIds.has(e.target),
  );
  const nodeCount = graph.nodes.length;
  const minEdges = Math.max(nodeCount - 1, 0);
  if (validEdges.length < minEdges) {
    score -= 20;
    findings.push("Graph is disconnected — add edges to form a coherent pipeline");
  }

  const inDegree = new Map<string, number>();
  const outDegree = new Map<string, number>();
  for (const n of graph.nodes) {
    inDegree.set(n.id, 0);
    outDegree.set(n.id, 0);
  }
  for (const e of validEdges) {
    outDegree.set(e.source, (outDegree.get(e.source) ?? 0) + 1);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  }
  const triggers = graph.nodes.filter((n) => n.type.startsWith("trigger"));
  if (triggers.length > 0) {
    const badTriggers = triggers.filter((t) => (inDegree.get(t.id) ?? 0) > 0);
    if (badTriggers.length > 0) {
      score -= 10;
      findings.push("Trigger nodes should not have inbound edges");
    }
  }

  const isolated = graph.nodes.filter((n) => {
    const connected = validEdges.some((e) => e.source === n.id || e.target === n.id);
    return !connected && nodeCount > 1;
  });
  if (isolated.length > 0) {
    score -= isolated.length * 8;
    findings.push(`${isolated.length} isolated node(s) detected`);
  }

  return { score: clamp(score), findings };
}

function computeMultimodalCoverage(graph: OverviewGraphInput): { score: number; findings: string[] } {
  const findings: string[] = [];
  if (graph.nodes.length === 0) return { score: 0, findings: ["No modules to assess modality coverage"] };

  const modalitiesPresent = new Set<string>();
  for (const n of graph.nodes) {
    for (const prefix of MODALITY_PREFIXES) {
      if (n.type.startsWith(prefix)) modalitiesPresent.add(prefix);
    }
  }

  const coverageRatio = modalitiesPresent.size / MODALITY_PREFIXES.length;
  let score = coverageRatio * 70;

  const hasMultimodalChain = graph.edges.some((e) => {
    const src = graph.nodes.find((n) => n.id === e.source);
    const tgt = graph.nodes.find((n) => n.id === e.target);
    if (!src || !tgt) return false;
    const srcMod = MODALITY_PREFIXES.some((p) => src.type.startsWith(p));
    const tgtMod = MODALITY_PREFIXES.some((p) => tgt.type.startsWith(p));
    return srcMod && tgtMod && src.type.split("_")[0] !== tgt.type.split("_")[0];
  });
  if (hasMultimodalChain) score += 20;

  const hasOutput = graph.nodes.some(
    (n) =>
      n.type.startsWith("webhook") ||
      n.type.startsWith("integrate") ||
      n.type === "data_store",
  );
  if (hasOutput) score += 10;
  else findings.push("Add an output node (webhook, integration, or data store) for multimodal delivery");

  if (modalitiesPresent.size === 0) {
    findings.push("No vision, voice, or text modules — workflow is single-modality");
  } else if (modalitiesPresent.size === 1) {
    findings.push("Consider adding complementary modalities (vision + text, voice + summarize)");
  }

  return { score: clamp(score), findings };
}

function computeResilienceRatio(graph: OverviewGraphInput): { score: number; findings: string[] } {
  const findings: string[] = [];
  const httpNodes = graph.nodes.filter(
    (n) => n.type.startsWith("http") || n.type === "httpRequest",
  );
  const healNodes = graph.nodes.filter((n) => n.type.startsWith("selfHeal"));

  if (httpNodes.length === 0) {
    const base = healNodes.length > 0 ? 65 : 50;
    if (healNodes.length === 0) findings.push("No self-heal nodes — add resilience for production HTTP paths");
    return { score: base, findings };
  }

  const httpIds = new Set(httpNodes.map((n) => n.id));
  const healedHttp = new Set<string>();
  for (const e of graph.edges) {
    const target = graph.nodes.find((n) => n.id === e.target);
    if (httpIds.has(e.source) && target?.type.startsWith("selfHeal")) {
      healedHttp.add(e.source);
    }
    if (e.sourceHandle === "error" && httpIds.has(e.source) && target?.type.startsWith("selfHeal")) {
      healedHttp.add(e.source);
    }
  }

  const ratio = healedHttp.size / httpNodes.length;
  const healDensity = Math.min(healNodes.length / httpNodes.length, 1);
  const score = clamp(ratio * 65 + healDensity * 35);

  if (ratio < 0.5) {
    findings.push("Less than half of HTTP nodes have self-heal fallbacks");
  }
  if (healNodes.length === 0) {
    findings.push("Add selfHeal modules on failure paths for production resilience");
  }

  return { score, findings };
}

function computeLibraryGrounding(graph: OverviewGraphInput): { score: number; findings: string[] } {
  const findings: string[] = [];
  if (graph.nodes.length === 0) return { score: 0, findings: ["No modules to ground against libraries"] };

  let grounded = 0;
  const allLibraries = new Set<string>();

  for (const n of graph.nodes) {
    const mod = getModule(n.type);
    const catalogLibs = mod?.libraries ?? [];
    if (catalogLibs.length > 0) {
      grounded += 1;
      for (const lib of catalogLibs) allLibraries.add(lib);
    } else if (!isValidModuleId(n.type)) {
      findings.push(`Unknown module "${n.type}" — not grounded in catalog libraries`);
    }
  }

  const catalogRatio = grounded / graph.nodes.length;
  const diversityBonus = Math.min(allLibraries.size / 5, 1) * 20;
  const score = clamp(catalogRatio * 80 + diversityBonus);

  if (catalogRatio < 0.6) {
    findings.push("Many modules lack library grounding — use catalog modules with SDK bindings");
  }

  return { score, findings };
}

function computeScheduleOpsMaturity(graph: OverviewGraphInput): { score: number; findings: string[] } {
  const findings: string[] = [];
  if (graph.nodes.length === 0) return { score: 0, findings: ["Empty graph — no ops maturity to score"] };

  let score = 30;
  const hasSchedule = graph.nodes.some((n) => SCHEDULE_OPS_IDS.has(n.type) || n.type.startsWith("trigger_schedule"));
  const hasHumanLoop = graph.nodes.some((n) => n.type.startsWith("human"));
  const hasDevOps = graph.nodes.some((n) => n.type.startsWith("devops"));
  const hasSecurity = graph.nodes.some((n) => n.type.startsWith("security"));
  const hasDelay = graph.nodes.some((n) => n.type.startsWith("delay"));

  if (hasSchedule) score += 20;
  else findings.push("Add a schedule trigger or ops module for recurring workflows");

  if (hasHumanLoop) score += 15;
  if (hasDevOps) score += 15;
  if (hasSecurity) score += 10;
  if (hasDelay) score += 10;

  const labeledOps = graph.nodes.filter((n) => {
    if (!OPS_MODULE_PREFIXES.some((p) => n.type.startsWith(p))) return false;
    const label = n.data?.label;
    return typeof label === "string" && label.length > 2;
  });
  score += (labeledOps.length / Math.max(graph.nodes.length, 1)) * 10;

  return { score: clamp(score), findings };
}

function computeRealWorldReadiness(graph: OverviewGraphInput): { score: number; findings: string[] } {
  const findings: string[] = [];
  let score = 70;

  const duplicateIds = graph.nodes.length - new Set(graph.nodes.map((n) => n.id)).size;
  if (duplicateIds > 0) {
    score -= duplicateIds * 12;
    findings.push("Remove duplicate node IDs before production deploy");
  }

  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  const dangling = graph.edges.filter((e) => !nodeIds.has(e.source) || !nodeIds.has(e.target));
  if (dangling.length > 0) {
    score -= dangling.length * 8;
    findings.push("Fix edges referencing missing nodes");
  }

  const unknownTypes = graph.nodes.filter((n) => !isValidModuleId(n.type));
  if (unknownTypes.length > 0) {
    score -= unknownTypes.length * 5;
    findings.push(`${unknownTypes.length} node(s) use non-catalog module types`);
  }

  const emptyLabels = graph.nodes.filter((n) => !n.data?.label);
  if (emptyLabels.length > graph.nodes.length * 0.4) {
    score -= 12;
    findings.push("Label nodes for operator clarity in production runbooks");
  }

  if (graph.nodes.length > 50) {
    score -= 15;
    findings.push("Graph exceeds 50 nodes — split into sub-workflows for maintainability");
  }

  const hasTrigger = graph.nodes.some((n) => n.type.startsWith("trigger"));
  const hasOutput = graph.nodes.some(
    (n) =>
      n.type.startsWith("webhook") ||
      n.type.startsWith("integrate") ||
      n.type === "data_store",
  );
  if (!hasTrigger) {
    score -= 15;
    findings.push("Missing entry trigger — workflows need a defined start point");
  }
  if (!hasOutput) {
    score -= 10;
    findings.push("Missing terminal output — add webhook, integration, or storage node");
  }

  return { score: clamp(score), findings };
}

function computePairingCompliance(graph: OverviewGraphInput): { score: number; findings: string[] } {
  const findings: string[] = [];
  if (graph.nodes.length < 2) {
    return { score: 50, findings: ["Graph too small for pairing compliance analysis"] };
  }

  const edges = graph.edges.map((e) => {
    const src = graph.nodes.find((n) => n.id === e.source);
    const tgt = graph.nodes.find((n) => n.id === e.target);
    return { srcType: src?.type ?? "", tgtType: tgt?.type ?? "" };
  });

  let matched = 0;
  let applicable = 0;

  for (const n of graph.nodes) {
    const recommendations = getRecommendedPairs(n.type);
    if (recommendations.length === 0) continue;
    applicable += recommendations.length;
    for (const rec of recommendations) {
      const hasPair = edges.some(
        (e) => e.srcType === n.type && e.tgtType === rec.moduleId,
      );
      if (hasPair) matched += 1;
    }
  }

  const ratio = applicable > 0 ? matched / applicable : 0.5;
  const score = clamp(40 + ratio * 60);

  if (ratio < 0.35 && applicable > 3) {
    findings.push("Low pairing compliance — connect modules in recommended upstream→downstream order");
  }

  return { score, findings };
}

function buildBlueprint(
  pillars: Record<string, number>,
  findings: string[],
  overall: number,
): OverviewBlueprint {
  const weakest = Object.entries(pillars).sort((a, b) => a[1] - b[1])[0];
  const strongest = Object.entries(pillars).sort((a, b) => b[1] - a[1])[0];

  const sections: OverviewBlueprint["sections"] = [
    {
      heading: "Integrity summary",
      body: `This workflow scores ${overall}/100 on the Resync overview integrity index. The index combines structural graph science, multimodal coverage, resilience ratios, library grounding, and operational maturity into a single production-readiness signal.`,
    },
    {
      heading: "Strongest pillar",
      body: `${formatPillarName(strongest[0])} leads at ${Math.round(strongest[1])}/100. Preserve these patterns when extending the canvas.`,
    },
    {
      heading: "Priority improvement",
      body: `${formatPillarName(weakest[0])} scores ${Math.round(weakest[1])}/100 and is the primary drag on eligibility. Address findings below before marking this workflow production-eligible.`,
    },
  ];

  if (findings.length > 0) {
    sections.push({
      heading: "Engineer action items",
      body: findings.slice(0, 5).join(" · "),
    });
  }

  const engineerNotes = [
    "Overview integrity is advisory — validate with runtime telemetry before cutover.",
    "Re-score after each major graph change; scores below 65 are not marketplace-eligible.",
    pillars.resilience < 60
      ? "Wire selfHeal on HTTP error handles before enabling auto-remediation in prod."
      : "Resilience ratio meets baseline — consider chaos testing for edge cases.",
    pillars.structuralIntegrity < 70
      ? "Run Validate in the builder to fix cycles and dangling edges."
      : "Graph topology passes acyclic validation.",
  ];

  return {
    title: overall >= 75 ? "Production-ready blueprint" : "Pre-production refinement blueprint",
    sections,
    engineerNotes,
  };
}

function formatPillarName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

const PILLAR_WEIGHTS: Record<string, number> = {
  structuralIntegrity: 0.2,
  multimodalCoverage: 0.15,
  resilience: 0.2,
  libraryGrounding: 0.1,
  scheduleOpsMaturity: 0.1,
  realWorldReadiness: 0.15,
  pairingCompliance: 0.1,
};

export function computeOverviewScore(graph: OverviewGraphInput): OverviewScoreResult {
  const structural = computeStructuralIntegrity(graph);
  const multimodal = computeMultimodalCoverage(graph);
  const resilience = computeResilienceRatio(graph);
  const libraries = computeLibraryGrounding(graph);
  const scheduleOps = computeScheduleOpsMaturity(graph);
  const realWorld = computeRealWorldReadiness(graph);
  const pairing = computePairingCompliance(graph);

  const pillars: Record<string, number> = {
    structuralIntegrity: structural.score,
    multimodalCoverage: multimodal.score,
    resilience: resilience.score,
    libraryGrounding: libraries.score,
    scheduleOpsMaturity: scheduleOps.score,
    realWorldReadiness: realWorld.score,
    pairingCompliance: pairing.score,
  };

  const overall = clamp(
    Math.round(
      Object.entries(pillars).reduce((sum, [key, val]) => sum + val * (PILLAR_WEIGHTS[key] ?? 0), 0),
    ),
  );

  const findings = [
    ...structural.findings,
    ...multimodal.findings,
    ...resilience.findings,
    ...libraries.findings,
    ...scheduleOps.findings,
    ...realWorld.findings,
    ...pairing.findings,
  ];
  const uniqueFindings = [...new Set(findings)];

  const eligible =
    overall >= 65 &&
    pillars.structuralIntegrity >= 60 &&
    pillars.realWorldReadiness >= 55 &&
    graph.nodes.length >= 2;

  return {
    overall,
    grade: scoreToGrade(overall),
    pillars,
    findings: uniqueFindings,
    blueprint: buildBlueprint(pillars, uniqueFindings, overall),
    eligible,
  };
}
