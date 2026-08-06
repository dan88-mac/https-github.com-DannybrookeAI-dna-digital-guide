import { AnimatedSection } from "@/components/marketing/ShowcaseAnimations";

const reviews = [
  {
    quote:
      "We replaced three brittle Zapier chains with one Resync canvas. When our CRM webhook changed shape, the self-heal layer caught it before anyone on-call noticed.",
    role: "Platform engineer",
    company: "B2B analytics startup",
    highlight: "Self-heal saved a weekend",
  },
  {
    quote:
      "Exporting to real Next.js routes was the selling point for our security review. We could audit the generated code instead of trusting a black-box runtime.",
    role: "Staff engineer",
    company: "Healthcare SaaS",
    highlight: "Code export passed review",
  },
  {
    quote:
      "The studio view finally gives our ops team a single diagram of what runs in production. Onboarding a new teammate used to take weeks of tribal knowledge.",
    role: "Head of operations",
    company: "E-commerce platform",
    highlight: "Faster team onboarding",
  },
  {
    quote:
      "Branching logic on the canvas is intuitive enough that our product managers prototype flows before engineering commits sprint capacity.",
    role: "Product lead",
    company: "Fintech API",
    highlight: "PM-friendly prototyping",
  },
  {
    quote:
      "Failover lanes between enrichment modules mean we don't wake up to silent data gaps anymore. Observability hooks are built into the graph, not bolted on.",
    role: "SRE",
    company: "Logistics tech",
    highlight: "Built-in observability",
  },
  {
    quote:
      "We started with a five-node webhook flow and grew to a multi-region mesh without switching tools. The mental model stayed consistent the whole way.",
    role: "Founding engineer",
    company: "Developer tools",
    highlight: "Scales with the team",
  },
];

export function ReviewsSection() {
  return (
    <AnimatedSection animation="fadeRise" className="mx-auto max-w-6xl px-4 py-24">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/70">
          Builder voices
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
          Teams shipping with Resync
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-400">
          Early adopters across ops, platform, and product—sharing what changed after
          moving workflows onto the canvas.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <article
            key={r.highlight}
            className="animate-fade-rise flex flex-col rounded-2xl border border-resync-border/60 bg-resync-surface/50 p-6 transition hover:border-cyan-500/20 hover:bg-resync-surface/80"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/80">
              {r.highlight}
            </p>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <footer className="mt-6 border-t border-resync-border/40 pt-4">
              <p className="text-sm font-medium text-white">{r.role}</p>
              <p className="text-xs text-zinc-500">{r.company}</p>
            </footer>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
