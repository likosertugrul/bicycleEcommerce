"use client";

import { useActionState } from "react";
import { createListing, type ListingState } from "@/server/listing-actions";
import type { Dictionary } from "@/lib/i18n";
import { CURRENCIES, type Currency } from "@/lib/currency";

const TYPES = ["MOUNTAIN", "ROAD", "CITY", "ELECTRIC", "KIDS", "GRAVEL"] as const;
const input =
  "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500";

export function SellForm({
  sell,
  bikeTypes,
  currency,
}: {
  sell: Dictionary["sell"];
  bikeTypes: Dictionary["bikeType"];
  currency: Currency;
}) {
  const [state, formAction, pending] = useActionState<ListingState, FormData>(
    createListing,
    {},
  );
  const symbol =
    CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency;

  return (
    <form action={formAction} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
      <input type="hidden" name="currency" value={currency} />
      <div>
        <label className="block text-sm font-semibold text-slate-900">
          {sell.bikeTitle} *
        </label>
        <input name="title" placeholder={sell.bikeTitlePlaceholder} className={input} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-semibold text-slate-900">{sell.type}</label>
          <select name="bikeType" className={input} defaultValue="MOUNTAIN">
            {TYPES.map((ty) => (
              <option key={ty} value={ty}>{bikeTypes[ty]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900">{sell.frameSize}</label>
          <input name="frameSize" placeholder="M" className={input} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900">{sell.wheelSizeField}</label>
          <input name="wheelSize" type="number" step="0.5" className={input} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900">
          {sell.askingPrice} ({symbol} {currency})
        </label>
        <input name="askingPrice" type="number" step="0.01" className={input} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900">{sell.description}</label>
        <textarea name="description" rows={4} placeholder={sell.descriptionPlaceholder} className={input} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900">{sell.photos}</label>
        <input
          name="imageFiles"
          type="file"
          accept="image/*"
          multiple
          className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-emerald-700"
        />
        <label className="mt-2 block text-sm text-slate-600">
          {sell.imageUrl}
          <input name="imageUrl" placeholder="https://..." className={input} />
        </label>
        <p className="mt-1 text-xs text-slate-400">{sell.photosNote}</p>
      </div>

      {state.error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error === "title"
            ? sell.titleRequired
            : state.error === "login"
              ? sell.loginRequired
              : state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {sell.submit}
      </button>
    </form>
  );
}
