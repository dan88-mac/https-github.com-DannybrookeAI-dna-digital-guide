import type { SubscriptionTier } from "@/types/database";

export type { SubscriptionTier };

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
      "3-node canvas limit",
      "Browse community templates",
      "500 self-heal credits / mo",
      "PWA offline drafts",
    ],
    stripePriceEnv: "",
  },
  {
    id: "STARTER",
    name: "Builder",
    priceLabel: "$39",
    creditsPerMonth: 8_000,
    features: [
      "Full node palette",
      "Idea-to-canvas generation",
      "Code export to Next.js",
      "8,000 credits / mo",
      "Publish free community templates",
    ],
    stripePriceEnv: "STRIPE_PRICE_STARTER",
  },
  {
    id: "PRO",
    name: "Pro",
    priceLabel: "$129",
    creditsPerMonth: 40_000,
    highlighted: true,
    features: [
      "Monster scale — up to 50 modules",
      "Sell on the marketplace",
      "Priority self-healing",
      "Team roles & audit log",
      "40,000 credits / mo",
    ],
    stripePriceEnv: "STRIPE_PRICE_PRO",
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    priceLabel: "Custom",
    creditsPerMonth: 500_000,
    features: [
      "SSO & organization controls",
      "Custom SLAs & integrations",
      "Dedicated success engineer",
      "12% total marketplace fee (vs 20%)",
      "Volume credits & VPC options",
    ],
    stripePriceEnv: "STRIPE_PRICE_ENTERPRISE",
  },
];

export const MARKETPLACE_FEES = {
  standardBuyerPercent: 10,
  standardSellerPercent: 10,
  standardTotalPercent: 20,
  enterpriseTotalPercent: 12,
} as const;

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
