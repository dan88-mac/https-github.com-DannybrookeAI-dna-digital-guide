import type { Metadata } from "next";
import { PageHero, Pill, type PillTone } from "@/components/content/ContentKit";
import { endpointsByGroup, type HttpMethod } from "@/lib/content/apiReference";

export const metadata: Metadata = {
  title: "API reference — Resync AI",
  description: "REST endpoints for the Resync AI runtime, workflows, telemetry, and webhooks.",
};

const METHOD_TONE: Record<HttpMethod, PillTone> = {
  GET: "green",
  POST: "cyan",
  PUT: "indigo",
  PATCH: "amber",
  DELETE: "rose",
};

export default function ApiReferencePage() {
  const groups = endpointsByGroup();
  const groupNames = Object.keys(groups);

  return (
    <>
      <PageHero
        eyebrow="API reference"
        title="Resync AI REST API"
        lede="Trigger workflows, run the self-heal runtime, and stream telemetry. All endpoints require an API key except /api/health."
      >
        <div className="rounded-xl border border-resync-border/60 bg-resync-bg/60 p-4 font-mono text-xs text-zinc-400">
          <span className="text-zinc-600"># Authenticate every request</span>
          <br />
          Authorization: Bearer <span className="text-cyan-300">rk_live_…</span>
        </div>
      </PageHero>

      <div className="mx-auto max-w-4xl space-y-14 px-4 py-16">
        {groupNames.map((group) => (
          <section key={group}>
            <h2 className="font-display text-xl font-bold text-white">{group}</h2>
            <div className="mt-5 space-y-6">
              {groups[group].map((ep) => (
                <article key={ep.path} className="overflow-hidden rounded-2xl border border-resync-border/60 bg-resync-surface/30">
                  <div className="flex items-center gap-3 border-b border-resync-border/60 px-5 py-3">
                    <Pill tone={METHOD_TONE[ep.method]}>{ep.method}</Pill>
                    <code className="font-mono text-sm text-white">{ep.path}</code>
                  </div>
                  <div className="grid gap-6 p-5 md:grid-cols-[1fr_1fr]">
                    <div>
                      <p className="text-sm text-zinc-400">{ep.summary}</p>
                      {ep.params.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs uppercase tracking-wider text-zinc-600">Parameters</p>
                          <ul className="mt-2 space-y-2">
                            {ep.params.map((p) => (
                              <li key={p.name} className="text-xs">
                                <span className="font-mono text-zinc-200">{p.name}</span>
                                <span className="text-zinc-600"> : {p.type}</span>
                                {p.required && <span className="ml-2 text-rose-400">required</span>}
                                <p className="mt-0.5 text-zinc-500">{p.description}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-600">Sample response</p>
                      <pre className="mt-2 overflow-x-auto rounded-lg border border-resync-border/60 bg-resync-bg/60 p-4 font-mono text-xs leading-relaxed text-cyan-100">
                        {ep.sampleResponse}
                      </pre>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
