import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getT, getCurrency } from "@/lib/locale";
import { getAuthUser } from "@/server/auth";
import { getMyOrders } from "@/server/orders";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS } from "@/lib/order-status";

export const metadata: Metadata = { title: "Siparişlerim", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [t, user, currency] = await Promise.all([getT(), getAuthUser(), getCurrency()]);
  if (!user) redirect("/giris");
  const orders = await getMyOrders();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/hesabim" className="hover:text-emerald-600">
          {t.auth.account}
        </Link>{" "}
        / {t.auth.orders}
      </nav>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">{t.auth.orders}</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <span aria-hidden className="text-5xl">📦</span>
          <p className="mt-4 text-lg font-semibold text-slate-900">
            {t.auth.ordersEmpty}
          </p>
          <p className="mt-1 text-slate-500">{t.auth.ordersEmptyHint}</p>
          <Link
            href="/urunler"
            className="mt-6 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            {t.wishlist.explore}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const st = ORDER_STATUS[o.status] ?? ORDER_STATUS.PENDING;
            return (
              <li key={o.id}>
                <Link
                  href={`/siparis/${o.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-400"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{o.orderNumber}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(o.createdAt).toLocaleDateString("en-US")} ·{" "}
                      {o.itemCount} {o.itemCount === 1 ? "item" : "items"} ·{" "}
                      {o.fulfillment === "PICKUP" ? "Pickup" : "Shipping"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>
                      {st.label}
                    </span>
                    <p className="mt-1 font-bold text-slate-900">
                      {formatPrice(o.totalCents, currency)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
