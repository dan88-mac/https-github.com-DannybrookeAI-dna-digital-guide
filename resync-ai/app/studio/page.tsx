import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Studio — Resync AI",
  description: "Multimodal studio for designing and refining self-healing workflows.",
};

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Studio</p>
      <h1 className="mt-2 text-4xl font-bold text-white">Design workflows in the studio</h1>
      <p className="mt-6 text-lg leading-relaxed text-zinc-300">
        Resync Studio is the multimodal workspace for idea-to-canvas generation, asset uploads,
        and collaborative refinement—connected to the same self-healing runtime as the builder.
      </p>
      <div className="glass mt-10 rounded-2xl p-8">
        <p className="text-sm leading-relaxed text-zinc-400">
          Studio sessions open in the builder with the full palette enabled on paid plans. Start
          from a prompt, template, or blank canvas and iterate with heal-aware previews.
        </p>
        <Link
          href="/builder"
          className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500"
        >
          Open builder
        </Link>
      </div>
    </div>
  );
}
