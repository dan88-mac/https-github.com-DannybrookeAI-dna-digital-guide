"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({
  source = "content",
  compact = false,
}: {
  source?: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (res.ok && data.ok) {
        setStatus("success");
        setMessage(data.message ?? "You're subscribed.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex w-full gap-2", compact ? "flex-row" : "flex-col sm:flex-row")}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Email address"
        className="min-w-0 flex-1 rounded-xl border border-resync-border bg-resync-bg/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-500/60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="w-full text-xs text-rose-400 sm:w-auto sm:self-center">{message}</p>
      )}
    </form>
  );
}
