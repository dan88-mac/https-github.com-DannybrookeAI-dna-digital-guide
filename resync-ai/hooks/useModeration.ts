"use client";

import { useCallback, useState } from "react";
import type { ModerationResult } from "@/lib/engine/moderation";

export function useModeration() {
  const [checking, setChecking] = useState(false);
  const [lastResult, setLastResult] = useState<ModerationResult | null>(null);

  const moderate = useCallback(async (text: string): Promise<ModerationResult> => {
    setChecking(true);
    try {
      const res = await fetch("/api/community/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const result = (await res.json()) as ModerationResult;
      setLastResult(result);
      return result;
    } catch {
      const fallback = { allowed: false, reasons: ["Moderation check failed"] };
      setLastResult(fallback);
      return fallback;
    } finally {
      setChecking(false);
    }
  }, []);

  return { moderate, checking, lastResult };
}
