"use client";

import { useState } from "react";
import { useModeration } from "@/hooks/useModeration";

export function FeedbackForm() {
  const [category, setCategory] = useState<"bug" | "feature" | "community" | "other">("community");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const { moderate, checking } = useModeration();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await moderate(message);
    if (!result.allowed) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setMessage("");
  }

  return (
    <section className="community-section glass rounded-2xl p-6">
      <h3 className="font-semibold text-white">Send feedback</h3>
      <p className="mt-1 text-xs text-zinc-500">Help us improve the community experience</p>
      {status === "done" ? (
        <p className="mt-4 text-sm text-emerald-400">Thanks — your feedback was recorded locally.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className="w-full rounded-xl border border-resync-border bg-resync-bg/50 px-4 py-2 text-sm text-white"
          >
            <option value="community">Community</option>
            <option value="feature">Feature request</option>
            <option value="bug">Bug report</option>
            <option value="other">Other</option>
          </select>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            placeholder="Your feedback…"
            className="w-full rounded-xl border border-resync-border bg-resync-bg/50 p-4 text-sm text-white placeholder:text-zinc-600"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full rounded-xl border border-resync-border bg-resync-bg/50 px-4 py-2 text-sm text-white placeholder:text-zinc-600"
          />
          {status === "error" && (
            <p className="text-xs text-red-400">Message blocked by moderation policy</p>
          )}
          <button
            type="submit"
            disabled={checking}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm text-white disabled:opacity-50"
          >
            Submit feedback
          </button>
        </form>
      )}
    </section>
  );
}
