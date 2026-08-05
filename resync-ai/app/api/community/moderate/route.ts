import { NextResponse } from "next/server";
import { moderateText } from "@/lib/engine/moderation";
import { moderateSchema } from "@/schemas/community";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = moderateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { allowed: false, reasons: ["Invalid request"], errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = moderateText(parsed.data.text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { allowed: false, reasons: ["Server error"] },
      { status: 500 },
    );
  }
}
