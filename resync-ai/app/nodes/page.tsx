import type { Metadata } from "next";
import { PageHero, Pill } from "@/components/content/ContentKit";
import { nodesByCategory, type NodeCategory } from "@/lib/content/nodes";

export const metadata: Metadata = {
  title: "Node reference — Resync AI",
  description: "Every Resync AI node documented with inputs, outputs, and parameters.",
};

const CATEGORY_ORDER: NodeCategory[] = [
  "Trigger",
  "Vision",
  "Text",
  "Logic",
  "Integration",
  "Data",
  "Resilience",
];

export default function NodesPage() {
  const byCat = nodesByCategory();

  return (
    <>
      <PageHero
        eyebrow="Node reference"
        title="Every node, documented"
        lede="The building blocks of a workflow. Each node lists its inputs, outputs, and configurable parameters."
      />

      <div className="mx-auto max-w-5xl space-y-14 px-4 py-16">
        {CATEGORY_ORDER.filter((c) => byCat[c]?.length).map((category) => (
          <section key={category}>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold text-white">{category}</h2>
              <Pill>{byCat[category].length}</Pill>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {byCat[category].map((node) => (
                <article
                  key={node.id}
                  className="rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white">{node.name}</h3>
                    <code className="rounded bg-resync-bg/60 px-2 py-0.5 font-mono text-[11px] text-cyan-300">
                      {node.id}
                    </code>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{node.summary}</p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-resync-border/60 bg-resync-bg/40 p-3">
                      <dt className="uppercase tracking-wider text-zinc-600">Inputs</dt>
                      <dd className="mt-1 font-mono text-zinc-300">{node.inputs}</dd>
                    </div>
                    <div className="rounded-lg border border-resync-border/60 bg-resync-bg/40 p-3">
                      <dt className="uppercase tracking-wider text-zinc-600">Outputs</dt>
                      <dd className="mt-1 font-mono text-zinc-300">{node.outputs}</dd>
                    </div>
                  </dl>

                  {node.params.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-600">Parameters</p>
                      <ul className="mt-2 space-y-2">
                        {node.params.map((p) => (
                          <li key={p.name} className="text-xs text-zinc-400">
                            <span className="font-mono text-zinc-200">{p.name}</span>
                            <span className="text-zinc-600"> : {p.type}</span>
                            {p.required && <span className="ml-2 text-rose-400">required</span>}
                            <p className="mt-0.5 text-zinc-500">{p.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
