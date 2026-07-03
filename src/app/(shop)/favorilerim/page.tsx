import type { Metadata } from "next";
import Link from "next/link";
import { getWishlist } from "@/server/wishlist";
import { clearWishlist } from "@/server/wishlist-actions";
import { getT, getCurrency } from "@/lib/locale";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Favorilerim",
  robots: { index: false },
};

export default async function WishlistPage() {
  const [t, currency, products] = await Promise.all([
    getT(),
    getCurrency(),
    getWishlist(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.wishlist.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {products.length > 0
              ? t.wishlist.countLabel(products.length)
              : t.wishlist.emptyLabel}
          </p>
        </div>
        {products.length > 0 && (
          <form action={clearWishlist}>
            <button
              type="submit"
              className="text-sm text-slate-400 hover:text-rose-600"
            >
              {t.wishlist.clearAll}
            </button>
          </form>
        )}
      </div>

      {products.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <span aria-hidden className="text-5xl">♡</span>
          <p className="mt-4 text-lg font-semibold text-slate-900">
            {t.wishlist.emptyTitle}
          </p>
          <p className="mt-1 text-slate-500">{t.wishlist.emptyHint}</p>
          <Link
            href="/urunler"
            className="mt-6 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            {t.wishlist.explore}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, idx) => (
            <Reveal key={product.id} delay={(idx % 3) * 80} className="h-full">
              <ProductCard product={product} t={t} currency={currency} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
