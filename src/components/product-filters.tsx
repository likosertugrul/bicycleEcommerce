"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface FilterLabels {
  search: string;
  searchPlaceholder: string;
  type: string;
  all: string;
  status: string;
  statusAll: string;
  frameSize: string;
  any: string;
  brand: string;
  price: string;
  min: string;
  max: string;
  reset: string;
  apply: string;
  filtersTitle: string;
  conditionNew: string;
  conditionUsed: string;
}

const CHIP =
  "rounded-full border px-3 py-1 text-sm font-medium transition-colors";

export function ProductFilters({
  brands,
  labels,
  types,
  frameSizes,
}: {
  brands: string[];
  labels: FilterLabels;
  types: { slug: string; label: string }[];
  frameSizes: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false); // mobil aç/kapa

  const get = (k: string) => sp.get(k) ?? "";

  function update(changes: Record<string, string | null>) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (!v) params.delete(k);
      else params.set(k, v);
    }
    const qs = params.toString();
    start(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  const toggle = (k: string, v: string) => update({ [k]: get(k) === v ? null : v });

  // Aktif filtre rozetleri
  const typeLabel = (slug: string) => types.find((t) => t.slug === slug)?.label ?? slug;
  const active: { key: string; label: string }[] = [];
  if (get("q")) active.push({ key: "q", label: `"${get("q")}"` });
  if (get("tur")) active.push({ key: "tur", label: typeLabel(get("tur")) });
  if (get("durum"))
    active.push({
      key: "durum",
      label: get("durum") === "sifir" ? labels.conditionNew : labels.conditionUsed,
    });
  if (get("kadro")) active.push({ key: "kadro", label: get("kadro") });
  if (get("marka")) active.push({ key: "marka", label: get("marka") });
  if (get("minFiyat")) active.push({ key: "minFiyat", label: `≥ $${get("minFiyat")}` });
  if (get("maxFiyat")) active.push({ key: "maxFiyat", label: `≤ $${get("maxFiyat")}` });

  const activeCount = active.length;

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white text-sm ${
        pending ? "opacity-70" : ""
      }`}
    >
      {/* Mobil başlık / aç-kapa */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-4 font-semibold text-slate-900 lg:hidden"
      >
        <span>
          {labels.filtersTitle}
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">
              {activeCount}
            </span>
          )}
        </span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      <div className={`${open ? "block" : "hidden"} space-y-5 p-4 pt-0 lg:block lg:pt-4`}>
        {/* Aktif filtreler */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            {active.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => update({ [a.key]: null })}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
              >
                {a.label}
                <span aria-hidden className="text-emerald-500">✕</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() =>
                update({
                  q: null, tur: null, durum: null, kadro: null,
                  marka: null, minFiyat: null, maxFiyat: null,
                })
              }
              className="text-xs font-medium text-slate-400 underline hover:text-slate-600"
            >
              {labels.reset}
            </button>
          </div>
        )}

        {/* Arama */}
        <form
          key={`q-${get("q")}`}
          onSubmit={(e) => {
            e.preventDefault();
            const v = (new FormData(e.currentTarget).get("q") as string).trim();
            update({ q: v || null });
          }}
        >
          <label className="block font-semibold text-slate-900">{labels.search}</label>
          <input
            name="q"
            defaultValue={get("q")}
            placeholder={labels.searchPlaceholder}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </form>

        {/* Tür — çip */}
        <div>
          <p className="font-semibold text-slate-900">{labels.type}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {types.map((ty) => {
              const on = get("tur") === ty.slug;
              return (
                <button
                  key={ty.slug}
                  type="button"
                  onClick={() => toggle("tur", ty.slug)}
                  className={`${CHIP} ${
                    on
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300 text-slate-600 hover:border-emerald-400"
                  }`}
                >
                  {ty.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Durum — segment */}
        <div>
          <p className="font-semibold text-slate-900">{labels.status}</p>
          <div className="mt-2 inline-flex rounded-lg border border-slate-300 p-0.5">
            {[
              { v: "", l: labels.statusAll },
              { v: "sifir", l: labels.conditionNew },
              { v: "2el", l: labels.conditionUsed },
            ].map((o) => {
              const on = get("durum") === o.v;
              return (
                <button
                  key={o.v || "all"}
                  type="button"
                  onClick={() => update({ durum: o.v || null })}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    on ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {o.l}
                </button>
              );
            })}
          </div>
        </div>

        {/* Kadro — çip */}
        <div>
          <p className="font-semibold text-slate-900">{labels.frameSize}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {frameSizes.map((s) => {
              const on = get("kadro") === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle("kadro", s)}
                  className={`${CHIP} min-w-9 ${
                    on
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300 text-slate-600 hover:border-emerald-400"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Marka */}
        <div>
          <label className="block font-semibold text-slate-900">{labels.brand}</label>
          <select
            value={get("marka")}
            onChange={(e) => update({ marka: e.target.value || null })}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          >
            <option value="">{labels.all}</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Fiyat */}
        <form
          key={`p-${get("minFiyat")}-${get("maxFiyat")}`}
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            update({
              minFiyat: (f.get("minFiyat") as string) || null,
              maxFiyat: (f.get("maxFiyat") as string) || null,
            });
          }}
        >
          <label className="block font-semibold text-slate-900">{labels.price}</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number" name="minFiyat" min={0} defaultValue={get("minFiyat")}
              placeholder={labels.min}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
            <span className="text-slate-400">–</span>
            <input
              type="number" name="maxFiyat" min={0} defaultValue={get("maxFiyat")}
              placeholder={labels.max}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              {labels.apply}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
