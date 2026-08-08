export type HybridRuntime = "python" | "powershell" | "www";

export interface HybridAssemblyStep {
  id: string;
  moduleId: string;
  functionCall: string;
  runtime: HybridRuntime;
  label: string;
  params?: Record<string, unknown>;
}

export interface PathHop {
  hop: number;
  from: string;
  to: string;
  nodeType: string;
  latencyMs: number;
  frequencyHz: number;
  telemetryUtc: string;
}

export interface FindMeDot {
  id: string;
  executionId: string;
  url?: string | null;
  contentFolder?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  label?: string;
  timestampUtc: string;
  signature: string;
}

export interface HybridStreamEvent {
  type?: string;
  moduleId?: string;
  event?: string;
  timestampUtc?: string;
  [key: string]: unknown;
}

export const HYBRID_RUNNER_URL =
  process.env.HYBRID_MATRIX_RUNNER_URL ?? "http://127.0.0.1:8765";
