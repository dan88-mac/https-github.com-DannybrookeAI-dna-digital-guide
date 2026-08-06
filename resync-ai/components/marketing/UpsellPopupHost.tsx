"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const TIPS = [
  {
    title: "Next step",
    body: "Open Studio to turn an idea into a scored graph, then send it to Builder.",
    href: "/studio",
  },
  {
    title: "Pro scale",
    body: "Plans: Community $0 · Builder $39 · Pro $129. Marketplace fees 20% (12% Enterprise).",
    href: "/pricing",
  },
  {
    title: "Heal loops",
    body: "Add a Self Heal module before export — overview score rewards resilience.",
    href: "/overview-score",
  },
];

/** Randomized, dismissible upsell / guidance popups (frequency capped). */
export function UpsellPopupHost() {
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(TIPS[0]);

  useEffect(() => {
    const key = "resync-upsell-at";
    const last = Number(localStorage.getItem(key) || 0);
    const now = Date.now();
    if (now - last < 12 * 60 * 1000) return;
    const t = window.setTimeout(() => {
      setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
      setOpen(true);
      localStorage.setItem(key, String(Date.now()));
    }, 8000);
    return () => window.clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-[70] w-[min(340px,calc(100vw-2rem))] animate-fade-rise rounded-2xl border border-cyan-500/30 bg-resync-surface/95 p-4 shadow-xl backdrop-blur-xl"
      role="dialog"
      aria-label="Resync tip"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
            Resync guide
          </p>
          <h3 className="mt-1 font-display text-base font-semibold text-white">{tip.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{tip.body}</p>
          <Link
            href={tip.href}
            className="mt-3 inline-flex text-sm font-medium text-cyan-300 hover:text-cyan-200"
            onClick={() => setOpen(false)}
          >
            Continue →
          </Link>
        </div>
        <button
          type="button"
          className="rounded-lg border border-resync-border px-2 py-1 text-xs text-zinc-400 hover:text-white"
          onClick={() => setOpen(false)}
          aria-label="Dismiss"
        >
          Esc
        </button>
      </div>
    </div>
  );
}
