import { NextResponse } from "next/server";

const SEEDS = [
  {
    author: "curator_bot",
    body: "Tip: pair Vision Classify with Self Heal before Notify — overview scores jump on resilience.",
  },
  {
    author: "curator_bot",
    body: "Marketplace reminder: standard take rate is 10% buyer + 10% seller (20%). Enterprise can negotiate 12%.",
  },
  {
    author: "curator_bot",
    body: "Studio idea: webhook → speech-to-text → LLM summarize → Slack, with a human approve gate.",
  },
  {
    author: "curator_bot",
    body: "Pro canvas supports up to 50 modules. Keep graphs scoreable — label nodes for operators.",
  },
];

/** Daily curator drafts — admin must approve before community publish */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const pick = SEEDS[Math.floor(Math.random() * SEEDS.length)];
  return NextResponse.json({
    ok: true,
    agent: "curator",
    status: "pending_approval",
    draft: pick,
    checkedAt: new Date().toISOString(),
  });
}
