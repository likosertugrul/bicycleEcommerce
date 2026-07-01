// Para: her zaman kuruş (INT) olarak saklanır, burada gösterime formatlanır.

const tryFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Kuruş (INT) → "12.500 ₺" */
export function formatPrice(cents: number): string {
  return tryFormatter.format(Math.round(cents / 100));
}

/** Kuruş → indirim yüzdesi (varsa) */
export function discountPercent(
  priceCents: number,
  compareAtCents: number | null,
): number | null {
  if (!compareAtCents || compareAtCents <= priceCents) return null;
  return Math.round((1 - priceCents / compareAtCents) * 100);
}
