import {
  BIKE_TYPE_SLUGS,
  type ProductCondition,
  type ProductFilters,
} from "@/lib/types";

export type RawSearchParams = { [key: string]: string | string[] | undefined };

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

// URL parametreleri (Türkçe) → ProductFilters
// örn: /urunler?tur=dag&durum=2el&kadro=L&minFiyat=10000&sirala=fiyat-artan&q=dağ
export function parseFilters(sp: RawSearchParams): ProductFilters {
  const filters: ProductFilters = {};

  const tur = one(sp.tur);
  if (tur && BIKE_TYPE_SLUGS[tur]) filters.bikeType = BIKE_TYPE_SLUGS[tur];

  const durum = one(sp.durum);
  if (durum === "sifir") filters.condition = "NEW" as ProductCondition;
  if (durum === "2el") filters.condition = "USED" as ProductCondition;

  const kadro = one(sp.kadro);
  if (kadro) filters.frameSize = kadro;

  const marka = one(sp.marka);
  if (marka) filters.brand = marka;

  // Fiyatlar arayüzde TL girilir, kuruşa çevrilir
  const minFiyat = Number(one(sp.minFiyat));
  if (Number.isFinite(minFiyat) && minFiyat > 0)
    filters.minPriceCents = Math.round(minFiyat * 100);

  const maxFiyat = Number(one(sp.maxFiyat));
  if (Number.isFinite(maxFiyat) && maxFiyat > 0)
    filters.maxPriceCents = Math.round(maxFiyat * 100);

  const q = one(sp.q);
  if (q) filters.query = q;

  const sirala = one(sp.sirala);
  if (sirala === "fiyat-artan") filters.sort = "price-asc";
  else if (sirala === "fiyat-azalan") filters.sort = "price-desc";
  else filters.sort = "newest";

  return filters;
}
