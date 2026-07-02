import type { Metadata } from "next";
import { getProducts, getBrands } from "@/server/products";
import { getT } from "@/lib/locale";
import { parseFilters } from "@/lib/search-params";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";

// Filtreli liste — SSR (dinamik parametreler, taze sonuç).
export const metadata: Metadata = {
  title: "Tüm Bisikletler",
  description:
    "Sıfır ve 2. el bisiklet kataloğu. Tür, durum, kadro boyu, marka ve fiyata göre filtreleyin.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/urunler">) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const [t, products, brands] = await Promise.all([
    getT(),
    getProducts(filters),
    getBrands(),
  ]);

  const currentSort = Array.isArray(sp.sirala) ? sp.sirala[0] : sp.sirala ?? "";
  const sortOptions = [
    { value: "", label: t.list.sortNewest },
    { value: "fiyat-artan", label: t.list.sortPriceAsc },
    { value: "fiyat-azalan", label: t.list.sortPriceDesc },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">{t.list.title}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {t.list.productsFound(products.length)}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProductFilters searchParams={sp} brands={brands} t={t} />
        </aside>

        <section>
          {/* Sıralama — mevcut filtreleri koruyarak yeni GET formu */}
          <form
            method="get"
            action="/urunler"
            className="mb-4 flex items-center justify-end gap-2 text-sm"
          >
            {["tur", "durum", "kadro", "marka", "minFiyat", "maxFiyat", "q"].map(
              (k) => {
                const v = Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k];
                return v ? (
                  <input key={k} type="hidden" name={k} value={v as string} />
                ) : null;
              },
            )}
            <label className="text-slate-500">{t.list.sort}</label>
            <select
              name="sirala"
              defaultValue={currentSort}
              className="rounded-lg border border-slate-300 px-3 py-1.5 outline-none focus:border-emerald-500"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50"
            >
              {t.list.apply}
            </button>
          </form>

          {products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              {t.list.empty}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} t={t} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
