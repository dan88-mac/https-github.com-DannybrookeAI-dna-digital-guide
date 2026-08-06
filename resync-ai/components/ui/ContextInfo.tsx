"use client";

import { useId, useState } from "react";

interface ContextInfoProps {
  title: string;
  children: React.ReactNode;
  tone?: "cyan" | "indigo" | "amber";
}

/** Angled / colored contextual info icon used across the SaaS. */
export function ContextInfo({ title, children, tone = "cyan" }: ContextInfoProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ring =
    tone === "indigo"
      ? "border-indigo-400/50 text-indigo-300"
      : tone === "amber"
        ? "border-amber-400/50 text-amber-300"
        : "border-cyan-400/50 text-cyan-300";
  const panel =
    tone === "indigo"
      ? "border-indigo-500/30 bg-indigo-950/40"
      : tone === "amber"
        ? "border-amber-500/30 bg-amber-950/30"
        : "border-cyan-500/30 bg-cyan-950/30";

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        title={title}
        onClick={() => setOpen((v) => !v)}
        className={`ml-1 inline-flex h-5 w-5 -rotate-6 items-center justify-center rounded-full border text-[10px] font-bold transition hover:rotate-0 ${ring}`}
      >
        i
      </button>
      {open && (
        <span
          id={id}
          role="note"
          className={`absolute left-0 top-7 z-40 w-64 -rotate-1 rounded-xl border p-3 text-left text-xs leading-relaxed text-zinc-200 shadow-lg backdrop-blur ${panel}`}
        >
          <span className="mb-1 block font-semibold underline decoration-cyan-400/60 underline-offset-2">
            {title}
          </span>
          {children}
        </span>
      )}
    </span>
  );
}
