import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getT } from "@/lib/locale";
import { getAuthUser } from "@/server/auth";

export const metadata: Metadata = { title: "Siparişlerim", robots: { index: false } };
export const dynamic = "force-dynamic";

// İskelet: gerçek siparişler Sprint 3 (ödeme) ile gelecek.
export default async function OrdersPage() {
  const [t, user] = await Promise.all([getT(), getAuthUser()]);
  if (!user) redirect("/giris");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/hesabim" className="hover:text-emerald-600">
          {t.auth.account}
        </Link>{" "}
        / {t.auth.orders}
      </nav>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">{t.auth.orders}</h1>

      <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 p-12 text-center">
        <span aria-hidden className="text-5xl">📦</span>
        <p className="mt-4 text-lg font-semibold text-slate-900">
          {t.auth.ordersEmpty}
        </p>
        <p className="mt-1 text-slate-500">{t.auth.ordersEmptyHint}</p>
        <Link
          href="/urunler"
          className="mt-6 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          {t.wishlist.explore}
        </Link>
      </div>
    </div>
  );
}
