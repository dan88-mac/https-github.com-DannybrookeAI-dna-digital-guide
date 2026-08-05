"use client";

import { PricingTable } from "@/components/ui/PricingTable";

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
          Start free with the community tier. Upgrade when self-healing becomes mission-critical
          for your users.
        </p>
      </div>
      <div className="mt-12">
        <PricingTable onSelect={handleSelect} />
      </div>
    </div>
  );
}
