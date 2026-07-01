import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Sepet",
  robots: { index: false },
};

// Sepet Sprint 2'de (server-side sepet + miktar yönetimi) gerçek işlevle gelecek.
export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center px-4 py-20 text-center">
        <span aria-hidden className="text-5xl">🛒</span>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Sepetiniz boş</h1>
        <p className="mt-2 text-slate-500">
          Sepet işlevi Sprint 2&apos;de eklenecek. Şimdilik bisikletlere göz
          atabilirsiniz.
        </p>
        <Link
          href="/urunler"
          className="mt-6 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Bisikletleri Keşfet
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
