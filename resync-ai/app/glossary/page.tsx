import type { Metadata } from "next";
import { PageHero, Panel, Pill } from "@/components/content/ContentKit";
import { glossaryByLetter } from "@/lib/content/glossary";

export const metadata: Metadata = {
  title: "Glossary — Resync AI",
  description: "Definitions for self-healing, refinement score, circuit breakers, and other Resync AI concepts.",
};

export default function GlossaryPage() {
  const byLetter = glossaryByLetter();
  const letters = Object.keys(byLetter).sort();

  return (
    <>
      <PageHero
        eyebrow="Glossary"
        title="The Resync AI vocabulary"
        lede="Plain-language definitions for the concepts you'll meet across the studio, builder, and runtime."
      />

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-10 flex flex-wrap gap-2">
          {letters.map((l) => (
            <a
              key={l}
              href={`#letter-${l}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-resync-border text-sm text-zinc-400 transition hover:border-cyan-500/40 hover:text-white"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="space-y-12">
          {letters.map((l) => (
            <section key={l} id={`letter-${l}`} className="scroll-mt-24">
              <h2 className="font-display text-2xl font-bold text-cyan-300">{l}</h2>
              <div className="mt-5 grid gap-4">
                {byLetter[l].map((t) => (
                  <Panel key={t.term}>
                    <h3 className="text-base font-semibold text-white">{t.term}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{t.definition}</p>
                    {t.related && t.related.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {t.related.map((r) => (
                          <Pill key={r}>{r}</Pill>
                        ))}
                      </div>
                    )}
                  </Panel>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
