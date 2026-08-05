import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { log } from "@/lib/logger";

const schema = z.object({
  executionId: z.string().uuid(),
  stepId: z.string().optional(),
  level: z.enum(["info", "warn", "error", "debug"]).default("info"),
  message: z.string().min(1).max(2000),
  payload: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const supabase = createServiceClient();
    await supabase.from("workflow_telemetry").insert({
      execution_id: body.executionId,
      step_id: body.stepId,
      level: body.level,
      message: body.message,
      payload: body.payload,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    log("error", "telemetry log failed", { error: String(e) });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
