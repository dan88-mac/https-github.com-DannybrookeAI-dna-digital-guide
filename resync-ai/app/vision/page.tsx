import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vision — Resync AI",
  description:
    "The Resync AI vision: multimodal workflows that heal themselves and a community-powered marketplace.",
};

const pillars = [
  {
    title: "Multimodal canvas",
    body: "Describe an idea in natural language, sketch a flow, or drop in assets—Resync AI assembles a living canvas of nodes you can refine, fork, and ship. Text, images, APIs, and code blocks coexist in one workspace built for iteration.",
  },
  {
    title: "Self-healing by default",
    body: "Production workflows should recover without midnight pages. Resync watches execution traces, proposes fixes, and lets you accept heals with full audit history—so reliability compounds instead of eroding.",
  },
  {
    title: "Community marketplace",
    body: "Builders publish templates and modules; teams discover, license, and extend what already works. Free community contributions and paid creator listings share one graph—accelerating everyone’s next workflow.",
  },
  {
    title: "Code you own",
    body: "Export to Next.js, wire webhooks, and run on your infrastructure when you are ready. Resync is the fastest path to a dependable automation—not a walled garden.",
  },
];

export default function VisionPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Vision</p>
        <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
          Multimodal workflows that heal themselves
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-zinc-300">
          Resync AI exists so teams can ship automation that survives real-world chaos. We combine
          a visual builder, AI-assisted design, and runtime self-healing into one platform—and
          surround it with a community marketplace where builders share what works.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {pillars.map((p) => (
          <div key={p.title} className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">{p.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-14 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white">Product mission</h2>
        <p className="mt-4 leading-relaxed text-zinc-400">
          Software should fail gracefully. Operators should spend time on new capabilities—not
          re-fixing the same integration. Resync AI measures success by how often you return
          because the platform is the fastest, most trustworthy path to the next reliable workflow.
        </p>
        <p className="mt-4 leading-relaxed text-zinc-400">
          We are building for builders, platform teams, and purpose-driven organizations who need
          automation that documents what happened, recovers automatically, and scales from a
          three-node experiment to fifty-module production graphs.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/builder"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500"
          >
            Open builder
          </Link>
          <Link
            href="/community"
            className="rounded-xl border border-resync-border px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
          >
            Join the community
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            View pricing →
          </Link>
        </div>
      </div>
    </div>
  );
}
