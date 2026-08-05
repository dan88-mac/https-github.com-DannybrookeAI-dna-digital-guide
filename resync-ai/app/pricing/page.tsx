"use client";

import Link from "next/link";
import { PricingTable } from "@/components/ui/PricingTable";
import { MARKETPLACE_FEES } from "@/lib/billing/tiers";

export default function PricingPage() {
  async function handleSelect(tier: "starter" | "pro" | "enterprise") {
    const orgId = prompt("Organization ID (from dashboard after signup):");
    if (!orgId) return;
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier, organizationId: orgId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error ?? "Checkout unavailable — configure Stripe or sign in.");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-white">Pricing that scales with your impact</h1>
        <p className="mt-4 text-zinc-400">
          Start free on Community. Upgrade when you need full palette access, marketplace selling,
          or enterprise controls. Credits power self-heal runs and AI-assisted canvas generation.
        </p>
      </div>

      <div className="mt-12">
        <PricingTable onSelect={handleSelect} />
      </div>

      <section className="glass mt-16 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white">Marketplace fees</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          When you buy or sell paid templates and modules on the Resync AI marketplace, standard
          plans use a transparent split:{" "}
          <strong className="text-zinc-200">
            {MARKETPLACE_FEES.standardBuyerPercent}% buyer fee
          </strong>{" "}
          plus{" "}
          <strong className="text-zinc-200">
            {MARKETPLACE_FEES.standardSellerPercent}% seller fee
          </strong>{" "}
          ({MARKETPLACE_FEES.standardTotalPercent}% total platform take). Enterprise customers
          qualify for a reduced{" "}
          <strong className="text-zinc-200">
            {MARKETPLACE_FEES.enterpriseTotalPercent}% total fee
          </strong>{" "}
          on marketplace transactions.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-resync-border bg-resync-surface/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Buyer</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {MARKETPLACE_FEES.standardBuyerPercent}%
            </p>
            <p className="mt-1 text-xs text-zinc-500">Added at checkout on paid listings</p>
          </div>
          <div className="rounded-xl border border-resync-border bg-resync-surface/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Seller</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {MARKETPLACE_FEES.standardSellerPercent}%
            </p>
            <p className="mt-1 text-xs text-zinc-500">Deducted from your payout</p>
          </div>
          <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Enterprise
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {MARKETPLACE_FEES.enterpriseTotalPercent}% total
            </p>
            <p className="mt-1 text-xs text-zinc-500">Combined buyer + seller fee</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-zinc-500">
          Free community templates have no marketplace fees. Pro and Enterprise sellers can list
          paid assets; buyers on any paid plan can purchase.
        </p>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold text-white">Credit engine calculator</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Every self-heal attempt, runtime execution, and AI canvas generation consumes credits
          from your monthly pool. Heavier graphs and frequent healing use more credits—plan your
          tier around peak module count and heal frequency.
        </p>
        <div className="glass mt-6 rounded-2xl p-6">
          <p className="text-sm text-zinc-300">
            A built-in{" "}
            <strong className="text-white">engine calculator</strong> in the builder estimates
            monthly credit usage from your canvas size, expected run volume, and self-heal
            settings—so you can right-size Community, Builder, or Pro before you upgrade.
          </p>
          <Link
            href="/builder"
            className="mt-4 inline-flex text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            Open builder to try the calculator →
          </Link>
        </div>
      </section>
    </div>
  );
}
