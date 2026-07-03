"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteProduct, toggleActive } from "@/server/admin-product-actions";
import { formatPrice } from "@/lib/format";

const COND: Record<string, string> = { NEW: "Sıfır", USED: "2. El" };
const TYPE: Record<string, string> = {
  MOUNTAIN: "Dağ", ROAD: "Yol", CITY: "Şehir",
  ELECTRIC: "Elektrikli", KIDS: "Çocuk", GRAVEL: "Gravel",
};

export interface AdminRowProduct {
  id: string;
  title: string;
  brand: string | null;
  condition: string;
  bikeType: string | null;
  priceCents: number;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
}

const stop = (e: React.MouseEvent) => e.stopPropagation();

export function AdminProductRow({ p }: { p: AdminRowProduct }) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/admin/urunler/${p.id}`)}
      className="cursor-pointer hover:bg-slate-50"
    >
      <td className="p-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-slate-100">
            {p.imageUrl && (
              <Image src={p.imageUrl} alt="" fill sizes="56px" className="object-cover" />
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
            onClick={stop}
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
        <form action={deleteProduct.bind(null, p.id)}>
          <button
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              if (!confirm(`"${p.title}" ürününü silmek istediğine emin misin?`))
                e.preventDefault();
            }}
            className="font-medium text-slate-400 hover:text-rose-600"
          >
            Sil
          </button>
        </form>
      </td>
    </tr>
  );
}
