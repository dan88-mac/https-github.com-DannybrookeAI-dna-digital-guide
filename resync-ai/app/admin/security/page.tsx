import Link from "next/link";

const CHECKS = [
  "No secrets in client bundles",
  "Admin routes require app_role=admin",
  "Failed admin logins emit security_events",
  "Service role key server-only",
  "CSP / no eval in workflow runtime",
  "Tier gates on Pro features",
  "Cron jobs HMAC or Vercel cron secret",
];

export default function AdminSecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/70">
        Secure inspect mode
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white">Code & access integrity</h1>
      <p className="mt-3 text-sm text-zinc-400">
        Production checklist for Resync AI. Unauthorized admin entry is blocked ASAP and reported.
      </p>
      <ul className="mt-8 space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c}
            className="flex items-start gap-3 rounded-xl border border-resync-border/70 bg-resync-surface/30 px-4 py-3 text-sm text-zinc-300"
          >
            <span className="mt-0.5 text-cyan-400">▣</span>
            {c}
          </li>
        ))}
      </ul>
      <Link href="/admin/agents" className="mt-8 inline-block text-sm text-cyan-300 hover:text-cyan-200">
        ← Agent fleet
      </Link>
    </div>
  );
}
