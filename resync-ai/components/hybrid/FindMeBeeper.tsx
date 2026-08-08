"use client";

import type { FindMeDot } from "@/lib/hybrid/types";

export function FindMeBeeper({ dots }: { dots: FindMeDot[] }) {
  if (!dots.length) {
    return (
      <p className="text-sm text-slate-400">
        Find-me beeper idle — run the pipeline to see scrape GPS dots.
      </p>
    );
  }

  return (
    <ul className="space-y-2 text-sm">
      {dots.map((d) => (
        <li
          key={d.id}
          className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 font-mono text-xs text-amber-100"
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400 mr-2" />
          <strong>{d.label ?? "active"}</strong>
          <div className="mt-1 text-slate-300">
            {d.url && <div>URL: {d.url}</div>}
            {d.contentFolder && <div>Folder: {d.contentFolder}</div>}
            {(d.latitude != null || d.longitude != null) && (
              <div>
                GPS: {d.latitude?.toFixed(5) ?? "—"}, {d.longitude?.toFixed(5) ?? "—"}
              </div>
            )}
            <div className="text-slate-500">{d.timestampUtc}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
