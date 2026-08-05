import { getModule, MODULE_CATALOG, type WorkflowModule } from "./moduleCatalog";

export interface PairRecommendation {
  moduleId: string;
  label: string;
  reason: string;
  ratio?: number;
}

/** Suggested upstream/downstream pairings keyed by module id. */
const PAIRING_GRAPH: Record<string, Array<{ moduleId: string; reason: string; ratio?: number }>> = {
  trigger: [
    { moduleId: "httpRequest", reason: "Fetch data after manual start", ratio: 0.72 },
    { moduleId: "text", reason: "Generate content from a prompt", ratio: 0.68 },
    { moduleId: "vision", reason: "Analyze uploaded images", ratio: 0.61 },
  ],
  trigger_webhook: [
    { moduleId: "transform", reason: "Normalize inbound webhook payload", ratio: 0.78 },
    { moduleId: "condition", reason: "Branch on webhook fields", ratio: 0.65 },
    { moduleId: "webhookOut", reason: "Acknowledge with outbound callback", ratio: 0.55 },
  ],
  trigger_schedule: [
    { moduleId: "data_query", reason: "Poll warehouse on interval", ratio: 0.74 },
    { moduleId: "devops_monitor", reason: "Scheduled health checks", ratio: 0.7 },
    { moduleId: "commerce_inventory", reason: "Nightly stock reconciliation", ratio: 0.62 },
  ],
  vision: [
    { moduleId: "text", reason: "Summarize visual findings", ratio: 0.81 },
    { moduleId: "condition", reason: "Route by detection confidence", ratio: 0.67 },
    { moduleId: "data_store", reason: "Persist extracted metadata", ratio: 0.58 },
  ],
  vision_ocr: [
    { moduleId: "text_extract", reason: "Pull entities from OCR text", ratio: 0.85 },
    { moduleId: "transform", reason: "Map OCR fields to schema", ratio: 0.72 },
  ],
  voice: [
    { moduleId: "text_translate", reason: "Translate transcript", ratio: 0.7 },
    { moduleId: "text_summarize", reason: "Condense long transcripts", ratio: 0.66 },
    { moduleId: "integrate_slack", reason: "Post transcript to channel", ratio: 0.54 },
  ],
  voice_synthesize: [
    { moduleId: "text", reason: "Generate script before TTS", ratio: 0.79 },
    { moduleId: "webhookOut", reason: "Deliver audio URL downstream", ratio: 0.52 },
  ],
  text: [
    { moduleId: "condition", reason: "Branch on model output", ratio: 0.71 },
    { moduleId: "transform", reason: "Shape JSON from LLM response", ratio: 0.69 },
    { moduleId: "humanApprove", reason: "Human review for sensitive copy", ratio: 0.48 },
  ],
  httpRequest: [
    { moduleId: "selfHeal", reason: "Recover from flaky APIs", ratio: 0.76 },
    { moduleId: "transform", reason: "Map API response fields", ratio: 0.73 },
    { moduleId: "condition", reason: "Handle status codes", ratio: 0.68 },
  ],
  transform: [
    { moduleId: "data_store", reason: "Write transformed records", ratio: 0.7 },
    { moduleId: "webhookOut", reason: "Forward shaped payload", ratio: 0.62 },
  ],
  condition: [
    { moduleId: "humanApprove", reason: "Escalate edge cases", ratio: 0.55 },
    { moduleId: "devops_alert", reason: "Alert on failure branch", ratio: 0.51 },
  ],
  selfHeal: [
    { moduleId: "httpRequest", reason: "Retry healed request", ratio: 0.82 },
    { moduleId: "devops_alert", reason: "Notify if healing fails", ratio: 0.45 },
  ],
  commerce_checkout: [
    { moduleId: "commerce_inventory", reason: "Verify stock before charge", ratio: 0.88 },
    { moduleId: "commerce_notify", reason: "Send order confirmation", ratio: 0.8 },
    { moduleId: "integrate_crm", reason: "Sync customer record", ratio: 0.65 },
  ],
  data_query: [
    { moduleId: "transform", reason: "Normalize query rows", ratio: 0.75 },
    { moduleId: "text_summarize", reason: "Narrate query insights", ratio: 0.58 },
  ],
  integrate_slack: [
    { moduleId: "text", reason: "Draft message content", ratio: 0.64 },
    { moduleId: "humanApprove", reason: "Approve before posting", ratio: 0.52 },
  ],
};

/** Canvas layout hints keyed by module id. */
const RATIO_HINTS: Record<string, string[]> = {
  trigger: ["Place triggers at the left edge of the canvas", "One trigger per workflow branch"],
  vision: ["Pair with text nodes for multimodal reasoning chains", "Keep vision nodes upstream of storage"],
  voice: ["Connect microphone/webhook input before transcribe nodes", "Use synthesize downstream of text generation"],
  text: ["LLM nodes work well after data-fetch or vision steps", "Add human approval for customer-facing output"],
  httpRequest: ["Follow with self-heal for production resilience", "Place before transform nodes"],
  commerce_checkout: ["Inventory check should precede checkout", "Notify after successful payment"],
  selfHeal: ["Insert between HTTP request and downstream logic", "Set maxAttempts based on SLA"],
  condition: ["Use switch for 3+ branches; condition for binary paths", "Place after nodes that emit scorable output"],
};

/** Tag-based fallback when explicit pairings are missing. */
function pairsFromTags(mod: WorkflowModule): PairRecommendation[] {
  if (!mod.pairingTags?.length) return [];
  const tagSet = new Set(mod.pairingTags);
  const hits: PairRecommendation[] = [];

  for (const candidate of MODULE_CATALOG) {
    if (candidate.id === mod.id) continue;
    const overlap = candidate.pairingTags?.filter((t) => tagSet.has(t)) ?? [];
    if (overlap.length === 0) continue;
    hits.push({
      moduleId: candidate.id,
      label: candidate.label,
      reason: `Shared tags: ${overlap.join(", ")}`,
      ratio: Math.min(0.95, 0.4 + overlap.length * 0.15),
    });
  }

  return hits.sort((a, b) => (b.ratio ?? 0) - (a.ratio ?? 0)).slice(0, 4);
}

export function getRecommendedPairs(moduleId: string): PairRecommendation[] {
  const mod = getModule(moduleId);
  if (!mod) return [];

  const explicit = PAIRING_GRAPH[moduleId] ?? [];
  const fromExplicit: PairRecommendation[] = [];
  for (const p of explicit) {
    const target = getModule(p.moduleId);
    if (!target) continue;
    const rec: PairRecommendation = {
      moduleId: p.moduleId,
      label: target.label,
      reason: p.reason,
    };
    if (typeof p.ratio === "number") {
      rec.ratio = p.ratio;
    }
    fromExplicit.push(rec);
  }

  if (fromExplicit.length > 0) return fromExplicit;
  return pairsFromTags(mod);
}

export function getRatioHints(moduleId: string): string[] {
  const mod = getModule(moduleId);
  const hints = [...(RATIO_HINTS[moduleId] ?? [])];
  if (mod?.category === "trigger") {
    hints.push("Triggers should have no inbound edges");
  }
  if (mod?.scheduleCapable) {
    hints.push("Schedule-capable modules can anchor cron-driven workflows");
  }
  return hints;
}

export function getAllLibraries(): string[] {
  const libs = new Set<string>();
  for (const mod of MODULE_CATALOG) {
    for (const lib of mod.libraries ?? []) {
      libs.add(lib);
    }
  }
  return Array.from(libs).sort();
}

/** Category adjacency for interconnection suggestions across hundreds of modules. */
export type LinkType = "data" | "control" | "fallback" | "schedule";

const CATEGORY_LINKS: Record<string, Array<{ category: string; linkType: LinkType; note: string }>> = {
  trigger: [
    { category: "http", linkType: "data", note: "Fetch after start" },
    { category: "vision", linkType: "data", note: "Ingest media" },
    { category: "schedule", linkType: "schedule", note: "Time-box runs" },
  ],
  vision: [
    { category: "text", linkType: "data", note: "Reason over detections" },
    { category: "ml", linkType: "data", note: "Embed or classify" },
    { category: "storage", linkType: "data", note: "Persist assets" },
  ],
  voice: [
    { category: "text", linkType: "data", note: "Process transcripts" },
    { category: "notify", linkType: "control", note: "Alert on keywords" },
  ],
  text: [
    { category: "agent", linkType: "control", note: "Tool-call loop" },
    { category: "condition", linkType: "control", note: "Branch on output" },
    { category: "human", linkType: "control", note: "Approve sensitive copy" },
  ],
  http: [
    { category: "selfHeal", linkType: "fallback", note: "Recover flaky APIs" },
    { category: "transform", linkType: "data", note: "Shape responses" },
  ],
  library: [
    { category: "ml", linkType: "data", note: "Wire SDK into ML steps" },
    { category: "agent", linkType: "control", note: "Expose as agent tool" },
  ],
  schedule: [
    { category: "data", linkType: "schedule", note: "Poll warehouses" },
    { category: "devops", linkType: "schedule", note: "Health checks" },
  ],
  commerce: [
    { category: "notify", linkType: "control", note: "Order confirmations" },
    { category: "integrate", linkType: "data", note: "CRM / ERP sync" },
  ],
  selfHeal: [
    { category: "http", linkType: "fallback", note: "Retry healed call" },
    { category: "notify", linkType: "control", note: "Escalate failures" },
  ],
};

export function suggestLinks(
  sourceId: string,
  targetId: string,
): { allowed: boolean; linkType: LinkType; note: string } {
  const source = getModule(sourceId);
  const target = getModule(targetId);
  if (!source || !target) {
    return { allowed: false, linkType: "data", note: "Unknown module id" };
  }
  if (sourceId === targetId) {
    return { allowed: false, linkType: "control", note: "Cannot link a module to itself" };
  }
  if (target.category === "trigger") {
    return { allowed: false, linkType: "control", note: "Triggers cannot accept inbound edges" };
  }

  const rule = (CATEGORY_LINKS[source.category] ?? []).find((r) => r.category === target.category);
  if (rule) return { allowed: true, linkType: rule.linkType, note: rule.note };

  const tagOverlap =
    source.pairingTags?.filter((t) => target.pairingTags?.includes(t)).length ?? 0;
  if (tagOverlap > 0) {
    return {
      allowed: true,
      linkType: "data",
      note: `Compatible via shared tags (${tagOverlap})`,
    };
  }

  return {
    allowed: true,
    linkType: "data",
    note: "Generic data edge — validate schemas in the inspector",
  };
}

export function autoWireHints(
  selectedIds: string[],
): Array<{ source: string; target: string; reason: string }> {
  const hints: Array<{ source: string; target: string; reason: string }> = [];
  const unique = [...new Set(selectedIds)].filter((id) => getModule(id));

  for (const sourceId of unique) {
    const recs = getRecommendedPairs(sourceId).slice(0, 2);
    for (const rec of recs) {
      if (!unique.includes(rec.moduleId)) continue;
      const link = suggestLinks(sourceId, rec.moduleId);
      if (!link.allowed) continue;
      hints.push({
        source: sourceId,
        target: rec.moduleId,
        reason: `${rec.reason} (${link.linkType})`,
      });
    }
  }

  return hints.slice(0, 24);
}

/** Category → starter modules for interconnection browsing. */
export function getCategoryBridge(category: string): PairRecommendation[] {
  const mods = MODULE_CATALOG.filter((m) => m.category === category).slice(0, 6);
  return mods.map((m, i) => ({
    moduleId: m.id,
    label: m.label,
    reason: m.purpose || m.description,
    ratio: Math.max(0.4, 0.9 - i * 0.08),
  }));
}
