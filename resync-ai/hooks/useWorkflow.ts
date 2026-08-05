"use client";

import { useCallback, useState } from "react";

export function useWorkflow(slug: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);

  const run = useCallback(
    async (payload: Record<string, unknown>) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/workflows/${slug}`, {
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
    },
    [slug]
  );

  return {
    run,
    loading,
    error,
    result,
    healed: Boolean((result as { selfHealed?: boolean })?.selfHealed),
  };
}
