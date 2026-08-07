import type { Metadata } from "next";
import { PageHero, Pill, CtaRow } from "@/components/content/ContentKit";
import { CUSTOMER_STORIES } from "@/lib/content/customers";

export const metadata: Metadata = {
  title: "Customers — Resync AI",
  description: "Case studies and measurable results from teams shipping self-healing workflows with Resync AI.",
};

export default function CustomersPage() {
  return (
    <>
      <PageHero
        eyebrow="Customers"
        title="Teams that ship resilient workflows"
        lede="Real results from teams that replaced brittle automation with self-healing workflows."
      />

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-16">
        {CUSTOMER_STORIES.map((story) => (
          <article
            key={story.company}
            className="overflow-hidden rounded-3xl border border-resync-border/60 bg-resync-surface/40"
          >
            <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:p-10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 font-display text-sm font-bold text-white">
                    {story.logo}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{story.company}</p>
                    <Pill>{story.industry}</Pill>
                  </div>
                </div>
                <blockquote className="mt-6 font-display text-xl leading-relaxed text-zinc-100">
                  “{story.quote}”
                </blockquote>
                <p className="mt-4 text-sm text-zinc-500">
                  {story.person} — {story.role}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-zinc-400">{story.summary}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-1">
                {story.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-resync-border/60 bg-resync-bg/40 p-5 text-center md:text-left"
                  >
                    <p className="font-display text-3xl font-bold text-cyan-300">{m.value}</p>
                    <p className="mt-1 text-xs text-zinc-400">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}

        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-resync-surface/70 to-indigo-950/20 p-10 text-center">
          <h2 className="font-display text-2xl font-bold text-white">Ready to write your own story?</h2>
          <p className="mx-auto mt-3 max-w-lg text-zinc-400">
            Start on the free plan and build a workflow that heals itself.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaRow primary={{ href: "/studio", label: "Open studio" }} secondary={{ href: "/pricing", label: "See pricing" }} />
          </div>
        </div>
      </div>
    </>
  );
}
