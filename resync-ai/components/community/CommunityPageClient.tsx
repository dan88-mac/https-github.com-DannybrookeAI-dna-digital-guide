"use client";

import { useCallback, useMemo, useState } from "react";
import { CommunityWaitlistForm } from "@/components/marketing/CommunityWaitlistForm";
import { ComposePostForm } from "@/components/community/ComposePostForm";
import { CommunitySettingsDrawer } from "@/components/community/CommunitySettingsDrawer";
import { FeedbackForm } from "@/components/community/FeedbackForm";
import { MessageBoard } from "@/components/community/MessageBoard";
import { PostCard, PostDetailDrawer } from "@/components/community/PostCard";
import { ReportModal } from "@/components/community/ReportModal";
import { useModeration } from "@/hooks/useModeration";
import { useCommunityStore } from "@/hooks/useCommunityStore";
import {
  filterPosts,
  getPostComments,
  type PostFilter,
} from "@/lib/community/store";
import { sanitizeForDisplay } from "@/lib/engine/moderation";

const FILTERS: { id: PostFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "templates", label: "Templates" },
  { id: "marketplace", label: "Marketplace" },
  { id: "trending", label: "Trending" },
  { id: "new", label: "New" },
];

export function CommunityPageClient() {
  const {
    state,
    hydrated,
    likePost,
    postComment,
    createPost,
    sendMessage,
    submitReport,
    saveSettings,
    block,
    unblock,
    rename,
  } = useCommunityStore();
  const { moderate } = useModeration();

  const [filter, setFilter] = useState<PostFilter>("all");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    type: "post" | "user";
    id: string;
    label: string;
  } | null>(null);

  const posts = useMemo(() => {
    if (!state) return [];
    return filterPosts(state.posts, filter, state.settings);
  }, [state, filter]);

  const selectedPost = useMemo(
    () => state?.posts.find((p) => p.id === selectedPostId) ?? null,
    [state, selectedPostId],
  );

  const selectedComments = useMemo(() => {
    if (!state || !selectedPostId) return [];
    return getPostComments(state.comments, selectedPostId).map((c) => ({
      ...c,
      text: sanitizeForDisplay(c.text),
    }));
  }, [state, selectedPostId]);

  const handleComment = useCallback(
    async (text: string) => {
      if (!selectedPostId) return false;
      const result = await moderate(text);
      if (!result.allowed) return false;
      postComment(selectedPostId, sanitizeForDisplay(text));
      return true;
    },
    [selectedPostId, moderate, postComment],
  );

  const handleCreatePost = useCallback(
    async (input: Parameters<NonNullable<typeof createPost>>[0]) => {
      const post = createPost(input);
      return !!post;
    },
    [createPost],
  );

  const handleSendMessage = useCallback(
    async (text: string) => {
      const result = await moderate(text);
      if (!result.allowed) return false;
      sendMessage(sanitizeForDisplay(text));
      return true;
    },
    [moderate, sendMessage],
  );

  if (!hydrated || !state) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-zinc-500">Loading community…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="community-section animate-fade-in">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Community
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white">
              Build, share, and remix workflows
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Discover templates, list designs on the marketplace, and collaborate with builders
              shipping self-healing automation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="glass rounded-xl px-4 py-2 text-sm text-zinc-400 transition hover:text-white"
          >
            Settings
          </button>
        </div>
      </section>

      {/* Filters */}
      <nav className="community-section mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all duration-300 ${
              filter === f.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                : "glass text-zinc-400 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main feed */}
        <div className="space-y-6 lg:col-span-2">
          <ComposePostForm onSubmit={handleCreatePost} />

          <div className="space-y-4">
            {posts.length === 0 && (
              <p className="text-center text-sm text-zinc-500">No posts match your filters.</p>
            )}
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="community-section"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <PostCard
                  post={post}
                  liked={post.likes.includes(state.sessionId)}
                  onOpen={() => setSelectedPostId(post.id)}
                  onLike={() => likePost(post.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <MessageBoard messages={state.messages} onSend={handleSendMessage} />
          <FeedbackForm />
          <section className="community-section glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white">Stay in the loop</h3>
            <p className="mt-1 text-xs text-zinc-500">Template drops and marketplace updates</p>
            <div className="mt-4">
              <CommunityWaitlistForm source="community-sidebar" />
            </div>
          </section>
        </aside>
      </div>

      {/* Post detail drawer */}
      {selectedPost && (
        <PostDetailDrawer
          post={selectedPost}
          comments={selectedComments}
          liked={selectedPost.likes.includes(state.sessionId)}
          sessionId={state.sessionId}
          onClose={() => setSelectedPostId(null)}
          onLike={() => likePost(selectedPost.id)}
          onComment={handleComment}
          onReport={() =>
            setReportTarget({ type: "post", id: selectedPost.id, label: "post" })
          }
          onBlock={() => {
            block(selectedPost.authorId);
            setSelectedPostId(null);
          }}
        />
      )}

      {settingsOpen && (
        <CommunitySettingsDrawer
          settings={state.settings}
          displayName={state.displayName}
          onSave={saveSettings}
          onRename={rename}
          onClose={() => setSettingsOpen(false)}
          onUnblock={unblock}
        />
      )}

      {reportTarget && (
        <ReportModal
          targetLabel={reportTarget.label}
          onSubmit={(reason, details) => {
            submitReport({
              targetType: reportTarget.type,
              targetId: reportTarget.id,
              reason,
              details,
            });
          }}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
}
