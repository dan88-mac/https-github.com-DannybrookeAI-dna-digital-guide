"use client";

import { Suspense, useState } from "react";
import { createClientSafe } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClientSafe();
    if (!supabase) {
      setMessage("Configure Supabase env vars to enable auth. Exploring as guest → builder.");
      router.push("/builder");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push(next);
  }

  async function signUp() {
    const supabase = createClientSafe();
    if (!supabase) {
      router.push("/builder");
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : "Check your email to confirm, then sign in.");
  }

  return (
    <>
      <form onSubmit={signIn} className="mt-8 space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-resync-border bg-resync-bg px-4 py-3 text-sm text-white"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-resync-border bg-resync-bg px-4 py-3 text-sm text-white"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={signUp}
          className="w-full rounded-xl border border-resync-border py-3 text-sm text-white"
        >
          Create account
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-zinc-400">{message}</p>}
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-bold text-white">Welcome back to Resync</h1>
      <p className="mt-2 text-sm text-zinc-400">Sign in to sync workflows, credits, and templates.</p>
      <Suspense fallback={<p className="mt-8 text-sm text-zinc-500">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
