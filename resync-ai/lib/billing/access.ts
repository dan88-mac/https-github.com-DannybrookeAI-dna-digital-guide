import type { SubscriptionTier } from "@/types/database";

/** Pro and Enterprise tiers unlock full overview integrity scoring. */
export function canAccessOverviewScore(tier: SubscriptionTier): boolean {
  return tier === "PRO" || tier === "ENTERPRISE";
}

/** Subscription tiers that include official marketplace workflows at no extra cost. */
export function canAccessSubscriptionWorkflows(tier: SubscriptionTier): boolean {
  return tier === "STARTER" || tier === "PRO" || tier === "ENTERPRISE";
}

/** Full node palette + idea-to-canvas + export */
export function canAccessFullBuilder(tier: SubscriptionTier): boolean {
  return tier === "STARTER" || tier === "PRO" || tier === "ENTERPRISE";
}

/** Monster scale up to 50 modules + marketplace sell */
export function canAccessProCanvas(tier: SubscriptionTier): boolean {
  return tier === "PRO" || tier === "ENTERPRISE";
}

export function maxModulesForTier(tier: SubscriptionTier): number {
  if (tier === "FREE") return 3;
  if (tier === "STARTER") return 20;
  return 50;
}

export type GateFeature =
  | "overview_score"
  | "full_builder"
  | "pro_canvas"
  | "marketplace_sell"
  | "subscription_workflows";

export function canAccessFeature(tier: SubscriptionTier, feature: GateFeature): boolean {
  switch (feature) {
    case "overview_score":
    case "pro_canvas":
    case "marketplace_sell":
      return canAccessProCanvas(tier);
    case "full_builder":
    case "subscription_workflows":
      return canAccessFullBuilder(tier);
    default:
      return false;
  }
}

export function upgradeHint(feature: GateFeature): { title: string; body: string; cta: string } {
  if (feature === "full_builder" || feature === "subscription_workflows") {
    return {
      title: "Builder plan required",
      body: "Unlock the full palette, idea-to-canvas, and export on Builder ($39/mo) and above.",
      cta: "See Builder pricing",
    };
  }
  return {
    title: "Pro plan required",
    body: "Unlock 50-module scale, marketplace selling, and full overview scoring on Pro ($129/mo).",
    cta: "Upgrade to Pro",
  };
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
