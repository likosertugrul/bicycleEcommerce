import type { Metadata } from "next";
import Link from "next/link";
import { getT, getCurrency } from "@/lib/locale";
import { getAuthUser } from "@/server/auth";
import { SellForm } from "@/components/sell-form";

export const metadata: Metadata = {
  title: "Bisikletini Sat",
  description:
    "Bisikletini bize gönder, ekibimiz incelesin ve satın alma teklifi sunsun. Kolay ve güvenli 2. el bisiklet satışı.",
};

export const dynamic = "force-dynamic";

export default async function SellBikePage() {
  const [t, currency, user] = await Promise.all([
    getT(),
    getCurrency(),
    getAuthUser(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">{t.sell.title}</h1>
      <p className="mt-2 text-slate-600">{t.sell.intro}</p>

      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <strong>{t.sell.howLabel}</strong> {t.sell.howText}
      </div>

      {user ? (
        <SellForm sell={t.sell} bikeTypes={t.bikeType} currency={currency} />
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-600">{t.sell.loginRequired}</p>
          <Link
            href="/giris"
            className="mt-4 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            {t.sell.loginCta}
          </Link>
        </div>
      )}
    </div>
  );
}
