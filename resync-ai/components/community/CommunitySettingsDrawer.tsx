"use client";

import { useState } from "react";
import type { CommunitySettings } from "@/lib/community/store";

export function CommunitySettingsDrawer({
  settings,
  displayName,
  onSave,
  onRename,
  onClose,
  onUnblock,
}: {
  settings: CommunitySettings;
  displayName: string;
  onSave: (s: Partial<CommunitySettings>) => void;
  onRename: (name: string) => void;
  onClose: () => void;
  onUnblock: (userId: string) => void;
}) {
  const [local, setLocal] = useState(settings);
  const [name, setName] = useState(displayName);
  const [muteInput, setMuteInput] = useState("");

  function toggle(key: keyof CommunitySettings) {
    if (typeof local[key] === "boolean") {
      const next = { ...local, [key]: !local[key] };
      setLocal(next);
      onSave({ [key]: next[key] });
    }
  }

  function addMuteWord() {
    const word = muteInput.trim();
    if (!word || local.muteWords.includes(word)) return;
    const next = { ...local, muteWords: [...local.muteWords, word] };
    setLocal(next);
    onSave({ muteWords: next.muteWords });
    setMuteInput("");
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-resync-border bg-resync-surface/95 backdrop-blur-xl">
        <header className="flex items-center justify-between border-b border-resync-border p-4">
          <h2 className="text-lg font-semibold text-white">Community settings</h2>
          <button type="button" onClick={onClose} className="p-2 text-zinc-400 hover:text-white">
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <section>
            <h3 className="text-sm font-medium text-white">Display name</h3>
            <div className="mt-2 flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-xl border border-resync-border bg-resync-bg/50 px-3 py-2 text-sm text-white"
              />
              <button
                type="button"
                onClick={() => onRename(name)}
                className="rounded-xl bg-indigo-600 px-3 py-2 text-sm text-white"
              >
                Save
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-white">Notifications</h3>
            <div className="mt-3 space-y-2">
              {(
                [
                  ["notifyReplies", "Reply notifications"],
                  ["notifyLikes", "Like notifications"],
                  ["emailDigest", "Weekly email digest"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between text-sm text-zinc-400">
                  {label}
                  <input
                    type="checkbox"
                    checked={local[key]}
                    onChange={() => toggle(key)}
                    className="rounded border-resync-border"
                  />
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-white">Content filters</h3>
            <div className="mt-3 space-y-2">
              {(
                [
                  ["hideNsfw", "Hide NSFW content"],
                  ["hideAbuse", "Hide reported content"],
                  ["showActivity", "Show my activity"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between text-sm text-zinc-400">
                  {label}
                  <input
                    type="checkbox"
                    checked={local[key]}
                    onChange={() => toggle(key)}
                    className="rounded border-resync-border"
                  />
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-white">Mute words</h3>
            <div className="mt-2 flex gap-2">
              <input
                value={muteInput}
                onChange={(e) => setMuteInput(e.target.value)}
                placeholder="Add word…"
                className="flex-1 rounded-xl border border-resync-border bg-resync-bg/50 px-3 py-2 text-sm text-white"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMuteWord())}
              />
              <button
                type="button"
                onClick={addMuteWord}
                className="rounded-xl border border-resync-border px-3 py-2 text-sm text-zinc-400"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {local.muteWords.map((w) => (
                <span
                  key={w}
                  className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-400"
                >
                  {w}
                  <button
                    type="button"
                    onClick={() => {
                      const next = local.muteWords.filter((x) => x !== w);
                      setLocal({ ...local, muteWords: next });
                      onSave({ muteWords: next });
                    }}
                    className="ml-1 text-zinc-600 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-white">Blocked users</h3>
            {local.blockedUserIds.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500">No blocked users</p>
            ) : (
              <ul className="mt-2 space-y-1">
                {local.blockedUserIds.map((id) => (
                  <li key={id} className="flex items-center justify-between text-sm text-zinc-400">
                    <span className="truncate">{id}</span>
                    <button
                      type="button"
                      onClick={() => onUnblock(id)}
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}
