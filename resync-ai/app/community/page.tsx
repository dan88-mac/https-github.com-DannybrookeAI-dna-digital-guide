import { COMMUNITY_TEMPLATES, MISSION_PILLARS } from "@/lib/community/content";
import { CommunityWaitlistForm } from "@/components/marketing/CommunityWaitlistForm";
import { TemplateCard } from "@/components/marketing/TemplateCard";

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">A community that builds together</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-400">
        Publish templates, earn visibility, and help teams worldwide ship reliable automation.
        Resync is purpose-driven SaaS—your workflows outlive a single project.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {MISSION_PILLARS.map((p) => (
          <article key={p.title} className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white">{p.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{p.body}</p>
          </article>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-semibold text-white">Featured community templates</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {COMMUNITY_TEMPLATES.slice(0, 2).map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </section>

      <section className="glass mt-16 rounded-3xl p-8">
        <h2 className="text-xl font-semibold text-white">Get community updates</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Template drops, revenue-share program, and builder spotlights—no spam.
        </p>
        <div className="mt-6">
          <CommunityWaitlistForm source="community" />
        </div>
      </section>
    </div>
  );
}
