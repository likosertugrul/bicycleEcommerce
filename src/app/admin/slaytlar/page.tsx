import Link from "next/link";
import Image from "next/image";
import { getAdminSlides } from "@/server/slides";
import { deleteSlide, toggleSlide } from "@/server/slide-actions";

export const dynamic = "force-dynamic";

export default async function AdminSlidesPage() {
  const slides = await getAdminSlides();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Ana Sayfa Slaytları{" "}
          <span className="text-base font-normal text-slate-400">({slides.length})</span>
        </h1>
        <Link
          href="/admin/slaytlar/yeni"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Yeni Slayt
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Yayındaki slaytlar ana sayfadaki büyük alanda sırayla döner. Hiç yoksa
        varsayılan tanıtım gösterilir.
      </p>

      {slides.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          Henüz slayt yok. “Yeni Slayt” ile bir bisiklet veya kampanya ekleyin.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {slides.map((s) => (
            <li key={s.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {s.imageUrl && <Image src={s.imageUrl} alt="" fill sizes="96px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-900">{s.title}</div>
                {s.subtitle && <div className="truncate text-sm text-slate-500">{s.subtitle}</div>}
                <div className="text-xs text-slate-400">Sıra: {s.position}{s.ctaHref ? ` · ${s.ctaHref}` : ""}</div>
              </div>
              <form action={toggleSlide.bind(null, s.id)}>
                <button
                  type="submit"
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {s.isActive ? "Yayında" : "Gizli"}
                </button>
              </form>
              <div className="flex gap-3 text-sm">
                <Link href={`/admin/slaytlar/${s.id}`} className="font-medium text-emerald-600 hover:text-emerald-700">
                  Düzenle
                </Link>
                <form action={deleteSlide.bind(null, s.id)}>
                  <button type="submit" className="font-medium text-slate-400 hover:text-rose-600">Sil</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
