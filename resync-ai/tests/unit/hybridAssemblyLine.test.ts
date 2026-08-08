import { describe, expect, it } from "vitest";
import { buildPathTrace } from "@/lib/hybrid/assemblyLineLocal";
import { scrubHybridPayload } from "@/lib/hybrid/maskSecrets";

describe("hybrid assembly line local", () => {
  it("builds path trace hops", () => {
    const trace = buildPathTrace("1.2.3.4", "example.com", 3);
    expect(trace.length).toBe(4);
    expect(trace[0].hop).toBe(1);
  });

  it("scrubs secrets", () => {
    const out = scrubHybridPayload({ apiKey: "sk-abcdefghijklmnop" });
    expect(String(out.apiKey)).not.toContain("sk-live");
  });
});
