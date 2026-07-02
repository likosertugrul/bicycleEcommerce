import Link from "next/link";
import type { RawSearchParams } from "@/lib/search-params";
import type { Dictionary } from "@/lib/i18n";
import { BIKE_TYPE_TO_SLUG, type BikeType } from "@/lib/types";

function val(sp: RawSearchParams, k: string): string {
  const v = sp[k];
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

const TYPES: BikeType[] = ["MOUNTAIN", "ROAD", "CITY", "ELECTRIC", "KIDS", "GRAVEL"];
const FRAME_SIZES = ["XS", "S", "M", "L", "XL"];

// GET formu → SSR. JS gerekmeden filtre çalışır, link paylaşılabilir.
export function ProductFilters({
  searchParams,
  brands,
  t,
}: {
  searchParams: RawSearchParams;
  brands: string[];
  t: Dictionary;
}) {
  return (
    <form
      method="get"
      action="/urunler"
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 text-sm"
    >
      <div>
        <label className="block font-semibold text-slate-900">{t.filters.search}</label>
        <input
          type="text"
          name="q"
          defaultValue={val(searchParams, "q")}
          placeholder={t.filters.searchPlaceholder}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
        />
      </div>

      <fieldset>
        <legend className="font-semibold text-slate-900">{t.filters.type}</legend>
        <select
          name="tur"
          defaultValue={val(searchParams, "tur")}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
        >
          <option value="">{t.filters.all}</option>
          {TYPES.map((ty) => (
            <option key={ty} value={BIKE_TYPE_TO_SLUG[ty]}>
              {t.bikeType[ty]}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="font-semibold text-slate-900">{t.filters.status}</legend>
        <select
          name="durum"
          defaultValue={val(searchParams, "durum")}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
        >
          <option value="">{t.filters.statusAll}</option>
          <option value="sifir">{t.condition.NEW}</option>
          <option value="2el">{t.condition.USED}</option>
        </select>
      </fieldset>

      <fieldset>
        <legend className="font-semibold text-slate-900">{t.filters.frameSize}</legend>
        <select
          name="kadro"
          defaultValue={val(searchParams, "kadro")}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
        >
          <option value="">{t.filters.any}</option>
          {FRAME_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="font-semibold text-slate-900">{t.filters.brand}</legend>
        <select
          name="marka"
          defaultValue={val(searchParams, "marka")}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
        >
          <option value="">{t.filters.all}</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="font-semibold text-slate-900">{t.filters.price}</legend>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            name="minFiyat"
            min={0}
            defaultValue={val(searchParams, "minFiyat")}
            placeholder={t.filters.min}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            name="maxFiyat"
            min={0}
            defaultValue={val(searchParams, "maxFiyat")}
            placeholder={t.filters.max}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>
      </fieldset>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
        >
          {t.filters.filter}
        </button>
        <Link
          href="/urunler"
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
        >
          {t.filters.reset}
        </Link>
      </div>
    </form>
  );
}
