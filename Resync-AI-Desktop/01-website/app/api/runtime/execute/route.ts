import { NextResponse } from "next/server";
import { runtimeExecuteSchema } from "@/schemas/runtime";
import { runSelfHeal } from "@/lib/runtime/selfHeal";
import { consumeCredits } from "@/lib/billing/credits";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rateLimit";
import { log } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anon";
  if (!rateLimit(`runtime:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const input = runtimeExecuteSchema.parse(await request.json());
    const allowed = await consumeCredits(input.organizationId, 1);
    if (!allowed) {
      return NextResponse.json(
        { error: "Quota exceeded", status: "QUOTA_EXCEEDED" },
        { status: 402 }
      );
    }

    const result = await runSelfHeal(input);

    try {
      const supabase = createServiceClient();
      const { data: exec } = await supabase
        .from("workflow_executions")
        .insert({
          organization_id: input.organizationId,
          status: result.status,
          input: input.incomingContext,
          output: result.data,
          duration_ms: result.durationMs,
          healed: result.selfHealed,
        })
        .select("id")
        .single();

      if (exec?.id) {
        await supabase.from("workflow_telemetry").insert({
          execution_id: exec.id,
          level: result.selfHealed ? "info" : "warn",
          message: result.message ?? "Runtime execution completed",
          payload: { traceId: result.traceId, attempts: result.attempts },
        });
      }
    } catch (dbErr) {
      log("warn", "telemetry persist skipped", { error: String(dbErr) });
    }

    return NextResponse.json(result);
  } catch (e) {
    log("error", "runtime execute failed", { error: String(e) });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
