import { NextResponse } from "next/server";
import { getBuiltImplementations } from "@/lib/hybrid/builtCatalog";

export async function GET() {
  const items = getBuiltImplementations();
  return NextResponse.json({ items, count: items.length });
}
