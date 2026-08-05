import { NextResponse } from "next/server";
import { z } from "zod";
import { createHmac, randomBytes } from "crypto";
import { log } from "@/lib/logger";

const schema = z.object({
  url: z.string().url(),
  payload: z.record(z.unknown()),
  secret: z.string().min(16).optional(),
});

async function dispatchWithRetry(url: string, body: string, signature: string) {
  const delays = [0, 500, 1500];
  let lastError: unknown;
  for (const delay of delays) {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Resync-Signature": signature,
        },
        body,
      });
      if (res.ok) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const secret = body.secret ?? process.env.RESYNC_ENCRYPTION_KEY ?? randomBytes(32).toString("hex");
    const raw = JSON.stringify(body.payload);
    const signature = createHmac("sha256", secret).update(raw).digest("hex");
    await dispatchWithRetry(body.url, raw, signature);
    return NextResponse.json({ ok: true });
  } catch (e) {
    log("error", "webhook dispatch failed", { error: String(e) });
    return NextResponse.json({ error: "Dispatch failed" }, { status: 502 });
  }
}
