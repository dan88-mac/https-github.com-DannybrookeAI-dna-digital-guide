export type NotifyLevel = "info" | "warn" | "critical" | "success";

export interface NotifyItem {
  id: string;
  level: NotifyLevel;
  title: string;
  detail: string;
  focus: string;
  at: string;
}

const BASE: Omit<NotifyItem, "id" | "at">[] = [
  {
    level: "info",
    title: "Curator draft ready",
    detail: "Community seed awaiting approval",
    focus: "community",
  },
  {
    level: "success",
    title: "Price audit clean",
    detail: "Public copy matches tiers.ts",
    focus: "billing",
  },
  {
    level: "warn",
    title: "Login health soft warn",
    detail: "Supabase env missing in preview — admin shell gated",
    focus: "auth",
  },
  {
    level: "critical",
    title: "Unauthorized admin probe",
    detail: "Blocked non-admin session → security_events",
    focus: "security",
  },
  {
    level: "info",
    title: "Overseer digest",
    detail: "Heal rate stable; studio method pack at 50",
    focus: "fleet",
  },
  {
    level: "success",
    title: "Cron orchestra OK",
    detail: "price-audit · login-health · community-draft",
    focus: "ops",
  },
  {
    level: "info",
    title: "Upsell cadence",
    detail: "Popup cap 1 / 18m session",
    focus: "marketing",
  },
  {
    level: "warn",
    title: "Pending subscribers",
    detail: "Checkout incomplete — Herald follow-up queue",
    focus: "sales",
  },
];

export function streamNotifications(tick = 0): NotifyItem[] {
  const now = Date.now();
  return BASE.map((b, i) => ({
    ...b,
    id: `n-${i}-${(tick + i) % 97}`,
    at: new Date(now - i * 90_000 - (tick % 7) * 1000).toISOString(),
  })).sort((a, b) => (a.at < b.at ? 1 : -1));
}
