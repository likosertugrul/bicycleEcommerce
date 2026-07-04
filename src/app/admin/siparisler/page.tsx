import Link from "next/link";
import { getAdminOrders } from "@/server/orders";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Siparişler{" "}
        <span className="text-base font-normal text-slate-400">({orders.length})</span>
      </h1>
      <p className="mt-1 text-sm text-slate-500">Yönetmek için satıra tıkla.</p>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          Henüz sipariş yok.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium">Sipariş No</th>
                <th className="p-3 font-medium">Müşteri</th>
                <th className="p-3 font-medium">Teslimat</th>
                <th className="p-3 font-medium">Durum</th>
                <th className="p-3 font-medium">Tutar</th>
                <th className="p-3 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => {
                const st = ORDER_STATUS[o.status] ?? ORDER_STATUS.PENDING;
                return (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <Link
                        href={`/admin/siparisler/${o.id}`}
                        className="font-medium text-emerald-700 hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="p-3 text-slate-600">{o.customer}</td>
                    <td className="p-3 text-slate-600">
                      {o.fulfillment === "PICKUP" ? "Mağazadan" : "Kargo"}
                    </td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${st.cls}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{formatPrice(o.totalCents)}</td>
                    <td className="p-3 text-slate-500">
                      {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
