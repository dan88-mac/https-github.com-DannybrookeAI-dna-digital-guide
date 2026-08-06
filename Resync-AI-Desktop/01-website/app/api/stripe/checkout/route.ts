import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkoutBodySchema } from "@/schemas/stripe";
import Stripe from "stripe";
import { log } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = checkoutBodySchema.parse(await request.json());
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!stripeKey || !appUrl) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const priceEnvKey =
      body.tier === "starter"
        ? "STRIPE_PRICE_STARTER"
        : body.tier === "pro"
          ? "STRIPE_PRICE_PRO"
          : "STRIPE_PRICE_ENTERPRISE";
    const priceId = process.env[priceEnvKey];
    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 503 });
    }

    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancel`,
      client_reference_id: body.organizationId,
      metadata: {
        organization_id: body.organizationId,
        tier: body.tier.toUpperCase(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    log("error", "checkout failed", { error: String(e) });
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
