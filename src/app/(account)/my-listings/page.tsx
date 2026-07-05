import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getT, getCurrency } from "@/lib/locale";
import { getAuthUser } from "@/server/auth";
import { getMyListings } from "@/server/listings";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "İlanlarım", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-rose-100 text-rose-800",
  PUBLISHED: "bg-emerald-100 text-emerald-800",
};

export default async function MyListingsPage() {
  const [t, currency, user] = await Promise.all([
    getT(),
    getCurrency(),
    getAuthUser(),
  ]);
  if (!user) redirect("/login");
  const listings = await getMyListings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <nav className="text-sm text-slate-500">
          <Link href="/account" className="hover:text-emerald-600">
            {t.auth.account}
          </Link>{" "}
          / {t.listings.title}
        </nav>
        <Link
          href="/sell-your-bike"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + {t.listings.newListing}
        </Link>
      </div>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">{t.listings.title}</h1>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          {t.listings.empty}
        </div>
      ) : (
        <ul className="space-y-3">
          {listings.map((l) => (
            <li key={l.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{l.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[l.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {t.listings.status[l.status as keyof typeof t.listings.status] ?? l.status}
                    </span>
                  </div>
                  {l.askingPriceCents != null && (
                    <p className="mt-1 text-sm text-slate-500">
                      {t.listings.asking}: {formatPrice(l.askingPriceCents, currency)}
                    </p>
                  )}
                </div>
              </div>
              {l.adminNote && (
                <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  <span className="font-medium">{t.listings.shopNote}:</span> {l.adminNote}
                </p>
              )}
              {l.convertedProductId && (
                <Link
                  href={`/products`}
                  className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  {t.listings.viewProduct} →
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
