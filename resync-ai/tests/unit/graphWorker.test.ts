import { describe, expect, it } from "vitest";
import { handleWorkerMessage } from "@/workers/nodeGraphLogic";

describe("nodeGraphLogic", () => {
  it("detects cycles", () => {
    const graph = {
      nodes: [{ id: "a" }, { id: "b" }],
      edges: [
        { source: "a", target: "b" },
        { source: "b", target: "a" },
      ],
    };
    const result = handleWorkerMessage({ type: "VALIDATE", graph });
    expect(result.ok).toBe(false);
  });

  it("returns topological order", () => {
    const graph = {
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      edges: [
        { source: "a", target: "b" },
        { source: "b", target: "c" },
      ],
    };
    const result = handleWorkerMessage({ type: "ORDER", graph });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.order).toEqual(["a", "b", "c"]);
  });
});
