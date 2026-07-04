import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminOrder } from "@/server/orders";
import { updateOrderStatus, setTrackingCode } from "@/server/order-actions";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS, ORDER_STATUS_ORDER } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({
  params,
}: PageProps<"/admin/siparisler/[id]">) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  const st = ORDER_STATUS[order.status] ?? ORDER_STATUS.PENDING;
  const addr = order.shippingAddress;

  return (
    <div className="p-6">
      <Link href="/admin/siparisler" className="text-sm text-emerald-700 hover:underline">
        ← Siparişler
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{order.orderNumber}</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${st.cls}`}>
          {st.label}
        </span>
        <span className="text-sm text-slate-400">
          {new Date(order.createdAt).toLocaleString("tr-TR")}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Sol: ürünler + teslimat */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Ürünler</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {order.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="text-slate-700">
                    {it.productTitle}{" "}
                    <span className="text-slate-400">
                      × {it.quantity} ({formatPrice(it.unitCents)})
                    </span>
                  </span>
                  <span className="font-medium">{formatPrice(it.lineCents)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Ara toplam</dt>
                <dd>{formatPrice(order.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Kargo</dt>
                <dd>{formatPrice(order.shippingCents)}</dd>
              </div>
              <div className="flex justify-between text-base font-bold">
                <dt>Toplam</dt>
                <dd>{formatPrice(order.totalCents)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
            <h2 className="font-semibold text-slate-900">Teslimat & İletişim</h2>
            <p className="mt-2 text-slate-600">
              Yöntem: {order.fulfillment === "PICKUP" ? "Mağazadan teslim" : "Kargo"}
            </p>
            {(order.guestEmail || order.guestPhone) && (
              <p className="text-slate-600">
                Misafir: {order.guestEmail} {order.guestPhone ? `· ${order.guestPhone}` : ""}
              </p>
            )}
            {addr && (
              <p className="mt-1 text-slate-600">
                <strong>{addr.recipient}</strong> · {addr.phone}
                <br />
                {addr.fullAddress}, {addr.district}/{addr.city}
                {addr.zipCode ? ` (${addr.zipCode})` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Sağ: durum yönetimi */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Durumu Değiştir</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {ORDER_STATUS_ORDER.map((s) => {
                const info = ORDER_STATUS[s];
                const active = s === order.status;
                return (
                  <form key={s} action={updateOrderStatus.bind(null, order.id, s)}>
                    <button
                      type="submit"
                      disabled={active}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        active
                          ? `${info.cls} cursor-default`
                          : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {info.label}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Kargo Takip Kodu</h2>
            <form action={setTrackingCode.bind(null, order.id)} className="mt-3 flex gap-2">
              <input
                name="trackingCode"
                defaultValue={order.trackingCode ?? ""}
                placeholder="Takip no"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Kaydet
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
