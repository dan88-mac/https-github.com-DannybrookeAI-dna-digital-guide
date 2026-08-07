import Link from "next/link";
import { ContextInfo } from "@/components/ui/ContextInfo";

const QUOTE = "Build once. Heal always. Compound.";

export default function SocialResourcesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: "url(/brand/circuitry.svg)",
          backgroundSize: "cover",
        }}
        aria-hidden
      />
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/70">
        Social kit
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white">
        Logo & visionary quote
        <ContextInfo title="Brand rule">
          Public surfaces say Resync AI only — no personal names on share cards.
        </ContextInfo>
      </h1>
      <p className="mt-4 text-zinc-400">
        State-of-the-art share assets for LinkedIn, X, forums, and community pushes. Agents (Beacon /
        Scout) can draft captions; humans approve.
      </p>

      <div className="mt-10 overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-resync-surface via-resync-bg to-indigo-950/40 p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.svg"
          alt="Resync AI logo"
          width={64}
          height={64}
          className="rounded-2xl shadow-lg shadow-cyan-900/40"
        />
        <p className="mt-6 font-display text-3xl font-bold text-white">Resync AI</p>
        <p className="mt-3 max-w-lg text-xl text-cyan-100/90">“{QUOTE}”</p>
        <p className="mt-4 text-sm text-zinc-400">
          Multimodal workflows that heal in production · Community $0 · Builder $39 · Pro $129
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <article className="glass rounded-2xl p-5">
          <h2 className="font-semibold text-white">Pricing deep-link mark</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Decorative QR-style stamp for decks and partner packs. Point campaigns at{" "}
            <Link href="/pricing" className="text-cyan-300 underline">
              /pricing
            </Link>
            .
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/qr-pricing.svg"
            alt="Pricing QR mark"
            width={120}
            height={120}
            className="mt-4 rounded-lg border border-resync-border"
          />
        </article>
        <article className="glass rounded-2xl p-5">
          <h2 className="font-semibold text-white">Chip folder motif</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Ultra-realistic chip-styled folder mark for Desktop partner vaults and developer packs.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/chip-folder.svg"
            alt="Chip folder"
            width={160}
            height={120}
            className="mt-4"
          />
        </article>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { t: "LinkedIn", d: "Square logo + quote + CTA to /pricing" },
          { t: "X / Forums", d: "Short heal narrative + /studio link" },
          { t: "Community", d: "Template spotlight + overview grade" },
        ].map((c) => (
          <article key={c.t} className="glass rounded-2xl p-5">
            <h2 className="font-semibold text-white">{c.t}</h2>
            <p className="mt-2 text-sm text-zinc-400">{c.d}</p>
          </article>
        ))}
      </div>

      <Link href="/agents" className="mt-10 inline-block text-sm text-cyan-300">
        See agent fleet →
      </Link>
    </div>
  );
}
