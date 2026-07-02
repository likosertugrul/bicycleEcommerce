import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminProduct } from "@/server/admin-products";
import { updateProduct } from "@/server/admin-product-actions";
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
      <ProductForm
        action={updateProduct.bind(null, id)}
        initial={initial}
        submitLabel="Kaydet"
      />
    </div>
  );
}
