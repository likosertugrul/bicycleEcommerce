// Telefon ülke kodları + ulusal numara uzunluk doğrulaması.
// Hem client (PhoneField) hem server (address-actions) kullanır.

export interface PhoneCountry {
  code: string;
  name: string;
  dial: string;
  flag: string;
  min: number; // ulusal numara min hane
  max: number; // ulusal numara max hane
}

// Türkiye ilk (varsayılan). Yaygın ülkeler.
export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "TR", name: "Türkiye", dial: "+90", flag: "🇹🇷", min: 10, max: 10 },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸", min: 10, max: 10 },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧", min: 10, max: 10 },
  { code: "DE", name: "Deutschland", dial: "+49", flag: "🇩🇪", min: 10, max: 11 },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷", min: 9, max: 9 },
  { code: "NL", name: "Nederland", dial: "+31", flag: "🇳🇱", min: 9, max: 9 },
  { code: "RU", name: "Россия", dial: "+7", flag: "🇷🇺", min: 10, max: 10 },
  { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪", min: 9, max: 9 },
  { code: "AZ", name: "Azərbaycan", dial: "+994", flag: "🇦🇿", min: 9, max: 9 },
];

export const DEFAULT_DIAL = "+90";

export function findByDial(dial: string): PhoneCountry | undefined {
  return PHONE_COUNTRIES.find((c) => c.dial === dial);
}

/** Saklanan "+90 5551234567" → { dial, national }. Eski/biçimsiz veriye toleranslı. */
export function parsePhone(stored?: string | null): {
  dial: string;
  national: string;
} {
  if (!stored) return { dial: DEFAULT_DIAL, national: "" };
  const s = stored.trim();
  const m = s.match(/^(\+\d{1,4})\s*(.*)$/);
  if (m && findByDial(m[1])) return { dial: m[1], national: m[2].replace(/\D/g, "") };
  return { dial: DEFAULT_DIAL, national: s.replace(/\D/g, "") };
}

/** Seçilen ülkeye göre ulusal numara uzunluğu geçerli mi? */
export function isValidPhone(dial: string, national: string): boolean {
  const c = findByDial(dial);
  if (!c) return false;
  const len = national.replace(/\D/g, "").length;
  return len >= c.min && len <= c.max;
}

/** Görüntü/saklama biçimi: "+90 5551234567". */
export function formatPhone(dial: string, national: string): string {
  return `${dial} ${national.replace(/\D/g, "")}`.trim();
}
