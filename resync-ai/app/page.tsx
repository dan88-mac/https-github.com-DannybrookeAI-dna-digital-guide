import Link from "next/link";
import { MissionSection } from "@/components/marketing/MissionSection";
import { SocialProofBar } from "@/components/marketing/SocialProofBar";
import { CommunityWaitlistForm } from "@/components/marketing/CommunityWaitlistForm";
import { TemplateCard } from "@/components/marketing/TemplateCard";
import { COMMUNITY_TEMPLATES } from "@/lib/community/content";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 md:pt-28">
        <div className="max-w-3xl animate-fade-in">
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">
            Self-healing workflow SaaS
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Automations that <span className="text-gradient">recover</span>—so your community
            keeps trusting you
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            Resync AI repairs broken integrations in production, exports real Next.js code, and
            grows with a template library your team will revisit launch after launch.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/builder"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/50 hover:bg-indigo-500"
            >
              Start building free
            </Link>
            <Link
              href="/templates"
              className="rounded-xl border border-resync-border px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
            >
              Browse templates
            </Link>
          </div>
        </div>
      </section>

      <SocialProofBar />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Start from community-proven flows</h2>
            <p className="mt-2 text-zinc-400">Clone, customize, and publish back to help the next team.</p>
          </div>
          <Link href="/templates" className="text-sm text-indigo-400 hover:text-indigo-300">
            View all templates →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {COMMUNITY_TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </section>

      <MissionSection />

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="glass rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white">Join the Resync community</h2>
          <p className="mt-3 max-w-xl text-zinc-400">
            Early builders get template spotlights, revenue-share on published flows, and direct
            input on our roadmap.
          </p>
          <div className="mt-8">
            <CommunityWaitlistForm source="landing" />
          </div>
        </div>
      </section>
    </>
  );
}
