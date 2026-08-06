import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runSelfHeal } from "@/lib/runtime/selfHeal";
import { consumeCredits } from "@/lib/billing/credits";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: workflowId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: wf } = await supabase
    .from("workflows")
    .select("id, organization_id, active_version_id")
    .eq("id", workflowId)
    .maybeSingle();

  if (!wf?.organization_id) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const payload = (await request.json()) as {
    failedEndpoint?: string;
    errorMessage?: string;
    expectedOutputSchema?: Record<string, unknown>;
    incomingContext?: Record<string, unknown>;
  };

  const allowed = await consumeCredits(wf.organization_id, 1);
  if (!allowed) {
    return NextResponse.json({ error: "Quota exceeded" }, { status: 402 });
  }

  const result = await runSelfHeal({
    organizationId: wf.organization_id,
    failedEndpoint: payload.failedEndpoint ?? "https://api.example.com/step",
    errorMessage: payload.errorMessage ?? "Workflow step failed",
    expectedOutputSchema: payload.expectedOutputSchema ?? {},
    incomingContext: payload.incomingContext ?? {},
  });

  return NextResponse.json({ workflowId, ...result });
}
