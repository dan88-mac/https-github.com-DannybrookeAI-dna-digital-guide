import { NextResponse } from "next/server";
import { z } from "zod";
import { HYBRID_RUNNER_URL } from "@/lib/hybrid/types";
import { scrubHybridPayload } from "@/lib/hybrid/maskSecrets";

const pingSchema = z.object({
  executionId: z.string().uuid(),
  url: z.string().url().optional(),
  folder: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  label: z.string().optional(),
});

export async function POST(request: Request) {
  const body = pingSchema.parse(await request.json());
  try {
    const res = await fetch(`${HYBRID_RUNNER_URL}/api/find-me/ping`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        execution_id: body.executionId,
        url: body.url,
        folder: body.folder,
        latitude: body.latitude,
        longitude: body.longitude,
        label: body.label,
      }),
    });
    if (res.ok) {
      return NextResponse.json(await res.json());
    }
  } catch {
    /* local */
  }
  return NextResponse.json(
    scrubHybridPayload({
      id: crypto.randomUUID(),
      executionId: body.executionId,
      url: body.url,
      contentFolder: body.folder,
      latitude: body.latitude,
      longitude: body.longitude,
      label: body.label ?? "frontend-ping",
      timestampUtc: new Date().toISOString(),
      signature: "local",
    })
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const executionId = searchParams.get("executionId");
  try {
    const q = executionId ? `?execution_id=${executionId}` : "";
    const res = await fetch(`${HYBRID_RUNNER_URL}/api/find-me/latest${q}`);
    if (res.ok) {
      return NextResponse.json(await res.json());
    }
  } catch {
    /* ignore */
  }
  return NextResponse.json({ dots: [] });
}
