import Link from "next/link";
import Image from "next/image";
import { getAdminListings } from "@/server/listings";
import {
  approveListing,
  rejectListing,
  convertToProduct,
} from "@/server/listing-actions";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  PENDING: "İnceleniyor",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  PUBLISHED: "Yayında",
};
const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-rose-100 text-rose-800",
  PUBLISHED: "bg-emerald-100 text-emerald-800",
};

export default async function AdminListingsPage() {
  const listings = await getAdminListings();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        İlanlar <span className="text-base font-normal text-slate-400">({listings.length})</span>
      </h1>

      {listings.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          Henüz ilan yok. Kullanıcılar “Bisikletini Sat” ile gönderdiğinde
          burada listelenecek.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {listings.map((l) => (
            <li key={l.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex gap-4">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {l.images[0] && (
                    <Image src={l.images[0]} alt="" fill sizes="112px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{l.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[l.status]}`}>
                      {STATUS[l.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{l.userEmail}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {l.bikeType ?? "—"} · {l.frameSize ?? "—"}
                    {l.askingPriceCents != null ? ` · İstenen: ${formatPrice(l.askingPriceCents)}` : ""}
                  </p>
                  {l.description && (
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">{l.description}</p>
                  )}
                  {l.adminNote && (
                    <p className="mt-1 text-sm text-rose-600">Not: {l.adminNote}</p>
                  )}
                </div>
              </div>

              {/* İşlemler */}
              {l.status === "PUBLISHED" ? (
                l.convertedProductId && (
                  <Link
                    href={`/admin/urunler/${l.convertedProductId}`}
                    className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Ürünü düzenle →
                  </Link>
                )
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={convertToProduct.bind(null, l.id)}>
                    <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">
                      Ürüne Dönüştür
                    </button>
                  </form>
                  {l.status === "PENDING" && (
                    <form action={approveListing.bind(null, l.id)}>
                      <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Onayla
                      </button>
                    </form>
                  )}
                  <form action={rejectListing.bind(null, l.id)} className="flex items-center gap-2">
                    <input
                      name="note"
                      placeholder="Red sebebi (ops.)"
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                    />
                    <button className="rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50">
                      Reddet
                    </button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
