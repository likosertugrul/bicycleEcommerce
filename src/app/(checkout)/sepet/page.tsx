import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/server/cart";
import { setQuantity, removeFromCart, clearCart } from "@/server/cart-actions";
import { getT, getCurrency } from "@/lib/locale";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sepet",
  robots: { index: false },
};

export default async function CartPage() {
  const [t, currency, cart] = await Promise.all([
    getT(),
    getCurrency(),
    getCart(),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">{t.cart.title}</h1>

        {cart.items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <span aria-hidden className="text-5xl">🛒</span>
            <p className="mt-4 text-lg font-semibold text-slate-900">
              {t.cart.empty}
            </p>
            <p className="mt-1 text-slate-500">{t.cart.emptyHint}</p>
            <Link
              href="/urunler"
              className="mt-6 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              {t.cart.explore}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Satırlar */}
            <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex gap-4 p-4">
                  <Link
                    href={`/urunler/${item.slug}`}
                    className="relative aspect-4/3 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/urunler/${item.slug}`}
                          className="font-semibold text-slate-900 hover:text-emerald-700"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {t.condition[item.condition]} · {t.cart.unit}{" "}
                          {formatPrice(item.unitCents, currency)}
                        </p>
                      </div>
                      <form action={removeFromCart.bind(null, item.productId)}>
                        <button
                          type="submit"
                          className="text-sm text-slate-400 hover:text-rose-600"
                        >
                          {t.cart.remove}
                        </button>
                      </form>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-3">
                      {/* Miktar (server action ile, JS gerekmez) */}
                      <div className="flex items-center gap-1">
                        <form
                          action={setQuantity.bind(
                            null,
                            item.productId,
                            item.quantity - 1,
                          )}
                        >
                          <button
                            type="submit"
                            className="h-8 w-8 rounded-lg border border-slate-300 text-lg leading-none text-slate-600 hover:bg-slate-50"
                            aria-label="−"
                          >
                            −
                          </button>
                        </form>
                        <span className="w-9 text-center font-medium">
                          {item.quantity}
                        </span>
                        <form
                          action={setQuantity.bind(
                            null,
                            item.productId,
                            item.quantity + 1,
                          )}
                        >
                          <button
                            type="submit"
                            disabled={item.quantity >= item.stock}
                            className="h-8 w-8 rounded-lg border border-slate-300 text-lg leading-none text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                            aria-label="+"
                          >
                            +
                          </button>
                        </form>
                      </div>
                      <span className="text-lg font-bold text-slate-900">
                        {formatPrice(item.lineCents, currency)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Özet */}
            <aside className="h-fit rounded-xl border border-slate-200 p-5 lg:sticky lg:top-24">
              <h2 className="font-semibold text-slate-900">{t.cart.summary}</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t.cart.subtotal}</dt>
                  <dd className="font-medium">{formatPrice(cart.subtotalCents, currency)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t.cart.shipping}</dt>
                  <dd className="text-slate-500">{t.cart.shippingAtCheckout}</dd>
                </div>
              </dl>
              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
                <span className="font-semibold">{t.cart.total}</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {formatPrice(cart.subtotalCents, currency)}
                </span>
              </div>

              <Link
                href="/odeme"
                className="mt-5 block w-full rounded-full bg-emerald-600 px-4 py-3 text-center font-semibold text-white transition-all hover:bg-emerald-700 active:scale-[0.99]"
              >
                {t.cart.checkout}
              </Link>

              <form action={clearCart} className="mt-4 text-center">
                <button
                  type="submit"
                  className="text-sm text-slate-400 hover:text-rose-600"
                >
                  {t.cart.clear}
                </button>
              </form>
            </aside>
          </div>
      )}
    </div>
  );
}
