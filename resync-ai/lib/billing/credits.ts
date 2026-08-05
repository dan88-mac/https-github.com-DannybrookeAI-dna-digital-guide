import { createServiceClient } from "@/lib/supabase/server";
import { creditsForTier, type SubscriptionTier } from "@/lib/billing/tiers";

function periodStart(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

export async function getUsage(orgId: string): Promise<{ used: number; limit: number }> {
  const supabase = createServiceClient();
  const start = periodStart();
  const { data } = await supabase
    .from("api_usage_counters")
    .select("credits_used, credits_limit")
    .eq("organization_id", orgId)
    .eq("period_start", start)
    .maybeSingle();
  if (data) {
    return { used: data.credits_used, limit: data.credits_limit };
  }
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("tier")
    .eq("organization_id", orgId)
    .maybeSingle();
  const limit = creditsForTier((sub?.tier as SubscriptionTier) ?? "FREE");
  return { used: 0, limit };
}

export async function consumeCredits(orgId: string, amount: number): Promise<boolean> {
  const supabase = createServiceClient();
  const start = periodStart();
  const usage = await getUsage(orgId);
  if (usage.used + amount > usage.limit) return false;

  const { data: existing } = await supabase
    .from("api_usage_counters")
    .select("id, credits_used")
    .eq("organization_id", orgId)
    .eq("period_start", start)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("api_usage_counters")
      .update({ credits_used: existing.credits_used + amount })
      .eq("id", existing.id);
  } else {
    await supabase.from("api_usage_counters").insert({
      organization_id: orgId,
      period_start: start,
      credits_used: amount,
      credits_limit: usage.limit,
    });
  }
  return true;
}

export async function resetCreditsForTier(orgId: string, tier: SubscriptionTier): Promise<void> {
  const supabase = createServiceClient();
  const start = periodStart();
  const limit = creditsForTier(tier);
  await supabase.from("api_usage_counters").upsert(
    {
      organization_id: orgId,
      period_start: start,
      credits_limit: limit,
      credits_used: 0,
    },
    { onConflict: "organization_id,period_start" }
  );
}
