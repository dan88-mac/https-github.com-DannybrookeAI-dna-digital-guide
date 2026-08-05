import { getModule, MODULE_CATALOG } from "./moduleCatalog";

export type GraphScale = "small" | "large" | "monster";

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface IdeaGraphResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  scale: GraphScale;
  summary: string;
}

const X_SPACING = 220;
const Y_SPACING = 140;

type Domain =
  | "ecommerce"
  | "saas_onboarding"
  | "devops"
  | "content"
  | "multimodal"
  | "generic";

interface DomainBlueprint {
  domain: Domain;
  modules: string[];
  summary: string;
}

const DOMAIN_KEYWORDS: Record<Domain, string[]> = {
  ecommerce: [
    "shop", "store", "cart", "checkout", "order", "payment", "inventory",
    "product", "ecommerce", "e-commerce", "retail", "sku", "fulfillment",
  ],
  saas_onboarding: [
    "onboard", "signup", "sign-up", "trial", "welcome", "activation",
    "saas", "subscription", "user journey", "kyc", "provision",
  ],
  devops: [
    "deploy", "ci/cd", "pipeline", "incident", "monitor", "alert", "scale",
    "kubernetes", "docker", "infra", "devops", "sre", "uptime", "rollback",
  ],
  content: [
    "blog", "article", "content", "publish", "seo", "social", "newsletter",
    "copy", "write", "editorial", "cms", "markdown",
  ],
  multimodal: [
    "image", "vision", "photo", "video", "audio", "voice", "speech",
    "transcribe", "ocr", "multimodal", "picture", "listen", "speak",
  ],
  generic: [],
};

function detectDomains(idea: string): Domain[] {
  const lower = idea.toLowerCase();
  const detected: Domain[] = [];
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (domain === "generic") continue;
    if (keywords.some((kw) => lower.includes(kw))) {
      detected.push(domain as Domain);
    }
  }
  return detected.length > 0 ? detected : ["generic"];
}

function estimateScale(idea: string, domains: Domain[]): GraphScale {
  const words = idea.trim().split(/\s+/).length;
  const complexitySignals = [
    /\band\b/gi,
    /\bthen\b/gi,
    /\bif\b/gi,
    /\bwhen\b/gi,
    /\balso\b/gi,
    /\bmultiple\b/gi,
    /\bintegrate\b/gi,
    /\bautomate\b/gi,
  ];
  let signalCount = 0;
  for (const re of complexitySignals) {
    const matches = idea.match(re);
    signalCount += matches?.length ?? 0;
  }
  const domainBonus = domains.length > 2 ? 2 : domains.length;
  const score = words + signalCount * 3 + domainBonus * 5;

  if (score >= 60 || words >= 40) return "monster";
  if (score >= 25 || words >= 15) return "large";
  return "small";
}

function targetNodeCount(scale: GraphScale, idea: string): number {
  const hash = idea.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  switch (scale) {
    case "small":
      return 3;
    case "large":
      return 8 + (hash % 8);
    case "monster":
      return 25 + (hash % 26);
  }
}

function buildBlueprint(domains: Domain[]): DomainBlueprint {
  const modules: string[] = ["trigger"];

  if (domains.includes("ecommerce")) {
    modules.push(
      "commerce_checkout",
      "commerce_inventory",
      "commerce_pricing",
      "commerce_notify",
      "httpRequest",
      "condition",
      "transform",
      "integrate_email",
    );
  }
  if (domains.includes("saas_onboarding")) {
    modules.push(
      "trigger_webhook",
      "text",
      "humanApprove",
      "integrate_crm",
      "integrate_email",
      "data_store",
      "condition",
      "delay",
    );
  }
  if (domains.includes("devops")) {
    modules.push(
      "devops_monitor",
      "devops_alert",
      "devops_deploy",
      "devops_scale",
      "condition",
      "selfHeal",
      "webhookOut",
      "security_audit",
    );
  }
  if (domains.includes("content")) {
    modules.push(
      "text",
      "text_summarize",
      "text_classify",
      "human_review",
      "text_summarize",
      "integrate_slack",
      "delay",
    );
  }
  if (domains.includes("multimodal")) {
    modules.push(
      "vision",
      "vision_ocr",
      "voice",
      "voice_synthesize",
      "text",
      "text_extract",
      "transform",
    );
  }
  if (domains.includes("generic") || modules.length <= 1) {
    modules.push(
      "httpRequest",
      "transform",
      "condition",
      "text",
      "webhookOut",
      "data_store",
      "integrate",
    );
  }

  const unique = [...new Set(modules)];
  const domainLabels = domains.filter((d) => d !== "generic").join(", ") || "general automation";
  return {
    domain: domains[0],
    modules: unique,
    summary: `Workflow for ${domainLabels}: ${unique.length} module types selected`,
  };
}

function expandModules(blueprint: DomainBlueprint, count: number): string[] {
  const pool = blueprint.modules;
  const catalogPool = MODULE_CATALOG.map((m) => m.id);
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i < pool.length) {
      result.push(pool[i]);
    } else {
      const extraCategories = ["data", "security", "integrate", "transform", "http"];
      const candidates = catalogPool.filter((id) => {
        const mod = getModule(id);
        return mod && extraCategories.includes(mod.category);
      });
      result.push(candidates[i % candidates.length] ?? "transform");
    }
  }
  return result;
}

function layoutNodes(moduleIds: string[]): GraphNode[] {
  const cols = Math.ceil(Math.sqrt(moduleIds.length * 1.5));
  return moduleIds.map((typeId, index) => {
    const mod = getModule(typeId);
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      id: `node-${index + 1}`,
      type: typeId,
      position: { x: col * X_SPACING + 80, y: row * Y_SPACING + 60 },
      data: { ...mod?.defaultData, label: mod?.label ?? typeId, nodeType: typeId },
    };
  });
}

function buildLinearEdges(nodes: GraphNode[]): GraphEdge[] {
  const edges: GraphEdge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `edge-${i + 1}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
    });
  }
  return edges;
}

function addBranchingEdges(nodes: GraphNode[], scale: GraphScale): GraphEdge[] {
  const edges = buildLinearEdges(nodes);
  if (scale === "small") return edges;

  const conditionIdx = nodes.findIndex((n) =>
    n.type.startsWith("condition") || n.type === "condition",
  );
  if (conditionIdx >= 0 && conditionIdx < nodes.length - 1) {
    const condNode = nodes[conditionIdx];
    const branchTarget = nodes[Math.min(conditionIdx + 2, nodes.length - 1)];
  if (branchTarget.id !== nodes[conditionIdx + 1]?.id) {
      edges.push({
        id: `edge-branch-${conditionIdx}`,
        source: condNode.id,
        target: branchTarget.id,
        sourceHandle: "false",
      });
    }
  }

  if (scale === "monster" && nodes.length >= 10) {
    const mid = Math.floor(nodes.length / 2);
    for (let i = 0; i < 3 && mid + i + 2 < nodes.length; i++) {
      edges.push({
        id: `edge-parallel-${i}`,
        source: nodes[mid].id,
        target: nodes[mid + i + 2].id,
      });
    }
  }

  return edges;
}

function injectSelfHealOnFailurePaths(
  nodes: GraphNode[],
  edges: GraphEdge[],
  scale: GraphScale,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (scale === "small") return { nodes, edges };

  const httpIndices = nodes
    .map((n, i) => (n.type.startsWith("http") ? i : -1))
    .filter((i) => i >= 0);

  const newNodes = [...nodes];
  const newEdges = [...edges];
  let healCount = 0;

  for (const idx of httpIndices) {
    const healId = `node-heal-${healCount + 1}`;
    const sourceNode = nodes[idx];
    const nextNode = nodes[idx + 1];
    if (!nextNode) continue;

    const mod = getModule("selfHeal");
    const healNode: GraphNode = {
      id: healId,
      type: "selfHeal",
      position: {
        x: sourceNode.position.x + X_SPACING / 2,
        y: sourceNode.position.y + Y_SPACING,
      },
      data: { ...mod?.defaultData, label: "Self Heal", nodeType: "selfHeal" },
    };
    newNodes.push(healNode);

    const linearEdgeIdx = newEdges.findIndex(
      (e) => e.source === sourceNode.id && e.target === nextNode.id,
    );
    if (linearEdgeIdx >= 0) {
      newEdges[linearEdgeIdx] = {
        ...newEdges[linearEdgeIdx],
        sourceHandle: "success",
      };
      newEdges.push({
        id: `edge-heal-fail-${healCount + 1}`,
        source: sourceNode.id,
        target: healId,
        sourceHandle: "error",
      });
      newEdges.push({
        id: `edge-heal-recover-${healCount + 1}`,
        source: healId,
        target: nextNode.id,
      });
    }
    healCount++;
  }

  return { nodes: newNodes, edges: newEdges };
}

export function translateIdeaToGraph(idea: string): IdeaGraphResult {
  const trimmed = idea.trim();
  if (!trimmed) {
    const mod = getModule("trigger");
    return {
      nodes: [
        {
          id: "node-1",
          type: "trigger",
          position: { x: 80, y: 60 },
          data: { ...mod?.defaultData, label: "Manual Trigger", nodeType: "trigger" },
        },
      ],
      edges: [],
      scale: "small",
      summary: "Empty idea — default trigger node",
    };
  }

  const domains = detectDomains(trimmed);
  const scale = estimateScale(trimmed, domains);
  const blueprint = buildBlueprint(domains);
  const nodeCount = targetNodeCount(scale, trimmed);
  const moduleIds = expandModules(blueprint, nodeCount);
  let nodes = layoutNodes(moduleIds);
  let edges = addBranchingEdges(nodes, scale);
  const healed = injectSelfHealOnFailurePaths(nodes, edges, scale);
  nodes = healed.nodes;
  edges = healed.edges;

  const scaleLabel =
    scale === "small" ? "3-node starter" : scale === "large" ? "8–15 node workflow" : "25–50 node pipeline";

  return {
    nodes,
    edges,
    scale,
    summary: `${blueprint.summary}. Generated ${nodes.length} nodes (${scaleLabel}).`,
  };
}
