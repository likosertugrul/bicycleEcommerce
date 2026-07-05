import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCart } from "@/server/cart";
import { getAuthUser } from "@/server/auth";
import { getAddresses } from "@/server/addresses";
import {
  computeShipping,
  FREE_SHIPPING_OVER_CENTS,
} from "@/server/orders";
import { getCurrency } from "@/lib/locale";
import { formatPrice } from "@/lib/format";
import { CheckoutForm } from "@/components/checkout-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const [cart, user, currency] = await Promise.all([
    getCart(),
    getAuthUser(),
    getCurrency(),
  ]);
  if (cart.items.length === 0) redirect("/cart");

  const addresses = user ? await getAddresses() : [];
  const shipping = computeShipping(cart.subtotalCents, "DELIVERY");
  const total = cart.subtotalCents + shipping;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <CheckoutForm addresses={addresses} isLoggedIn={!!user} />

        {/* Sipariş özeti */}
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="font-semibold text-slate-900">Order Summary</h2>
          <ul className="mt-3 space-y-3">
            {cart.items.map((it) => (
              <li key={it.productId} className="flex gap-3 text-sm">
                <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded bg-slate-100">
                  {it.image && (
                    <Image src={it.image} alt="" fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-slate-800">{it.title}</p>
                  <p className="text-slate-400">
                    {it.quantity} × {formatPrice(it.unitCents, currency)}
                  </p>
                </div>
                <span className="font-medium text-slate-900">
                  {formatPrice(it.lineCents, currency)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-medium">{formatPrice(cart.subtotalCents, currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Shipping (est.)</dt>
              <dd className="font-medium">
                {shipping === 0 ? "Free" : formatPrice(shipping, currency)}
              </dd>
            </div>
            <p className="text-xs text-slate-400">
              Free store pickup. Free shipping on orders over {formatPrice(FREE_SHIPPING_OVER_CENTS, currency)}.
            </p>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base">
              <dt className="font-semibold text-slate-900">Total</dt>
              <dd className="font-bold text-slate-900">{formatPrice(total, currency)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
