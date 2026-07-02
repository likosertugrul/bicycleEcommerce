import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/server/admin-product-actions";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div className="p-6">
      <nav className="mb-2 text-sm text-slate-500">
        <Link href="/admin/urunler" className="hover:text-emerald-600">
          Ürünler
        </Link>{" "}
        / Yeni
      </nav>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Yeni Ürün</h1>
      <ProductForm action={createProduct} submitLabel="Oluştur" />
    </div>
  );
}
