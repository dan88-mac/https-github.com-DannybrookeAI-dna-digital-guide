"use client";

import { useState } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import type { CommunityPost } from "@/lib/community/store";
import { RefinementBadge } from "./RefinementBadge";
import { FeePreview } from "./FeePreview";

const TYPE_LABELS: Record<string, string> = {
  template: "Template",
  marketplace: "Marketplace",
  design: "Design",
  discussion: "Discussion",
};

export function PostCard({
  post,
  liked,
  onOpen,
  onLike,
}: {
  post: CommunityPost;
  liked: boolean;
  onOpen: () => void;
  onLike: () => void;
}) {
  return (
    <article
      className="community-section glass group cursor-pointer rounded-2xl p-5 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-900/20"
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-300">
            {TYPE_LABELS[post.type] ?? post.type}
          </span>
          {post.priceCents != null && post.priceCents > 0 && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
              ${(post.priceCents / 100).toFixed(2)}
            </span>
          )}
          <RefinementBadge score={post.refinementScore} grade={post.refinementGrade} />
        </div>
        <time className="shrink-0 text-xs text-zinc-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </time>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-indigo-200">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
        {post.description}
      </p>
      <p className="mt-2 text-xs text-zinc-500">{post.capabilitySummary}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-zinc-500">by {post.authorName}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={`text-xs transition ${liked ? "text-pink-400" : "text-zinc-500 hover:text-pink-300"}`}
          >
            {liked ? "♥" : "♡"} {formatNumber(post.likes.length)}
          </button>
          <span className="text-xs text-zinc-500">
            {post.commentIds.length} comments
          </span>
        </div>
      </div>

      {post.priceCents != null && post.priceCents > 0 && (
        <div className="pointer-events-none mt-3 opacity-0 transition-opacity group-hover:opacity-100">
          <FeePreview priceCents={post.priceCents} />
        </div>
      )}
    </article>
  );
}

export function PostDetailDrawer({
  post,
  comments,
  liked,
  sessionId,
  onClose,
  onLike,
  onComment,
  onReport,
  onBlock,
}: {
  post: CommunityPost;
  comments: Array<{ id: string; authorName: string; text: string; createdAt: string; authorId: string }>;
  liked: boolean;
  sessionId: string;
  onClose: () => void;
  onLike: () => void;
  onComment: (text: string) => Promise<boolean>;
  onReport: () => void;
  onBlock: () => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const builderHref = post.templateSlug
    ? `/builder?template=${post.templateSlug}`
    : "/builder";

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    setCommentError(null);
    const ok = await onComment(commentText.trim());
    if (ok) {
      setCommentText("");
    } else {
      setCommentError("Comment blocked by moderation policy");
    }
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-resync-border bg-resync-surface/95 backdrop-blur-xl animate-slide-up">
        <header className="flex items-center justify-between border-b border-resync-border p-4">
          <h2 className="text-lg font-semibold text-white">Post details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-wrap items-center gap-2">
            <RefinementBadge score={post.refinementScore} grade={post.refinementGrade} size="md" />
            {post.priceCents != null && post.priceCents > 0 && (
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                ${(post.priceCents / 100).toFixed(2)}
              </span>
            )}
          </div>

          <h3 className="mt-4 text-xl font-bold text-white">{post.title}</h3>
          <p className="mt-2 text-sm text-zinc-400">by {post.authorName}</p>
          <p className="mt-4 leading-relaxed text-zinc-300">{post.description}</p>
          <p className="mt-3 text-sm text-indigo-300/80">{post.capabilitySummary}</p>

          {post.priceCents != null && post.priceCents > 0 && (
            <FeePreview priceCents={post.priceCents} />
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href={builderHref}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Use in Builder
            </Link>
            <button
              type="button"
              onClick={onLike}
              className={`rounded-xl border px-4 py-2 text-sm ${liked ? "border-pink-500/40 text-pink-300" : "border-resync-border text-zinc-400 hover:text-white"}`}
            >
              {liked ? "Liked" : "Like"} ({post.likes.length})
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  void navigator.share({
                    title: post.title,
                    text: post.description,
                    url: window.location.href,
                  });
                } else {
                  void navigator.clipboard?.writeText(window.location.href);
                }
              }}
              className="rounded-xl border border-resync-border px-4 py-2 text-sm text-zinc-400 hover:text-white"
            >
              Share
            </button>
            <button
              type="button"
              onClick={onReport}
              className="rounded-xl border border-resync-border px-4 py-2 text-sm text-zinc-500 hover:text-amber-300"
            >
              Report
            </button>
            {post.authorId !== sessionId && (
              <button
                type="button"
                onClick={onBlock}
                className="rounded-xl border border-resync-border px-4 py-2 text-sm text-zinc-500 hover:text-red-300"
              >
                Block user
              </button>
            )}
          </div>

          <section className="mt-8">
            <h4 className="font-semibold text-white">Comments</h4>
            <ul className="mt-4 space-y-3">
              {comments.length === 0 && (
                <li className="text-sm text-zinc-500">No comments yet — start the thread.</li>
              )}
              {comments.map((c) => (
                <li key={c.id} className="rounded-xl bg-white/5 p-3">
                  <p className="text-xs text-zinc-500">
                    {c.authorName} · {new Date(c.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">{c.text}</p>
                </li>
              ))}
            </ul>

            <form onSubmit={handleComment} className="mt-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                rows={3}
                className="w-full rounded-xl border border-resync-border bg-resync-bg/50 p-3 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
              {commentError && <p className="mt-1 text-xs text-red-400">{commentError}</p>}
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="mt-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {submitting ? "Checking…" : "Post comment"}
              </button>
            </form>
          </section>
        </div>
      </aside>
    </div>
  );
}
