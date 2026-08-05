import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { resetCreditsForTier } from "@/lib/billing/credits";
import { tierFromStripePrice } from "@/lib/billing/tiers";
import type { SubscriptionTier } from "@/types/database";
import { log } from "@/lib/logger";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey);
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (e) {
    log("error", "webhook signature invalid", { error: String(e) });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("stripe_webhook_events")
    .select("event_id")
    .eq("event_id", event.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  await supabase.from("stripe_webhook_events").insert({ event_id: event.id });

  async function upsertSubscription(
    orgId: string,
    tier: SubscriptionTier,
    customerId: string,
    subscriptionId: string | null,
    status: string,
    periodEnd: number | null
  ) {
    await supabase.from("subscriptions").upsert(
      {
        organization_id: orgId,
        tier,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "organization_id" }
    );
    await resetCreditsForTier(orgId, tier);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.organization_id ?? session.client_reference_id;
      const tierMeta = (session.metadata?.tier ?? "STARTER") as SubscriptionTier;
      if (orgId && session.customer) {
        await upsertSubscription(
          orgId,
          tierMeta,
          String(session.customer),
          session.subscription ? String(session.subscription) : null,
          "active",
          null
        );
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const orgId = sub.metadata?.organization_id;
      const priceId = sub.items.data[0]?.price.id ?? "";
      const tier = tierFromStripePrice(priceId);
      if (orgId) {
        await upsertSubscription(
          orgId,
          event.type === "customer.subscription.deleted" ? "FREE" : tier,
          String(sub.customer),
          sub.id,
          sub.status,
          sub.current_period_end
        );
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
