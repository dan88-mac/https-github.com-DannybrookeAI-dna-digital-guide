/** Shared skills + Hermes-styled agent roster for Resync ops console */

export interface AgentSkill {
  id: string;
  name: string;
  purpose: string;
}

export const AGENT_SKILLS: AgentSkill[] = [
  { id: "security_scan", name: "Security scan", purpose: "Inspect auth anomalies and CSP posture" },
  { id: "price_sync", name: "Price sync", purpose: "Diff public copy vs tiers.ts" },
  { id: "login_health", name: "Login health", purpose: "Probe auth config and /api/health" },
  { id: "content_freshness", name: "Content freshness", purpose: "Flag stale landing sections" },
  { id: "community_seed", name: "Community seed", purpose: "Draft moderated community posts" },
  { id: "seo_draft", name: "SEO draft", purpose: "Propose template SEO titles" },
  { id: "competitor_watch", name: "Competitor watch", purpose: "Summarize allowlisted industry notes" },
  { id: "legal_calendar", name: "Legal calendar", purpose: "Remind counsel/filing checkpoints" },
  { id: "uptime_pulse", name: "Uptime pulse", purpose: "Track health endpoint latency" },
  { id: "dependency_audit", name: "Dependency audit", purpose: "Note outdated package advisories" },
  { id: "upsell_cadence", name: "Upsell cadence", purpose: "Tune popup frequency caps" },
  { id: "tier_gates", name: "Tier gates", purpose: "Verify gated routes still locked" },
  { id: "heal_metrics", name: "Heal metrics", purpose: "Aggregate self-heal success signals" },
  { id: "overview_grades", name: "Overview grades", purpose: "Track graph grade distribution" },
  { id: "marketplace_fees", name: "Marketplace fees", purpose: "Validate 20%/12% fee copy" },
  { id: "module_docs", name: "Module docs", purpose: "Ensure catalog explainers render" },
  { id: "code_panel", name: "Code panel", purpose: "Check export side panel integrity" },
  { id: "studio_templates", name: "Studio templates", purpose: "Suggest agentic graph templates" },
  { id: "narrator_digest", name: "Narrator digest", purpose: "Compose Overseer status narrative" },
  { id: "analytics_rollups", name: "Analytics rollups", purpose: "Daily visits/flows counters" },
  { id: "secret_hygiene", name: "Secret hygiene", purpose: "Ensure no secrets in client bundles" },
  { id: "csp_inspect", name: "CSP inspect", purpose: "Secure inspect-mode checklist" },
  { id: "social_kit", name: "Social kit", purpose: "Refresh share cards and quotes" },
  { id: "cron_orchestrate", name: "Cron orchestrate", purpose: "Coordinate scheduled jobs" },
  { id: "approve_queue", name: "Approve queue", purpose: "Surface pending human approvals" },
];

export type AgentId =
  | "sentinel"
  | "herald"
  | "beacon"
  | "scout"
  | "curator"
  | "forge"
  | "overseer";

export interface FleetAgent {
  id: AgentId;
  name: string;
  job: string;
  skillIds: string[];
  status: "idle" | "running" | "attention";
}

export const FLEET_AGENTS: FleetAgent[] = [
  {
    id: "sentinel",
    name: "Sentinel",
    job: "Security, auth anomalies, inspect-mode guards",
    skillIds: ["security_scan", "login_health", "secret_hygiene", "csp_inspect", "tier_gates"],
    status: "idle",
  },
  {
    id: "herald",
    name: "Herald",
    job: "Sales, pricing consistency, upsell popups",
    skillIds: ["price_sync", "upsell_cadence", "marketplace_fees", "tier_gates"],
    status: "idle",
  },
  {
    id: "beacon",
    name: "Beacon",
    job: "Marketing and landing freshness",
    skillIds: ["content_freshness", "seo_draft", "social_kit"],
    status: "idle",
  },
  {
    id: "scout",
    name: "Scout",
    job: "Allowlisted competitive digests",
    skillIds: ["competitor_watch", "seo_draft"],
    status: "idle",
  },
  {
    id: "curator",
    name: "Curator",
    job: "Community quality and moderation drafts",
    skillIds: ["community_seed", "approve_queue", "heal_metrics"],
    status: "idle",
  },
  {
    id: "forge",
    name: "Forge",
    job: "Studio templates and module suggestions",
    skillIds: ["studio_templates", "module_docs", "code_panel", "overview_grades"],
    status: "idle",
  },
  {
    id: "overseer",
    name: "Overseer",
    job: "Narrator: site-wide summary, upgrades, status",
    skillIds: ["narrator_digest", "analytics_rollups", "cron_orchestrate", "approve_queue", "uptime_pulse", "dependency_audit", "legal_calendar"],
    status: "idle",
  },
];

export function thoughtStream(agent: FleetAgent, tick: number): string {
  const skill = agent.skillIds[tick % agent.skillIds.length];
  const skillName = AGENT_SKILLS.find((s) => s.id === skill)?.name ?? skill;
  const lines = [
    `Initializing ${agent.name} context…`,
    `Loading skill “${skillName}”…`,
    `Comparing live signals against Resync baselines…`,
    `Drafting proposal — awaiting admin approval (fail-safe).`,
    `Memory write: working→reverse snapshot v${(tick % 5) + 1}.`,
  ];
  return lines.slice(0, (tick % lines.length) + 1).join(" ");
}
