"use client";

import { useState } from "react";
import { useModeration } from "@/hooks/useModeration";
import type { PostType } from "@/lib/community/store";

export function ComposePostForm({
  onSubmit,
}: {
  onSubmit: (input: {
    type: PostType;
    title: string;
    description: string;
    priceCents?: number;
  }) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<PostType>("discussion");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { moderate, checking } = useModeration();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const combined = `${title}\n${description}`;
    const result = await moderate(combined);
    if (!result.allowed) {
      setError(result.reasons.join(". ") || "Content blocked by moderation");
      return;
    }

    setSubmitting(true);
    const priceCents =
      type === "marketplace" && price ? Math.round(parseFloat(price) * 100) : undefined;
    const ok = await onSubmit({ type, title, description, priceCents });
    setSubmitting(false);
    if (ok) {
      setTitle("");
      setDescription("");
      setPrice("");
      setOpen(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass w-full rounded-2xl p-4 text-left text-sm text-zinc-400 transition hover:border-indigo-500/30 hover:text-zinc-300"
      >
        Share a workflow, template, or idea with the community…
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="community-section glass rounded-2xl p-6">
      <h3 className="font-semibold text-white">Create post</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {(["discussion", "design", "template", "marketplace"] as PostType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-full px-3 py-1 text-xs capitalize ${
              type === t
                ? "bg-indigo-600 text-white"
                : "border border-resync-border text-zinc-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="mt-4 w-full rounded-xl border border-resync-border bg-resync-bg/50 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your workflow or question…"
        required
        rows={4}
        className="mt-3 w-full rounded-xl border border-resync-border bg-resync-bg/50 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
      />
      {type === "marketplace" && (
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="List price (USD)"
          className="mt-3 w-full rounded-xl border border-resync-border bg-resync-bg/50 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
        />
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={submitting || checking}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting || checking ? "Checking…" : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl border border-resync-border px-5 py-2 text-sm text-zinc-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
