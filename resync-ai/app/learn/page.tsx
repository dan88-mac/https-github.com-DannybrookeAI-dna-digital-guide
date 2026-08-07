import type { Metadata } from "next";
import { PageHero, Pill, type PillTone } from "@/components/content/ContentKit";
import { LEARNING_PATHS, totalMinutes, type LearningPath } from "@/lib/content/learn";

export const metadata: Metadata = {
  title: "Learn — Resync AI",
  description: "Structured learning paths from your first workflow to advanced multimodal pipelines.",
};

const LEVEL_TONE: Record<LearningPath["level"], PillTone> = {
  Beginner: "green",
  Intermediate: "cyan",
  Advanced: "indigo",
};

export default function LearnPage() {
  return (
    <>
      <PageHero
        eyebrow="Learn"
        title="From first flow to production"
        lede="Follow a path end-to-end. Each lesson builds on the last, with hands-on steps you can try in the builder."
      />

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-16">
        {LEARNING_PATHS.map((path) => (
          <article key={path.slug} className="rounded-3xl border border-resync-border/60 bg-resync-surface/40 p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <div className="flex items-center gap-3">
                  <Pill tone={LEVEL_TONE[path.level]}>{path.level}</Pill>
                  <span className="font-mono text-xs text-zinc-500">
                    {path.lessons.length} lessons · {totalMinutes(path)}m
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold text-white">{path.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{path.blurb}</p>

                <p className="mt-6 text-xs uppercase tracking-wider text-zinc-600">You'll be able to</p>
                <ul className="mt-3 space-y-2">
                  {path.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-zinc-300">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              <ol className="space-y-3">
                {path.lessons.map((lesson, i) => (
                  <li
                    key={lesson.title}
                    className="flex items-start gap-4 rounded-xl border border-resync-border/60 bg-resync-bg/40 p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 font-mono text-sm text-cyan-300">
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{lesson.title}</h3>
                        <span className="font-mono text-[11px] text-zinc-600">{lesson.minutes}m</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">{lesson.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
