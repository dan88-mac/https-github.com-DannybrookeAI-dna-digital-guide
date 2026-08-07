import type { Metadata } from "next";
import { PageHero, Pill } from "@/components/content/ContentKit";
import { ROADMAP, ROADMAP_STAGES, type RoadmapStage } from "@/lib/content/roadmap";

export const metadata: Metadata = {
  title: "Roadmap — Resync AI",
  description: "What Resync AI is building now, next, and later — with community vote counts.",
};

const STAGE_TONE: Record<RoadmapStage, "cyan" | "indigo" | "neutral"> = {
  Now: "cyan",
  Next: "indigo",
  Later: "neutral",
};

const STAGE_BLURB: Record<RoadmapStage, string> = {
  Now: "In active development",
  Next: "Up next this quarter",
  Later: "On the horizon",
};

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Roadmap"
        title="Where Resync is headed"
        lede="A transparent view of what we're building. Vote counts reflect community demand — the loudest signals rise to the top."
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {ROADMAP_STAGES.map((stage) => {
            const items = ROADMAP.filter((r) => r.stage === stage).sort((a, b) => b.votes - a.votes);
            return (
              <div key={stage} className="rounded-2xl border border-resync-border/60 bg-resync-surface/30 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Pill tone={STAGE_TONE[stage]}>{stage}</Pill>
                    <p className="mt-2 text-xs text-zinc-500">{STAGE_BLURB[stage]}</p>
                  </div>
                  <span className="font-mono text-xs text-zinc-600">{items.length}</span>
                </div>
                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-xl border border-resync-border/60 bg-resync-bg/40 p-4 transition hover:border-cyan-500/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                        <span className="flex shrink-0 items-center gap-1 rounded-lg border border-resync-border px-2 py-1 font-mono text-xs text-cyan-300">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3l6 7H4l6-7z" />
                          </svg>
                          {item.votes}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.description}</p>
                      <p className="mt-3 text-[11px] uppercase tracking-wider text-zinc-600">{item.tag}</p>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
