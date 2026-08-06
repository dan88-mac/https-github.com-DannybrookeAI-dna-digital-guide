import Link from "next/link";
import { FLEET_AGENTS, AGENT_SKILLS } from "@/lib/agents/fleet";
import { ContextInfo } from "@/components/ui/ContextInfo";

export default function AgentsPublicPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/70">Operations</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white">
        a-sync agent fleet
        <ContextInfo title="Human approval">
          Agents propose content and checks. Admins approve before anything publishes — fail-safe
          autonomy, not silent mutation.
        </ContextInfo>
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        Seven Hermes-styled roles look after security, sales, marketing, research, community, studio,
        and narration — sharing twenty-five skills focused on Resync&apos;s purpose.
      </p>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FLEET_AGENTS.map((a) => (
          <article key={a.id} className="glass rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-white">{a.name}</h2>
            <p className="mt-2 text-sm text-zinc-400">{a.job}</p>
            <p className="mt-4 text-[11px] uppercase tracking-wider text-cyan-400/70">
              {a.skillIds.length} skills
            </p>
          </article>
        ))}
      </div>
      <p className="mt-10 text-sm text-zinc-500">
        {AGENT_SKILLS.length} skills registered ·{" "}
        <Link href="/admin/login" className="text-zinc-400 underline-offset-2 hover:underline">
          Operator access
        </Link>
      </p>
    </div>
  );
}
