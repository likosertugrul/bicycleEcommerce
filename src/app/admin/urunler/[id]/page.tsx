import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAdminProduct } from "@/server/admin-products";
import {
  updateProduct,
  deleteProductImage,
  setCoverImage,
} from "@/server/admin-product-actions";
import { ProductForm, type ProductFormInitial } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: PageProps<"/admin/urunler/[id]">) {
  const { id } = await params;
  const p = await getAdminProduct(id);
  if (!p) notFound();

  const cover = p.images.find((i) => i.isCover) ?? p.images[0];
  const str = (v: number | null | undefined) => (v != null ? String(v) : "");

  const initial: ProductFormInitial = {
    title: p.title,
    description: p.description ?? "",
    brand: p.brand ?? "",
    condition: p.condition as "NEW" | "USED",
    bikeType: p.bikeType ?? "",
    frameSize: p.frameSize ?? "",
    wheelSize: p.wheelSize != null ? String(p.wheelSize) : "",
    gearCount: str(p.gearCount),
    brakeType: p.brakeType ?? "",
    color: p.color ?? "",
    priceTL: (p.priceCents / 100).toString(),
    compareTL: p.compareAtCents != null ? (p.compareAtCents / 100).toString() : "",
    stock: String(p.stock),
    coverImageUrl: cover?.url ?? "",
    isActive: p.isActive,
    usageLevel: p.usageLevel ?? "",
    manufactureYear: str(p.manufactureYear),
    cosmeticNotes: p.cosmeticNotes ?? "",
    mileageKm: str(p.mileageKm),
  };

  return (
    <div className="p-6">
      <nav className="mb-2 text-sm text-slate-500">
        <Link href="/admin/urunler" className="hover:text-emerald-600">
          Ürünler
        </Link>{" "}
        / {p.title}
      </nav>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Ürünü Düzenle</h1>

      {p.images.length > 0 && (
        <div className="mb-6 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-slate-700">
            Mevcut Görseller ({p.images.length})
          </p>
          <div className="flex flex-wrap gap-3">
            {p.images.map((img) => (
              <div key={img.id} className="w-28">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <Image src={img.url} alt="" fill sizes="112px" className="object-cover" />
                  {img.isCover && (
                    <span className="absolute left-1 top-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Kapak
                    </span>
                  )}
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  {!img.isCover ? (
                    <form action={setCoverImage.bind(null, img.id)}>
                      <button className="font-medium text-emerald-600 hover:text-emerald-700">
                        Kapak yap
                      </button>
                    </form>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                  <form action={deleteProductImage.bind(null, img.id)}>
                    <button className="font-medium text-slate-400 hover:text-rose-600">
                      Sil
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProductForm
        action={updateProduct.bind(null, id)}
        initial={initial}
        submitLabel="Kaydet"
      />
    </div>
  );
}
