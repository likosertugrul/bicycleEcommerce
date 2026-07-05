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
// örn: /products?type=dag&condition=used&size=L&minPrice=10000&sort=fiyat-artan&q=dağ
export function parseFilters(sp: RawSearchParams): ProductFilters {
  const filters: ProductFilters = {};

  const tur = one(sp.type);
  if (tur && BIKE_TYPE_SLUGS[tur]) filters.bikeType = BIKE_TYPE_SLUGS[tur];

  const condition = one(sp.condition);
  if (condition === "new") filters.condition = "NEW" as ProductCondition;
  if (condition === "used") filters.condition = "USED" as ProductCondition;

  const size = one(sp.size);
  if (size) filters.frameSize = size;

  const brand = one(sp.brand);
  if (brand) filters.brand = brand;

  // Fiyatlar arayüzde TL girilir, kuruşa çevrilir
  const minPrice = Number(one(sp.minPrice));
  if (Number.isFinite(minPrice) && minPrice > 0)
    filters.minPriceCents = Math.round(minPrice * 100);

  const maxPrice = Number(one(sp.maxPrice));
  if (Number.isFinite(maxPrice) && maxPrice > 0)
    filters.maxPriceCents = Math.round(maxPrice * 100);

  const q = one(sp.q);
  if (q) filters.query = q;

  const sort = one(sp.sort);
  if (sort === "price-asc") filters.sort = "price-asc";
  else if (sort === "price-desc") filters.sort = "price-desc";
  else filters.sort = "newest";

  return filters;
}
