import type { Metadata } from "next";
import { getT } from "@/lib/locale";
import { BIKE_TYPE_TO_SLUG, type BikeType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Bisikletini Sat",
  description:
    "Bisikletini bize gönder, ekibimiz incelesin ve satın alma teklifi sunsun. Kolay ve güvenli 2. el bisiklet satışı.",
};

// Locale okuduğu için dinamik.
export const dynamic = "force-dynamic";

const TYPES: BikeType[] = ["MOUNTAIN", "ROAD", "CITY", "ELECTRIC", "KIDS", "GRAVEL"];

export default async function SellBikePage() {
  const t = await getT();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">{t.sell.title}</h1>
      <p className="mt-2 text-slate-600">{t.sell.intro}</p>

      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <strong>{t.sell.howLabel}</strong> {t.sell.howText}
      </div>

      {/* Not: Bu form Sprint 4'te Server Action + görsel yükleme ile bağlanacak. */}
      <form className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.sell.name} name="ad" required />
          <Field label={t.sell.phone} name="telefon" type="tel" required />
        </div>

        <Field
          label={t.sell.bikeTitle}
          name="baslik"
          placeholder={t.sell.bikeTitlePlaceholder}
          required
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <Label>{t.sell.type}</Label>
            <select
              name="tur"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            >
              {TYPES.map((ty) => (
                <option key={ty} value={BIKE_TYPE_TO_SLUG[ty]}>
                  {t.bikeType[ty]}
                </option>
              ))}
            </select>
          </div>
          <Field label={t.sell.frameSize} name="kadro" placeholder="M" />
          <Field label={t.sell.askingPrice} name="fiyat" type="number" />
        </div>

        <div>
          <Label>{t.sell.description}</Label>
          <textarea
            name="aciklama"
            rows={4}
            placeholder={t.sell.descriptionPlaceholder}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <Label>{t.sell.photos}</Label>
          <div className="mt-2 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            {t.sell.photosNote}
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          {t.sell.submit}
        </button>
        <p className="text-center text-xs text-slate-400">{t.sell.demoNote}</p>
      </form>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-900">{children}</label>;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label>
        {label} {required && <span className="text-rose-500">*</span>}
      </Label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
      />
    </div>
  );
}
