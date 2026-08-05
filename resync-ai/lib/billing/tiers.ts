import type { SubscriptionTier } from "@/types/database";

export interface TierConfig {
  id: SubscriptionTier;
  name: string;
  priceLabel: string;
  creditsPerMonth: number;
  features: string[];
  highlighted?: boolean;
  stripePriceEnv: string;
}

export const TIERS: TierConfig[] = [
  {
    id: "FREE",
    name: "Community",
    priceLabel: "$0",
    creditsPerMonth: 500,
    features: [
      "Visual workflow builder",
      "500 self-heal credits / mo",
      "Community templates",
      "PWA offline drafts",
    ],
    stripePriceEnv: "",
  },
  {
    id: "STARTER",
    name: "Starter",
    priceLabel: "$29",
    creditsPerMonth: 5_000,
    features: [
      "Everything in Community",
      "5,000 credits / mo",
      "Email support",
      "Code export to Next.js",
    ],
    stripePriceEnv: "STRIPE_PRICE_STARTER",
  },
  {
    id: "PRO",
    name: "Pro",
    priceLabel: "$99",
    creditsPerMonth: 25_000,
    highlighted: true,
    features: [
      "Everything in Starter",
      "25,000 credits / mo",
      "Team roles & audit log",
      "Priority self-healing",
      "Outbound webhooks",
    ],
    stripePriceEnv: "STRIPE_PRICE_PRO",
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    priceLabel: "Custom",
    creditsPerMonth: 500_000,
    features: [
      "Unlimited orgs & SSO",
      "Dedicated success engineer",
      "Custom SLAs & VPC options",
      "Community spotlight & co-marketing",
    ],
    stripePriceEnv: "STRIPE_PRICE_ENTERPRISE",
  },
];

export function creditsForTier(tier: SubscriptionTier): number {
  const found = TIERS.find((t) => t.id === tier);
  return found?.creditsPerMonth ?? 500;
}

export function tierFromStripePrice(priceId: string): SubscriptionTier {
  if (priceId === process.env.STRIPE_PRICE_STARTER) return "STARTER";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "PRO";
  if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) return "ENTERPRISE";
  return "FREE";
}
