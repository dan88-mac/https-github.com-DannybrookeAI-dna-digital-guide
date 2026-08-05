const SELLER_FEE_RATE = 0.1;
const BUYER_FEE_RATE = 0.1;

export interface SaleFees {
  listPriceCents: number;
  sellerReceivesCents: number;
  buyerPaysCents: number;
  platformFromSellerCents: number;
  platformFromBuyerCents: number;
  platformTotalCents: number;
}

export function calculateSaleFees(listPriceCents: number): SaleFees {
  if (!Number.isFinite(listPriceCents) || listPriceCents < 0) {
    throw new Error("listPriceCents must be a non-negative finite number");
  }

  const roundedList = Math.round(listPriceCents);
  const platformFromSellerCents = Math.round(roundedList * SELLER_FEE_RATE);
  const platformFromBuyerCents = Math.round(roundedList * BUYER_FEE_RATE);
  const sellerReceivesCents = roundedList - platformFromSellerCents;
  const buyerPaysCents = roundedList + platformFromBuyerCents;
  const platformTotalCents = platformFromSellerCents + platformFromBuyerCents;

  return {
    listPriceCents: roundedList,
    sellerReceivesCents,
    buyerPaysCents,
    platformFromSellerCents,
    platformFromBuyerCents,
    platformTotalCents,
  };
}
