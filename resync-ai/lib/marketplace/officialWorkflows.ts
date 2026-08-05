import type { WorkflowGraph } from "@/schemas/workflow";

export type WorkflowAccess = "free" | "subscription" | "paid";

export interface OfficialWorkflow {
  id: string;
  title: string;
  slug: string;
  description: string;
  detail: string;
  access: WorkflowAccess;
  priceCents?: number;
  tags: string[];
  testedBadge: true;
  qualityScore: number;
  graph: WorkflowGraph;
}

function g(
  nodes: Array<{ id: string; type: string; x: number; y: number; label: string }>,
  edges: Array<{ id: string; source: string; target: string; sourceHandle?: string }>,
): WorkflowGraph {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: { x: n.x, y: n.y },
      data: { label: n.label, nodeType: n.type },
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
    })),
  };
}

export const OFFICIAL_WORKFLOWS: OfficialWorkflow[] = [
  {
    id: "ow-checkout-heal",
    title: "E-commerce checkout with self-heal",
    slug: "checkout-self-heal",
    description: "Inventory check, payment retry, and order notification with automatic schema patching.",
    detail:
      "Official a-sync tested workflow for DTC checkout flows. Handles missing shipping fields, retries failed payment webhooks, and notifies ops on unrecoverable errors.",
    access: "free",
    tags: ["commerce", "self-heal", "starter"],
    testedBadge: true,
    qualityScore: 94,
    graph: g(
      [
        { id: "1", type: "trigger_webhook", x: 0, y: 80, label: "Checkout webhook" },
        { id: "2", type: "httpRequest", x: 220, y: 80, label: "Payment API" },
        { id: "3", type: "selfHeal", x: 440, y: 80, label: "Schema patch" },
        { id: "4", type: "integrate_slack", x: 660, y: 80, label: "Notify ops" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3", sourceHandle: "error" },
        { id: "e3", source: "3", target: "4" },
      ],
    ),
  },
  {
    id: "ow-saas-onboard",
    title: "SaaS user onboarding pipeline",
    slug: "saas-onboarding-pipeline",
    description: "Validate signups, sync CRM, and send welcome email with human approval gate.",
    detail:
      "End-to-end onboarding from webhook trigger through CRM sync and transactional email. Includes human-in-the-loop for enterprise accounts.",
    access: "free",
    tags: ["growth", "crm", "email"],
    testedBadge: true,
    qualityScore: 91,
    graph: g(
      [
        { id: "1", type: "trigger_webhook", x: 0, y: 0, label: "Signup webhook" },
        { id: "2", type: "data_validate", x: 200, y: 0, label: "Validate profile" },
        { id: "3", type: "integrate_crm", x: 400, y: 0, label: "CRM sync" },
        { id: "4", type: "integrate_email", x: 600, y: 0, label: "Welcome email" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "4" },
      ],
    ),
  },
  {
    id: "ow-incident-response",
    title: "Incident auto-remediation",
    slug: "incident-auto-remediation",
    description: "Pager alert → health probe → self-heal restart → Slack escalation.",
    detail:
      "Battle-tested DevOps workflow for on-call teams. Probes downstream health, attempts automated restart, and escalates to Slack when healing fails.",
    access: "subscription",
    tags: ["devops", "incident", "slack"],
    testedBadge: true,
    qualityScore: 96,
    graph: g(
      [
        { id: "1", type: "trigger_webhook", x: 0, y: 100, label: "Pager alert" },
        { id: "2", type: "httpRequest", x: 220, y: 100, label: "Health probe" },
        { id: "3", type: "selfHeal", x: 440, y: 100, label: "Restart policy" },
        { id: "4", type: "integrate_slack", x: 660, y: 100, label: "Escalate" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3", sourceHandle: "error" },
        { id: "e3", source: "3", target: "4" },
      ],
    ),
  },
  {
    id: "ow-vision-intake",
    title: "Vision document intake",
    slug: "vision-document-intake",
    description: "OCR receipts and invoices, summarize, and store in database.",
    detail:
      "Multimodal intake pipeline: vision OCR extracts text, LLM summarizes key fields, and data store persists structured records.",
    access: "subscription",
    tags: ["vision", "ocr", "multimodal"],
    testedBadge: true,
    qualityScore: 93,
    graph: g(
      [
        { id: "1", type: "trigger", x: 0, y: 60, label: "Upload trigger" },
        { id: "2", type: "vision_ocr", x: 200, y: 60, label: "OCR extract" },
        { id: "3", type: "text_summarize", x: 400, y: 60, label: "Summarize" },
        { id: "4", type: "data_store", x: 600, y: 60, label: "Persist" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "4" },
      ],
    ),
  },
  {
    id: "ow-voice-support",
    title: "Voice support triage",
    slug: "voice-support-triage",
    description: "Transcribe support calls, classify intent, route to human or auto-reply.",
    detail:
      "Voice → text → condition branching with human approval for escalations. Ideal for support teams scaling async triage.",
    access: "subscription",
    tags: ["voice", "support", "human-loop"],
    testedBadge: true,
    qualityScore: 90,
    graph: g(
      [
        { id: "1", type: "trigger_webhook", x: 0, y: 80, label: "Call recording" },
        { id: "2", type: "voice", x: 200, y: 80, label: "Transcribe" },
        { id: "3", type: "text_classify", x: 400, y: 80, label: "Classify intent" },
        { id: "4", type: "humanApprove", x: 600, y: 40, label: "Human review" },
        { id: "5", type: "integrate_email", x: 600, y: 120, label: "Auto-reply" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "4" },
        { id: "e4", source: "3", target: "5" },
      ],
    ),
  },
  {
    id: "ow-scheduled-report",
    title: "Scheduled analytics report",
    slug: "scheduled-analytics-report",
    description: "Cron-triggered data query, transform, and email digest to stakeholders.",
    detail:
      "Ops-mature workflow with schedule trigger, database query, transform aggregation, and email delivery. Includes delay for rate limiting.",
    access: "subscription",
    tags: ["schedule", "analytics", "email"],
    testedBadge: true,
    qualityScore: 88,
    graph: g(
      [
        { id: "1", type: "trigger_schedule", x: 0, y: 80, label: "Daily cron" },
        { id: "2", type: "data_query", x: 200, y: 80, label: "Query metrics" },
        { id: "3", type: "transform", x: 400, y: 80, label: "Aggregate" },
        { id: "4", type: "delay", x: 500, y: 80, label: "Rate limit" },
        { id: "5", type: "integrate_email", x: 650, y: 80, label: "Send digest" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "4" },
        { id: "e4", source: "4", target: "5" },
      ],
    ),
  },
  {
    id: "ow-security-scan",
    title: "Security scan pipeline",
    slug: "security-scan-pipeline",
    description: "Scan inbound payloads, encrypt PII, and write audit log entries.",
    detail:
      "Security-first workflow for regulated industries. Scans for XSS/injection, encrypts sensitive fields, and maintains immutable audit trail.",
    access: "paid",
    priceCents: 2900,
    tags: ["security", "compliance", "enterprise"],
    testedBadge: true,
    qualityScore: 97,
    graph: g(
      [
        { id: "1", type: "trigger_webhook", x: 0, y: 80, label: "Inbound API" },
        { id: "2", type: "security_scan", x: 200, y: 80, label: "Vuln scan" },
        { id: "3", type: "security_encrypt", x: 400, y: 80, label: "Encrypt PII" },
        { id: "4", type: "security_audit", x: 600, y: 80, label: "Audit log" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "4" },
      ],
    ),
  },
  {
    id: "ow-k8s-deploy",
    title: "Kubernetes deploy & scale",
    slug: "k8s-deploy-scale",
    description: "CI webhook triggers deploy, health check, and auto-scale policy.",
    detail:
      "Premium DevOps workflow for platform teams. Deploys to Kubernetes, validates health, and applies HPA scale rules with self-heal on failure.",
    access: "paid",
    priceCents: 4900,
    tags: ["devops", "kubernetes", "scale"],
    testedBadge: true,
    qualityScore: 95,
    graph: g(
      [
        { id: "1", type: "trigger_webhook", x: 0, y: 80, label: "CI webhook" },
        { id: "2", type: "devops_deploy", x: 200, y: 80, label: "Deploy" },
        { id: "3", type: "httpRequest", x: 400, y: 80, label: "Health check" },
        { id: "4", type: "selfHeal", x: 500, y: 140, label: "Rollback heal" },
        { id: "5", type: "devops_scale", x: 600, y: 80, label: "Auto-scale" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "5" },
        { id: "e4", source: "3", target: "4", sourceHandle: "error" },
      ],
    ),
  },
  {
    id: "ow-multimodal-rag",
    title: "Multimodal RAG assistant",
    slug: "multimodal-rag-assistant",
    description: "Vision + text pipeline for document Q&A with Slack delivery.",
    detail:
      "Advanced multimodal workflow combining vision analysis, text generation, and Slack integration for internal knowledge assistants.",
    access: "paid",
    priceCents: 3900,
    tags: ["multimodal", "rag", "ai"],
    testedBadge: true,
    qualityScore: 92,
    graph: g(
      [
        { id: "1", type: "trigger", x: 0, y: 80, label: "User query" },
        { id: "2", type: "vision", x: 200, y: 40, label: "Analyze doc" },
        { id: "3", type: "text", x: 400, y: 80, label: "Generate answer" },
        { id: "4", type: "integrate_slack", x: 600, y: 80, label: "Post to Slack" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "4" },
      ],
    ),
  },
  {
    id: "ow-lead-enrich",
    title: "Lead enrichment & routing",
    slug: "lead-enrichment-routing",
    description: "Enrich inbound leads via API, score, and route to CRM owners.",
    detail:
      "Growth workflow for sales teams. Enriches lead data from third-party APIs, scores fit, and routes to the right CRM owner with Slack notification.",
    access: "free",
    tags: ["growth", "crm", "enrichment"],
    testedBadge: true,
    qualityScore: 87,
    graph: g(
      [
        { id: "1", type: "trigger_webhook", x: 0, y: 80, label: "Form submit" },
        { id: "2", type: "httpRequest", x: 200, y: 80, label: "Enrich API" },
        { id: "3", type: "transform", x: 400, y: 80, label: "Score lead" },
        { id: "4", type: "integrate_crm", x: 600, y: 80, label: "Route to CRM" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "4" },
      ],
    ),
  },
  {
    id: "ow-inventory-sync",
    title: "Inventory sync with heal",
    slug: "inventory-sync-heal",
    description: "Sync warehouse inventory across channels with self-healing retries.",
    detail:
      "Commerce ops workflow for multi-channel sellers. Pulls inventory, transforms to channel format, and self-heals on API rate limits.",
    access: "subscription",
    tags: ["commerce", "inventory", "sync"],
    testedBadge: true,
    qualityScore: 89,
    graph: g(
      [
        { id: "1", type: "trigger_schedule", x: 0, y: 80, label: "Hourly sync" },
        { id: "2", type: "httpRequest", x: 200, y: 80, label: "Warehouse API" },
        { id: "3", type: "transform", x: 400, y: 80, label: "Channel format" },
        { id: "4", type: "selfHeal", x: 500, y: 140, label: "Rate-limit heal" },
        { id: "5", type: "httpRequest", x: 600, y: 80, label: "Push channels" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "5" },
        { id: "e4", source: "5", target: "4", sourceHandle: "error" },
      ],
    ),
  },
  {
    id: "ow-compliance-review",
    title: "Compliance document review",
    slug: "compliance-document-review",
    description: "OCR legal docs, human approval, encrypted storage, and audit trail.",
    detail:
      "Enterprise compliance workflow for legal and finance teams. Full human-in-the-loop with encryption and audit logging.",
    access: "paid",
    priceCents: 5900,
    tags: ["compliance", "legal", "enterprise"],
    testedBadge: true,
    qualityScore: 98,
    graph: g(
      [
        { id: "1", type: "trigger", x: 0, y: 80, label: "Doc upload" },
        { id: "2", type: "vision_ocr", x: 200, y: 80, label: "OCR legal doc" },
        { id: "3", type: "humanApprove", x: 400, y: 80, label: "Legal review" },
        { id: "4", type: "security_encrypt", x: 600, y: 80, label: "Encrypt store" },
        { id: "5", type: "security_audit", x: 800, y: 80, label: "Audit trail" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "4" },
        { id: "e4", source: "4", target: "5" },
      ],
    ),
  },
  {
    id: "ow-webhook-fanout",
    title: "Webhook fan-out router",
    slug: "webhook-fanout-router",
    description: "Route inbound webhooks to multiple downstream integrations with conditions.",
    detail:
      "Simple but robust fan-out pattern. Validates payload, branches on event type, and dispatches to Slack, email, or HTTP endpoints.",
    access: "free",
    tags: ["webhook", "routing", "starter"],
    testedBadge: true,
    qualityScore: 86,
    graph: g(
      [
        { id: "1", type: "trigger_webhook", x: 0, y: 100, label: "Inbound hook" },
        { id: "2", type: "condition", x: 200, y: 100, label: "Event type?" },
        { id: "3", type: "integrate_slack", x: 400, y: 40, label: "Slack alert" },
        { id: "4", type: "integrate_email", x: 400, y: 100, label: "Email notify" },
        { id: "5", type: "httpRequest", x: 400, y: 160, label: "Forward API" },
      ],
      [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "2", target: "4" },
        { id: "e4", source: "2", target: "5" },
      ],
    ),
  },
];

export function getOfficialWorkflow(slug: string): OfficialWorkflow | undefined {
  return OFFICIAL_WORKFLOWS.find((w) => w.slug === slug);
}

export function paidWorkflowSlugs(): string[] {
  return OFFICIAL_WORKFLOWS.filter((w) => w.access === "paid").map((w) => w.slug);
}
