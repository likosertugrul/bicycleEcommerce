"use client";

import { useActionState } from "react";
import type { SlideFormState } from "@/server/slide-actions";
import type { SlideView } from "@/server/slides";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500";

export function SlideForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: SlideFormState, fd: FormData) => Promise<SlideFormState>;
  initial?: SlideView;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<SlideFormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <label className="block text-sm font-medium text-slate-700">
        Başlık *
        <input name="title" defaultValue={initial?.title} required className={input} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Alt Metin
        <input name="subtitle" defaultValue={initial?.subtitle ?? ""} className={input} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Buton Metni
          <input name="ctaLabel" defaultValue={initial?.ctaLabel ?? ""} placeholder="İncele" className={input} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Buton Linki
          <input name="ctaHref" defaultValue={initial?.ctaHref ?? ""} placeholder="/urunler/... veya https://..." className={input} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Sıra
          <input name="position" type="number" defaultValue={initial?.position ?? 0} className={input} />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-700">Görsel (bisiklet/kampanya)</p>
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
          veya URL
          <input name="imageUrl" defaultValue={initial?.imageUrl ?? ""} placeholder="https://..." className={input} />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} className="h-4 w-4" />
        Yayında (ana sayfada göster)
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
