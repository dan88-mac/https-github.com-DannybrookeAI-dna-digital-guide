export type ModuleCategory =
  | "trigger"
  | "vision"
  | "voice"
  | "text"
  | "http"
  | "transform"
  | "condition"
  | "selfHeal"
  | "webhook"
  | "human"
  | "delay"
  | "commerce"
  | "devops"
  | "data"
  | "security"
  | "integrate";

export interface ModuleIO {
  name: string;
  type: string;
  description?: string;
}

export interface WorkflowModule {
  id: string;
  label: string;
  category: ModuleCategory;
  icon: string;
  description: string;
  color: string;
  defaultData: Record<string, unknown>;
  /** Short purpose line (falls back to description in UI). */
  purpose?: string;
  uses?: string[];
  libraries?: string[];
  inputs?: ModuleIO[];
  outputs?: ModuleIO[];
  configSchema?: Record<string, unknown>;
  pairingTags?: string[];
  instructions?: string;
  codeSnippet?: string;
  /** Can anchor scheduled/cron workflows. */
  scheduleCapable?: boolean;
}

export const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  trigger: "Triggers",
  vision: "Vision",
  voice: "Voice",
  text: "Text / LLM",
  http: "HTTP",
  transform: "Transform",
  condition: "Conditions",
  selfHeal: "Self-heal",
  webhook: "Webhooks",
  human: "Human loop",
  delay: "Delay",
  commerce: "Commerce",
  devops: "DevOps",
  data: "Data",
  security: "Security",
  integrate: "Integrations",
};

/** Resolve display purpose for old and new catalog entries. */
export function getModulePurpose(mod: WorkflowModule): string {
  return mod.purpose ?? mod.description;
}

export const MODULE_CATALOG: WorkflowModule[] = [
  // trigger
  {
    id: "trigger",
    label: "Manual Trigger",
    category: "trigger",
    icon: "▶",
    description: "Start workflow manually or via API call",
    purpose: "Kick off a workflow on demand from the builder or API",
    uses: ["Prototyping", "One-off jobs", "Operator-initiated runs"],
    libraries: ["Resync Runtime"],
    inputs: [],
    outputs: [{ name: "payload", type: "object", description: "Optional starter context" }],
    pairingTags: ["start", "entry"],
    instructions: "Place at the left edge. Connect downstream to fetch, transform, or AI nodes.",
    codeSnippet: 'await runtime.trigger("manual", { userId: ctx.user.id });',
    color: "#6366f1",
    defaultData: { label: "Manual Trigger", triggerType: "manual" },
  },
  {
    id: "trigger_webhook",
    label: "Webhook Trigger",
    category: "trigger",
    icon: "⚡",
    description: "Start when an inbound webhook is received",
    color: "#6366f1",
    defaultData: { label: "Webhook Trigger", triggerType: "webhook", path: "/hooks/inbound" },
  },
  {
    id: "trigger_schedule",
    label: "Schedule Trigger",
    category: "trigger",
    icon: "🕐",
    description: "Run on a cron or interval schedule",
    purpose: "Run workflows on cron or fixed intervals",
    uses: ["Nightly ETL", "Health checks", "Report generation"],
    libraries: ["Resync Runtime", "node-cron"],
    scheduleCapable: true,
    pairingTags: ["start", "schedule", "cron"],
    instructions: "Use standard cron syntax. Pair with data_query or devops_monitor for polling jobs.",
    codeSnippet: 'cron.schedule("0 * * * *", () => runtime.run(workflowId));',
    color: "#6366f1",
    defaultData: { label: "Schedule", triggerType: "schedule", cron: "0 * * * *" },
  },
  {
    id: "trigger_event",
    label: "Event Trigger",
    category: "trigger",
    icon: "📡",
    description: "React to platform or bus events",
    color: "#6366f1",
    defaultData: { label: "Event Trigger", triggerType: "event", eventName: "" },
  },
  // vision
  {
    id: "vision",
    label: "Vision Analyze",
    category: "vision",
    icon: "👁",
    description: "Analyze images with multimodal AI",
    purpose: "Extract meaning from images using multimodal models",
    uses: ["Document QA", "Visual inspection", "Content moderation"],
    libraries: ["OpenAI", "Anthropic"],
    inputs: [{ name: "image", type: "url | buffer", description: "Image to analyze" }],
    outputs: [
      { name: "analysis", type: "string", description: "Model narrative response" },
      { name: "structured", type: "object", description: "Optional JSON when schema provided" },
    ],
    configSchema: { model: "string", prompt: "string", maxTokens: "number" },
    pairingTags: ["multimodal", "vision", "ai"],
    instructions: "Upstream: webhook or manual upload. Downstream: text_summarize or condition on labels.",
    codeSnippet:
      'const result = await openai.chat.completions.create({\n  model: "gpt-4o",\n  messages: [{ role: "user", content: [{ type: "image_url", image_url: { url } }, { type: "text", text: prompt }] }],\n});',
    color: "#8b5cf6",
    defaultData: { label: "Vision Analyze", model: "gpt-4o", prompt: "Describe this image" },
  },
  {
    id: "vision_ocr",
    label: "OCR Extract",
    category: "vision",
    icon: "📄",
    description: "Extract text from images and documents",
    color: "#8b5cf6",
    defaultData: { label: "OCR", language: "auto" },
  },
  {
    id: "vision_detect",
    label: "Object Detect",
    category: "vision",
    icon: "🎯",
    description: "Detect objects and regions in images",
    color: "#8b5cf6",
    defaultData: { label: "Object Detect", confidence: 0.8 },
  },
  {
    id: "vision_classify",
    label: "Image Classify",
    category: "vision",
    icon: "🏷",
    description: "Classify images into categories",
    color: "#8b5cf6",
    defaultData: { label: "Classify", categories: [] },
  },
  // voice
  {
    id: "voice",
    label: "Voice Transcribe",
    category: "voice",
    icon: "🎤",
    description: "Transcribe audio to text",
    purpose: "Convert speech audio into searchable text",
    uses: ["Meeting notes", "Call center QA", "Voice commands"],
    libraries: ["OpenAI Whisper"],
    inputs: [{ name: "audio", type: "url | buffer", description: "Audio file or stream" }],
    outputs: [{ name: "transcript", type: "string" }],
    pairingTags: ["multimodal", "voice", "speech"],
    instructions: "Chain to text_translate or text_summarize for multilingual workflows.",
    color: "#ec4899",
    defaultData: { label: "Transcribe", language: "en", model: "whisper-1" },
  },
  {
    id: "voice_synthesize",
    label: "Voice Synthesize",
    category: "voice",
    icon: "🔊",
    description: "Convert text to natural speech",
    color: "#ec4899",
    defaultData: { label: "Synthesize", voice: "alloy", speed: 1.0 },
  },
  {
    id: "voice_translate",
    label: "Voice Translate",
    category: "voice",
    icon: "🌐",
    description: "Translate spoken audio to another language",
    color: "#ec4899",
    defaultData: { label: "Voice Translate", targetLanguage: "en" },
  },
  // text
  {
    id: "text",
    label: "Text Generate",
    category: "text",
    icon: "✍",
    description: "Generate text with LLM",
    purpose: "Generate or transform text with large language models",
    uses: ["Copywriting", "Classification prompts", "Agent reasoning"],
    libraries: ["OpenAI", "Anthropic", "Google Gemini"],
    inputs: [{ name: "context", type: "object", description: "Variables for prompt template" }],
    outputs: [{ name: "text", type: "string" }],
    configSchema: { model: "string", prompt: "string", maxTokens: "number", temperature: "number" },
    pairingTags: ["llm", "text", "ai"],
    instructions: "Use after vision or voice nodes to reason over multimodal context.",
    codeSnippet:
      'const { text } = await llm.generate({ model: "gpt-4o", prompt: render(template, ctx) });',
    color: "#14b8a6",
    defaultData: { label: "Generate Text", model: "gpt-4o", prompt: "", maxTokens: 1024 },
  },
  {
    id: "text_summarize",
    label: "Summarize",
    category: "text",
    icon: "📝",
    description: "Summarize long text content",
    color: "#14b8a6",
    defaultData: { label: "Summarize", maxLength: 200 },
  },
  {
    id: "text_classify",
    label: "Text Classify",
    category: "text",
    icon: "🔖",
    description: "Classify text into labels",
    color: "#14b8a6",
    defaultData: { label: "Classify Text", labels: [] },
  },
  {
    id: "text_extract",
    label: "Extract Entities",
    category: "text",
    icon: "🔍",
    description: "Extract structured entities from text",
    color: "#14b8a6",
    defaultData: { label: "Extract", schema: {} },
  },
  {
    id: "text_translate",
    label: "Translate Text",
    category: "text",
    icon: "🗣",
    description: "Translate text between languages",
    color: "#14b8a6",
    defaultData: { label: "Translate", targetLanguage: "en" },
  },
  // http
  {
    id: "httpRequest",
    label: "HTTP Request",
    category: "http",
    icon: "🌐",
    description: "Call REST or GraphQL endpoints",
    purpose: "Integrate any REST or GraphQL API",
    uses: ["SaaS webhooks", "Internal microservices", "Third-party data fetch"],
    libraries: ["fetch", "undici"],
    inputs: [{ name: "body", type: "object", description: "Request payload" }],
    outputs: [
      { name: "status", type: "number" },
      { name: "data", type: "object | array" },
    ],
    pairingTags: ["http", "integration"],
    instructions: "Follow with selfHeal for flaky endpoints. Map responses via transform.",
    color: "#3b82f6",
    defaultData: { label: "HTTP Request", method: "GET", url: "", headers: {} },
  },
  {
    id: "http_batch",
    label: "HTTP Batch",
    category: "http",
    icon: "📦",
    description: "Execute multiple HTTP requests in parallel",
    color: "#3b82f6",
    defaultData: { label: "HTTP Batch", requests: [], concurrency: 5 },
  },
  // transform
  {
    id: "transform",
    label: "Transform Data",
    category: "transform",
    icon: "⚙",
    description: "Map and reshape JSON payloads",
    color: "#f59e0b",
    defaultData: { label: "Transform", mapping: {} },
  },
  {
    id: "transform_merge",
    label: "Merge Data",
    category: "transform",
    icon: "🔗",
    description: "Merge multiple inputs into one object",
    color: "#f59e0b",
    defaultData: { label: "Merge", strategy: "deep" },
  },
  {
    id: "transform_split",
    label: "Split Data",
    category: "transform",
    icon: "✂",
    description: "Split arrays or objects into branches",
    color: "#f59e0b",
    defaultData: { label: "Split", path: "", mode: "array" },
  },
  // condition
  {
    id: "condition",
    label: "Condition",
    category: "condition",
    icon: "⑂",
    description: "Branch based on a boolean expression",
    color: "#a855f7",
    defaultData: { label: "If / Else", expression: "", operator: "eq" },
  },
  {
    id: "condition_switch",
    label: "Switch",
    category: "condition",
    icon: "🔀",
    description: "Multi-way branch on field value",
    color: "#a855f7",
    defaultData: { label: "Switch", field: "", cases: [] },
  },
  {
    id: "condition_filter",
    label: "Filter",
    category: "condition",
    icon: "🚰",
    description: "Filter arrays by predicate",
    color: "#a855f7",
    defaultData: { label: "Filter", predicate: "", keepMatching: true },
  },
  // selfHeal
  {
    id: "selfHeal",
    label: "Self Heal",
    category: "selfHeal",
    icon: "🩹",
    description: "Auto-repair failed API responses with AI",
    purpose: "Automatically patch and retry failed API calls",
    uses: ["Resilient integrations", "Schema drift recovery", "Production hardening"],
    libraries: ["Resync Runtime", "OpenAI"],
    pairingTags: ["resilience", "http"],
    instructions: "Insert immediately after httpRequest nodes in production graphs.",
    color: "#ef4444",
    defaultData: { label: "Self Heal", maxAttempts: 3, strategy: "patch" },
  },
  {
    id: "selfHeal_circuit",
    label: "Circuit Breaker",
    category: "selfHeal",
    icon: "⚡",
    description: "Trip circuit on repeated failures",
    color: "#ef4444",
    defaultData: { label: "Circuit Breaker", threshold: 5, cooldownMs: 60000 },
  },
  // webhook
  {
    id: "webhookOut",
    label: "Webhook Out",
    category: "webhook",
    icon: "📤",
    description: "Send payload to external webhook URL",
    color: "#06b6d4",
    defaultData: { label: "Webhook Out", url: "", method: "POST" },
  },
  {
    id: "webhook_receive",
    label: "Webhook Receive",
    category: "webhook",
    icon: "📥",
    description: "Wait for and validate inbound webhook",
    color: "#06b6d4",
    defaultData: { label: "Receive Webhook", timeoutMs: 30000 },
  },
  // human
  {
    id: "humanApprove",
    label: "Human Approval",
    category: "human",
    icon: "👤",
    description: "Pause for human approval before continuing",
    color: "#f97316",
    defaultData: { label: "Approval", assignee: "", timeoutHours: 24 },
  },
  {
    id: "human_review",
    label: "Human Review",
    category: "human",
    icon: "✅",
    description: "Request human review with rubric",
    color: "#f97316",
    defaultData: { label: "Review", rubric: [], required: true },
  },
  {
    id: "human_input",
    label: "Human Input",
    category: "human",
    icon: "⌨",
    description: "Collect structured input from a human",
    color: "#f97316",
    defaultData: { label: "Human Input", fields: [], formTitle: "" },
  },
  // delay
  {
    id: "delay",
    label: "Delay",
    category: "delay",
    icon: "⏳",
    description: "Wait for a fixed duration",
    color: "#64748b",
    defaultData: { label: "Delay", durationMs: 5000 },
  },
  // commerce
  {
    id: "commerce_checkout",
    label: "Checkout",
    category: "commerce",
    icon: "🛒",
    description: "Process checkout and payment flow",
    purpose: "Orchestrate checkout and payment capture",
    uses: ["E-commerce", "SaaS billing", "Marketplace payouts"],
    libraries: ["Stripe"],
    pairingTags: ["commerce", "payments"],
    instructions: "Always place commerce_inventory upstream. Notify on success.",
    color: "#10b981",
    defaultData: { label: "Checkout", provider: "stripe", currency: "usd" },
  },
  {
    id: "commerce_inventory",
    label: "Inventory Check",
    category: "commerce",
    icon: "📦",
    description: "Verify stock levels before fulfillment",
    color: "#10b981",
    defaultData: { label: "Inventory", skuField: "sku", minQuantity: 1 },
  },
  {
    id: "commerce_pricing",
    label: "Dynamic Pricing",
    category: "commerce",
    icon: "💰",
    description: "Calculate dynamic price based on rules",
    color: "#10b981",
    defaultData: { label: "Pricing", rules: [], basePrice: 0 },
  },
  {
    id: "commerce_notify",
    label: "Order Notify",
    category: "commerce",
    icon: "📧",
    description: "Send order confirmation notifications",
    color: "#10b981",
    defaultData: { label: "Order Notify", channels: ["email"], template: "order_confirm" },
  },
  // devops
  {
    id: "devops_deploy",
    label: "Deploy",
    category: "devops",
    icon: "🚀",
    description: "Trigger deployment pipeline",
    color: "#0ea5e9",
    defaultData: { label: "Deploy", environment: "staging", service: "" },
  },
  {
    id: "devops_monitor",
    label: "Monitor",
    category: "devops",
    icon: "📈",
    description: "Query metrics and health endpoints",
    color: "#0ea5e9",
    defaultData: { label: "Monitor", metric: "latency", threshold: 500 },
  },
  {
    id: "devops_alert",
    label: "Alert",
    category: "devops",
    icon: "🚨",
    description: "Fire alerts to on-call channels",
    color: "#0ea5e9",
    defaultData: { label: "Alert", severity: "warning", channel: "pagerduty" },
  },
  {
    id: "devops_scale",
    label: "Auto Scale",
    category: "devops",
    icon: "📐",
    description: "Scale infrastructure based on load",
    color: "#0ea5e9",
    defaultData: { label: "Scale", minReplicas: 1, maxReplicas: 10 },
  },
  // data
  {
    id: "data_query",
    label: "Data Query",
    category: "data",
    icon: "🗄",
    description: "Query database or data warehouse",
    color: "#7c3aed",
    defaultData: { label: "Query", source: "postgres", query: "" },
  },
  {
    id: "data_store",
    label: "Data Store",
    category: "data",
    icon: "💾",
    description: "Persist records to storage",
    color: "#7c3aed",
    defaultData: { label: "Store", table: "", mode: "upsert" },
  },
  {
    id: "data_validate",
    label: "Validate Schema",
    category: "data",
    icon: "✓",
    description: "Validate data against JSON schema",
    color: "#7c3aed",
    defaultData: { label: "Validate", schema: {}, strict: true },
  },
  // security
  {
    id: "security_scan",
    label: "Security Scan",
    category: "security",
    icon: "🛡",
    description: "Scan payloads for vulnerabilities",
    color: "#dc2626",
    defaultData: { label: "Security Scan", scanTypes: ["xss", "injection"] },
  },
  {
    id: "security_encrypt",
    label: "Encrypt",
    category: "security",
    icon: "🔐",
    description: "Encrypt sensitive fields",
    color: "#dc2626",
    defaultData: { label: "Encrypt", algorithm: "aes-256-gcm", fields: [] },
  },
  {
    id: "security_audit",
    label: "Audit Log",
    category: "security",
    icon: "📜",
    description: "Write immutable audit trail entries",
    color: "#dc2626",
    defaultData: { label: "Audit", action: "", retentionDays: 365 },
  },
  // integrate
  {
    id: "integrate",
    label: "Integration Hub",
    category: "integrate",
    icon: "🔌",
    description: "Connect to third-party SaaS integrations",
    color: "#84cc16",
    defaultData: { label: "Integrate", provider: "", action: "" },
  },
  {
    id: "integrate_slack",
    label: "Slack",
    category: "integrate",
    icon: "💬",
    description: "Send messages or actions to Slack",
    color: "#84cc16",
    defaultData: { label: "Slack", channel: "", message: "" },
  },
  {
    id: "integrate_email",
    label: "Email",
    category: "integrate",
    icon: "📨",
    description: "Send transactional email",
    color: "#84cc16",
    defaultData: { label: "Email", to: "", subject: "", body: "" },
  },
  {
    id: "integrate_crm",
    label: "CRM Sync",
    category: "integrate",
    icon: "🏢",
    description: "Sync contacts and deals to CRM",
    color: "#84cc16",
    defaultData: { label: "CRM", provider: "hubspot", entity: "contact" },
  },
];

const catalogById = new Map(MODULE_CATALOG.map((m) => [m.id, m]));

export function getModule(id: string): WorkflowModule | undefined {
  return catalogById.get(id);
}

export function modulesByCategory(): Record<ModuleCategory, WorkflowModule[]> {
  const grouped = {} as Record<ModuleCategory, WorkflowModule[]>;
  for (const mod of MODULE_CATALOG) {
    if (!grouped[mod.category]) grouped[mod.category] = [];
    grouped[mod.category].push(mod);
  }
  return grouped;
}

export const MODULE_IDS = MODULE_CATALOG.map((m) => m.id);

export function isValidModuleId(id: string): boolean {
  return catalogById.has(id);
}

export interface ModuleFilterOptions {
  query?: string;
  categories?: ModuleCategory[];
  library?: string;
  scheduleCapableOnly?: boolean;
}

export function filterModules(options: ModuleFilterOptions = {}): WorkflowModule[] {
  const q = options.query?.trim().toLowerCase() ?? "";
  const catSet = options.categories?.length ? new Set(options.categories) : null;

  return MODULE_CATALOG.filter((mod) => {
    if (catSet && !catSet.has(mod.category)) return false;
    if (options.library && !(mod.libraries ?? []).includes(options.library)) return false;
    if (options.scheduleCapableOnly && !mod.scheduleCapable) return false;
    if (!q) return true;
    const haystack = [
      mod.label,
      mod.id,
      mod.description,
      mod.purpose ?? "",
      mod.category,
      ...(mod.uses ?? []),
      ...(mod.libraries ?? []),
      ...(mod.pairingTags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
