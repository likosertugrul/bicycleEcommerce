import Link from "next/link";
import Image from "next/image";
import { getAdminSlides } from "@/server/slides";
import { deleteSlide, toggleSlide } from "@/server/slide-actions";
import { ConfirmButton } from "@/components/confirm-button";

export const dynamic = "force-dynamic";

export default async function AdminSlidesPage() {
  const slides = await getAdminSlides();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Home Slides{" "}
          <span className="text-base font-normal text-slate-400">({slides.length})</span>
        </h1>
        <Link
          href="/admin/slaytlar/yeni"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + New Slide
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Active slides rotate in the hero on the home page. If none, a default hero is shown.
      </p>

      {slides.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          No slides yet. Add a bike or campaign with “New Slide”.
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
                <div className="text-xs text-slate-400">Order: {s.position}{s.ctaHref ? ` · ${s.ctaHref}` : ""}</div>
              </div>
              <form action={toggleSlide.bind(null, s.id)}>
                <button
                  type="submit"
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {s.isActive ? "Active" : "Hidden"}
                </button>
              </form>
              <div className="flex gap-3 text-sm">
                <Link href={`/admin/slaytlar/${s.id}`} className="font-medium text-emerald-600 hover:text-emerald-700">
                  Edit
                </Link>
                <ConfirmButton
                  action={deleteSlide.bind(null, s.id)}
                  title="Delete slide"
                  message={`Delete "${s.title}"? This cannot be undone.`}
                  className="font-medium text-slate-400 hover:text-rose-600"
                >
                  Delete
                </ConfirmButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
