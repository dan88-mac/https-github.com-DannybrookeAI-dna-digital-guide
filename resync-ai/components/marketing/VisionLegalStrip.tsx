import Link from "next/link";
import { AnimatedSection } from "@/components/marketing/ShowcaseAnimations";

export function VisionLegalStrip() {
  return (
    <AnimatedSection
      animation="transitionLap"
      className="border-y border-resync-border/40 bg-resync-surface/20"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center">
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
          <span className="font-medium text-zinc-200">Our vision:</span> automation infrastructure
          that earns trust over years—not disposable scripts that break quietly. Resync is built
          for teams who return, repair, and ship again.
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/vision" className="text-cyan-400/90 transition hover:text-cyan-300">
            Vision
          </Link>
          <Link href="/privacy" className="text-zinc-400 transition hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="text-zinc-400 transition hover:text-white">
            Terms
          </Link>
        </nav>
      </div>
    </AnimatedSection>
  );
}
