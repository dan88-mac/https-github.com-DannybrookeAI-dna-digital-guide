import type { Metadata } from "next";
import { PageHero, Panel, Pill } from "@/components/content/ContentKit";
import { JOB_OPENINGS, COMPANY_VALUES } from "@/lib/content/careers";

export const metadata: Metadata = {
  title: "Careers — Resync AI",
  description: "Open roles at Resync AI and how we work. Remote-first, builders welcome.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build software that heals"
        lede="We're a remote-first team building the workflow platform we always wanted. Everyone ships."
      />

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16">
        <section>
          <h2 className="font-display text-2xl font-bold text-white">How we work</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {COMPANY_VALUES.map((v) => (
              <Panel key={v.title}>
                <h3 className="text-base font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{v.description}</p>
              </Panel>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white">Open roles</h2>
          <div className="mt-6 space-y-4">
            {JOB_OPENINGS.map((job) => (
              <article
                key={job.title}
                className="group flex flex-col gap-4 rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-6 transition hover:border-cyan-500/40 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-white">{job.title}</h3>
                    <Pill tone="cyan">{job.team}</Pill>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{job.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span>{job.location}</span>
                    <span>·</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <span className="shrink-0 rounded-xl border border-resync-border px-5 py-2.5 text-sm font-semibold text-white transition group-hover:border-cyan-500/40 group-hover:text-cyan-300">
                  Apply →
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
