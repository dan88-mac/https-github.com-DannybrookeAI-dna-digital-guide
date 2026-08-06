"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  OFFICIAL_WORKFLOWS,
  type OfficialWorkflow,
  type WorkflowAccess,
} from "@/lib/marketplace/officialWorkflows";
import {
  canAccessSubscriptionWorkflows,
  readPurchasedWorkflows,
  readSubscriberTier,
  recordPurchasedWorkflow,
  PURCHASED_WORKFLOWS_KEY,
  SUBSCRIBER_TIER_KEY,
} from "@/lib/billing/access";
import type { SubscriptionTier } from "@/types/database";
import { AgentHelpIcon } from "@/components/agent/AgentHelpIcon";

const DRAFT_KEY = "resync-workflow-draft";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function accessLabel(access: WorkflowAccess): string {
  if (access === "free") return "Free";
  if (access === "subscription") return "Included in subscription";
  return "Paid";
}

function WorkflowCard({
  workflow,
  tier,
  purchased,
  onUse,
  onBuy,
  buying,
}: {
  workflow: OfficialWorkflow;
  tier: SubscriptionTier;
  purchased: boolean;
  onUse: (w: OfficialWorkflow) => void;
  onBuy: (w: OfficialWorkflow) => void;
  buying: boolean;
}) {
  const hasSubscription = canAccessSubscriptionWorkflows(tier);
  const canUse =
    workflow.access === "free" ||
    (workflow.access === "subscription" && hasSubscription) ||
    (workflow.access === "paid" && purchased);

  const needsUpgrade = workflow.access === "subscription" && !hasSubscription;
  const needsPurchase = workflow.access === "paid" && !purchased;

  return (
    <article className="glass flex flex-col rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {workflow.testedBadge && (
              <span className="rounded-full bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                a-sync tested
              </span>
            )}
            <span className="rounded-full bg-indigo-950/60 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
              {accessLabel(workflow.access)}
              {workflow.priceCents ? ` · ${formatPrice(workflow.priceCents)}` : ""}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-white">{workflow.title}</h3>
        </div>
        <span className="shrink-0 rounded-lg bg-resync-bg/60 px-2 py-1 font-mono text-xs text-zinc-400">
          {workflow.qualityScore}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm text-zinc-400">{workflow.description}</p>
      <p className="mt-2 text-xs text-zinc-500">{workflow.detail}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {workflow.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-resync-border/50 px-2 py-0.5 text-[10px] text-zinc-500"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {canUse ? (
          <button
            type="button"
            onClick={() => onUse(workflow)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Use workflow
          </button>
        ) : needsUpgrade ? (
          <Link
            href="/pricing"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Upgrade to unlock
          </Link>
        ) : needsPurchase ? (
          <button
            type="button"
            disabled={buying}
            onClick={() => onBuy(workflow)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {buying ? "Processing…" : `Buy ${formatPrice(workflow.priceCents ?? 0)}`}
          </button>
        ) : null}
        <Link
          href={`/builder?template=${workflow.slug}`}
          className="rounded-lg border border-resync-border px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
        >
          Preview in builder
        </Link>
      </div>
    </article>
  );
}

export function MarketplaceClient() {
  const router = useRouter();
  const [tier, setTier] = useState<SubscriptionTier>("FREE");
  const [purchased, setPurchased] = useState<string[]>([]);
  const [buyingSlug, setBuyingSlug] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setTier(readSubscriberTier());
    setPurchased(readPurchasedWorkflows());

    const onStorage = (e: StorageEvent) => {
      if (e.key === SUBSCRIBER_TIER_KEY) setTier(readSubscriberTier());
      if (e.key === PURCHASED_WORKFLOWS_KEY) setPurchased(readPurchasedWorkflows());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const grouped = useMemo(() => {
    return {
      free: OFFICIAL_WORKFLOWS.filter((w) => w.access === "free"),
      subscription: OFFICIAL_WORKFLOWS.filter((w) => w.access === "subscription"),
      paid: OFFICIAL_WORKFLOWS.filter((w) => w.access === "paid"),
    };
  }, []);

  const injectDraft = useCallback((workflow: OfficialWorkflow) => {
    const nodes = workflow.graph.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: { ...n.data, nodeType: n.type },
    }));
    const edges = workflow.graph.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
    }));
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        idea: workflow.description,
        scale: "small",
        nodes,
        edges,
        summary: `Loaded official workflow: ${workflow.title}`,
      }),
    );
    router.push("/builder");
  }, [router]);

  const handleBuy = useCallback(async (workflow: OfficialWorkflow) => {
    setBuyingSlug(workflow.slug);
    setSuccessMsg(null);

    try {
      const orgId = localStorage.getItem("resync-org-id");
      if (orgId) {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier: "starter", organizationId: orgId }),
        });
        if (res.ok) {
          const data = (await res.json()) as { url?: string };
          if (data.url) {
            window.location.href = data.url;
            return;
          }
        }
      }

      const purchaseRes = await fetch("/api/marketplace/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: workflow.slug }),
      });
      const purchaseData = (await purchaseRes.json()) as {
        ok?: boolean;
        token?: string;
        error?: string;
      };

      if (!purchaseRes.ok || !purchaseData.ok) {
        alert(purchaseData.error ?? "Purchase failed");
        return;
      }

      recordPurchasedWorkflow(workflow.slug);
      setPurchased(readPurchasedWorkflows());
      setSuccessMsg(
        `Purchased "${workflow.title}" — token ${purchaseData.token?.slice(0, 12)}… saved locally.`,
      );
    } finally {
      setBuyingSlug(null);
    }
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <p className="text-xs uppercase tracking-wider text-indigo-400">Official marketplace</p>
        <h1 className="mt-1 flex flex-wrap items-center gap-3 text-4xl font-bold text-white">
          a-sync approved workflows
          <AgentHelpIcon
            size="md"
            prompt="Which official workflows are free vs paid, and how do I buy one?"
          />
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Battle-tested official workflows from the Resync team. Free templates for everyone,
          subscription bundles for Builder and above, and premium paid flows for enterprise patterns.
        </p>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
          {successMsg}
        </div>
      )}

      <section>
        <h2 className="text-xl font-semibold text-white">Free official workflows</h2>
        <p className="mt-1 text-sm text-zinc-500">Available to all tiers — no purchase required.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.free.map((w) => (
            <WorkflowCard
              key={w.id}
              workflow={w}
              tier={tier}
              purchased={purchased.includes(w.slug)}
              onUse={injectDraft}
              onBuy={handleBuy}
              buying={buyingSlug === w.slug}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Included with subscription</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Unlocked on Builder ($39), Pro, and Enterprise plans.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.subscription.map((w) => (
            <WorkflowCard
              key={w.id}
              workflow={w}
              tier={tier}
              purchased={purchased.includes(w.slug)}
              onUse={injectDraft}
              onBuy={handleBuy}
              buying={buyingSlug === w.slug}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Premium paid workflows</h2>
        <p className="mt-1 text-sm text-zinc-500">
          One-time purchase. Stripe checkout when org is linked; otherwise local purchase token flow.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.paid.map((w) => (
            <WorkflowCard
              key={w.id}
              workflow={w}
              tier={tier}
              purchased={purchased.includes(w.slug)}
              onUse={injectDraft}
              onBuy={handleBuy}
              buying={buyingSlug === w.slug}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
