// Env'de protokol unutulsa bile (örn. "site.com") geçerli mutlak URL'e çevir.
function normalizeUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return "http://localhost:3000";
  if (/^https?:\/\//i.test(value)) return value.replace(/\/$/, "");
  return `https://${value.replace(/\/$/, "")}`;
}

export const site = {
  name: "Bike World",
  shortName: "Bike World",
  description:
    "New and used bikes — mountain, road, city, electric, kids and gravel. Shop safely from your local store with pickup or shipping.",
  // Overridden in prod with NEXT_PUBLIC_SITE_URL.
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  phone: "(555) 000-0000",
  nav: [
    { href: "/urunler", label: "All Bikes" },
    { href: "/urunler?durum=sifir", label: "New" },
    { href: "/urunler?durum=2el", label: "Used" },
    { href: "/bisikletini-sat", label: "Sell Your Bike" },
  ],
} as const;
