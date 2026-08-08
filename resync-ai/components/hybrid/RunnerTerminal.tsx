"use client";

export function RunnerTerminal({
  lines,
  onCommand,
}: {
  lines: string[];
  onCommand: (cmd: string) => void;
}) {
  return (
    <div className="flex h-64 flex-col rounded-xl border border-resync-border/80 bg-black/60 font-mono text-xs text-emerald-300">
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {lines.map((line, i) => (
          <div key={`${i}-${line.slice(0, 24)}`} className="whitespace-pre-wrap break-all">
            {line}
          </div>
        ))}
      </div>
      <form
        className="flex border-t border-resync-border/60"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const cmd = String(fd.get("cmd") ?? "").trim();
          if (cmd) onCommand(cmd);
          e.currentTarget.reset();
        }}
      >
        <span className="px-3 py-2 text-indigo-400">matrix&gt;</span>
        <input
          name="cmd"
          className="flex-1 bg-transparent py-2 pr-3 outline-none placeholder:text-slate-600"
          placeholder="run | call geo.resolve | list implementations"
          autoComplete="off"
        />
      </form>
    </div>
  );
}
