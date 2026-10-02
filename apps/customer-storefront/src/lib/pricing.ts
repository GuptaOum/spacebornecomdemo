// Mirrors services/api/src/orders/pricing.ts. Checkout shows the exact fee from /catalog/resolve;
// these only drive the estimate before the delivery distance is known.
export const FREE_DELIVERY_THRESHOLD = 499;
export const BASE_DELIVERY_FEE = 25;
export const PLATFORM_FEE = 5;

export function estimateTotals(itemsTotal: number) {
  const freeDelivery = itemsTotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFrom = freeDelivery ? 0 : BASE_DELIVERY_FEE;
  return {
    freeDelivery,
    amountToFreeDelivery: Math.max(0, FREE_DELIVERY_THRESHOLD - itemsTotal),
    deliveryFrom,
    platformFee: PLATFORM_FEE,
    estimatedTotal: itemsTotal + deliveryFrom + PLATFORM_FEE,
  };
}
