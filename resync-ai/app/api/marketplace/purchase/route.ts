import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash, randomBytes } from "crypto";
import { getOfficialWorkflow, paidWorkflowSlugs } from "@/lib/marketplace/officialWorkflows";
import { log } from "@/lib/logger";

const purchaseBodySchema = z.object({
  slug: z.string().min(1).max(80),
});

function generatePurchaseToken(slug: string): string {
  const nonce = randomBytes(16).toString("hex");
  const digest = createHash("sha256").update(`${slug}:${nonce}:${Date.now()}`).digest("hex");
  return `rsw_${digest.slice(0, 32)}`;
}

export async function POST(request: Request) {
  try {
    const body = purchaseBodySchema.parse(await request.json());
    const workflow = getOfficialWorkflow(body.slug);

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    if (workflow.access !== "paid") {
      return NextResponse.json(
        { error: "This workflow does not require a paid purchase" },
        { status: 400 },
      );
    }

    const validPaidSlugs = paidWorkflowSlugs();
    if (!validPaidSlugs.includes(body.slug)) {
      return NextResponse.json({ error: "Invalid paid workflow slug" }, { status: 400 });
    }

    const token = generatePurchaseToken(body.slug);

    log("info", "marketplace purchase recorded", {
      slug: body.slug,
      priceCents: workflow.priceCents,
      tokenPrefix: token.slice(0, 12),
    });

    return NextResponse.json({
      ok: true,
      slug: body.slug,
      title: workflow.title,
      priceCents: workflow.priceCents,
      token,
      message:
        "Purchase intent recorded. Store token client-side in resync-purchased-workflows until Stripe org checkout is configured.",
    });
  } catch (e) {
    log("error", "marketplace purchase failed", { error: String(e) });
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    paidSlugs: paidWorkflowSlugs(),
    count: paidWorkflowSlugs().length,
  });
}
