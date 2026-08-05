"use client";

import { useState } from "react";

export function CommunityWaitlistForm({ source = "community" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/community/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStatus("done");
      setMessage(data.message ?? "You are on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not join right now. Try again soon.");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="flex-1 rounded-xl border border-resync-border bg-resync-bg px-4 py-3 text-sm text-white outline-none ring-indigo-500/0 focus:ring-2"
      />
      <button
        type="submit"
        disabled={status === "loading" || status === "done"}
        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : status === "done" ? "Welcome!" : "Join community"}
      </button>
      {message && (
        <p className={`text-sm sm:basis-full ${status === "error" ? "text-red-400" : "text-emerald-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
