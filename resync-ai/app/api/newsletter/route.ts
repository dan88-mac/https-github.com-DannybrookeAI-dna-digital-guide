import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter subscribe endpoint. Self-contained: validates the email and best-
 * effort persists to Supabase when configured, but always succeeds in demo mode
 * so the subscribe UX works without external services.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown; source?: unknown };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const source = typeof body.source === "string" ? body.source : "content";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, message: "Please enter a valid email." }, { status: 400 });
    }

    try {
      const supabase = createServiceClient();
      await supabase
        .from("newsletter_subscribers")
        .upsert({ email, source }, { onConflict: "email" });
    } catch {
      /* DB optional in demo — still confirm the subscription */
    }

    return NextResponse.json({ ok: true, message: "You're subscribed. Watch your inbox." });
  } catch {
    return NextResponse.json({ ok: false, message: "Something went wrong." }, { status: 400 });
  }
}
