// Env'de protokol unutulsa bile (örn. "site.com") geçerli mutlak URL'e çevir.
function normalizeUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return "http://localhost:3000";
  if (/^https?:\/\//i.test(value)) return value.replace(/\/$/, "");
  return `https://${value.replace(/\/$/, "")}`;
}

export const site = {
  name: "Bisiklet Dünyası",
  shortName: "Bisiklet",
  description:
    "Sıfır ve 2. el bisikletler — dağ, yol, şehir, elektrikli, çocuk ve gravel. Yerel dükkanınızdan güvenli alışveriş, mağazadan teslim veya kargo.",
  // Prod'da NEXT_PUBLIC_SITE_URL ile override edilir.
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  phone: "0850 000 00 00",
  nav: [
    { href: "/urunler", label: "Tüm Bisikletler" },
    { href: "/urunler?durum=sifir", label: "Sıfır" },
    { href: "/urunler?durum=2el", label: "2. El" },
    { href: "/bisikletini-sat", label: "Bisikletini Sat" },
  ],
} as const;
