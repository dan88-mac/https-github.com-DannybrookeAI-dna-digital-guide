const stats = [
  { label: "Self-healed runs", value: "2.4M+" },
  { label: "Community templates", value: "180+" },
  { label: "Teams worldwide", value: "12k+" },
  { label: "Avg. return visits / mo", value: "8.2" },
];

export function SocialProofBar() {
  return (
    <section className="border-y border-resync-border/60 bg-resync-surface/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-white md:text-3xl">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
