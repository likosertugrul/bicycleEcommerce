import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import {
  BIKE_TYPE_LABELS,
  CONDITION_LABELS,
} from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images.find((i) => i.isCover) ?? product.images[0];
  const discount = discountPercent(product.priceCents, product.compareAtCents);

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        {cover && (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute left-2 top-2 flex gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              product.condition === "USED"
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {CONDITION_LABELS[product.condition]}
          </span>
          {discount && (
            <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
              %{discount}
            </span>
          )}
        </div>
        {product.isPlaceholder && (
          <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
            Temsili görsel
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium text-emerald-600">
          {BIKE_TYPE_LABELS[product.bikeType]} · {product.brand}
        </span>
        <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900 group-hover:text-emerald-700">
          {product.title}
        </h3>
        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500">
          {product.frameSize && <span>Kadro {product.frameSize}</span>}
          {product.wheelSize && <span>{product.wheelSize}″ jant</span>}
          {product.gearCount ? <span>{product.gearCount} vites</span> : null}
        </div>

        <div className="mt-auto flex items-end gap-2 pt-3">
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(product.priceCents)}
          </span>
          {product.compareAtCents && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.compareAtCents)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
