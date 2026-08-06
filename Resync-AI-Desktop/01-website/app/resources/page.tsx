import Link from "next/link";

const resources = [
  {
    title: "Multimodal module catalog",
    desc: "Browse 260+ vision, voice, text, and integration modules with pairing guidance.",
    href: "/multimodal",
    cta: "Open catalog",
  },
  {
    title: "Official workflow marketplace",
    desc: "Free and paid a-sync approved workflows — clone or purchase templates.",
    href: "/marketplace",
    cta: "Browse marketplace",
  },
  {
    title: "Overview integrity score",
    desc: "Scientific-style quality index for your builder draft — pillars, findings, and blueprint.",
    href: "/overview-score",
    cta: "View score",
  },
  {
    title: "Builder & refinement",
    desc: "Compose graphs, validate structure, and tune resilience before export.",
    href: "/builder",
    cta: "Open builder",
  },
  {
    title: "Pricing & tiers",
    desc: "Community, Builder, Pro, and Enterprise plans with marketplace fee breakdown.",
    href: "/pricing",
    cta: "See pricing",
  },
  {
    title: "Legal & policies",
    desc: "Privacy, terms, acceptable use, and trademark guidance for production deployments.",
    href: "/privacy",
    cta: "Read policies",
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Resources</h1>
      <p className="mt-4 text-zinc-400">
        Guides and entry points to Resync product surfaces — no fluff, just where to go next.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {resources.map((r) => (
          <article key={r.title} className="glass flex flex-col rounded-2xl p-6">
            <h2 className="font-semibold text-white">{r.title}</h2>
            <p className="mt-2 flex-1 text-sm text-zinc-400">{r.desc}</p>
            <Link
              href={r.href}
              className="mt-4 inline-flex w-fit rounded-lg border border-indigo-500/40 px-4 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-600/20"
            >
              {r.cta} →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
