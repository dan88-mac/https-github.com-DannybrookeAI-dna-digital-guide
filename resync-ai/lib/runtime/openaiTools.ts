export const OPENAI_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "patch_missing_field",
      description: "Patch a missing or invalid field in the output to match the expected schema",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "JSON path e.g. user.email" },
          value: { description: "Value to set" },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          reason: { type: "string" },
        },
        required: ["path", "value", "confidence", "reason"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "execute_fallback_endpoint",
      description: "Call a fallback HTTP endpoint when primary failed",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string" },
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH"] },
          body: { type: "object" },
          headers: { type: "object", additionalProperties: { type: "string" } },
        },
        required: ["url", "method"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "abort_with_reason",
      description: "Stop healing when recovery is not safe",
      parameters: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
        required: ["message"],
      },
    },
  },
];
