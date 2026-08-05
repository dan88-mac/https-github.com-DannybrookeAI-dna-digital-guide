"use client";

import { useEffect, useState } from "react";
import { flushWorkflowSaves, queueWorkflowSave } from "@/lib/offline/idbStorage";

export function useOfflineQueue(send: (payload: unknown) => Promise<void>) {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      void flushWorkflowSaves(send).then(setPending);
    };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [send]);

  async function enqueue(id: string, payload: unknown) {
    await queueWorkflowSave(id, payload);
    setPending((p) => p + 1);
    if (online) {
      const flushed = await flushWorkflowSaves(send);
      setPending((p) => Math.max(0, p - flushed));
    }
  }

  return { online, pending, enqueue };
}
