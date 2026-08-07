import type { Metadata } from "next";
import { PageHero } from "@/components/content/ContentKit";
import {
  STATUS_COMPONENTS,
  STATUS_INCIDENTS,
  overallState,
  type ComponentState,
} from "@/lib/content/status";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "System status — Resync AI",
  description: "Live component uptime and incident history for the Resync AI platform.",
};

const STATE_COLOR: Record<ComponentState, string> = {
  operational: "bg-emerald-400",
  degraded: "bg-amber-400",
  outage: "bg-rose-500",
  maintenance: "bg-sky-400",
};

const STATE_LABEL: Record<ComponentState, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
  maintenance: "Maintenance",
};

export default function StatusPage() {
  const overall = overallState();

  return (
    <>
      <PageHero
        eyebrow="Status"
        title="System status"
        lede="Real-time health of every Resync AI component, plus recent incident history."
      >
        <div className="inline-flex items-center gap-3 rounded-xl border border-resync-border/60 bg-resync-surface/40 px-5 py-3">
          <span className={cn("h-3 w-3 rounded-full", STATE_COLOR[overall], "animate-glow-pulse")} />
          <span className="text-sm font-medium text-white">
            {overall === "operational" ? "All systems operational" : STATE_LABEL[overall]}
          </span>
        </div>
      </PageHero>

      <div className="mx-auto max-w-4xl space-y-14 px-4 py-16">
        <section>
          <h2 className="font-display text-xl font-bold text-white">Components</h2>
          <div className="mt-5 divide-y divide-resync-border/60 overflow-hidden rounded-2xl border border-resync-border/60">
            {STATUS_COMPONENTS.map((c) => (
              <div key={c.name} className="flex items-center justify-between gap-4 bg-resync-surface/20 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className={cn("h-2.5 w-2.5 rounded-full", STATE_COLOR[c.state])} />
                  <span className="text-sm text-white">{c.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-zinc-500">{c.uptime90.toFixed(2)}% · 90d</span>
                  <span className="text-xs text-emerald-300">{STATE_LABEL[c.state]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-white">Incident history</h2>
          <div className="mt-5 space-y-4">
            {STATUS_INCIDENTS.map((i) => (
              <article key={i.date} className="rounded-2xl border border-resync-border/60 bg-resync-surface/30 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{i.title}</h3>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs",
                      i.resolved
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                    )}
                  >
                    {i.resolved ? "Resolved" : "Monitoring"}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {i.date} · {i.severity}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{i.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
