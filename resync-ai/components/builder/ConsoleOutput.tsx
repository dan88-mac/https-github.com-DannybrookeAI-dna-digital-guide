"use client";

export function ConsoleOutput({
  logs,
  onClear,
}: {
  logs: string[];
  onClear: () => void;
}) {
  return (
    <aside className="glass flex w-full flex-col rounded-2xl lg:w-80">
      <div className="flex items-center justify-between border-b border-resync-border px-4 py-3">
        <h3 className="text-sm font-medium text-white">Console</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-zinc-500 hover:text-white"
        >
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-xs text-zinc-400">
        {logs.length === 0 ? (
          <p className="text-zinc-600">Run validate or execute to see logs…</p>
        ) : (
          logs.map((line, i) => (
            <pre key={`${i}-${line.slice(0, 20)}`} className="mb-2 whitespace-pre-wrap text-zinc-300">
              {line}
            </pre>
          ))
        )}
      </div>
    </aside>
  );
}
