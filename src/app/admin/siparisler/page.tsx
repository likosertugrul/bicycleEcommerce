import { getPrisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  PENDING: "Bekliyor",
  PAID: "Ödendi",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim",
  CANCELLED: "İptal",
  REFUNDED: "İade",
};

export default async function AdminOrdersPage() {
  const prisma = getPrisma();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Siparişler <span className="text-base font-normal text-slate-400">({orders.length})</span>
      </h1>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          Henüz sipariş yok. Sipariş yönetimi, ödeme adımı (Sprint 3) devreye
          girince dolacak.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium">Sipariş No</th>
                <th className="p-3 font-medium">Durum</th>
                <th className="p-3 font-medium">Tutar</th>
                <th className="p-3 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-900">{o.orderNumber}</td>
                  <td className="p-3 text-slate-600">{STATUS[o.status] ?? o.status}</td>
                  <td className="p-3 font-medium">{formatPrice(o.totalCents)}</td>
                  <td className="p-3 text-slate-500">
                    {o.createdAt.toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
