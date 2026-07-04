import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderById } from "@/server/orders";
import { getCurrency } from "@/lib/locale";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS } from "@/lib/order-status";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false } };

export default async function OrderPage({ params }: PageProps<"/siparis/[id]">) {
  const { id } = await params;
  const [order, currency] = await Promise.all([getOrderById(id), getCurrency()]);
  if (!order) notFound();

  const st = ORDER_STATUS[order.status] ?? ORDER_STATUS.PENDING;
  const addr = order.shippingAddress;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Onay bandı */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <span aria-hidden className="text-4xl">✅</span>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Siparişiniz alındı!</h1>
        <p className="mt-1 text-slate-600">
          Sipariş No: <strong>{order.orderNumber}</strong>
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Durum</h2>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${st.cls}`}>
            {st.label}
          </span>
        </div>
        {order.status === "PENDING" && (
          <p className="mt-2 text-sm text-slate-500">
            Ödeme entegrasyonu yakında. Ödeme onayı için mağaza sizinle iletişime
            geçecek (havale/EFT veya mağazadan ödeme).
          </p>
        )}
        {order.trackingCode && (
          <p className="mt-2 text-sm text-slate-600">
            Kargo takip: <strong>{order.trackingCode}</strong>
          </p>
        )}
      </div>

      {/* Ürünler */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">Ürünler</h2>
        <ul className="mt-3 space-y-3">
          {order.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded bg-slate-100">
                {it.image && (
                  <Image src={it.image} alt="" fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                {it.slug ? (
                  <Link href={`/urunler/${it.slug}`} className="text-slate-800 hover:text-emerald-700">
                    {it.productTitle}
                  </Link>
                ) : (
                  <span className="text-slate-800">{it.productTitle}</span>
                )}
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
            <dt className="text-slate-500">Ara toplam</dt>
            <dd>{formatPrice(order.subtotalCents, currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Kargo</dt>
            <dd>{order.shippingCents === 0 ? "Ücretsiz" : formatPrice(order.shippingCents, currency)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
            <dt>Toplam</dt>
            <dd>{formatPrice(order.totalCents, currency)}</dd>
          </div>
        </dl>
      </div>

      {/* Teslimat */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 text-sm">
        <h2 className="font-semibold text-slate-900">Teslimat</h2>
        {order.fulfillment === "PICKUP" ? (
          <p className="mt-2 text-slate-600">🏪 Mağazadan teslim alınacak.</p>
        ) : addr ? (
          <p className="mt-2 text-slate-600">
            <strong>{addr.recipient}</strong> · {addr.phone}
            <br />
            {addr.fullAddress}, {addr.district}/{addr.city}
            {addr.zipCode ? ` (${addr.zipCode})` : ""}
          </p>
        ) : (
          <p className="mt-2 text-slate-500">—</p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/urunler"
          className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Alışverişe devam et
        </Link>
        <Link
          href="/siparislerim"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Siparişlerim
        </Link>
      </div>
    </div>
  );
}
