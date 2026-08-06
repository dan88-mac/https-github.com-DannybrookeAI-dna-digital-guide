import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000";
  let healthOk = false;
  let latencyMs = -1;
  try {
    const t0 = Date.now();
    const res = await fetch(`${base}/api/health`, { cache: "no-store" });
    latencyMs = Date.now() - t0;
    healthOk = res.ok;
  } catch {
    healthOk = false;
  }

  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return NextResponse.json({
    ok: healthOk,
    agent: "sentinel",
    healthOk,
    latencyMs,
    supabaseConfigured,
    checkedAt: new Date().toISOString(),
  });
}
