import Link from "next/link";
import { HeroImmersive } from "@/components/marketing/HeroImmersive";
import { SocialProofBar } from "@/components/marketing/SocialProofBar";
import { FeatureVideoShowcase } from "@/components/marketing/FeatureVideoShowcase";
import { ScaleShowcase } from "@/components/marketing/ScaleShowcase";
import { CommunityWaitlistForm } from "@/components/marketing/CommunityWaitlistForm";
import { AnimatedSection } from "@/components/marketing/ShowcaseAnimations";

const steps = [
  {
    num: "01",
    title: "Sketch on the canvas",
    body: "Drop nodes for triggers, transforms, and outputs. Wire multimodal paths with drag-and-connect—no YAML archaeology.",
  },
  {
    num: "02",
    title: "Test with live data",
    body: "Run flows against real payloads in the studio. Watch packets route, failures surface, and self-heal kick in before deploy.",
  },
  {
    num: "03",
    title: "Export and ship",
    body: "Generate production Next.js routes, publish templates to the community, and monitor from the same graph you built.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroImmersive />

      <SocialProofBar />

      <FeatureVideoShowcase />

      <ScaleShowcase />

      <AnimatedSection animation="fadeRise" className="mx-auto max-w-6xl px-4 py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            How it works
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Three steps from idea to production
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <article
              key={s.num}
              className="animate-fade-rise relative rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-8"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <span className="font-mono text-4xl font-bold text-cyan-500/20">{s.num}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.body}</p>
            </article>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection animation="glowPulse" className="mx-auto max-w-6xl px-4 py-24 pb-32">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-resync-surface/80 via-resync-surface/60 to-indigo-950/30 p-10 md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl" />

          <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Ready to build something that lasts?
          </h2>
          <p className="mt-4 max-w-xl text-zinc-400">
            Open the studio, wire your first canvas, or join builders sharing templates in the
            community. Plans: Community $0 · Builder $39 · Pro $129.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/studio"
              className="rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-900/20 transition hover:brightness-110"
            >
              Open studio
            </Link>
            <Link
              href="/builder"
              className="rounded-xl border border-resync-border px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Launch builder
            </Link>
            <Link
              href="/community"
              className="rounded-xl border border-resync-border px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Join community
            </Link>
          </div>

          <div className="mt-10 border-t border-resync-border/40 pt-8">
            <p className="text-sm text-zinc-500">
              Want early access to template spotlights and roadmap input?
            </p>
            <div className="mt-4 max-w-lg">
              <CommunityWaitlistForm source="landing-cta" />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
