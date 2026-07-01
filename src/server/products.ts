import "server-only";
import type { Product, ProductFilters } from "@/lib/types";
import { MOCK_PRODUCTS } from "./mock-data";

// Veri erişim katmanı. Şu an yer tutucu (mock) veriyle çalışır.
// Supabase + Prisma bağlanınca yalnızca bu dosyanın içi değişir;
// çağıran sayfalar (imza aynı kaldığı için) etkilenmez.

/** Filtre + sıralamayla ürün listesi. */
export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  let items = MOCK_PRODUCTS.filter((p) => {
    if (filters.bikeType && p.bikeType !== filters.bikeType) return false;
    if (filters.condition && p.condition !== filters.condition) return false;
    if (filters.frameSize && p.frameSize !== filters.frameSize) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (
      filters.minPriceCents !== undefined &&
      p.priceCents < filters.minPriceCents
    )
      return false;
    if (
      filters.maxPriceCents !== undefined &&
      p.priceCents > filters.maxPriceCents
    )
      return false;
    if (filters.query) {
      const q = filters.query.toLocaleLowerCase("tr");
      const hay = `${p.title} ${p.brand} ${p.description}`.toLocaleLowerCase(
        "tr",
      );
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      items = items.sort((a, b) => a.priceCents - b.priceCents);
      break;
    case "price-desc":
      items = items.sort((a, b) => b.priceCents - a.priceCents);
      break;
    default:
      items = items.sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      );
  }

  return items;
}

/** Tek ürün (detay sayfası). */
export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

/** Ana sayfa vitrini — öne çıkan ürünler. */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const items = await getProducts();
  return items.slice(0, limit);
}

/** Benzer ürünler (aynı tür, kendisi hariç). */
export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  return MOCK_PRODUCTS.filter(
    (p) => p.bikeType === product.bikeType && p.id !== product.id,
  ).slice(0, limit);
}

/** sitemap.ts / generateStaticParams için tüm slug'lar. */
export async function getAllProductSlugs(): Promise<string[]> {
  return MOCK_PRODUCTS.map((p) => p.slug);
}

/** Filtre çubuğu için mevcut markalar. */
export async function getBrands(): Promise<string[]> {
  return [...new Set(MOCK_PRODUCTS.map((p) => p.brand))].sort();
}
