import type { Metadata } from "next";
import { PageHero, Panel, Pill } from "@/components/content/ContentKit";
import { SECURITY_PRACTICES, SECURITY_CERTS, SUBPROCESSORS } from "@/lib/content/security";

export const metadata: Metadata = {
  title: "Security & Trust — Resync AI",
  description: "How Resync AI protects your data: tenant isolation, encrypted secrets, audit logging, and compliance.",
};

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security & trust"
        title="Security is a design constraint"
        lede="Multi-tenant isolation, encrypted secrets, and auditable execution — built in from the first migration, not bolted on."
      />

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16">
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY_CERTS.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-5 text-center"
              >
                <p className="font-display text-base font-semibold text-white">{c.label}</p>
                <p className="mt-2 text-xs text-emerald-300">{c.state}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white">Our practices</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {SECURITY_PRACTICES.map((p) => (
              <Panel key={p.title}>
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.description}</p>
              </Panel>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white">Subprocessors</h2>
          <p className="mt-2 text-sm text-zinc-400">
            The third parties we rely on to deliver the service.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-resync-border/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-resync-surface/60 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3">Provider</th>
                  <th className="px-5 py-3">Purpose</th>
                  <th className="px-5 py-3">Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-resync-border/60">
                {SUBPROCESSORS.map((s) => (
                  <tr key={s.name} className="bg-resync-surface/20">
                    <td className="px-5 py-3 font-medium text-white">{s.name}</td>
                    <td className="px-5 py-3 text-zinc-400">{s.purpose}</td>
                    <td className="px-5 py-3">
                      <Pill>{s.location}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
