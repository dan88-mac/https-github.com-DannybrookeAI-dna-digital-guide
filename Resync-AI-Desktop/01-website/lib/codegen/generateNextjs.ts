import type { WorkflowGraph } from "@/schemas/workflow";

export interface CodegenResult {
  files: { path: string; content: string }[];
}

export function generateNextjsExport(
  slug: string,
  name: string,
  graph: WorkflowGraph
): CodegenResult {
  const routeHandler = `import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const res = await fetch(\`\${base}/api/runtime/execute\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organizationId: body.organizationId,
      failedEndpoint: body.failedEndpoint ?? "${graph.nodes[0]?.id ?? "step-1"}",
      errorMessage: body.errorMessage ?? "Workflow step failed",
      expectedOutputSchema: body.expectedOutputSchema ?? {},
      incomingContext: body.incomingContext ?? {},
    }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
`;

  const hook = `"use client";

import { useCallback, useState } from "react";

export function useWorkflow(slug: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);

  const run = useCallback(async (payload: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(\`/api/workflows/\${slug}\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Run failed");
      setResult(data);
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [slug]);

  return { run, loading, error, result, healed: (result as { selfHealed?: boolean })?.selfHealed };
}
`;

  const runner = `"use client";

import { useWorkflow } from "@/hooks/useWorkflow";

export function WorkflowRunner({ slug }: { slug: string }) {
  const { run, loading, error, result, healed } = useWorkflow(slug);

  return (
    <div className="rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold">${name}</h2>
      <button
        type="button"
        disabled={loading}
        onClick={() => run({ organizationId: "", incomingContext: {} })}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Running…" : "Run workflow"}
      </button>
      {healed && <p className="mt-2 text-sm text-emerald-600">Self-healed successfully</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {result != null && (
        <pre className="mt-4 overflow-auto rounded bg-slate-50 p-3 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
`;

  return {
    files: [
      { path: `app/api/workflows/${slug}/route.ts`, content: routeHandler },
      { path: "hooks/useWorkflow.ts", content: hook },
      { path: "components/WorkflowRunner.tsx", content: runner },
      {
        path: "resync.generated.env.example",
        content: "NEXT_PUBLIC_APP_URL=\nOPENAI_API_KEY=\n",
      },
      {
        path: "RESYNC_EXPORT_README.md",
        content: `# ${name}\n\nDeploy this export to any Next.js 14+ app.\n\n1. Copy files into your project.\n2. Set env vars from resync.generated.env.example.\n3. Run \`npm run dev\`.\n`,
      },
    ],
  };
}
