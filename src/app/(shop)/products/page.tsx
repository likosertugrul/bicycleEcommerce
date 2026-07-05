import type { Metadata } from "next";
import { getProducts, getBrands } from "@/server/products";
import { getT, getCurrency } from "@/lib/locale";
import { parseFilters } from "@/lib/search-params";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { ProductFilters } from "@/components/product-filters";
import { SortSelect } from "@/components/sort-select";
import { BIKE_TYPE_TO_SLUG, type BikeType } from "@/lib/types";

const FILTER_TYPES: BikeType[] = [
  "MOUNTAIN", "ROAD", "CITY", "ELECTRIC", "KIDS", "GRAVEL",
];
const FRAME_SIZES = ["XS", "S", "M", "L", "XL"];

// Filtreli liste — SSR (dinamik parametreler, taze sonuç).
export const metadata: Metadata = {
  title: "Tüm Bisikletler",
  description:
    "Sıfır ve 2. el bisiklet kataloğu. Tür, condition, size boyu, brand ve fiyata göre filtreleyin.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const [t, currency, products, brands] = await Promise.all([
    getT(),
    getCurrency(),
    getProducts(filters),
    getBrands(),
  ]);

  const sortOptions = [
    { value: "", label: t.list.sortNewest },
    { value: "price-asc", label: t.list.sortPriceAsc },
    { value: "price-desc", label: t.list.sortPriceDesc },
  ];
  const filterTypes = FILTER_TYPES.map((ty) => ({
    slug: BIKE_TYPE_TO_SLUG[ty],
    label: t.bikeType[ty],
  }));
  const filterLabels = {
    ...t.filters,
    apply: t.list.apply,
    filtersTitle: t.filters.filter,
    conditionNew: t.condition.NEW,
    conditionUsed: t.condition.USED,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">{t.list.title}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProductFilters
            brands={brands}
            labels={filterLabels}
            types={filterTypes}
            frameSizes={FRAME_SIZES}
          />
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-sm text-slate-500">
              {t.list.productsFound(products.length)}
            </p>
            <SortSelect label={t.list.sort} options={sortOptions} />
          </div>

          {products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              {t.list.empty}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product, idx) => (
                <Reveal key={product.id} delay={(idx % 3) * 80} className="h-full">
                  <ProductCard product={product} t={t} currency={currency} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
