export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  group: string;
  summary: string;
  params: ApiParam[];
  sampleResponse: string;
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/health",
    group: "System",
    summary: "Liveness and dependency health check.",
    params: [],
    sampleResponse: `{
  "status": "ok",
  "uptime": 128394,
  "checks": { "db": "ok", "runtime": "ok" }
}`,
  },
  {
    method: "POST",
    path: "/api/runtime/execute",
    group: "Runtime",
    summary: "Run the self-heal runtime for a failed step.",
    params: [
      { name: "organizationId", type: "string", required: true, description: "Owning organization id." },
      { name: "failedEndpoint", type: "string", required: true, description: "The endpoint that failed." },
      { name: "errorMessage", type: "string", required: true, description: "The error to heal from." },
      { name: "expectedOutputSchema", type: "object", required: true, description: "JSON-schema subset for the expected output." },
      { name: "attempt", type: "number", required: false, description: "Current attempt (max 3)." },
    ],
    sampleResponse: `{
  "data": { "shippingAddress": "…patched…" },
  "status": "SELF_HEALED",
  "selfHealed": true,
  "attempts": 2,
  "durationMs": 812,
  "traceId": "trc_9f2a"
}`,
  },
  {
    method: "POST",
    path: "/api/workflows/save",
    group: "Workflows",
    summary: "Create or update a workflow version.",
    params: [
      { name: "workflowId", type: "string", required: false, description: "Omit to create a new workflow." },
      { name: "name", type: "string", required: true, description: "Human-readable workflow name." },
      { name: "graph", type: "object", required: true, description: "The validated workflow graph." },
    ],
    sampleResponse: `{ "id": "wf_18c", "version": 4, "savedAt": "2026-08-05T12:00:00Z" }`,
  },
  {
    method: "GET",
    path: "/api/workflows/list",
    group: "Workflows",
    summary: "List workflows for the current organization.",
    params: [
      { name: "limit", type: "number", required: false, description: "Page size; defaults to 20." },
      { name: "cursor", type: "string", required: false, description: "Pagination cursor." },
    ],
    sampleResponse: `{ "items": [ { "id": "wf_18c", "name": "Checkout heal" } ], "nextCursor": null }`,
  },
  {
    method: "POST",
    path: "/api/workflows/{id}/execute",
    group: "Workflows",
    summary: "Execute a saved workflow with an input payload.",
    params: [
      { name: "id", type: "string", required: true, description: "Workflow id (path param)." },
      { name: "input", type: "object", required: true, description: "Input payload for the trigger." },
    ],
    sampleResponse: `{ "executionId": "ex_5a1", "status": "SUCCESS", "durationMs": 1423 }`,
  },
  {
    method: "POST",
    path: "/api/telemetry/log",
    group: "Telemetry",
    summary: "Append a telemetry line for an execution step.",
    params: [
      { name: "executionId", type: "string", required: true, description: "Parent execution id." },
      { name: "level", type: "'info' | 'warn' | 'error'", required: true, description: "Log level." },
      { name: "message", type: "string", required: true, description: "Log message." },
    ],
    sampleResponse: `{ "ok": true }`,
  },
  {
    method: "POST",
    path: "/api/webhooks/dispatch",
    group: "Webhooks",
    summary: "Dispatch a signed outbound webhook.",
    params: [
      { name: "url", type: "string", required: true, description: "Destination URL (allow-listed)." },
      { name: "event", type: "string", required: true, description: "Event name." },
      { name: "payload", type: "object", required: true, description: "Event payload; signed with HMAC-SHA256." },
    ],
    sampleResponse: `{ "delivered": true, "attempts": 1, "signature": "sha256=…" }`,
  },
];

export function endpointsByGroup(): Record<string, ApiEndpoint[]> {
  return API_ENDPOINTS.reduce(
    (acc, e) => {
      (acc[e.group] ||= []).push(e);
      return acc;
    },
    {} as Record<string, ApiEndpoint[]>
  );
}
