"use client";

import { TIERS } from "@/lib/billing/tiers";
import { cn } from "@/lib/utils";

export function PricingTable({
  onSelect,
}: {
  onSelect?: (tier: "starter" | "pro" | "enterprise") => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {TIERS.map((tier) => (
        <div
          key={tier.id}
          className={cn(
            "glass flex flex-col rounded-2xl p-6",
            tier.highlighted && "ring-2 ring-indigo-500/60"
          )}
        >
          {tier.highlighted && (
            <span className="mb-3 w-fit rounded-full bg-indigo-600/20 px-3 py-1 text-xs font-medium text-indigo-300">
              Most popular
            </span>
          )}
          <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
          <p className="mt-2 text-3xl font-bold text-white">
            {tier.priceLabel}
            {tier.id !== "ENTERPRISE" && tier.id !== "FREE" && (
              <span className="text-sm font-normal text-zinc-500">/mo</span>
            )}
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm text-zinc-400">
            {tier.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-emerald-400">✓</span>
                {f}
              </li>
            ))}
          </ul>
          {tier.id === "FREE" ? (
            <a
              href="/login"
              className="mt-8 block rounded-xl border border-resync-border py-3 text-center text-sm font-medium text-white hover:bg-white/5"
            >
              Start free
            </a>
          ) : tier.id === "ENTERPRISE" ? (
            <a
              href="mailto:hello@resync.ai"
              className="mt-8 block rounded-xl border border-resync-border py-3 text-center text-sm font-medium text-white hover:bg-white/5"
            >
              Talk to us
            </a>
          ) : (
            <button
              type="button"
              onClick={() =>
                onSelect?.(
                  tier.id === "STARTER" ? "starter" : tier.id === "PRO" ? "pro" : "enterprise"
                )
              }
              className={cn(
                "mt-8 rounded-xl py-3 text-sm font-medium transition",
                tier.highlighted
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "border border-resync-border text-white hover:bg-white/5"
              )}
            >
              Upgrade
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
