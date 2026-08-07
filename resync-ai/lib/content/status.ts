export type ComponentState = "operational" | "degraded" | "outage" | "maintenance";

export interface StatusComponent {
  name: string;
  state: ComponentState;
  uptime90: number;
}

export interface StatusIncident {
  date: string;
  title: string;
  severity: "minor" | "major";
  resolved: boolean;
  summary: string;
}

export const STATUS_COMPONENTS: StatusComponent[] = [
  { name: "Web application", state: "operational", uptime90: 99.99 },
  { name: "Runtime / execute API", state: "operational", uptime90: 99.97 },
  { name: "Self-heal (LLM) pipeline", state: "operational", uptime90: 99.92 },
  { name: "Workflows API", state: "operational", uptime90: 99.98 },
  { name: "Stripe webhooks", state: "operational", uptime90: 99.99 },
  { name: "Database (Postgres)", state: "operational", uptime90: 99.995 },
  { name: "Marketplace", state: "operational", uptime90: 99.96 },
];

export const STATUS_INCIDENTS: StatusIncident[] = [
  {
    date: "2026-07-22",
    title: "Elevated self-heal latency",
    severity: "minor",
    resolved: true,
    summary:
      "A brief spike in LLM provider latency slowed self-heal attempts for ~18 minutes. Automatic backoff prevented failures; no data was affected.",
  },
  {
    date: "2026-06-11",
    title: "Marketplace search degraded",
    severity: "minor",
    resolved: true,
    summary:
      "Search indexing lagged behind writes for ~30 minutes. New listings appeared with a short delay; browsing was unaffected.",
  },
  {
    date: "2026-05-02",
    title: "Scheduled database maintenance",
    severity: "minor",
    resolved: true,
    summary:
      "Planned failover exercise completed within the maintenance window with no customer-visible downtime.",
  },
];

export function overallState(): ComponentState {
  if (STATUS_COMPONENTS.some((c) => c.state === "outage")) return "outage";
  if (STATUS_COMPONENTS.some((c) => c.state === "degraded")) return "degraded";
  if (STATUS_COMPONENTS.some((c) => c.state === "maintenance")) return "maintenance";
  return "operational";
}
