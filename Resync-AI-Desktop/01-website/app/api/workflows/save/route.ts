import { NextResponse } from "next/server";
import { saveWorkflowSchema } from "@/schemas/workflow";
import { createClient } from "@/lib/supabase/server";
import { log } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = saveWorkflowSchema.parse(await request.json());
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let workflowId = body.workflowId;
    if (!workflowId) {
      const { data: wf, error } = await supabase
        .from("workflows")
        .insert({
          organization_id: body.organizationId,
          name: body.name,
          slug: body.slug,
        })
        .select("id")
        .single();
      if (error || !wf) {
        return NextResponse.json({ error: error?.message ?? "Create failed" }, { status: 400 });
      }
      workflowId = wf.id;
    }

    const { data: versions } = await supabase
      .from("workflow_versions")
      .select("version")
      .eq("workflow_id", workflowId)
      .order("version", { ascending: false })
      .limit(1);

    const nextVersion = (versions?.[0]?.version ?? 0) + 1;
    const { data: version, error: vErr } = await supabase
      .from("workflow_versions")
      .insert({
        workflow_id: workflowId,
        version: nextVersion,
        graph: body.graph,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (vErr || !version) {
      return NextResponse.json({ error: vErr?.message ?? "Version failed" }, { status: 400 });
    }

    await supabase
      .from("workflows")
      .update({ active_version_id: version.id, name: body.name })
      .eq("id", workflowId);

    return NextResponse.json({ workflowId, versionId: version.id, version: nextVersion });
  } catch (e) {
    log("error", "workflow save failed", { error: String(e) });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
