"use client";

import { useCallback, useEffect, useState } from "react";
import { ContextInfo } from "@/components/ui/ContextInfo";

interface Draft {
  author: string;
  body: string;
}

interface DraftResponse {
  ok: boolean;
  agent?: string;
  status?: string;
  draft?: Draft;
  checkedAt?: string;
  error?: string;
}

const LOCAL_SEEDS: Draft[] = [
  {
    author: "curator_bot",
    body: "Tip: pair Vision Classify with Self Heal before Notify — overview scores jump on resilience.",
  },
  {
    author: "curator_bot",
    body: "Marketplace reminder: standard take rate is 10% buyer + 10% seller (20%). Enterprise can negotiate 12%.",
  },
  {
    author: "curator_bot",
    body: "Studio idea: webhook → speech-to-text → LLM summarize → Slack, with a human approve gate.",
  },
  {
    author: "curator_bot",
    body: "Pro canvas supports up to 50 modules. Keep graphs scoreable — label nodes for operators.",
  },
];

/** Randomised curator drafts — triple-check before publish (local approve only in demo). */
export function CuratorAgentFeed() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<string>("idle");
  const [approved, setApproved] = useState<string[]>([]);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus("checking");
    try {
      const res = await fetch("/api/cron/community-draft");
      if (res.ok) {
        const data = (await res.json()) as DraftResponse;
        if (data.draft) {
          setDraft(data.draft);
          setCheckedAt(data.checkedAt ?? new Date().toISOString());
          setStatus(data.status ?? "pending_approval");
          return;
        }
      }
    } catch {
      /* fall through to local */
    }
    const pick = LOCAL_SEEDS[Math.floor(Math.random() * LOCAL_SEEDS.length)];
    setDraft(pick);
    setCheckedAt(new Date().toISOString());
    setStatus("pending_approval");
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 45_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  function approve() {
    if (!draft) return;
    setApproved((prev) => [draft.body, ...prev].slice(0, 5));
    setStatus("approved_local");
    void refresh();
  }

  return (
    <section className="community-section glass rounded-2xl border border-cyan-500/20 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400/80">
            Curator agent
          </p>
          <h3 className="mt-1 text-sm font-semibold text-white">Live community drafts</h3>
        </div>
        <ContextInfo title="Human gate" tone="amber">
          Drafts are randomised and triple-checked. Nothing publishes without approve. Cron uses
          CRON_SECRET in production.
        </ContextInfo>
      </div>

      <p className="mt-3 text-[11px] uppercase tracking-wider text-zinc-500">
        Status · {status}
        {checkedAt ? ` · ${new Date(checkedAt).toLocaleTimeString()}` : ""}
      </p>

      {draft && (
        <blockquote className="mt-3 rounded-xl border border-dashed border-resync-border/80 bg-black/25 p-4 text-sm leading-relaxed text-zinc-300">
          <span className="text-cyan-400/90">{draft.author}</span>
          <span className="mt-2 block">{draft.body}</span>
        </blockquote>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={approve}
          disabled={!draft}
          className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
        >
          Approve locally
        </button>
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-lg border border-resync-border px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
        >
          Resample
        </button>
      </div>

      {approved.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-resync-border/50 pt-3">
          {approved.map((body) => (
            <li key={body.slice(0, 48)} className="text-xs text-emerald-400/90">
              ✓ {body.slice(0, 120)}
              {body.length > 120 ? "…" : ""}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
