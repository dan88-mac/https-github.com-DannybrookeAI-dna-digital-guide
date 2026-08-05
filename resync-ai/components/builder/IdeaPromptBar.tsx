"use client";

export function IdeaPromptBar({
  idea,
  onIdeaChange,
  onGenerate,
  summary,
}: {
  idea: string;
  onIdeaChange: (value: string) => void;
  onGenerate: () => void;
  summary?: string | null;
}) {
  return (
    <div className="glass flex flex-col gap-2 rounded-xl p-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <input
          type="text"
          value={idea}
          onChange={(e) => onIdeaChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onGenerate();
          }}
          placeholder="Describe your workflow — vision, voice, commerce, DevOps…"
          className="w-full rounded-lg border border-resync-border/60 bg-resync-bg/60 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
        />
        {summary && (
          <p className="mt-1.5 truncate text-[11px] text-indigo-300/80">{summary}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onGenerate}
        className="shrink-0 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-950/30 hover:from-indigo-500 hover:to-violet-500"
      >
        Generate
      </button>
    </div>
  );
}
