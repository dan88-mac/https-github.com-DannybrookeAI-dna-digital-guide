const resources = [
  {
    title: "Self-healing playbooks",
    desc: "When to patch schema vs. trigger fallback endpoints in production.",
  },
  {
    title: "Template authoring guide",
    desc: "Publish flows to the gallery and qualify for community revenue share.",
  },
  {
    title: "Stripe + Supabase setup",
    desc: "Connect billing and multi-tenant RLS in under an hour.",
  },
  {
    title: "Customer story: nonprofit intake",
    desc: "How volunteer onboarding went from 40% failures to 99% healed runs.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Resources</h1>
      <p className="mt-4 text-zinc-400">Guides and stories to help you ship—and come back smarter.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {resources.map((r) => (
          <article key={r.title} className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white">{r.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{r.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
