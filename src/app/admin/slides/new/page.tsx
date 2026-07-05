import Link from "next/link";
import { SlideForm } from "@/components/admin/slide-form";
import { createSlide } from "@/server/slide-actions";

export const dynamic = "force-dynamic";

export default function NewSlidePage() {
  return (
    <div className="p-6">
      <nav className="mb-2 text-sm text-slate-500">
        <Link href="/admin/slides" className="hover:text-emerald-600">Slaytlar</Link> / Yeni
      </nav>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">New Slide</h1>
      <SlideForm action={createSlide} submitLabel="Create" />
    </div>
  );
}
