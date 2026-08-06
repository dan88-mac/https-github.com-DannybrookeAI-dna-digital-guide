import { NextResponse } from "next/server";
import { TIERS, MARKETPLACE_FEES } from "@/lib/billing/tiers";

/** Scheduled price auditor — Vercel cron or manual GET with CRON_SECRET */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const expected = {
    FREE: "$0",
    STARTER: "$39",
    PRO: "$129",
    ENTERPRISE: "Custom",
    marketplaceTotal: MARKETPLACE_FEES.standardTotalPercent,
    enterpriseFee: MARKETPLACE_FEES.enterpriseTotalPercent,
  };

  const live = Object.fromEntries(TIERS.map((t) => [t.id, t.priceLabel]));
  const drift: string[] = [];
  if (live.FREE !== expected.FREE) drift.push("FREE price drift");
  if (live.STARTER !== expected.STARTER) drift.push("STARTER/Builder price drift");
  if (live.PRO !== expected.PRO) drift.push("PRO price drift");

  return NextResponse.json({
    ok: drift.length === 0,
    agent: "herald",
    expected,
    live,
    drift,
    checkedAt: new Date().toISOString(),
  });
}
