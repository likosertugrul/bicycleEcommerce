import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCart } from "@/server/cart";
import { setQuantity, removeFromCart, clearCart } from "@/server/cart-actions";
import { formatPrice } from "@/lib/format";
import { CONDITION_LABELS } from "@/lib/types";

export const metadata: Metadata = {
  title: "Sepet",
  robots: { index: false },
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Sepetim</h1>

        {cart.items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <span aria-hidden className="text-5xl">🛒</span>
            <p className="mt-4 text-lg font-semibold text-slate-900">
              Sepetiniz boş
            </p>
            <p className="mt-1 text-slate-500">
              Beğendiğiniz bisikletleri sepete ekleyerek başlayın.
            </p>
            <Link
              href="/urunler"
              className="mt-6 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Bisikletleri Keşfet
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
                          {CONDITION_LABELS[item.condition]} · birim{" "}
                          {formatPrice(item.unitCents)}
                        </p>
                      </div>
                      <form action={removeFromCart.bind(null, item.productId)}>
                        <button
                          type="submit"
                          className="text-sm text-slate-400 hover:text-rose-600"
                          aria-label="Ürünü sepetten çıkar"
                        >
                          Kaldır
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
                            aria-label="Azalt"
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
                            aria-label="Artır"
                          >
                            +
                          </button>
                        </form>
                      </div>
                      <span className="text-lg font-bold text-slate-900">
                        {formatPrice(item.lineCents)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Özet */}
            <aside className="h-fit rounded-xl border border-slate-200 p-5 lg:sticky lg:top-24">
              <h2 className="font-semibold text-slate-900">Sipariş Özeti</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Ara Toplam</dt>
                  <dd className="font-medium">
                    {formatPrice(cart.subtotalCents)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Kargo</dt>
                  <dd className="text-slate-500">Ödeme adımında</dd>
                </div>
              </dl>
              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
                <span className="font-semibold">Toplam</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {formatPrice(cart.subtotalCents)}
                </span>
              </div>

              <button
                type="button"
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-full bg-emerald-600 px-4 py-3 font-semibold text-white opacity-60"
              >
                Ödemeye Geç
              </button>
              <p className="mt-2 text-center text-xs text-slate-400">
                Ödeme adımı Sprint 3&apos;te (iyzico) eklenecek.
              </p>

              <form action={clearCart} className="mt-4 text-center">
                <button
                  type="submit"
                  className="text-sm text-slate-400 hover:text-rose-600"
                >
                  Sepeti boşalt
                </button>
              </form>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
