import { NextResponse } from "next/server";
import { z } from "zod";
import { runAsyncAgent } from "@/lib/agent/asyncAgent";
import { rateLimit } from "@/lib/rateLimit";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  page: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      }),
    )
    .max(20)
    .optional(),
});

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "anonymous";
  return `agent-chat:${ip}`;
}

export async function POST(request: Request) {
  try {
    if (!rateLimit(clientKey(request), 30, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await runAsyncAgent({
      message: parsed.data.message,
      page: parsed.data.page,
      history: parsed.data.history,
      sessionId: parsed.data.sessionId,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Agent unavailable" }, { status: 500 });
  }
}
