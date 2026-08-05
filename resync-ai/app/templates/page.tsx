import { COMMUNITY_TEMPLATES } from "@/lib/community/content";
import { TemplateCard } from "@/components/marketing/TemplateCard";

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Template gallery</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        Jump in with flows battle-tested by the community. Customize in the builder and come back
        whenever you need the same pattern again.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COMMUNITY_TEMPLATES.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
    </div>
  );
}
