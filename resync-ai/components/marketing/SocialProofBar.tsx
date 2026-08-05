const highlights = [
  "Self-healing runtime",
  "Exportable Next.js code",
  "Community templates",
  "Multimodal canvas",
];

export function SocialProofBar() {
  return (
    <section className="border-y border-resync-border/40 bg-resync-surface/20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-8">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Built for teams who ship workflows that last
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {highlights.map((h) => (
            <span
              key={h}
              className="font-mono text-xs text-zinc-400 before:mr-2 before:text-cyan-500/60 before:content-['◆']"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
