import { NextResponse } from "next/server";
import { z } from "zod";
import { HYBRID_RUNNER_URL } from "@/lib/hybrid/types";
import { scrubHybridPayload } from "@/lib/hybrid/maskSecrets";
import { runLocalAssemblyLine } from "@/lib/hybrid/assemblyLineLocal";

const schema = z.object({
  executionId: z.string().uuid().optional(),
  clientGeo: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      accuracy: z.number().optional(),
    })
    .optional(),
  targetHost: z.string().default("hybrid.resync.ai"),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const executionId = body.executionId ?? crypto.randomUUID();
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  try {
    const res = await fetch(`${HYBRID_RUNNER_URL}/api/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        execution_id: executionId,
        client_geo: body.clientGeo,
        client_ip: clientIp,
        target_host: body.targetHost,
      }),
      signal: AbortSignal.timeout(120_000),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(scrubHybridPayload(data));
    }
  } catch {
    /* fall through to local fallback */
  }

  const events: Record<string, unknown>[] = [];
  const summary = await runLocalAssemblyLine({
    executionId,
    clientIp,
    targetHost: body.targetHost,
    clientGeo: body.clientGeo,
    onEvent: (ev) => events.push(ev),
  });

  return NextResponse.json(scrubHybridPayload({ summary, events }));
}
