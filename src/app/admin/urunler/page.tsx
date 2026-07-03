import Link from "next/link";
import { getAdminProducts } from "@/server/admin-products";
import { AdminProductRow } from "@/components/admin/product-row";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Ürünler <span className="text-base font-normal text-slate-400">({products.length})</span>
        </h1>
        <Link
          href="/admin/urunler/yeni"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Yeni Ürün
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Düzenlemek için ürün satırına tıkla.
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3 font-medium">Ürün</th>
              <th className="p-3 font-medium">Durum/Tür</th>
              <th className="p-3 font-medium">Fiyat</th>
              <th className="p-3 font-medium">Stok</th>
              <th className="p-3 font-medium">Aktif</th>
              <th className="p-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <AdminProductRow
                key={p.id}
                p={{
                  id: p.id,
                  title: p.title,
                  brand: p.brand,
                  condition: p.condition,
                  bikeType: p.bikeType,
                  priceCents: p.priceCents,
                  stock: p.stock,
                  isActive: p.isActive,
                  imageUrl: p.images[0]?.url ?? null,
                }}
              />
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Henüz ürün yok. “Yeni Ürün” ile ekleyin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
