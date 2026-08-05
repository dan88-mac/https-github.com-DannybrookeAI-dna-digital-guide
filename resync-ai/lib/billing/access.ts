import type { SubscriptionTier } from "@/types/database";

/** Pro and Enterprise tiers unlock full overview integrity scoring. */
export function canAccessOverviewScore(tier: SubscriptionTier): boolean {
  return tier === "PRO" || tier === "ENTERPRISE";
}

/** Subscription tiers that include official marketplace workflows at no extra cost. */
export function canAccessSubscriptionWorkflows(tier: SubscriptionTier): boolean {
  return tier === "STARTER" || tier === "PRO" || tier === "ENTERPRISE";
}

export const SUBSCRIBER_TIER_KEY = "resync-subscriber-tier";
export const PURCHASED_WORKFLOWS_KEY = "resync-purchased-workflows";

export function readSubscriberTier(): SubscriptionTier {
  if (typeof window === "undefined") return "FREE";
  const raw = localStorage.getItem(SUBSCRIBER_TIER_KEY);
  if (raw === "FREE" || raw === "STARTER" || raw === "PRO" || raw === "ENTERPRISE") {
    return raw;
  }
  return "FREE";
}

export function readPurchasedWorkflows(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PURCHASED_WORKFLOWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function recordPurchasedWorkflow(slug: string): void {
  const existing = readPurchasedWorkflows();
  if (!existing.includes(slug)) {
    localStorage.setItem(PURCHASED_WORKFLOWS_KEY, JSON.stringify([...existing, slug]));
  }
}
