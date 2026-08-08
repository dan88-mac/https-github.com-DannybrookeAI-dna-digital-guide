import type { HybridAssemblyStep, PathHop } from "@/lib/hybrid/types";
import { scrubHybridPayload } from "@/lib/hybrid/maskSecrets";

const NODE_TYPES = ["edge", "cdn", "fiber", "satellite", "cloud", "platform"] as const;

function pickNode(i: number): string {
  const labels = ["syd", "akl", "sin", "nrt", "lax", "fra", "lon"];
  return labels[i % labels.length];
}

export function buildPathTrace(clientIp: string, targetHost: string, hops = 6): PathHop[] {
  const trace: PathHop[] = [];
  let prev = clientIp || "0.0.0.0";
  const now = () => new Date().toISOString();

  for (let i = 0; i < hops; i++) {
    const nxt = `node-${pickNode(i)}.${targetHost}`;
    trace.push({
      hop: i + 1,
      from: prev,
      to: nxt,
      nodeType: NODE_TYPES[Math.floor(Math.random() * NODE_TYPES.length)],
      latencyMs: Math.round((Math.random() * 90 + 10) * 100) / 100,
      frequencyHz: Math.round((Math.random() * 3e9 + 2e9) * 100) / 100,
      telemetryUtc: now(),
    });
    prev = nxt;
  }
  trace.push({
    hop: hops + 1,
    from: prev,
    to: targetHost,
    nodeType: "platform",
    latencyMs: Math.round(Math.random() * 30 + 5),
    frequencyHz: 0,
    telemetryUtc: now(),
  });
  return trace;
}

export function defaultAssemblySteps(): HybridAssemblyStep[] {
  return [
    {
      id: "s1",
      moduleId: "mod-geo",
      functionCall: "geo.resolve",
      runtime: "python",
      label: "Geolocation lock",
    },
    {
      id: "s2",
      moduleId: "mod-security",
      functionCall: "security.scrub",
      runtime: "python",
      label: "Key mask & scrub",
      params: { payload: { apiKey: "local-dev", note: "pre-flight" } },
    },
    {
      id: "s3",
      moduleId: "mod-domains",
      functionCall: "web.domains.connector",
      runtime: "www",
      label: "Domain connector",
      params: { domains: ["resync.ai", "github.com"] },
    },
    {
      id: "s4",
      moduleId: "mod-fetch",
      functionCall: "python.http.fetch",
      runtime: "python",
      label: "Live scrape sample",
      params: { url: "https://httpbin.org/get", folder: "/library/scrape-cache" },
    },
    {
      id: "s5",
      moduleId: "mod-ps",
      functionCall: "powershell.echo",
      runtime: "python",
      label: "PowerShell bridge (via runner)",
    },
  ];
}

export async function runLocalAssemblyLine(options: {
  executionId: string;
  clientIp: string;
  targetHost: string;
  clientGeo?: { latitude?: number; longitude?: number };
  onEvent: (ev: Record<string, unknown>) => void;
}): Promise<Record<string, unknown>> {
  const steps = defaultAssemblySteps();
  const trace = buildPathTrace(options.clientIp, options.targetHost);
  for (const hop of trace) {
    options.onEvent({ type: "path_hop", ...hop });
  }

  const stepResults: Record<string, unknown>[] = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const started = {
      type: "assembly_step",
      moduleId: step.moduleId,
      event: "step_start",
      timestampUtc: new Date().toISOString(),
      stepIndex: i,
      runtime: step.runtime,
      functionCall: step.functionCall,
      label: step.label,
    };
    options.onEvent(started);

    const result: Record<string, unknown> = {
      ok: true,
      step: step.id,
      geo: options.clientGeo ?? null,
    };
    if (step.id === "s4") {
      result.url = step.params?.url;
      result.folder = step.params?.folder;
      options.onEvent({
        type: "find_me",
        dots: [
          {
            id: `local-${i}`,
            executionId: options.executionId,
            url: step.params?.url,
            contentFolder: step.params?.folder,
            latitude: options.clientGeo?.latitude ?? null,
            longitude: options.clientGeo?.longitude ?? null,
            label: step.label,
            timestampUtc: new Date().toISOString(),
            signature: "local-fallback",
          },
        ],
      });
    }

    options.onEvent({
      type: "assembly_step",
      moduleId: step.moduleId,
      event: "step_complete",
      timestampUtc: new Date().toISOString(),
      stepIndex: i,
      output: scrubHybridPayload(result),
    });
    stepResults.push({
      stepId: step.id,
      functionCall: step.functionCall,
      runtime: step.runtime,
      result: scrubHybridPayload(result),
      timestampUtc: new Date().toISOString(),
    });
  }

  return {
    executionId: options.executionId,
    completedUtc: new Date().toISOString(),
    steps: stepResults,
    pathTrace: trace,
    mode: "local-fallback",
  };
}
