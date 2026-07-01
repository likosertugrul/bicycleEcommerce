import type { Metadata } from "next";
import { BIKE_TYPE_LABELS, BIKE_TYPE_TO_SLUG, type BikeType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Bisikletini Sat",
  description:
    "Bisikletini bize gönder, ekibimiz incelesin ve satın alma teklifi sunsun. Kolay ve güvenli 2. el bisiklet satışı.",
};

const TYPES = Object.keys(BIKE_TYPE_LABELS) as BikeType[];

export default function SellBikePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Bisikletini Sat</h1>
      <p className="mt-2 text-slate-600">
        Bisikletinin bilgilerini gönder, ekibimiz incelesin. Uygun bulursak
        sana bir satın alma teklifi sunar, anlaşınca dükkanımızda satışa
        çıkarırız. Fotoğraf ve teknik bilgi ne kadar detaylıysa teklif o kadar
        hızlı olur.
      </p>

      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <strong>Nasıl işliyor?</strong> Form gönder →{" "}
        <em>Onay bekliyor</em> → Dükkan inceler → Teklif / Onay → Satışa çıkar.
      </div>

      {/* Not: Bu form Sprint 4'te Server Action + görsel yükleme ile bağlanacak. */}
      <form className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ad Soyad" name="ad" required />
          <Field label="Telefon" name="telefon" type="tel" required />
        </div>

        <Field label="Bisiklet Başlığı" name="baslik" placeholder="örn. Rockline 27.5 Dağ Bisikleti" required />

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <Label>Bisiklet Türü</Label>
            <select
              name="tur"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            >
              {TYPES.map((t) => (
                <option key={t} value={BIKE_TYPE_TO_SLUG[t]}>
                  {BIKE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <Field label="Kadro Boyu" name="kadro" placeholder="M" />
          <Field label="İstenen Fiyat (₺)" name="fiyat" type="number" />
        </div>

        <div>
          <Label>Açıklama</Label>
          <textarea
            name="aciklama"
            rows={4}
            placeholder="Kullanım durumu, varsa kusurlar, aksesuarlar..."
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <Label>Fotoğraflar</Label>
          <div className="mt-2 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Görsel yükleme Sprint 4&apos;te (Supabase Storage) eklenecek.
            <br />2. el ilanlarda gerçek fotoğraf zorunludur.
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          İncelemeye Gönder
        </button>
        <p className="text-center text-xs text-slate-400">
          Bu form şu an demo aşamasındadır; gönderim backend&apos;e henüz
          bağlanmadı.
        </p>
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
