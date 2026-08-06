import { calculateSaleFees } from "@/lib/marketplace/fees";

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function FeePreview({ priceCents }: { priceCents: number }) {
  if (!priceCents || priceCents <= 0) return null;

  let fees;
  try {
    fees = calculateSaleFees(priceCents);
  } catch {
    return null;
  }

  return (
    <div className="mt-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs">
      <p className="font-medium text-indigo-200">Marketplace fee preview</p>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-400">
        <dt>List price</dt>
        <dd className="text-right text-white">{formatCents(fees.listPriceCents)}</dd>
        <dt>You receive</dt>
        <dd className="text-right text-emerald-400">{formatCents(fees.sellerReceivesCents)}</dd>
        <dt>Buyer pays</dt>
        <dd className="text-right text-zinc-300">{formatCents(fees.buyerPaysCents)}</dd>
        <dt>Platform fee</dt>
        <dd className="text-right text-zinc-500">{formatCents(fees.platformTotalCents)}</dd>
      </dl>
    </div>
  );
}
