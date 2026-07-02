"use client";

import { useActionState, useState } from "react";
import type { AdminFormState } from "@/server/admin-product-actions";

export interface ProductFormInitial {
  title: string;
  description: string;
  brand: string;
  condition: "NEW" | "USED";
  bikeType: string;
  frameSize: string;
  wheelSize: string;
  gearCount: string;
  brakeType: string;
  color: string;
  priceTL: string;
  compareTL: string;
  stock: string;
  coverImageUrl: string;
  isActive: boolean;
  usageLevel: string;
  manufactureYear: string;
  cosmeticNotes: string;
  mileageKm: string;
}

const BIKE_TYPES: { v: string; l: string }[] = [
  { v: "", l: "—" },
  { v: "MOUNTAIN", l: "Dağ" },
  { v: "ROAD", l: "Yol" },
  { v: "CITY", l: "Şehir" },
  { v: "ELECTRIC", l: "Elektrikli" },
  { v: "KIDS", l: "Çocuk" },
  { v: "GRAVEL", l: "Gravel" },
];

const input =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500";

export function ProductForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: AdminFormState, fd: FormData) => Promise<AdminFormState>;
  initial?: Partial<ProductFormInitial>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(
    action,
    {},
  );
  const [condition, setCondition] = useState<"NEW" | "USED">(
    initial?.condition ?? "NEW",
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <Field label="Başlık *">
        <input name="title" defaultValue={initial?.title} required className={input} />
      </Field>

      <Field label="Açıklama">
        <textarea name="description" rows={3} defaultValue={initial?.description} className={input} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Marka">
          <input name="brand" defaultValue={initial?.brand} className={input} />
        </Field>
        <Field label="Durum">
          <select
            name="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as "NEW" | "USED")}
            className={input}
          >
            <option value="NEW">Sıfır</option>
            <option value="USED">2. El</option>
          </select>
        </Field>
        <Field label="Tür">
          <select name="bikeType" defaultValue={initial?.bikeType ?? ""} className={input}>
            {BIKE_TYPES.map((b) => (
              <option key={b.v} value={b.v}>{b.l}</option>
            ))}
          </select>
        </Field>
        <Field label="Renk">
          <input name="color" defaultValue={initial?.color} className={input} />
        </Field>
        <Field label="Kadro Boyu">
          <input name="frameSize" defaultValue={initial?.frameSize} placeholder="M" className={input} />
        </Field>
        <Field label="Jant (inç)">
          <input name="wheelSize" type="number" step="0.5" defaultValue={initial?.wheelSize} className={input} />
        </Field>
        <Field label="Vites">
          <input name="gearCount" type="number" defaultValue={initial?.gearCount} className={input} />
        </Field>
        <Field label="Fren">
          <input name="brakeType" defaultValue={initial?.brakeType} className={input} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Fiyat (₺) *">
          <input name="priceTL" type="number" step="0.01" defaultValue={initial?.priceTL} required className={input} />
        </Field>
        <Field label="Eski Fiyat (₺)">
          <input name="compareTL" type="number" step="0.01" defaultValue={initial?.compareTL} className={input} />
        </Field>
        <Field label="Stok">
          <input name="stock" type="number" defaultValue={initial?.stock ?? "0"} className={input} />
        </Field>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-700">Kapak Görseli</p>
        <label className="mt-2 block text-sm text-slate-600">
          Dosya yükle
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-emerald-700"
          />
        </label>
        <label className="mt-3 block text-sm text-slate-600">
          veya URL gir
          <input
            name="coverImageUrl"
            defaultValue={initial?.coverImageUrl}
            placeholder="/placeholders/mountain-01.svg veya https://..."
            className={input}
          />
        </label>
        <p className="mt-1 text-xs text-slate-400">
          Dosya yüklersen URL yok sayılır. Mevcut görsel korunur (boş bırakırsan).
        </p>
      </div>

      {condition === "USED" && (
        <div className="grid gap-4 rounded-xl border border-amber-200 bg-amber-50/40 p-4 sm:grid-cols-2">
          <Field label="Kullanım Durumu">
            <input name="usageLevel" defaultValue={initial?.usageLevel} placeholder="Az Kullanılmış" className={input} />
          </Field>
          <Field label="Üretim Yılı">
            <input name="manufactureYear" type="number" defaultValue={initial?.manufactureYear} className={input} />
          </Field>
          <Field label="Kilometre">
            <input name="mileageKm" type="number" defaultValue={initial?.mileageKm} className={input} />
          </Field>
          <Field label="Kozmetik Notlar">
            <input name="cosmeticNotes" defaultValue={initial?.cosmeticNotes} className={input} />
          </Field>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} className="h-4 w-4" />
        Yayında (aktif)
      </label>

      {state.error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  );
}
