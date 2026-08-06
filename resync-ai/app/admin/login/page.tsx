"use client";

import { Suspense, useState } from "react";
import { createClientSafe } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin/agents";
  const err = params.get("error");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const supabase = createClientSafe();
    if (!supabase) {
      setMessage("Configure Supabase env vars, then bootstrap admin users via scripts/bootstrap-admin.mjs (env-only secrets).");
      await fetch("/api/admin/security-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "admin_login_unconfigured", path: "/admin/login" }),
      }).catch(() => {});
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Access denied.");
      await fetch("/api/admin/security-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "admin_login_failed", path: "/admin/login" }),
      }).catch(() => {});
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("app_role")
      .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
      .maybeSingle();
    if (profile?.app_role !== "admin") {
      await supabase.auth.signOut();
      setMessage("Access denied.");
      await fetch("/api/admin/security-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "admin_login_forbidden", path: "/admin/login" }),
      }).catch(() => {});
      return;
    }
    router.push(next);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/70">Restricted</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-white">Admin sign-in</h1>
      <p className="mt-3 text-sm text-zinc-400">
        Authorized operators only. Unauthorized attempts are blocked and reported. Passwords are never
        stored in the client bundle — bootstrap via server env.
      </p>
      {(err === "unauthorized" || err === "configure_supabase") && (
        <p className="mt-4 text-sm text-amber-300">
          {err === "configure_supabase"
            ? "Supabase is not configured in this environment."
            : "Unauthorized. This attempt was logged."}
        </p>
      )}
      <form onSubmit={signIn} className="mt-8 space-y-4">
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          className="w-full rounded-xl border border-resync-border bg-resync-bg px-4 py-3 text-sm text-white"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-resync-border bg-resync-bg px-4 py-3 text-sm text-white"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 py-3 text-sm font-semibold text-white"
        >
          Enter admin
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-amber-300">{message}</p>}
      <p className="mt-8 text-center text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-300">
          ← Back to Resync AI
        </Link>
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-zinc-400">Loading…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
