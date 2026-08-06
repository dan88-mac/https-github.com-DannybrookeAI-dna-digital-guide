"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addComment,
  addMessage,
  addPost,
  addReport,
  blockUser,
  loadCommunityState,
  saveCommunityState,
  toggleLike,
  unblockUser,
  updateSettings,
  type CommunityPost,
  type CommunitySettings,
  type CommunityState,
  type PostFilter,
  setDisplayName,
} from "@/lib/community/store";

export function useCommunityStore() {
  const [state, setState] = useState<CommunityState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadCommunityState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CommunityState) => {
    setState(next);
    saveCommunityState(next);
  }, []);

  const likePost = useCallback(
    (postId: string) => {
      if (!state) return;
      persist(toggleLike(state, postId));
    },
    [state, persist],
  );

  const postComment = useCallback(
    (postId: string, text: string) => {
      if (!state) return;
      persist(addComment(state, postId, text));
    },
    [state, persist],
  );

  const createPost = useCallback(
    (input: Parameters<typeof addPost>[1]) => {
      if (!state) return null;
      const next = addPost(state, input);
      persist(next);
      return next.posts[0];
    },
    [state, persist],
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (!state) return;
      persist(addMessage(state, text));
    },
    [state, persist],
  );

  const submitReport = useCallback(
    (input: Parameters<typeof addReport>[1]) => {
      if (!state) return;
      persist(addReport(state, input));
    },
    [state, persist],
  );

  const saveSettings = useCallback(
    (settings: Partial<CommunitySettings>) => {
      if (!state) return;
      persist(updateSettings(state, settings));
    },
    [state, persist],
  );

  const block = useCallback(
    (userId: string) => {
      if (!state) return;
      persist(blockUser(state, userId));
    },
    [state, persist],
  );

  const unblock = useCallback(
    (userId: string) => {
      if (!state) return;
      persist(unblockUser(state, userId));
    },
    [state, persist],
  );

  const rename = useCallback(
    (name: string) => {
      setDisplayName(name);
      if (state) persist({ ...state, displayName: name });
    },
    [state, persist],
  );

  return {
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
  };
}

export type { CommunityPost, CommunitySettings, CommunityState, PostFilter };
