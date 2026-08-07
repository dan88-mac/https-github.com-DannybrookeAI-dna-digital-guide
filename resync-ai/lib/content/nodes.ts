export type NodeCategory = "Trigger" | "Vision" | "Text" | "Logic" | "Integration" | "Data" | "Resilience";

export interface NodeParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface NodeDoc {
  id: string;
  name: string;
  category: NodeCategory;
  summary: string;
  inputs: string;
  outputs: string;
  params: NodeParam[];
}

export const NODE_DOCS: NodeDoc[] = [
  {
    id: "trigger_webhook",
    name: "Webhook trigger",
    category: "Trigger",
    summary: "Starts a workflow when an inbound HTTP request is received.",
    inputs: "—",
    outputs: "payload, headers",
    params: [
      { name: "path", type: "string", required: true, description: "Unique inbound path for this trigger." },
      { name: "secret", type: "string", required: false, description: "Optional HMAC secret to verify signatures." },
    ],
  },
  {
    id: "trigger_schedule",
    name: "Schedule trigger",
    category: "Trigger",
    summary: "Runs a workflow on a cron schedule.",
    inputs: "—",
    outputs: "firedAt",
    params: [
      { name: "cron", type: "string", required: true, description: "Cron expression, e.g. '0 * * * *'." },
      { name: "timezone", type: "string", required: false, description: "IANA timezone; defaults to UTC." },
    ],
  },
  {
    id: "vision_ocr",
    name: "OCR extract",
    category: "Vision",
    summary: "Extracts text from images and PDFs with high accuracy.",
    inputs: "image | pdf",
    outputs: "text, confidence",
    params: [
      { name: "language", type: "string", required: false, description: "Hint the OCR language; auto-detected by default." },
      { name: "pages", type: "string", required: false, description: "Page range for multi-page PDFs." },
    ],
  },
  {
    id: "vision_analyze",
    name: "Vision analyze",
    category: "Vision",
    summary: "Detects objects, labels, and faces in an image.",
    inputs: "image",
    outputs: "labels[], objects[]",
    params: [
      { name: "features", type: "string[]", required: false, description: "Which detectors to run: labels, objects, faces." },
      { name: "minConfidence", type: "number", required: false, description: "Drop results below this confidence." },
    ],
  },
  {
    id: "llm",
    name: "LLM generate",
    category: "Text",
    summary: "Generates or transforms text with a configurable model.",
    inputs: "prompt, context",
    outputs: "completion",
    params: [
      { name: "model", type: "string", required: false, description: "Defaults to gpt-4o-mini; env-configurable." },
      { name: "temperature", type: "number", required: false, description: "0–1 randomness; defaults to 0.3." },
      { name: "maxTokens", type: "number", required: false, description: "Upper bound on output length." },
    ],
  },
  {
    id: "text_summarize",
    name: "Text summarizer",
    category: "Text",
    summary: "Condenses long text into key points or an abstract.",
    inputs: "text",
    outputs: "summary",
    params: [
      { name: "type", type: "'key-points' | 'abstract'", required: false, description: "Summary style." },
      { name: "maxLength", type: "number", required: false, description: "Max summary length in tokens." },
    ],
  },
  {
    id: "condition",
    name: "If / Else",
    category: "Logic",
    summary: "Branches execution on a boolean expression.",
    inputs: "value",
    outputs: "true, false",
    params: [
      { name: "expression", type: "string", required: true, description: "Expression evaluated against the input." },
    ],
  },
  {
    id: "switch",
    name: "Switch",
    category: "Logic",
    summary: "Multi-path branching on a matched key.",
    inputs: "value",
    outputs: "case:*, default",
    params: [
      { name: "cases", type: "string[]", required: true, description: "Ordered list of case keys to match." },
    ],
  },
  {
    id: "httpRequest",
    name: "HTTP request",
    category: "Integration",
    summary: "Calls any REST endpoint with typed inputs.",
    inputs: "body, headers",
    outputs: "response, status",
    params: [
      { name: "url", type: "string", required: true, description: "Target URL (allow-listed in production)." },
      { name: "method", type: "string", required: true, description: "GET, POST, PUT, PATCH, DELETE." },
    ],
  },
  {
    id: "integrate_slack",
    name: "Slack notify",
    category: "Integration",
    summary: "Sends a message, file, or alert to Slack.",
    inputs: "message",
    outputs: "ts",
    params: [
      { name: "channel", type: "string", required: true, description: "Target channel or user id." },
    ],
  },
  {
    id: "data_store",
    name: "Data store",
    category: "Data",
    summary: "Persists structured records to the database.",
    inputs: "record",
    outputs: "id",
    params: [
      { name: "table", type: "string", required: true, description: "Destination table (RLS-scoped)." },
    ],
  },
  {
    id: "selfHeal",
    name: "Self-heal",
    category: "Resilience",
    summary: "Recovers from a failed step via patch, fallback, or safe abort.",
    inputs: "error, context",
    outputs: "data, healed",
    params: [
      { name: "maxAttempts", type: "number", required: false, description: "Retry cap; defaults to 3." },
      { name: "allowFallback", type: "boolean", required: false, description: "Permit allow-listed fallback endpoints." },
    ],
  },
];

export function nodesByCategory(): Record<NodeCategory, NodeDoc[]> {
  return NODE_DOCS.reduce(
    (acc, n) => {
      (acc[n.category] ||= []).push(n);
      return acc;
    },
    {} as Record<NodeCategory, NodeDoc[]>
  );
}
