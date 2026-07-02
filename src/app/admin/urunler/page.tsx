import Link from "next/link";
import Image from "next/image";
import { getAdminProducts } from "@/server/admin-products";
import { deleteProduct, toggleActive } from "@/server/admin-product-actions";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const COND: Record<string, string> = { NEW: "Sıfır", USED: "2. El" };
const TYPE: Record<string, string> = {
  MOUNTAIN: "Dağ", ROAD: "Yol", CITY: "Şehir",
  ELECTRIC: "Elektrikli", KIDS: "Çocuk", GRAVEL: "Gravel",
};

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

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
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
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-slate-100">
                      {p.images[0] && (
                        <Image src={p.images[0].url} alt="" fill sizes="56px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{p.title}</div>
                      <div className="text-xs text-slate-400">{p.brand}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-slate-600">
                  {COND[p.condition]}
                  {p.bikeType ? ` · ${TYPE[p.bikeType]}` : ""}
                </td>
                <td className="p-3 font-medium">{formatPrice(p.priceCents)}</td>
                <td className={`p-3 ${p.stock <= 2 ? "font-semibold text-rose-600" : ""}`}>
                  {p.stock}
                </td>
                <td className="p-3">
                  <form action={toggleActive.bind(null, p.id)}>
                    <button
                      type="submit"
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {p.isActive ? "Aktif" : "Pasif"}
                    </button>
                  </form>
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/urunler/${p.id}`} className="font-medium text-emerald-600 hover:text-emerald-700">
                      Düzenle
                    </Link>
                    <form action={deleteProduct.bind(null, p.id)}>
                      <button type="submit" className="font-medium text-slate-400 hover:text-rose-600">
                        Sil
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
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
