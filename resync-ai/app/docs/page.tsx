import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/content/ContentKit";
import { DOC_CATEGORIES } from "@/lib/content/docs";

export const metadata: Metadata = {
  title: "Docs — Resync AI",
  description: "Guides and references for building, integrating, and shipping self-healing workflows.",
};

export default function DocsPage() {
  return (
    <>
      <PageHero
        eyebrow="Documentation"
        title="Build with Resync AI"
        lede="Guides organized by topic — from your first workflow to production APIs and code export."
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {DOC_CATEGORIES.map((cat) => (
            <section
              key={cat.category}
              className="rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-6"
            >
              <h2 className="font-display text-lg font-bold text-white">{cat.category}</h2>
              <p className="mt-1 text-sm text-zinc-400">{cat.blurb}</p>
              <ul className="mt-5 space-y-2">
                {cat.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-resync-border hover:bg-resync-bg/50"
                    >
                      <span>
                        <span className="block text-sm font-medium text-white group-hover:text-cyan-300">
                          {link.title}
                        </span>
                        <span className="block text-xs text-zinc-500">{link.description}</span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-zinc-600">{link.minutes}m</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
