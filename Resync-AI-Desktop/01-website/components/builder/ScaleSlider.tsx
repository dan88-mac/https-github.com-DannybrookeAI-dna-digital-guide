"use client";

import type { GraphScale } from "@/lib/engine/ideaToCanvas";

const SCALE_OPTIONS: { value: GraphScale; label: string; hint: string }[] = [
  { value: "small", label: "Small", hint: "3 nodes" },
  { value: "large", label: "Large", hint: "8–15 nodes" },
  { value: "monster", label: "Monster", hint: "25–50 nodes" },
];

export function ScaleSlider({
  value,
  onChange,
}: {
  value: GraphScale;
  onChange: (scale: GraphScale) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-resync-border/80 bg-resync-surface/50 p-1 backdrop-blur-md">
      <span className="hidden px-2 text-[10px] uppercase tracking-wider text-zinc-500 sm:inline">
        Scale
      </span>
      {SCALE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          title={opt.hint}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
            value === opt.value
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-900/40"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
