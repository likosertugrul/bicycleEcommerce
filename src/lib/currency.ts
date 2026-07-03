// Site tek para birimi: USD. Fiyatlar DB'de USD cent olarak saklanır.
export type Currency = "USD";
export const CURRENCIES: { code: Currency; symbol: string; flag: string }[] = [
  { code: "USD", symbol: "$", flag: "🇺🇸" },
];

export const DEFAULT_CURRENCY: Currency = "USD";
export const CURRENCY_COOKIE = "cur";

// USD taban; dönüşüm yok.
export const RATES: Record<Currency, number> = { USD: 1 };

const LOCALES: Record<Currency, string> = { USD: "en-US" };

export function isCurrency(v: string | undefined | null): v is Currency {
  return v === "USD";
}

export function localeFor(c: Currency): string {
  return LOCALES[c];
}
