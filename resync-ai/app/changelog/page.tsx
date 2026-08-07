import type { Metadata } from "next";
import { PageHero, Pill, type PillTone } from "@/components/content/ContentKit";
import { CHANGELOG, type ChangeTag } from "@/lib/content/changelog";

export const metadata: Metadata = {
  title: "Changelog — Resync AI",
  description: "Every Resync AI release, tagged by feature, improvement, fix, and security.",
};

const TAG_TONE: Record<ChangeTag, PillTone> = {
  feature: "cyan",
  improvement: "indigo",
  fix: "green",
  security: "rose",
};

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title="Everything we've shipped"
        lede="Product updates and platform changes, newest first. Subscribe from any page to get release notes in your inbox."
      />

      <div className="mx-auto max-w-4xl px-4 py-16">
        <ol className="relative space-y-12 border-l border-resync-border/60 pl-8">
          {CHANGELOG.map((entry) => (
            <li key={entry.version} className="relative">
              <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border border-cyan-500/40 bg-resync-bg">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Pill tone="cyan">v{entry.version}</Pill>
                <time className="font-mono text-xs text-zinc-500">{entry.date}</time>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-white">{entry.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{entry.summary}</p>
              <ul className="mt-5 space-y-2.5">
                {entry.changes.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Pill tone={TAG_TONE[c.tag]}>{c.tag}</Pill>
                    <span className="pt-0.5">{c.text}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
