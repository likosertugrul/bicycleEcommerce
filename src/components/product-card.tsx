import Link from "next/link";
import type { Product } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import { formatPrice, discountPercent } from "@/lib/format";
import type { Currency } from "@/lib/currency";
import { FavoriteButton } from "@/components/favorite-button";
import { ProductCardImage } from "@/components/product-card-image";

export function ProductCard({
  product,
  t,
  currency = "USD",
  index = 0,
}: {
  product: Product;
  t: Dictionary;
  currency?: Currency;
  index?: number;
}) {
  const discount = discountPercent(product.priceCents, product.compareAtCents);

  return (
    <Link
      href={`/urunler/${product.slug}`}
      style={{ animationDelay: `${Math.min(index, 10) * 55}ms` }}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70 animate-fade-in-up"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <ProductCardImage images={product.images} title={product.title} />
        <div className="absolute left-2 top-2 z-10 flex gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              product.condition === "USED"
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {t.condition[product.condition]}
          </span>
          {discount && (
            <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
              %{discount}
            </span>
          )}
        </div>
        {product.isPlaceholder && (
          <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
            {t.card.placeholder}
          </span>
        )}
        <div className="absolute right-2 top-2 z-10">
          <FavoriteButton productId={product.id} variant="icon" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium text-emerald-600">
          {t.bikeType[product.bikeType]} · {product.brand}
        </span>
        <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900 group-hover:text-emerald-700">
          {product.title}
        </h3>
        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500">
          {product.frameSize && <span>{t.card.frame} {product.frameSize}</span>}
          {product.wheelSize && <span>{product.wheelSize}″ {t.card.wheel}</span>}
          {product.gearCount ? <span>{product.gearCount} {t.card.gears}</span> : null}
        </div>

        <div className="mt-auto flex items-end gap-2 pt-3">
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(product.priceCents, currency)}
          </span>
          {product.compareAtCents && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.compareAtCents, currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
