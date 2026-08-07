"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Dismissible "what's new" banner. The `id` is persisted in localStorage so a
 * given announcement is only shown until the visitor dismisses it. Bump the id
 * (kept in sync with the latest changelog release) to re-surface a new note.
 */
export function AnnouncementBanner({
  id,
  message,
  href,
  cta,
}: {
  id: string;
  message: string;
  href: string;
  cta: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(`resync-banner-${id}`);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [id]);

  if (!visible) return null;

  function dismiss() {
    try {
      localStorage.setItem(`resync-banner-${id}`, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <div className="relative z-40 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-resync-surface/60 to-indigo-950/40">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2 text-center text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">
          New
        </span>
        <span className="text-zinc-300">{message}</span>
        <Link href={href} className="font-semibold text-cyan-300 underline-offset-2 hover:underline">
          {cta} →
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 transition hover:bg-white/5 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
