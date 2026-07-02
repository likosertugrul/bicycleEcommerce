// Para birimi seçimi. Fiyatlar DB'de kuruş/TRY saklanır; gösterimde dönüştürülür.
// NOT: kurlar YAKLAŞIK ve statiktir; ileride canlı bir kur API'sine bağlanabilir.

export type Currency = "TRY" | "USD" | "EUR" | "GBP";
export const CURRENCIES: { code: Currency; symbol: string; flag: string }[] = [
  { code: "TRY", symbol: "₺", flag: "🇹🇷" },
  { code: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", flag: "🇬🇧" },
];

export const DEFAULT_CURRENCY: Currency = "TRY";
export const CURRENCY_COOKIE = "cur";

// 1 TRY → hedef birim (yaklaşık).
export const RATES: Record<Currency, number> = {
  TRY: 1,
  USD: 0.025,
  EUR: 0.023,
  GBP: 0.02,
};

const LOCALES: Record<Currency, string> = {
  TRY: "tr-TR",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

export function isCurrency(v: string | undefined | null): v is Currency {
  return v === "TRY" || v === "USD" || v === "EUR" || v === "GBP";
}

export function localeFor(c: Currency): string {
  return LOCALES[c];
}
