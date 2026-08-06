import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const allowed = rateLimit(`sec-event:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: { kind?: string; path?: string; detail?: Record<string, unknown> } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const kind = (body.kind || "unknown").slice(0, 80);
  const path = (body.path || "").slice(0, 200);

  try {
    const supabase = createServiceClient();
    await supabase.from("security_events").insert({
      kind,
      path,
      ip_hash: ip.slice(0, 64),
      user_agent: (req.headers.get("user-agent") || "").slice(0, 240),
      detail: body.detail ?? {},
    });
  } catch {
    // Demo environments without service role still return ok to avoid leaking config
  }

  return NextResponse.json({ ok: true });
}
