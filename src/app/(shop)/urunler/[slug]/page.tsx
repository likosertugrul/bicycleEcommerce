import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getAllProductSlugs,
  getRelatedProducts,
} from "@/server/products";
import { ProductCard } from "@/components/product-card";
import { formatPrice, discountPercent } from "@/lib/format";
import {
  BIKE_TYPE_LABELS,
  BIKE_TYPE_TO_SLUG,
  CONDITION_LABELS,
} from "@/lib/types";
import { site } from "@/lib/site";

// Ürün detay — ISR/SSG. generateStaticParams ile build'de statik üretilir.
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/urunler/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };

  const cover = product.images.find((i) => i.isCover) ?? product.images[0];
  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: `/urunler/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.description,
      images: cover ? [{ url: cover.url }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/urunler/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const cover = product.images.find((i) => i.isCover) ?? product.images[0];
  const discount = discountPercent(product.priceCents, product.compareAtCents);
  const related = await getRelatedProducts(product);
  const inStock = product.stock > 0;

  // JSON-LD: Product + Offer (SEO — vazgeçilmez)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images.map((i) => `${site.url}${i.url}`),
    itemCondition:
      product.condition === "USED"
        ? "https://schema.org/UsedCondition"
        : "https://schema.org/NewCondition",
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: (product.priceCents / 100).toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${site.url}/urunler/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-600">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/urunler" className="hover:text-emerald-600">Bisikletler</Link>
        <span>/</span>
        <Link
          href={`/urunler?tur=${BIKE_TYPE_TO_SLUG[product.bikeType]}`}
          className="hover:text-emerald-600"
        >
          {BIKE_TYPE_LABELS[product.bikeType]}
        </Link>
        <span>/</span>
        <span className="text-slate-700">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Galeri */}
        <div>
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {cover && (
              <Image
                src={cover.url}
                alt={cover.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
            {product.isPlaceholder && (
              <span className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-1 text-xs text-white">
                Temsili görsel
              </span>
            )}
          </div>
        </div>

        {/* Bilgi */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                product.condition === "USED"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {CONDITION_LABELS[product.condition]}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {BIKE_TYPE_LABELS[product.bikeType]} · {product.brand}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {product.title}
          </h1>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatPrice(product.priceCents)}
            </span>
            {product.compareAtCents && (
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-rose-600 px-2 py-0.5 text-sm font-semibold text-white">
                %{discount} indirim
              </span>
            )}
          </div>

          <p className="mt-2 text-sm">
            {inStock ? (
              <span className="font-medium text-emerald-600">
                ✓ Stokta ({product.stock} adet)
              </span>
            ) : (
              <span className="font-medium text-rose-600">Tükendi</span>
            )}
          </p>

          <p className="mt-4 text-slate-600">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              disabled={!inStock}
              className="rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sepete Ekle
            </button>
            <button className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
              ♡ Favori
            </button>
          </div>

          {/* Teknik özellikler */}
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-sm">
            <Spec label="Kadro Boyu" value={product.frameSize} />
            <Spec
              label="Jant Çapı"
              value={product.wheelSize ? `${product.wheelSize}″` : null}
            />
            <Spec
              label="Vites"
              value={product.gearCount ? `${product.gearCount}` : null}
            />
            <Spec label="Fren" value={product.brakeType} />
            <Spec label="Renk" value={product.color} />
            {product.specs.map((s) => (
              <Spec key={s.key} label={s.key} value={s.value} />
            ))}
          </dl>

          {/* 2. El özel alanları */}
          {product.condition === "USED" && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-900">
                2. El Durum Bilgisi
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-amber-900">
                <Spec label="Kullanım" value={product.usageLevel} />
                <Spec
                  label="Üretim Yılı"
                  value={product.manufactureYear?.toString() ?? null}
                />
                <Spec
                  label="Kilometre"
                  value={product.mileageKm ? `${product.mileageKm} km` : null}
                />
              </dl>
              {product.cosmeticNotes && (
                <p className="mt-3 text-sm text-amber-900">
                  <span className="font-medium">Kozmetik notlar: </span>
                  {product.cosmeticNotes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Benzer ürünler */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900">Benzer Bisikletler</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2 border-b border-black/5 pb-1">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
