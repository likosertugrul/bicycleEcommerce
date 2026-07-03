import Link from "next/link";
import { notFound } from "next/navigation";
import { getSlide } from "@/server/slides";
import { updateSlide } from "@/server/slide-actions";
import { SlideForm } from "@/components/admin/slide-form";

export const dynamic = "force-dynamic";

export default async function EditSlidePage({
  params,
}: PageProps<"/admin/slaytlar/[id]">) {
  const { id } = await params;
  const slide = await getSlide(id);
  if (!slide) notFound();

  return (
    <div className="p-6">
      <nav className="mb-2 text-sm text-slate-500">
        <Link href="/admin/slaytlar" className="hover:text-emerald-600">Slaytlar</Link> / {slide.title}
      </nav>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Slaytı Düzenle</h1>
      <SlideForm action={updateSlide.bind(null, id)} initial={slide} submitLabel="Kaydet" />
    </div>
  );
}
