"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  deleteProduct,
  toggleActive,
  quickUpdateProduct,
} from "@/server/admin-product-actions";
import { ConfirmButton } from "@/components/confirm-button";

const CONDITIONS: [string, string][] = [
  ["NEW", "Sıfır"],
  ["USED", "2. El"],
];
const TYPES: [string, string][] = [
  ["MOUNTAIN", "Dağ"],
  ["ROAD", "Yol"],
  ["CITY", "Şehir"],
  ["ELECTRIC", "Elektrikli"],
  ["KIDS", "Çocuk"],
  ["GRAVEL", "Gravel"],
];

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
const input =
  "rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-emerald-500";

export function AdminProductRow({ p }: { p: AdminRowProduct }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [price, setPrice] = useState((p.priceCents / 100).toString());
  const [stock, setStock] = useState(p.stock.toString());
  const [condition, setCondition] = useState(p.condition);
  const [bikeType, setBikeType] = useState(p.bikeType ?? "CITY");

  const nextCents = Math.round((parseFloat(price) || 0) * 100);
  const dirty =
    nextCents !== p.priceCents ||
    (parseInt(stock, 10) || 0) !== p.stock ||
    condition !== p.condition ||
    bikeType !== (p.bikeType ?? "CITY");

  function save(e: React.MouseEvent) {
    e.stopPropagation();
    start(() =>
      quickUpdateProduct(p.id, {
        priceCents: nextCents,
        stock: parseInt(stock, 10) || 0,
        condition,
        bikeType,
      }),
    );
  }

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

      {/* Durum + Tür */}
      <td className="p-3" onClick={stop}>
        <div className="flex flex-col gap-1">
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            onClick={stop}
            className={input}
          >
            {CONDITIONS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            value={bikeType}
            onChange={(e) => setBikeType(e.target.value)}
            onClick={stop}
            className={input}
          >
            {TYPES.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </td>

      {/* Fiyat */}
      <td className="p-3" onClick={stop}>
        <div className="flex items-center gap-1">
          <span className="text-slate-400">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onClick={stop}
            className={`${input} w-24`}
          />
        </div>
      </td>

      {/* Stok */}
      <td className="p-3" onClick={stop}>
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          onClick={stop}
          className={`${input} w-16`}
        />
      </td>

      {/* Aktif toggle */}
      <td className="p-3">
        <form action={toggleActive.bind(null, p.id)}>
          <button
            type="submit"
            onClick={stop}
            role="switch"
            aria-checked={p.isActive}
            title={
              p.isActive
                ? "Aktif — pasife almak için tıkla"
                : "Pasif — aktif etmek için tıkla"
            }
            className="flex items-center gap-2"
          >
            <span
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                p.isActive ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  p.isActive ? "translate-x-[1.125rem]" : "translate-x-0.5"
                }`}
              />
            </span>
            <span
              className={`text-xs font-medium ${
                p.isActive ? "text-emerald-700" : "text-slate-500"
              }`}
            >
              {p.isActive ? "Aktif" : "Pasif"}
            </span>
          </button>
        </form>
      </td>

      {/* İşlem: Kaydet (değişiklik varsa) + Sil */}
      <td className="p-3">
        <div className="flex items-center gap-3">
          {dirty && (
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {pending ? "…" : "Kaydet"}
            </button>
          )}
          <ConfirmButton
            action={deleteProduct.bind(null, p.id)}
            stopPropagation
            title="Ürünü sil"
            message={`"${p.title}" ürününü silmek istediğine emin misin?`}
            className="font-medium text-slate-400 hover:text-rose-600"
          >
            Sil
          </ConfirmButton>
        </div>
      </td>
    </tr>
  );
}
