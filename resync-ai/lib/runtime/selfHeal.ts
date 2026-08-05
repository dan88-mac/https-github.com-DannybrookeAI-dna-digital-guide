import OpenAI from "openai";
import { OPENAI_TOOLS } from "@/lib/runtime/openaiTools";
import {
  isCircuitOpen,
  isPrivateUrl,
  recordFailure,
  recordSuccess,
} from "@/lib/runtime/circuitBreaker";
import type { RuntimeExecuteInput } from "@/schemas/runtime";

export interface SelfHealResult {
  data: Record<string, unknown>;
  status: "SUCCESS" | "SELF_HEALED" | "FALLBACK_TRIGGERED" | "FAILED";
  selfHealed: boolean;
  attempts: number;
  durationMs: number;
  traceId: string;
  message?: string;
}

function setByPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (typeof cur[p] !== "object" || cur[p] === null) cur[p] = {};
    cur = cur[p] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

export async function runSelfHeal(input: RuntimeExecuteInput): Promise<SelfHealResult> {
  const start = Date.now();
  const traceId = crypto.randomUUID();
  const attempt = input.attempt ?? 0;
  const maxAttempts = 3;

  if (isCircuitOpen(input.organizationId, input.failedEndpoint)) {
    return {
      data: input.incomingContext,
      status: "FAILED",
      selfHealed: false,
      attempts: attempt,
      durationMs: Date.now() - start,
      traceId,
      message: "Circuit breaker open for this endpoint",
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      data: input.incomingContext,
      status: "FAILED",
      selfHealed: false,
      attempts: attempt,
      durationMs: Date.now() - start,
      traceId,
      message: "OpenAI not configured",
    };
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL ?? "gpt-4o";

  let working: Record<string, unknown> = { ...input.incomingContext };
  let selfHealed = false;
  let status: SelfHealResult["status"] = "FAILED";
  let lastMessage: string | undefined;

  for (let i = attempt; i < maxAttempts; i++) {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are Resync AI runtime. Repair failed API responses using tools. Prefer patch_missing_field when schema gaps are clear. Use fallback only when necessary.",
        },
        {
          role: "user",
          content: JSON.stringify({
            failedEndpoint: input.failedEndpoint,
            errorMessage: input.errorMessage,
            expectedOutputSchema: input.expectedOutputSchema,
            context: working,
          }),
        },
      ],
      tools: OPENAI_TOOLS,
      tool_choice: "auto",
    });

    const choice = completion.choices[0];
    const toolCalls = choice.message.tool_calls ?? [];

    if (toolCalls.length === 0) {
      lastMessage = choice.message.content ?? "No tool selected";
      break;
    }

    for (const call of toolCalls) {
      if (call.type !== "function") continue;
      const fn = call.function.name;
      const args = JSON.parse(call.function.arguments) as Record<string, unknown>;

      if (fn === "abort_with_reason") {
        lastMessage = String(args.message ?? "Aborted");
        recordFailure(input.organizationId, input.failedEndpoint);
        return {
          data: working,
          status: "FAILED",
          selfHealed: false,
          attempts: i + 1,
          durationMs: Date.now() - start,
          traceId,
          message: lastMessage,
        };
      }

      if (fn === "patch_missing_field") {
        setByPath(working, String(args.path), args.value);
        selfHealed = true;
        status = "SELF_HEALED";
      }

      if (fn === "execute_fallback_endpoint") {
        const url = String(args.url ?? "");
        if (isPrivateUrl(url)) {
          lastMessage = "Fallback URL not allowed";
          continue;
        }
        const method = String(args.method ?? "GET");
        const res = await fetch(url, {
          method,
          headers: (args.headers as Record<string, string>) ?? { "Content-Type": "application/json" },
          body:
            method !== "GET" && args.body
              ? JSON.stringify(args.body)
              : undefined,
        });
        const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        working = { ...working, ...body };
        selfHealed = true;
        status = "FALLBACK_TRIGGERED";
      }
    }

    if (selfHealed) {
      recordSuccess(input.organizationId, input.failedEndpoint);
      return {
        data: working,
        status,
        selfHealed: true,
        attempts: i + 1,
        durationMs: Date.now() - start,
        traceId,
      };
    }
  }

  recordFailure(input.organizationId, input.failedEndpoint);
  return {
    data: working,
    status: selfHealed ? status : "FAILED",
    selfHealed,
    attempts: maxAttempts,
    durationMs: Date.now() - start,
    traceId,
    message: lastMessage,
  };
}
