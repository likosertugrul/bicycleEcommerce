// Para: her zaman kuruş (INT) / TRY olarak saklanır, burada gösterime formatlanır.
import {
  DEFAULT_CURRENCY,
  RATES,
  localeFor,
  type Currency,
} from "@/lib/currency";

/** Kuruş (INT, TRY) → seçilen para biriminde biçimlenmiş fiyat. */
export function formatPrice(
  cents: number,
  currency: Currency = DEFAULT_CURRENCY,
): string {
  const amount = (cents / 100) * RATES[currency];
  const fractionDigits = currency === "TRY" ? 0 : 2;
  return new Intl.NumberFormat(localeFor(currency), {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

/** Kuruş → indirim yüzdesi (para biriminden bağımsız). */
export function discountPercent(
  priceCents: number,
  compareAtCents: number | null,
): number | null {
  if (!compareAtCents || compareAtCents <= priceCents) return null;
  return Math.round((1 - priceCents / compareAtCents) * 100);
}
