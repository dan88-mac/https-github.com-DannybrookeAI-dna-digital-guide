import { MISSION_PILLARS } from "@/lib/community/content";

export function MissionSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Purpose-built for teams who <span className="text-gradient">keep coming back</span>
        </h2>
        <p className="mt-4 text-zinc-400">
          Resync is not a one-off automation toy. It is the place you return when integrations
          break, launches loom, and your community is counting on reliable software.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {MISSION_PILLARS.map((p) => (
          <article key={p.title} className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-white">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
