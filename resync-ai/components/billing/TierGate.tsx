"use client";

import Link from "next/link";
import type { SubscriptionTier } from "@/types/database";
import {
  canAccessFeature,
  upgradeHint,
  type GateFeature,
} from "@/lib/billing/access";

interface TierGateProps {
  tier: SubscriptionTier;
  feature: GateFeature | string;
  children: React.ReactNode;
  teaser?: React.ReactNode;
}

function resolveFeature(feature: GateFeature | string): GateFeature {
  if (
    feature === "overview_score" ||
    feature === "full_builder" ||
    feature === "pro_canvas" ||
    feature === "marketplace_sell" ||
    feature === "subscription_workflows"
  ) {
    return feature;
  }
  // Back-compat: older calls passed display strings for overview scoring
  return "overview_score";
}

export { canAccessOverviewScore } from "@/lib/billing/access";

export function TierGate({ tier, feature, children, teaser }: TierGateProps) {
  const gate = resolveFeature(feature);
  if (canAccessFeature(tier, gate)) {
    return <>{children}</>;
  }

  const hint = upgradeHint(gate);

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm">{teaser ?? children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-resync-bg/60 backdrop-blur-[2px]">
        <div className="glass mx-4 max-w-md rounded-2xl border border-cyan-500/25 p-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-950/80 text-cyan-300">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">{hint.title}</h3>
          <p className="mt-2 text-sm text-zinc-400">{hint.body}</p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:brightness-110"
          >
            {hint.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
