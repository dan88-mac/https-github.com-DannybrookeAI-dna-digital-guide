import { HYBRID_RUNNER_URL } from "@/lib/hybrid/types";
import { runLocalAssemblyLine } from "@/lib/hybrid/assemblyLineLocal";
import { scrubHybridPayload } from "@/lib/hybrid/maskSecrets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const executionId = searchParams.get("executionId") ?? crypto.randomUUID();
  const targetHost = searchParams.get("targetHost") ?? "hybrid.resync.ai";
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(scrubHybridPayload(obj))}\n\n`));
      };

      try {
        const res = await fetch(`${HYBRID_RUNNER_URL}/api/execute/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            execution_id: executionId,
            client_ip: clientIp,
            target_host: targetHost,
          }),
        });
        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const dec = new TextDecoder();
          let buf = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            const parts = buf.split("\n\n");
            buf = parts.pop() ?? "";
            for (const part of parts) {
              if (part.startsWith("data: ")) {
                controller.enqueue(encoder.encode(`${part}\n\n`));
              }
            }
          }
          controller.close();
          return;
        }
      } catch {
        /* local fallback */
      }

      send({
        type: "assembly_step",
        moduleId: "fallback",
        event: "runner_unreachable",
        timestampUtc: new Date().toISOString(),
        message: "Using in-process assembly line (start Python runner on :8765 for full bridge)",
      });

      const summary = await runLocalAssemblyLine({
        executionId,
        clientIp,
        targetHost,
        onEvent: send,
      });
      send({ type: "summary", ...summary });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
