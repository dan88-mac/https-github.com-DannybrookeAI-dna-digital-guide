import { NextResponse } from "next/server";
import { waitlistSchema } from "@/schemas/community";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = waitlistSchema.parse(await request.json());
    try {
      const supabase = createServiceClient();
      await supabase.from("community_waitlist").upsert(
        { email: body.email, source: body.source ?? "landing" },
        { onConflict: "email" }
      );
    } catch {
      /* DB optional in demo — still welcome user */
    }
    return NextResponse.json({ ok: true, message: "Welcome to the Resync community." });
  } catch {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
}
