"use client";

import { useState } from "react";
import { useModeration } from "@/hooks/useModeration";

export function MessageBoard({
  messages,
  onSend,
}: {
  messages: Array<{ id: string; authorName: string; text: string; createdAt: string }>;
  onSend: (text: string) => Promise<boolean>;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { moderate, checking } = useModeration();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    const result = await moderate(text);
    if (!result.allowed) {
      setError(result.reasons.join(". "));
      return;
    }
    setSubmitting(true);
    const ok = await onSend(text.trim());
    setSubmitting(false);
    if (ok) setText("");
  }

  return (
    <section className="community-section glass rounded-2xl p-6">
      <h3 className="font-semibold text-white">Community board</h3>
      <p className="mt-1 text-xs text-zinc-500">Short messages visible to all members</p>
      <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
        {messages.slice(-8).map((m) => (
          <li key={m.id} className="rounded-lg bg-white/5 px-3 py-2 text-sm">
            <span className="font-medium text-indigo-300">{m.authorName}</span>
            <span className="text-zinc-500"> · </span>
            <span className="text-zinc-400">{m.text}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a message…"
          className="flex-1 rounded-xl border border-resync-border bg-resync-bg/50 px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting || checking}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </section>
  );
}
